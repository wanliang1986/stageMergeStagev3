import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Editor } from '@tinymce/tinymce-react';
import { apn } from '../../../../apn-sdk/request';
import * as apnSDK from '../../../../apn-sdk/';
// import { classNames } from 'react-select-5/dist/declarations/src/utils';

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
    this.state = this._getStateFromProps(props);
    this.editor = React.createRef();
  }

  _getStateFromProps = (props, state = {}) => {
    console.log('bill debug::::::', props.job.toJS());
    console.log(props.value);
    return {
      ipgPublicDesc: props.job.get('ipgPublicDesc') || '',
      ipgJd: props.value,
    };
  };

  componentDidMount(): void {
    const editor = document.querySelector(
      '.ipgJd_readOnly .tox-edit-area__iframe'
    );
    if (editor) {
      editor.style.cssText = `
      background-color: #f5f5f5;
      border:1px solid #cacaca;
      opacity: .6;
      `;
    }
  }

  componentWillUnmount(): void {
    this.state.publicDesc = this.state.publicDesc;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.job !== this.props.job ||
      nextProps.disabled !== this.props.disabled
    ) {
      this.setState(this._getStateFromProps(nextProps));
    }
  }

  render() {
    const { ipgPublicDesc, ipgJd } = this.state;
    const { disabled, job, lang } = this.props;
    const isZH = lang.match('zh');

    console.log('ipgJd::::', ipgJd);

    return (
      <>
        <div
          className="flex-child-auto flex-container flex-dir-column ipgJd"
          style={{
            position: 'relative',
            overflow: 'inherit',
            padding: 2,
            marginLeft: -1,
          }}
        >
          {this.props.ipgJobStatus !== 'OPEN' ? (
            <Editor
              disabled={disabled}
              key={job.get('lastModifiedDate') + lang}
              required
              apiKey={'tojl9grn4udojs81m50kdmmd5ys79uhbg5aqwy1kh27fv8vh'}
              ref={this.editor}
              value={ipgJd}
              init={{
                language_url: isZH ? '/langs/zh_CN.js' : '',
                language: isZH ? 'zh_CN' : 'en_US',
                language_url: '/langs/zh_CN.js',
                language: 'zh_CN',
                paste_data_images: true,
                menubar: false,
                statusbar: false,
                branding: false,
                elementpath: false,
                skin_url: '/skins/oxide',
                content_css: '/skins/content/default/content.min.css',
                plugins:
                  'fullscreen print preview paste searchreplace fullpage code visualchars visualblocks image link table charmap hr advlist lists textcolor wordcount colorpicker textpattern',
                toolbar: [
                  'bold italic underline | numlist bullist outdent indent | searchreplace | removeformat | fullscreen',
                ],
                height: '600px',
                width: '600px',
                convert_urls: false,
                contextmenu: 'link image table copy paste',
              }}
              onEditorChange={(publicDesc, editor) => {
                console.log(publicDesc);
                const ipgJd = editor.getBody().innerText.trim();
                this.setState({ ipgJd: publicDesc });
                this.props.onChange(publicDesc);
              }}
            />
          ) : (
            <div className="ipgJd_readOnly">
              <Editor
                // style={{
                //   minHeight: 400,
                //   border: '1px solid #cacaca',
                //   color: '#8e8e8e',
                //   backgroundColor: '#f5f5f5',
                //   padding: '5px 10px',
                //   fontSize: '14px',
                // }}
                disabled={true}
                key={job.get('lastModifiedDate') + lang}
                required
                apiKey={'tojl9grn4udojs81m50kdmmd5ys79uhbg5aqwy1kh27fv8vh'}
                ref={this.editor}
                value={ipgJd}
                init={{
                  language_url: isZH ? '/langs/zh_CN.js' : '',
                  language: isZH ? 'zh_CN' : 'en_US',
                  // language_url: '/langs/zh_CN.js',
                  // language: 'zh_CN',
                  paste_data_images: true,
                  menubar: false,
                  statusbar: false,
                  branding: false,
                  elementpath: false,
                  skin_url: '/skins/oxide',
                  content_css: '/skins/content/default/content.min.css',
                  plugins:
                    'fullscreen print preview paste searchreplace fullpage code visualchars visualblocks image link table charmap hr advlist lists textcolor wordcount colorpicker textpattern',
                  toolbar: [
                    'bold italic underline | numlist bullist outdent indent | searchreplace | removeformat | fullscreen',
                  ],
                  height: '600px',
                  width: '600px',
                  convert_urls: false,
                  contextmenu: 'link image table copy paste',
                  // minHeight: 400,
                  border: '1px solid #cacaca',
                  color: '#8e8e8e',
                  backgroundColor: '#f5f5f5',
                  padding: '5px 10px',
                  fontSize: '14px',
                }}
                onEditorChange={(publicDesc, editor) => {
                  console.log(publicDesc);
                  const ipgJd = editor.getBody().innerText.trim();
                  this.setState({ ipgJd: publicDesc });

                  this.props.onChange(publicDesc);
                }}
              />
            </div>
          )}
        </div>
      </>
    );
  }
}

export default withStyles(styles)(JobDescription);
