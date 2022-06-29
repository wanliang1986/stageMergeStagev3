import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { pdfjs, Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import AutoSizer from 'react-virtualized-auto-sizer';
import Scrollbars from 'react-custom-scrollbars';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import { externalUrl, getTalentFromParserOutput } from './../../../../utils';
import Loading from '../Loading';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const scaleOptions = [
  {
    value: 0,
    label: 'Auto',
  },
  {
    value: 200,
    label: '200%',
  },
  {
    value: 150,
    label: '150%',
  },
  {
    value: 100,
    label: '100%',
  },
  {
    value: 75,
    label: '75%',
  },
  {
    value: 50,
    label: '50%',
  },
];

class ResumeText extends React.PureComponent {
  render() {
    const { content, width, height } = this.props;
    return (
      <div
        style={{
          width,
          height,
          whiteSpace: 'pre-wrap',
          padding: 12,
          overflow: 'auto',
        }}
      >
        {content}
      </div>
    );
  }
}

class ResumeDoc extends React.PureComponent {
  render() {
    const { url, width, height } = this.props;
    return (
      <iframe
        title="resume"
        style={{ display: 'block', width, height }}
        allowFullScreen
        src={'https://view.officeapps.live.com/op/embed.aspx?src=' + url}
      />
    );
  }
}

class ResumePDF extends React.PureComponent {
  state = {
    numPages: null,
    scale: 0,
    anchorEl: null,
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleSelect = (e, scale) => {
    this.setState({ scale, anchorEl: null });
  };

  onDocumentLoad = (pdf) => {
    // console.log(pdf);
    this.setState({ numPages: pdf.numPages });
  };

  render() {
    const { url, width, height } = this.props;
    const { numPages, anchorEl, scale } = this.state;
    const currentScale = scale || Math.floor((width - 25) / 6.12);
    return (
      <React.Fragment>
        <Scrollbars style={{ width, height: height - 33 }}>
          <div className="pdf__document">
            <Document
              file={url}
              // file='https://apn-cv-staging.oss-cn-shenzhen.aliyuncs.com/d38b5595-9c6f-45f5-8570-c82391180f24'
              onLoadSuccess={this.onDocumentLoad}
              onLoadError={this.onLoadError}
              loading={
                <div style={{ height: height - 34, display: 'flex' }}>
                  <Loading />
                </div>
              }
              options={{
                cMapUrl: `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/cmaps/`,
                cMapPacked: true,
              }}
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  // width={width - 24.5}
                  scale={currentScale / 100}
                />
              ))}
            </Document>
          </div>
        </Scrollbars>

        <div
          className="flex-container align-center"
          style={{
            position: 'absolute',
            bottom: 0,
            width,
            backgroundColor: 'white',
            borderTop: '1px solid #cacaca',
            zIndex: 1,
          }}
        >
          <Button
            aria-owns={anchorEl ? 'simple-menu' : null}
            aria-haspopup="true"
            onClick={this.handleClick}
            size="small"
          >
            {currentScale}%
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleClose}
          >
            {scaleOptions.map((scale, index) => (
              <MenuItem
                key={index}
                onClick={(e) => this.handleSelect(e, scale.value)}
              >
                {scale.label}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </React.Fragment>
    );
  }
}

const docRegex = /\.(doc|docx|undefined)$/;
const pdfRegex = /\.pdf$/;
const imgRegex = /\.(jpg|jpeg|png|webp|gif|bmp)$/;

class ResumeFrame extends React.PureComponent {
  render() {
    const { resume } = this.props;
    if (resume) {
      const matchDoc = (resume.get('name') || '').toLowerCase().match(docRegex);
      const matchPdf = (resume.get('name') || '').toLowerCase().match(pdfRegex);
      const matchImg = (resume.get('name') || '').toLowerCase().match(imgRegex);
      return (
        <AutoSizer>
          {({ width, height }) => {
            if (matchDoc) {
              return (
                <ResumeDoc
                  width={width}
                  height={height}
                  url={externalUrl(resume.get('s3Link'), true)}
                />
              );
            }
            if (matchPdf) {
              return (
                <ResumePDF
                  url={externalUrl(resume.get('s3Link'), true)}
                  width={width}
                  height={height}
                />
              );
            }
            if (matchImg) {
              return (
                <div style={{ width, height, overflow: 'auto' }}>
                  <img
                    src={externalUrl(resume.get('s3Link'), true)}
                    style={{ width }}
                  />
                </div>
              );
            }
            return (
              <ResumeText
                content={
                  resume.get('text') ||
                  JSON.stringify(
                    getTalentFromParserOutput(resume.get('parserOutput')),
                    null,
                    2
                  )
                }
                width={width}
                height={height}
              />
            );
          }}
        </AutoSizer>
      );
    }
    return 'No Resume';
  }
}

ResumeFrame.propTypes = {
  resume: PropTypes.instanceOf(Immutable.Map).isRequired,
};

export default ResumeFrame;
