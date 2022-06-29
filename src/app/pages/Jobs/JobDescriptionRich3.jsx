import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Editor } from '@tinymce/tinymce-react';

const styles = (theme) => ({
  buttonProgress: {
    color: theme.palette.primary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
    height: 600,
  },
});

const state = {};

class JobDescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = this._getStateFromProps(props);
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
    return {
      publicDesc: props.job.get('publicDesc') || '',
      jdText: props.job.get('jdText') || '',
    };
  };

  render() {
    const { publicDesc } = this.state;
    const { disabled, job, lang } = this.props;
    const isZH = lang.match('zh');
    return (
      <>
        <div
          className="flex-child-auto flex-container flex-dir-column"
          style={{
            position: 'relative',
            overflow: 'inherit',
            padding: 2,
            marginLeft: -1,
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
              convert_urls: false,
              contextmenu: 'link image table copy paste',
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
        </div>
      </>
    );
  }
}

export default withStyles(styles)(JobDescription);
