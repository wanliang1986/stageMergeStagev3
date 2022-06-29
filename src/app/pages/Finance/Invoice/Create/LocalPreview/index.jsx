import React, { Component } from 'react';

import LocalPreviewInvoiceTemplate from './LocalPreviewInvoiceTemplate';
import LocalPreviewInvoiceTemplateForCanada from './LocalPreviewInvoiceTemplateForCanada';

class LocalPreview extends Component {
  render() {
    const { invoice } = this.props;
    console.log(invoice);

    return (
      <div>
        <div style={{ padding: '20px 20px 6px 20px' }}>Preview Invoice</div>
        {invoice.subInvoiceList ? (
          invoice.subInvoiceList.map((ele, index) => {
            if (invoice.currency === 'CAD') {
              return (
                <LocalPreviewInvoiceTemplateForCanada
                  key={index}
                  invoice={invoice}
                  subInvoice={ele.dueAmount}
                  childInvoiceNumber={2}
                  index={index + 1}
                />
              );
            }
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
        ) : invoice.currency === 'CAD' ? (
          <LocalPreviewInvoiceTemplateForCanada invoice={invoice} />
        ) : (
          <LocalPreviewInvoiceTemplate invoice={invoice} />
        )}
      </div>
    );
  }
}

export default LocalPreview;
