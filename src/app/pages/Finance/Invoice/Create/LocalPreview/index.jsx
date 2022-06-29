import React, { Component } from 'react';

import LocalPreviewInvoiceTemplate from './LocalPreviewInvoiceTemplate';

class LocalPreview extends Component {
  render() {
    const { invoice } = this.props;
    console.log(invoice);

    return (
      <div>
        {invoice.subInvoiceList ? (
          invoice.subInvoiceList.map((ele, index) => {
            return (
              <LocalPreviewInvoiceTemplate
                key={index}
                invoice={invoice}
                subInvoice={ele.dueAmount}
                childInvoiceNumber={2}
                index={index + 1}
              />
            );
          })
        ) : (
          <LocalPreviewInvoiceTemplate invoice={invoice} />
        )}
      </div>
    );
  }
}

export default LocalPreview;
