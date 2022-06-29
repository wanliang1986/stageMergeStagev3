import React from 'react';
import Immutable from 'immutable';
import { withStyles } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import CircularProgress from '@material-ui/core/CircularProgress';

import CustomAutoComplete from '../../components/particial/CustomAutoComplete/index2';
import { Editor } from '@tinymce/tinymce-react';
import { uploadAvatar } from '../../../apn-sdk';

const styles = (theme) => ({
  buttonProgress: {
    color: theme.palette.primary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

const state = {};

class JobDescription extends React.Component {
  constructor(props) {
    super(props);
    const initialState = this._getStateFromProps(props);
    initialState.parsing = false;
    this.state = initialState;
    this.editor = React.createRef();
  }

  componentDidMount(): void {
    const editor = this.editor.current;
    console.log(editor);
  }

  componentWillUnmount(): void {
    state.publicDesc = this.state.publicDesc;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.job !== this.props.job ||
      nextProps.disabled !== this.props.disabled
    ) {
      this.setState(this._getStateFromProps(nextProps));
    }
  }

  _getStateFromProps = (props, state = {}) => {
    let keywords = props.job.get('keywords') || '';
    let requiredKeywords = props.job.get('requiredKeywords') || '';

    const keywordsOptions = Immutable.Set()
      .concat(keywords.split(','), requiredKeywords.split(','))
      .toArray()
      .filter((f) => f && f.trim());

    return {
      publicDesc: props.job.get('publicDesc') || '',
      jdText: props.job.get('jdText') || '',
      keywords,
      requiredKeywords,
      keywordsOptions,
    };
  };

  handleParseJD = (e) => {
    e.preventDefault();
    const jdText = this.editor.current.editor.getBody().innerText.trim();
    const publicDesc = this.editor.current.editor.getContent();

    this.props.onParseJD({
      publicDesc,
      jdText,
    });
  };

  render() {
    const { publicDesc } = this.state;
    const { t, classes, parsing, disabled, job, lang, onParseJD } = this.props;
    // console.log(publicDesc);
    const isZH = lang.match('zh');
    return (
      <>
        <div
          className="flex-child-auto flex-container flex-dir-column"
          style={{
            position: 'relative',
            overflow: 'inherit',
          }}
        >
          <Editor
            apiKey={'tojl9grn4udojs81m50kdmmd5ys79uhbg5aqwy1kh27fv8vh'}
            key={job.get('lastModifiedDate') + lang}
            ref={this.editor}
            value={publicDesc}
            init={{
              language_url: isZH ? '/langs/zh_CN.js' : '',
              language: isZH ? 'zh_CN' : 'en_US',
              paste_data_images: true,
              /* enable title field in the Image dialog*/
              image_title: true,
              /* enable automatic uploads of images represented by blob or data URIs*/
              automatic_uploads: true,

              file_picker_callback: function (callback, value, meta) {
                /* Provide file and text for the link dialog */
                // console.log(meta)

                /* Provide link and alt text for the link dialog */
                if (meta.filetype === 'file') {
                  const input = document.createElement('input');
                  input.setAttribute('type', 'file');
                  input.onchange = function () {
                    const file = this.files[0];

                    const reader = new FileReader();
                    reader.onload = function () {
                      /*
                        Note: Now we need to register the blob in TinyMCEs image blob
                        registry. In the next release this part hopefully won't be
                        necessary, as we are looking to handle it internally.
                      */
                      const id = 'blobid' + new Date().getTime();
                      const blobCache =
                        window.tinymce.activeEditor.editorUpload.blobCache;
                      const base64 = reader.result.split(',')[1];
                      const blobInfo = blobCache.create(id, file, base64);
                      blobCache.add(blobInfo);

                      /* call the callback and populate the Title field with the file name */
                      // callback(blobInfo.blobUri(), { text: file.name });

                      uploadAvatar(blobInfo.blob()).then((res) =>
                        callback(res.response.s3url, { text: file.name })
                      );
                    };
                    reader.readAsDataURL(file);
                  };

                  input.click();
                }

                /* Provide image and alt text for the image dialog */
                if (meta.filetype === 'image') {
                  const input = document.createElement('input');
                  input.setAttribute('type', 'file');
                  input.setAttribute('accept', 'image/*');

                  /*
                    Note: In modern browsers input[type="file"] is functional without
                    even adding it to the DOM, but that might not be the case in some older
                    or quirky browsers like IE, so you might want to add it to the DOM
                    just in case, and visually hide it. And do not forget do remove it
                    once you do not need it anymore.
                  */

                  input.onchange = function () {
                    const file = this.files[0];

                    const reader = new FileReader();
                    reader.onload = function () {
                      /*
                        Note: Now we need to register the blob in TinyMCEs image blob
                        registry. In the next release this part hopefully won't be
                        necessary, as we are looking to handle it internally.
                      */
                      const id = 'blobid' + new Date().getTime();
                      const blobCache =
                        window.tinymce.activeEditor.editorUpload.blobCache;
                      const base64 = reader.result.split(',')[1];
                      const blobInfo = blobCache.create(id, file, base64);
                      blobCache.add(blobInfo);

                      /* call the callback and populate the Title field with the file name */
                      callback(blobInfo.blobUri(), { title: file.name });
                    };
                    reader.readAsDataURL(file);
                  };

                  input.click();
                }

                // /* Provide alternative source and posted for the media dialog */
                // if (meta.filetype === 'media') {
                //   callback('movie.mp4', {
                //     source2: 'alt.ogg',
                //     poster: 'https://www.google.com/logos/google.jpg',
                //   });
                // }
              },
              images_upload_handler: function (blobInfo, success, failure) {
                // console.log(blobInfo);
                uploadAvatar(blobInfo.blob()).then(
                  (res) => success(res.response.s3url, blobInfo.filename()),
                  (err) => failure(err.status)
                );
              },
              menubar: false,
              statusbar: false,
              branding: false,
              elementpath: false,
              height: '100%',
              skin_url: '/skins/oxide',
              content_css: '/skins/content/default/content.min.css',
              plugins:
                'fullscreen print preview paste searchreplace code visualchars visualblocks image link table charmap hr advlist lists textcolor wordcount contextmenu colorpicker textpattern',
              toolbar: [
                'fontselect fontsizeselect | bold italic underline forecolor backcolor | numlist bullist outdent indent | alignleft aligncenter alignright alignjustify | searchreplace | removeformat | fullscreen',
              ],
              convert_urls: false,
            }}
            onEditorChange={(publicDesc, editor) => {
              const jdText = editor.getBody().innerText.trim();
              state.publicDesc = publicDesc;
              this.setState({ jdText, publicDesc });
            }}
          />
          <input type="hidden" name="jdText" value={this.state.jdText || ''} />
          <input
            type="hidden"
            name="publicDesc"
            value={this.state.publicDesc || ''}
          />
          {onParseJD && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                minWidth: 120,
              }}
            >
              <Fab
                color="primary"
                size="small"
                style={{ width: '100%' }}
                variant="extended"
                onClick={this.handleParseJD}
                disabled={parsing}
              >
                {t('action:parseJD')}
              </Fab>
              {parsing && (
                <CircularProgress
                  className={classes.buttonProgress}
                  size={20}
                />
              )}
            </div>
          )}
        </div>

        <div style={{ marginTop: 8 }}>
          <div className="row expanded">
            <input
              type="hidden"
              name="keywords"
              disabled={disabled}
              value={this.state.keywords || ''}
            />
            <input
              type="hidden"
              name="requiredKeywords"
              disabled={disabled}
              value={this.state.requiredKeywords || ''}
            />

            <div className="small-12">
              <CustomAutoComplete
                label={t('field:Required Skills')}
                value={this.state.requiredKeywords}
                options={this.state.keywordsOptions}
                onChange={(requiredKeywords) => {
                  this.setState({ requiredKeywords });
                }}
                placeholder={''}
                disabled={disabled}
              />
            </div>
            <div className="small-12">
              <CustomAutoComplete
                label={t('field:Optional Skills')}
                value={this.state.keywords}
                options={this.state.keywordsOptions}
                onChange={(keywords) => {
                  this.setState({ keywords });
                }}
                placeholder={''}
                disabled={disabled}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withStyles(styles)(JobDescription);
