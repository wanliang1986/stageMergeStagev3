import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import DetailHeader from './DetailHeader';
import DetailStepper from './DetailStepper';

class InvoiceDetail extends Component {
  componentDidMount() {
    console.log('InvoiceDetail componentDidMount');
    this.scrollToAnchor();
  }

  scrollToAnchor = () => {
    let anchorName = this.props.location.hash;
    if (anchorName) {
      anchorName = anchorName.replace('#', '');
      let anchorElement = document.getElementById(anchorName);
      if (anchorElement && 'scrollIntoView' in anchorElement) {
        anchorElement.scrollIntoView();
      }
    }
  };

  render() {
    const { invoiceDetailList, t, onUpdate } = this.props;

    return (
      <div>
        {invoiceDetailList.map((ele) => {
          return (
            <Paper
              key={ele.get('subInvoiceNo')}
              style={{
                width: '750px',
                overflowX: 'hidden',
                marginBottom: '30px',
              }}
              id={ele.get('subInvoiceNo')}
            >
              <DetailHeader invoice={ele} t={t} />
              <DetailStepper invoice={ele} t={t} onUpdate={onUpdate} />
            </Paper>
          );
        })}
      </div>
    );
  }
}

export default InvoiceDetail;
