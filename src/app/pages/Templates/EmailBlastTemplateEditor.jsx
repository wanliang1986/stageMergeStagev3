import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { upsertTemplate } from '../../actions/templateAction';
import { withStyles } from '@material-ui/core/styles';
import { sendTestEmail } from '../../actions/emailAction';

import { Editor } from '@tinymce/tinymce-react';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import FormInput from '../../components/particial/FormInput';
import PrimaryButton from '../../components/particial/PrimaryButton';
import SecondaryButton from '../../components/particial/SecondaryButton';
import PotentialButton from '../../components/particial/PotentialButton';
import { uploadAvatar } from '../../../apn-sdk';

const styles = (theme) => ({
  tags: {
    paddingLeft: 17,
  },
  tagContent: {
    padding: '4px 4px 8px',
    border: `1px solid #C8C8C8`,
    marginTop: '20px',
    height: 'calc(100% - 54px)',
    overflowY: 'auto',
    minWidth: '215px',
  },
  tagButton: {
    borderRadius: '16px',
    padding: '0 14px',
    backgroundColor: '#EDEDED',
    margin: '5px',
    height: '32px',
  },
});

class TemplateEditor extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: props.template.get('type') || '',
      errorMessage: Immutable.Map(),
      sending: false,
    };
    this.lastFocused = null;
    this.value = props.template.get('template') || '';
    this.templateForm = React.createRef();
  }

  onChange = (value) => {
    this.setState({ value });
  };

  handleEditorChange = (e) => {
    const value = e.target.getContent();
    console.log('Content was updated:', value);
    this.value = value;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const templateForm = e.target;
    let errorMessage = this._validateForm(templateForm);
    if (errorMessage) {
      return this.setState({ errorMessage });
    }

    const { template, dispatch, handleRequestClose } = this.props;

    const newTemplate = {
      isRichText: true,
      title: templateForm.title.value,
      subject: templateForm.subject.value,
      template: this.value,
      type: 'Email_Blast', //templateForm.type.value
    };

    dispatch(upsertTemplate(newTemplate, template.get('id'))).then(
      handleRequestClose
    );
  };

  _validateForm(basicForm) {
    let errorMessage = Immutable.Map();

    if (!basicForm.title.value) {
      errorMessage = errorMessage.set(
        'title',
        this.props.t('message:Title is required')
      );
    }

    return errorMessage.size > 0 && errorMessage;
  }

  removeErrorMessage = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  handleSendTestEmail = (e) => {
    e.preventDefault();
    const templateForm = this.templateForm.current;
    if (templateForm) {
      this.setState({ sending: true });
      const { dispatch } = this.props;
      dispatch(sendTestEmail(templateForm.subject.value, this.value)).then(() =>
        this.setState({ sending: false })
      );
    }
  };

  onFocus = () => {
    this.lastFocused = document.activeElement;
  };

  render() {
    const { t, i18n, template, handleRequestClose } = this.props;
    const { errorMessage, sending } = this.state;
    const isZH = i18n.language.match('zh');

    console.log('[[tmeplate]]', template.get('template'));
    return (
      <React.Fragment>
        <DialogContent className="flex-container">
          <form
            onSubmit={this.handleSubmit}
            id="templateForm"
            className={'flex-child-auto flex-container flex-dir-column'}
            ref={this.templateForm}
          >
            <Typography variant="h5" gutterBottom>
              {t('common:View/Edit Template')}
            </Typography>
            <div>
              <div className="row expanded ">
                <div className="small-12 columns">
                  <FormInput
                    label={t('field:templateName')}
                    name="title"
                    placeholder="title"
                    defaultValue={template.get('title')}
                    onBlur={() => this.removeErrorMessage('title')}
                    errorMessage={errorMessage.get('title')}
                  />
                </div>
                <div className="small-12 columns">
                  <FormInput
                    label={t('field:subject')}
                    name="subject"
                    placeholder="subject"
                    defaultValue={template.get('subject')}
                    onFocus={this.onFocus}
                  />
                </div>
              </div>
            </div>

            <div
              className="columns flex-child-auto "
              style={{
                height: 900,
                overflow: 'hidden',
                flex: '1 1 auto',
                marginTop: 4,
              }}
            >
              <Editor
                apiKey={'tojl9grn4udojs81m50kdmmd5ys79uhbg5aqwy1kh27fv8vh'}
                initialValue={template.get('template') || ''}
                init={{
                  valid_children: '+body[style]',

                  language_url: isZH ? '/langs/zh_CN.js' : '',
                  language: isZH ? 'zh_CN' : 'en_US',
                  menubar: false,
                  // statusbar: false,
                  branding: false,
                  elementpath: false,
                  convert_urls: false,
                  paste_data_images: true,
                  /* enable title field in the Image dialog*/
                  image_title: true,
                  /* enable automatic uploads of images represented by blob or data URIs*/
                  automatic_uploads: true,

                  file_picker_callback: function (callback, value, meta) {
                    /* Provide file and text for the link dialog */

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
                  },
                  images_upload_handler: function (blobInfo, success, failure) {
                    // console.log(blobInfo);
                    uploadAvatar(blobInfo.blob()).then(
                      (res) => success(res.response.s3url, blobInfo.filename()),
                      (err) => failure(err.status)
                    );
                  },

                  skin_url: '/skins/oxide',
                  content_css: '/skins/content/default/content.min.css',
                  height: '100%',
                  plugins:
                    'print preview paste searchreplace code visualchars visualblocks image link table charmap hr advlist lists textcolor wordcount contextmenu colorpicker textpattern',
                  toolbar1:
                    'print preview | undo redo | searchreplace | link unlink | table hr removeformat | forecolor backcolor image | charmap | code | formatselect fontselect fontsizeselect | bold italic underline strikethrough | numlist bullist outdent indent | alignleft aligncenter alignright alignjustify | customTags',
                  table_default_attributes: {
                    border: '0',
                  },

                  setup: function (editor) {
                    editor.ui.registry.addMenuButton('customTags', {
                      text: 'Merge Tags',
                      fetch: function (callback) {
                        callback([
                          {
                            type: 'menuitem',
                            text: 'Full Name',
                            onAction: function () {
                              editor.insertContent('{{name}}');
                            },
                          },
                        ]);
                      },
                    });
                  },
                }}
                onChange={this.handleEditorChange}
                onFocus={this.onFocus}
              />
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <div className="horizontal-layout flex-child-auto">
            <SecondaryButton onClick={handleRequestClose}>
              {t('action:cancel')}
            </SecondaryButton>
            <PrimaryButton type="submit" form="templateForm">
              {t('action:save')}
            </PrimaryButton>
            <div className="flex-child-auto" />
            <PotentialButton
              onClick={this.handleSendTestEmail}
              processing={sending}
            >
              {t('action:test')}
            </PotentialButton>
          </div>
        </DialogActions>
      </React.Fragment>
    );
  }
}

TemplateEditor.propTypes = {
  handleRequestClose: PropTypes.func.isRequired,
  template: PropTypes.instanceOf(Immutable.Map),
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default withStyles(styles)(TemplateEditor);
