import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Immutable from 'immutable';
import { pdfjs, Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import AutoSizer from 'react-virtualized-auto-sizer';
import Scrollbars from 'react-custom-scrollbars';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

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

const positions = [
  { top: '5%', left: '5%' },

  { top: '25%', left: '5%' },

  { top: '45%', left: '5%' },

  { top: '65%', left: '5%' },

  { top: '85%', left: '5%' },
  { top: '5%', left: '55%' },
  { top: '25%', left: '55%' },

  { top: '45%', left: '55%' },

  { top: '65%', left: '55%' },

  { top: '85%', left: '55%' },
];

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
    const { url, width, height, name } = this.props;
    const { numPages, anchorEl, scale } = this.state;
    const currentScale = scale || Math.floor((width - 25) / 6.12);

    return (
      <React.Fragment>
        <Scrollbars style={{ width, height: height - 33 }}>
          <div className="pdf__document">
            <Document
              file={url}
              onContextMenu={(e) => e.preventDefault()}
              // file='https://apn-cv-staging.oss-cn-shenzhen.aliyuncs.com/d38b5595-9c6f-45f5-8570-c82391180f24'
              onLoadSuccess={this.onDocumentLoad}
              onLoadError={this.onLoadError}
              loading={
                <div style={{ height: height - 34, display: 'flex' }}>
                  <Loading />
                </div>
              }
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                  style={{ position: 'relative' }}
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  // width={width - 24.5}
                  renderTextLayer={false}
                  scale={currentScale / 100}
                >
                  {Array(
                    positions.map((ele, index) => {
                      return (
                        <p
                          key={index}
                          style={{
                            position: 'absolute',
                            top: `${ele.top}`,
                            left: `${ele.left}`,
                            transform: 'rotate(-35deg)',
                            fontSize: '50px',
                            color: 'rgba(0,0,0,0.12)',
                          }}
                        >
                          {name}
                        </p>
                      );
                    })
                  )}
                </Page>
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

class ResumeFrame extends React.PureComponent {
  render() {
    const { resume, currentUser } = this.props;
    console.log(resume.toJS());
    return (
      <AutoSizer>
        {({ width, height }) => {
          return (
            <ResumePDF
              // url={externalUrl(resume.get('s3Link'), true)}

              // url='https://s3-us-west-1.amazonaws.com/apn-cv-staging/d1e1215e-baf6-4a54-8e5a-9a878ccb083b'
              url={resume.get('s3url')}
              width={width}
              height={height}
              name={currentUser.get('fullName')}
            />
          );
        }}
      </AutoSizer>
    );
  }
}

ResumeFrame.propTypes = {
  resume: PropTypes.instanceOf(Immutable.Map).isRequired,
};

function mapStoreStateToProps(state) {
  return {
    currentUser: state.controller.currentUser,
  };
}

export default connect(mapStoreStateToProps)(ResumeFrame);
