import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { uploadAvatar } from './../actions/filesActions';

import AvatarEditor from 'react-avatar-editor';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Slider from '@material-ui/core/Slider';

import PrimaryButton from './particial/PrimaryButton';
import SecondaryButton from './particial/SecondaryButton';

const defaultImage =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

class ImageEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scale: 1,
      url: this.props.photoUrl || null,
    };
  }

  _uploadImage = (image) => {
    const { dispatch, onSave } = this.props;
    dispatch(uploadAvatar(image)).then(({ s3url }) => {
      onSave(s3url);
      this.setState({
        url: s3url,
      });
    });
  };

  onClickSave = () => {
    if (this.editor) {
      // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
      // drawn on another canvas, or added to the DOM.
      this.editor.getImageScaledToCanvas().toBlob((blob) => {
        this._uploadImage(blob);
      });
    }
  };

  setEditorRef = (editor) => (this.editor = editor);

  render() {
    const { scale, url } = this.state;
    const { t, open, image, onNewImage, circle, photoUrl } = this.props;
    return (
      <Dialog
        open={open}
        maxWidth="sm"
        // PaperProps={{ style: { overflowX: 'hidden' } }}
      >
        <DialogTitle>{t('common:editImage')}</DialogTitle>
        <div className="flex-child-auto">
          <AvatarEditor
            ref={this.setEditorRef}
            image={image || defaultImage}
            width={200}
            height={200}
            border={[120, 20, 120, 100]}
            borderRadius={circle ? 100 : 4}
            scale={scale}
            crossOrigin={'anonymous'}
            color={[0, 0, 0, 0.3]}
          />
          <div
            className="align-middle container-padding horizontal-layout"
            style={{ paddingTop: 10 }}
          >
            <div>{t('action:zoom')}:</div>

            <div>
              <Slider
                min={0.1}
                max={2}
                step={0.1}
                value={scale}
                style={{ width: 200 }}
                onChange={(_, scale) => this.setState({ scale })}
              />
            </div>
          </div>
        </div>

        <Divider />
        <DialogActions style={{ paddingBottom: 12 }}>
          <SecondaryButton onClick={() => this.props.onSave(url)}>
            {t('action:cancel')}
          </SecondaryButton>

          <SecondaryButton component="label" onChange={onNewImage}>
            {t('action:changePhoto')}
            <input key="newImage" type="file" style={{ display: 'none' }} />
          </SecondaryButton>
          <PrimaryButton onClick={this.onClickSave}>
            {t('action:confirm')}
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    );
  }
}

ImageEditor.propTypes = {
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onSave: PropTypes.func,
  onNewImage: PropTypes.func,
};

export default withTranslation('action')(connect()(ImageEditor));
