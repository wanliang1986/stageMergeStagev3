// import XLSX from 'xlsx/dist/xlsx.mini.min';
const XLSX = window.XLSX;
export function handleFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = (e) => {
      /* Parse data */
      try {
        const bstr = e.target.result;
        // console.log(bstr);
        const wb = XLSX.read(bstr, {
          type: rABS ? 'binary' : 'array',
          cellDates: true,
        });
        console.log(wb);
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

        resolve({ data: data, cols: make_cols(ws['!ref']) });
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = (e) => reject(e);
    if (rABS) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
}

export function exportJson(data, { fileName = 'sheetjs', headers = [] } = {}) {
  const ws = XLSX.utils.json_to_sheet(data, {
    header: headers.map((h) => h.name),
    dateNF: 'yyyy-MM-dd hh:mm',
  });
  ws['!autofilter'] = {
    ref: `A1:${XLSX.utils.encode_col(headers.length - 1)}${data.length + 1}`,
  };
  ws['!cols'] = headers.map((h) => ({ width: h.width }));
  // ws['!rows'] = [{level:7}];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, `${fileName}.xlsx`, { cellDates: true });
}

const make_cols = (refstr) => {
  let o = [],
    C = XLSX.utils.decode_range(refstr).e.c + 1;
  for (let i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i };
  return o;
};
export const SheetJSFT = [
  'xlsx',
  'xlsb',
  'xlsm',
  'xls',
  'xml',
  'csv',
  'txt',
  'ods',
  'fods',
  'uos',
  'sylk',
  'dif',
  'dbf',
  'prn',
  'qpw',
  '123',
  'wb*',
  'wq*',
  'html',
  'htm',
]
  .map(function (x) {
    return '.' + x;
  })
  .join(',');
