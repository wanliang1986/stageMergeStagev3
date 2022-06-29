require('dotenv').config();
const OSS = require('ali-oss');
const walk = require('walk');

const client = new OSS({
  /* same options */
  accessKeyId: process.env.OSS_client_id,
  accessKeySecret: process.env.OSS_secret_key,
  bucket: 'dev-hitalentech',
  region: 'oss-cn-shenzhen',
  secure: true
});
const walker = walk.walk('./build', { followLinks: false });

const tasks = [];
walker.on('file', (root, stat, next) => {
  // Add this file to the list of files
  const filepath = root + '/' + stat.name;
  const fileName = filepath.replace('./build/', '');
  if (fileName !== 'asset-manifest.json' && fileName !== 'index.html') {
    tasks.push({ fileName, filepath });
  }
  next();
});
walker.on('end', () => {
  console.log(`All files${tasks.length} traversed. start uploading...`);
  return asyncPool(4, tasks, ({ fileName, filepath }) => {
    console.time(fileName);
    if (fileName.match(/\.map$/)) {
      return Promise.resolve(fileName);
    }
    return client
      .put(fileName, filepath, {
        timeout: 300000,
        headers: {
          'Cache-Control': fileName.match(/^locales/)
            ? 'max-age=0'
            : 'max-age=31536000'
        }
      })
      .then(() => {
        console.log('success');
        console.timeEnd(fileName);
      })
      .catch(err => {
        console.log('failed');
        console.timeEnd(fileName);
        throw err;
      });
  })
    .then(() => {
      console.time('asset-manifest.json');
      return client
        .put('asset-manifest.json', './build/asset-manifest.json', {
          headers: { 'Cache-Control': 'max-age=1' }
        })
        .then(() => {
          console.log('success');
          console.timeEnd('asset-manifest.json');
        })
        .catch(err => {
          console.log('failed');
          console.timeEnd('asset-manifest.json');
          throw err;
        });
    })
    .then(() => {
      client
        .put('index.html', './build/index.html', {
          headers: { 'Cache-Control': 'max-age=1' }
        })
        .then(() => {
          console.log('finished');
        })
        .catch(err => {
          console.log(`index.html error: %j`, err);
        });
    });
});

function asyncPool(poolLimit, array, iteratorFn) {
  let i = 0;
  const ret = [];
  const executing = [];
  const enqueue = function() {
    if (i === array.length) {
      return Promise.resolve();
    }
    const item = array[i++];
    const p = Promise.resolve().then(() => iteratorFn(item, array));
    ret.push(p);
    const e = p.then(() => executing.splice(executing.indexOf(e), 1));
    executing.push(e);
    let r = Promise.resolve();
    if (executing.length >= poolLimit) {
      r = Promise.race(executing);
    }
    return r.then(() => enqueue());
  };
  return enqueue().then(() => Promise.all(ret));
}
