import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import clsx from 'clsx';
import { Editor } from '@tinymce/tinymce-react';
import {
  uploadAvatar,
  setCompanyInfo,
  getCompanyInfo,
} from '../../../../apn-sdk';
import Loading from '../../../components/particial/Loading';
import { showErrorMessage } from '../../../actions';
import Immutable from 'immutable';
import * as ActionTypes from '../../../constants/actionTypes';

import Button from '@material-ui/core/Button';
import { SaveContentIcon } from './../../../components/Icons';
import { withTranslation } from 'react-i18next';
const styles = {
  root: {
    position: 'relative',
    height: '100%',
    '& .tox .tox-toolbar': {
      paddingRight: '120px',
    },
  },
  saveButtonContainer: {
    position: 'absolute',
    right: 17,
    top: 17,
    zIndex: 1,
    width: 100,
  },
};

class CompanyNote extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      content: '<p>This is the initial content of the editor</p>',
      // content: '',
      isDirty: false,
      processing: false,
      show: false,
    };
    this.useDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    this.editor;
  }

  componentDidMount() {
    // console.log('componentDidMount');
    this.getData();
  }

  componentWillUnmount() {
    if (this.editor) {
      this.editor.off('NodeChange', this.handleDirty);
    }
  }

  handleDirty = () => {
    this.setState({ isDirty: this.editor.isDirty() });
  };

  getData = () => {
    const { company, dispatch } = this.props;
    // console.log(company);
    getCompanyInfo(company.get('id'))
      .then(({ response }) => {
        this.setState({
          loading: false,
          content: (response && response.info) || '',
        });
      })
      .catch((err) => {
        this.setState({
          loading: false,
          content: '',
        });
        dispatch(showErrorMessage(err));
      });
  };
  saveData = () => {
    if (this.editor) {
      const editor = this.editor;
      const info = editor.getContent();
      const { company, dispatch } = this.props;
      this.setState({
        processing: true,
      });
      if (this.editor.isDirty()) {
        editor.save();
        editor.nodeChanged();
      }

      setCompanyInfo(company.get('id'), info)
        .then(() => {
          dispatch({
            type: ActionTypes.ADD_MESSAGE,
            message: {
              type: 'hint',
              message: 'Saved',
            },
          });
        })
        .catch((err) => dispatch(showErrorMessage(err)))
        .finally(() => {
          this.setState({
            processing: false,
          });
        });
    }
  };

  handleEditorChange = (content, editor) => {
    this.setState({ content });
  };

  handleSubmit = (e) => {
    alert('handleSubmit');
    e.preventDefault();
    console.log('handleSubmit', e);
  };
  handleSaveContent = (e, ...p) => {
    e.preventDefault();
    console.log('handleSaveContent', p);
  };

  handleEvent =
    (eventName) =>
    (...p) => {
      console.log(eventName, ...p);
    };

  render() {
    const { loading, content } = this.state;
    const { classes, company, canEdit, t } = this.props;
    if (loading) {
      return <Loading />;
    }
    return (
      <div className={clsx('flex-child-auto container-padding', classes.root)}>
        <Editor
          id={String(company.get('id'))}
          apiKey={'tojl9grn4udojs81m50kdmmd5ys79uhbg5aqwy1kh27fv8vh'}
          value={content}
          init={{
            setup: (editor) => {
              this.editor = editor;
              this.editor.on('NodeChange', this.handleDirty);
              editor.on('init', (e) => {
                this.setState({ show: true });
              });
            },
            default_link_target: '_blank',
            menubar: false,
            auto_focus: String(company.get('id')),
            external_plugins: {
              checklist: '/tinymce/plugins/pluginTinychecklist/index.js',
              casechange: '/tinymce/plugins/pluginTinycasechange/index.js',
              advcode: '/tinymce/plugins/pluginTinyadvcode/index.js',
            },
            plugins:
              'save autosave advcode casechange print checklist preview paste importcss searchreplace autolink directionality visualblocks visualchars image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount textpattern noneditable help charmap quickbars emoticons',
            toolbar:
              'preview undo redo | bold italic underline strikethrough casechange | fontsizeselect formatselect | outdent indent |  numlist bullist checklist | forecolor backcolor | image link code',
            toolbar_sticky: true,
            toolbar_mode: 'wrap', //
            save_onsavecallback: this.saveData,
            branding: false,
            elementpath: false,
            convert_urls: false,
            importcss_append: true,
            automatic_uploads: true,
            paste_data_images: true,
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
            height: '100%',
            min_height: 400,
            min_width: 400,
            resize: false,
            quickbars_selection_toolbar:
              'bold italic | quicklink h2 h3 h4 blockquote quickimage quicktable',
            quickbars_insert_toolbar: '',
            noneditable_noneditable_class: 'mceNonEditable',
            contextmenu: false,
            skin_url: this.useDarkMode ? '/skins/oxide-dark' : '/skins/oxide',
            content_css: this.useDarkMode
              ? '/skins/content/dark/content.min.css'
              : '/skins/content/default/content.min.css',
            content_style:
              'body { font-family:Helvetica,Arial,sans-serif; font-size:12pt;width:calc(100% - 2rem);max-width:675px;margin-left:auto; margin-right:auto; } img {max-width:100%} \n' +
              'table, tr, td {\n' +
              '  vertical-align: top;\n' +
              '  border-collapse: collapse;\n' +
              '}\n' +
              '\n' +
              'p {\n' +
              '  margin: 0;\n' +
              '}\n' +
              '\n' +
              '.ie-container table, .mso-container table {\n' +
              '  table-layout: fixed;\n' +
              '}\n' +
              '\n' +
              '* {\n' +
              '  line-height: inherit;\n' +
              '}\n' +
              '\n' +
              "a[x-apple-data-detectors='true'] {\n" +
              '  color: inherit !important;\n' +
              '  text-decoration: none !important;\n' +
              '}\n',
            // table_default_attributes: {
            //   border: '1',
            // },
          }}
          onEditorChange={(content) => this.setState({ content })}
          disabled={!canEdit}
        />
        <div className={classes.saveButtonContainer}>
          {this.state.show && (
            <Button
              disabled={!this.state.isDirty || this.state.processing}
              onClick={this.saveData}
              startIcon={<SaveContentIcon style={{ fontSize: 24 }} />}
              title={t('tab:Save')}
            >
              {this.state.isDirty
                ? t('tab:Save')
                : this.state.processing
                ? t('tab:Saving') + '...'
                : t('tab:Saved')}
            </Button>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, { company }) => {
  const currentUserId = state.controller.currentUser.get('id');
  const authorities = state.controller.currentUser.get('authorities');

  const isAdmin =
    authorities &&
    authorities.includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' }));
  const salesLead = state.model.companies.getIn([
    String(company.get('id')),
    'salesLead',
  ]);
  const isAM =
    salesLead &&
    salesLead.find((s) => {
      const accountManager = s.get('accountManager');
      return (
        accountManager &&
        accountManager.find((am) => {
          // console.log(am.get('id'));
          return am.get('id') === currentUserId;
        })
      );
    });
  return {
    canEdit: isAdmin || isAM,
  };
};

export default withTranslation('tab')(
  connect(mapStateToProps)(withStyles(styles)(CompanyNote))
);
