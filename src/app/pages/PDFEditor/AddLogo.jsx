import React from 'react';
import 'pdfjs-dist/web/pdf_viewer.css';
import { pdfjs as PDFJS } from 'react-pdf/dist/esm/entry.webpack';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import { withTranslation } from 'react-i18next';
import { asyncPool } from '../../../utils/asyncPool';
import { PDFDocument } from 'pdf-lib';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import PrimaryButton from '../../components/particial/PrimaryButton';
import PotentialButton from '../../components/particial/PotentialButton';

PDFJS.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.js`;

const logoUrl = '/assets/logoIPG.png';
const styles = {
  root: {
    background: 'lightgray',
    overflowX: 'auto',
    overflowY: 'auto',
    height: '100%',
    border: '1px solid',
  },
  content: {
    float: 'left',
    position: 'relative',
  },
  draggable: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 100,
    height: 40,
    boxSizing: 'content-box',
    border: '3px solid #3498DB',
    visibility: 'hidden',
    cursor: 'grab',
  },
  resizer: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: 'white',
    border: '3px solid #3498DB',
    position: 'absolute',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '300px',
    minHeight: '50px',
  },
};

class AddLogo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resumeFile: null,
      toAllPage: false,
    };
    this.logo = React.createRef();
  }

  handleResumeUpload = (e) => {
    this._resetLogo();
    const fileInput = e.target;
    const resumeFile = fileInput.files[0];
    fileInput.value = '';
    if (resumeFile) {
      this.setState({ resumeFile }, () => {
        resumeFile.arrayBuffer().then(this.getPDF);
      });
    }
  };

  _resetLogo = () => {
    let container = document.getElementById('container');
    container.innerHTML = '';
    const element = document.querySelector('#dragDiv');
    element.style.border = 'none';
    element.style.visibility = 'hidden';
    // element.style.top = '10px';
    // element.style.left = '10px';
    // element.style.width = '100px';
    // element.style.height = '40px';
  };

  getPDF = (file) => {
    const element = document.querySelector('#dragDiv');
    element.style.visibility = 'visible';
    element.style.border = '3px solid #3498DB';

    PDFJS.getDocument({
      data: file,
      cMapUrl: `//cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS.version}/cmaps/`,
      cMapPacked: true,
    }).promise.then((pdf) => {
      // for (let i = 1; i <= pdf.numPages; i++) {
      this._renderPDF(pdf, 1);
      // }
    });
  };

  _renderPDF = (pdf, num) => {
    let pageDiv;
    let container = document.getElementById('container');
    pdf.getPage(num).then((page) => {
      //适配大显示器,retina
      let scale = 1;
      let viewport = page.getViewport({ scale });
      pageDiv = document.createElement('div');
      pageDiv.setAttribute('id', 'page-' + page.pageNumber);
      pageDiv.setAttribute('style', `padding:0px;line-height: 0px;`);
      let canvas = document.createElement('canvas');
      pageDiv.appendChild(canvas);
      let context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      container.appendChild(pageDiv);
      let renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      page.render(renderContext);
    });
  };

  //适配letter a4
  download = async () => {
    const { resumeFile, toAllPage } = this.state;

    const existingPdfBytes = await resumeFile.arrayBuffer();
    const logoBytes = await fetch(logoUrl).then((res) => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const logoImage = await pdfDoc.embedPng(logoBytes);
    const pages = pdfDoc.getPages();
    if (toAllPage) {
      await asyncPool(1, pages, (p) => {
        this._addLogo(p, pdfDoc, logoImage);
      });
    } else {
      await this._addLogo(pages[0], pdfDoc, logoImage);
    }
    const pdfBytes = await pdfDoc.save();
    this._download(pdfBytes, resumeFile.name);
  };

  _addLogo = async (page, pdfDoc, logoImage) => {
    const logoStyle = getComputedStyle(this.logo.current, null);
    const width = parseFloat(logoStyle.getPropertyValue('width'));
    const height = parseFloat(logoStyle.getPropertyValue('height'));
    const x = parseFloat(logoStyle.getPropertyValue('left'));
    const y = parseFloat(logoStyle.getPropertyValue('top'));
    //pdf draw from bottom-left
    page.drawImage(logoImage, {
      x,
      y: page.getHeight() - height - y,
      width,
      height,
    });
  };

  _download = (buffer, filename) => {
    const blob = new Blob([buffer], {
      type: 'application/pdf',
    });

    const url = window.URL.createObjectURL(blob);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', filename);
    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: false,
    });
    linkElement.dispatchEvent(clickEvent);
  };

  componentDidMount() {
    this._makeResizableDiv('#dragDiv');
    this._makeDraggableDiv('#dragDiv');
  }

  render() {
    const { classes, t } = this.props;
    const { resumeFile, toAllPage } = this.state;
    return (
      <>
        <div
          className="horizontal-layout align-middle"
          style={{ minHeight: 50, flexWrap: 'wrap' }}
        >
          <PrimaryButton
            variant="contained"
            color="primary"
            component="label"
            onChange={this.handleResumeUpload}
          >
            {t('action:uploadResume')}
            <input key="resume" type="file" style={{ display: 'none' }} />
          </PrimaryButton>
          {resumeFile && (
            <>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={toAllPage}
                    onChange={(e) =>
                      this.setState({ toAllPage: e.target.checked })
                    }
                    color="primary"
                  />
                }
                label="To All Page"
              />
              <PotentialButton
                variant="outlined"
                color="primary"
                onClick={this.download}
              >
                {t('action:download')}
              </PotentialButton>

              <PotentialButton
                variant="outlined"
                color="primary"
                onClick={() => {
                  this.setState({ resumeFile: null });
                  this._resetLogo();
                }}
              >
                {t('action:clear')}
              </PotentialButton>
            </>
          )}
        </div>

        <div id="routesContainer" className={classes.root}>
          <div id="content" className={classes.content}>
            <div id="container" />

            <div
              className={classes.draggable}
              id="dragDiv"
              style={{
                backgroundSize: 'contain',
                backgroundImage: `url(${logoUrl})`,
              }}
              ref={this.logo}
            >
              <div
                className={`${classes.resizer} resizer`}
                style={{ left: '-6.5px', top: '-6.5px', cursor: 'nwse-resize' }}
              />
              <div
                className={`${classes.resizer} resizer top-right`}
                style={{
                  right: '-6.5px',
                  top: '-6.5px',
                  cursor: 'nesw-resize',
                }}
              />
              <div
                className={`${classes.resizer} resizer bottom-left`}
                style={{
                  left: '-6.5px',
                  bottom: '-6.5px',
                  cursor: 'nesw-resize',
                }}
              />
              <div
                className={`${classes.resizer} resizer bottom-right`}
                style={{
                  right: '-6.5px',
                  bottom: '-6.5px',
                  cursor: 'nwse-resize',
                }}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
  _makeDraggableDiv(div) {
    const container = document.querySelector(div);
    var initialX;
    var initialY;
    let diffX;
    let diffY;

    let root = document.querySelector('#routesContainer');

    container.onmousedown = function (e) {
      var original_x = container.getClientRects()[0].left;
      var original_y = container.getClientRects()[0].top;

      initialX = e.pageX;
      initialY = e.pageY;
      console.log('donw', original_x, original_y);

      container.onmousemove = function (e) {
        e.preventDefault();
        diffX = e.pageX - initialX;
        diffY = e.pageY - initialY;
        // console.log(original_x,initialX,e.pageX);

        // const liveLeft=container.getClientRects()[0].left;
        // const liveTop=container.getClientRects()[0].top;

        container.style.left = original_x + diffX - 72 + root.scrollLeft + 'px';
        container.style.top = original_y + diffY - 130 + root.scrollTop + 'px';
      };
    };
    window.onmouseup = function () {
      container.onmousemove = null;
    };
  }

  _makeResizableDiv = (div) => {
    const element = document.querySelector(div);
    const resizers = document.querySelectorAll(div + ' .resizer');

    const minimum_size = 60;
    const maximum_size = 300;
    let original_width = 0;
    let original_height = 0;
    let original_x = 0;
    let original_y = 0;
    let original_mouse_x = 0;
    let original_mouse_y = 0;
    for (let i = 0; i < resizers.length; i++) {
      const currentResizer = resizers[i];
      currentResizer.addEventListener('mousedown', function (e) {
        e.preventDefault();
        e.stopPropagation();
        original_width = parseFloat(
          getComputedStyle(element, null)
            .getPropertyValue('width')
            .replace('px', '')
        );
        original_height = parseFloat(
          getComputedStyle(element, null)
            .getPropertyValue('height')
            .replace('px', '')
        );
        original_x = element.getBoundingClientRect().left;
        original_y = element.getBoundingClientRect().top;
        original_mouse_x = e.pageX;
        original_mouse_y = e.pageY;
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResize);
      });

      function resize(e) {
        const diff = e.pageX - original_mouse_x;
        let root = document.querySelector('#routesContainer');
        if (currentResizer.classList.contains('bottom-right')) {
          const width = original_width + (e.pageX - original_mouse_x);

          if (width > minimum_size && width < maximum_size) {
            element.style.width = original_width + diff + 'px';
            element.style.height = original_height + diff * 0.4 + 'px';
          }
        } else if (currentResizer.classList.contains('bottom-left')) {
          const width = original_width - (e.pageX - original_mouse_x);

          if (width > minimum_size && width < maximum_size) {
            element.style.width = original_width - diff + 'px';
            element.style.left =
              original_x + diff - 72 + root.scrollLeft + 'px';
            element.style.height = original_height - diff * 0.4 + 'px';
          }
        } else if (currentResizer.classList.contains('top-right')) {
          const width = original_width + (e.pageX - original_mouse_x);

          if (width > minimum_size && width < maximum_size) {
            element.style.width = original_width + diff + 'px';
            element.style.top =
              original_y - diff * 0.4 - 130 + root.scrollTop + 'px';
            element.style.height = original_height + diff * 0.4 + 'px';
          }
        } else {
          const width = original_width - (e.pageX - original_mouse_x);

          if (width > minimum_size && width < maximum_size) {
            element.style.width = original_width - diff + 'px';
            element.style.left =
              original_x + diff - 72 + root.scrollLeft + 'px';
            element.style.top =
              original_y + diff * 0.4 - 130 + root.scrollTop + 'px';
            element.style.height = original_height - diff * 0.4 + 'px';
          }
        }
      }

      function stopResize() {
        window.removeEventListener('mousemove', resize);
      }
    }
  };
}

export default withTranslation(['action'])(
  connect()(withStyles(styles)(AddLogo))
);
