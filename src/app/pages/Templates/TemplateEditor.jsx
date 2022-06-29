import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { upsertTemplate } from '../../actions/templateAction';
import { templateTypes2 } from '../../constants/formOptions';
import { withStyles } from '@material-ui/core/styles';
import { uploadAvatar } from '../../../apn-sdk';

import Select from 'react-select';
import { Editor } from '@tinymce/tinymce-react';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import FormReactSelectContainer from '../../components/particial/FormReactSelectContainer';
import FormInput from '../../components/particial/FormInput';
import PrimaryButton from '../../components/particial/PrimaryButton';
import SecondaryButton from '../../components/particial/SecondaryButton';

const templateTypeOptions = templateTypes2;
const specialTags = [
  { value: '{{{COMPANYNAME}}}', label: 'Company' },
  { value: '{{{JOBTITLE}}}', label: 'Job Title' },
  { value: '{{{JOBID}}}', label: 'Job ID' },
  { value: '{{{JOBCODE}}}', label: 'Job Code' },
  { value: '{{{JOBLINK}}}', label: 'Job Link' },
  { value: '{{{JOBOWNER}}}', label: 'Job Owner' },
  { value: '{{{JOBCITY}}}', label: 'Job City' },
  { value: '{{{JOBSTATE}}}', label: 'Job State' },
  { value: '{{{AGREEDPAYRATE}}}', label: 'Agreed Pay Rate' },
  { value: '{{{MONTHDURATION}}}', label: 'Month Duration' },
  { value: '{{{JOBDESCRIPTION}}}', label: 'Job Description' },
  { value: '{{{CANDIDATEFIRSTNAME}}}', label: 'Candidate First Name' },
  { value: '{{{CANDIDATELASTNAME}}}', label: 'Candidate Last Name' },
  { value: '{{{CANDIDATEFULLNAME}}}', label: 'Candidate Full Name' },
  { value: '{{{CANDIDATEEMAIL}}}', label: 'Candidate Email' },
  { value: '{{{CANDIDATEPHONE}}}', label: 'Candidate Phone' },
  { value: '{{{CANDIDATESCHOOL}}}', label: 'Candidate School' },
  { value: '{{{CANDIDATECOMPANY}}}', label: 'Candidate Company' },
  { value: '{{{CANDIDATETITLE}}}', label: 'Candidate Title' },

  { value: '{{{CANDIDATECITY}}}', label: 'Candidate City' },
  { value: '{{{CANDIDATESTATE}}}', label: 'Candidate State' },
  { value: '{{{SUBMITRECRUITER}}}', label: 'Submit Recruiter' },
  { value: '{{{USERFIRSTNAME}}}', label: 'User First Name' },
  { value: '{{{USERLASTNAME}}}', label: 'User Last Name' },
  { value: '{{{USEREMAIL}}}', label: 'User Email' },
  { value: '{{{USERPHONE}}}', label: 'User Phone' },
  { value: '{{{USERCOMPANY}}}', label: 'User Company' },
];
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

  selectedTag: {
    backgroundColor: '#C8C8C8',
  },
});

class TemplateEditor extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: props.template.get('type') || '',
      errorMessage: Immutable.Map(),
      selectedTag: this._loadSelectedTag(),
    };
    this.lastFocused = null;
    this.value = props.template.get('template') || '';
  }

  _loadSelectedTag = () => {
    // var regex = new RegExp('(?<={{{)[^}]*(?=}}})', 'g');
    var regex = new RegExp('{{{([^}]*)}}}', 'g');
    var str = this.props.template.get('template');
    var array1;
    let res = [];

    while ((array1 = regex.exec(str)) !== null) {
      // console.log(array1)
      res.push(array1[1]);
    }

    res = res.map((ele) => {
      return '{{{' + ele + '}}}';
    });

    return res;
  };

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
      type: templateForm.type.value,
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

    if (!basicForm.type.value) {
      errorMessage = errorMessage.set(
        'type',
        this.props.t('message:Please select a type')
      );
    }

    return errorMessage.size > 0 && errorMessage;
  }

  removeErrorMessage = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  _insertText = (text) => {
    if (this.state.selectedTag.findIndex((ele) => ele === text) === -1) {
      let selectedTag = [...this.state.selectedTag, text];
      this.setState({ selectedTag });
    }

    var input = this.lastFocused;
    if (!input || input.tagName !== 'INPUT') {
      // return tinymce.activeEditor.execCommand('mceInsertContent', false, text);
      return window.tinymce.activeEditor.insertContent(text);
    }
    var scrollPos = input.scrollTop;
    var pos = 0;
    var browser =
      input.selectionStart || input.selectionStart === '0'
        ? 'ff'
        : document.selection
        ? 'ie'
        : false;
    if (browser === 'ie') {
      input.focus();
      var range = document.selection.createRange();
      range.moveStart('character', -input.value.length);
      pos = range.text.length;
    } else if (browser === 'ff') {
      pos = input.selectionStart;
    }

    var front = input.value.substring(0, pos);
    var back = input.value.substring(pos, input.value.length);
    input.value = front + text + back;
    pos = pos + text.length;
    if (browser === 'ie') {
      input.focus();
      range = document.selection.createRange();
      range.moveStart('character', -input.value.length);
      range.moveStart('character', pos);
      range.moveEnd('character', 0);
      range.select();
    } else if (browser === 'ff') {
      input.selectionStart = pos;
      input.selectionEnd = pos;
      input.focus();
    }
    input.scrollTop = scrollPos;
  };

  onFocus = () => {
    this.lastFocused = document.activeElement;
  };

  render() {
    const { t, classes, template, handleRequestClose } = this.props;
    const { type, errorMessage, selectedTag } = this.state;

    console.log('[[tmeplate]]', template.get('template'));
    return (
      <React.Fragment>
        <DialogContent className="flex-container">
          <form
            onSubmit={this.handleSubmit}
            id="templateForm"
            className={'flex-child-auto flex-container flex-dir-column'}
          >
            <Typography variant="h5" gutterBottom>
              {t('common:View/Edit Template')}
            </Typography>
            <div>
              <div className="row expanded ">
                <div className="small-7 columns">
                  <FormInput
                    label={t('field:templateName')}
                    name="title"
                    placeholder="title"
                    defaultValue={template.get('title')}
                    onBlur={() => this.removeErrorMessage('title')}
                    errorMessage={errorMessage.get('title')}
                  />
                </div>
                <div className="small-5 columns">
                  <FormReactSelectContainer
                    label={t('field:type')}
                    errorMessage={errorMessage.get('type')}
                  >
                    <Select
                      clearable={false}
                      options={templateTypeOptions}
                      value={type}
                      onChange={(type) => {
                        this.setState({ type });
                      }}
                      simpleValue
                      openOnFocus={true}
                      onBlur={() => this.removeErrorMessage('type')}
                    />
                  </FormReactSelectContainer>
                  <input type="hidden" name="type" value={type} />
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
                    'print preview | undo redo | searchreplace | link unlink | table hr removeformat | forecolor backcolor image | charmap | code | formatselect fontselect fontsizeselect | bold italic underline strikethrough | numlist bullist outdent indent | alignleft aligncenter alignright alignjustify ',
                }}
                onChange={this.handleEditorChange}
                onFocus={this.onFocus}
              />
            </div>
          </form>
          <div className={classes.tags}>
            <Typography variant="h5">{t('common:Special tags')}</Typography>
            <div className={classes.tagContent}>
              {specialTags.map((tag, index) => {
                return (
                  <div key={index}>
                    <button
                      className={
                        selectedTag.findIndex((ele) => ele === tag.value) === -1
                          ? `${classes.tagButton}`
                          : `${classes.tagButton} ${classes.selectedTag}`
                      }
                      onClick={() => this._insertText(tag.value)}
                    >
                      {tag.label}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <div>
            <div className="horizontal-layout">
              <SecondaryButton onClick={handleRequestClose}>
                {t('action:cancel')}
              </SecondaryButton>
              <PrimaryButton type="submit" form="templateForm">
                {t('action:save')}
              </PrimaryButton>
            </div>
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
