import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { uploadAvatar } from '../../../apn-sdk';

const editorConfig = {
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
          const blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
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
          const blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
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
  resize: true,
  height: localStorage.getItem('emailContentHeight') || '400',
  // height: '100%',
  skin_url: '/skins/oxide',
  content_css: '/skins/content/default/content.min.css',
  plugins:
    'print preview paste  searchreplace code visualchars visualblocks image link table charmap hr advlist lists textcolor wordcount contextmenu colorpicker textpattern',
  toolbar:
    'fontselect fontsizeselect | bold italic underline | forecolor backcolor | numlist bullist outdent indent | alignleft aligncenter alignright alignjustify | removeformat',
  setup: (editor) => {
    editor.on('ResizeEditor', function (e) {
      editorConfig.height = editor.getContainer().clientHeight;
      localStorage.setItem('emailContentHeight', editorConfig.height);
    });
  },
};

function RichTextEditor({
  initialValue,
  editorRef,
  onChange,
  className,
  isEmailBlast,
}) {
  return (
    <div style={{ padding: '4px 2px 0 0' }} className={className}>
      <Editor
        apiKey={'tojl9grn4udojs81m50kdmmd5ys79uhbg5aqwy1kh27fv8vh'}
        initialValue={initialValue}
        init={{
          ...editorConfig,

          toolbar: isEmailBlast
            ? 'preview | fontselect fontsizeselect | bold italic underline | forecolor backcolor | numlist bullist outdent indent | alignleft aligncenter alignright alignjustify | removeformat | customTags'
            : 'fontselect fontsizeselect | bold italic underline | forecolor backcolor | numlist bullist outdent indent | alignleft aligncenter alignright alignjustify | removeformat',

          setup: (editor) => {
            editorRef(editor);
            editorConfig.setup(editor);
            if (isEmailBlast) {
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
            }
          },
        }}
        onChange={onChange}
      />
    </div>
  );
}

export default RichTextEditor;
