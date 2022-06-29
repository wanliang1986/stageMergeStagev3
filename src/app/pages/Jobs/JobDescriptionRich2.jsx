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
  },
});

class JobDescription extends React.Component {
  constructor(props) {
    super(props);
    this.editor = React.createRef();
  }

  render() {
    const { text, onChange } = this.props;

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
            ref={this.editor}
            value={text}
            init={{
              paste_data_images: true,
              menubar: false,
              statusbar: false,
              branding: false,
              elementpath: false,
              skin_url: '/skins/oxide',
              content_css: '/skins/content/default/content.min.css',
              plugins:
                'print preview paste searchreplace code visualchars visualblocks link table charmap hr advlist lists textcolor wordcount colorpicker textpattern',
              toolbar: [],
              height: 250,
              convert_urls: false,
            }}
            onEditorChange={(publicDesc, editor) => {
              const jdText = editor.getBody().innerText.trim();
              onChange({ jdText, publicDesc });
            }}
          />
        </div>
      </>
    );
  }
}

export default withStyles(styles)(JobDescription);
