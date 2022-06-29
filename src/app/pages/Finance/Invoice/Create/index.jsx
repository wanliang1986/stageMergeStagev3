import React, { Component } from 'react';

import FTEInvoiceCreateForm from './FTEInvoiceCreateForm';
import StartupFeeInvoiceCreateForm from './StartupFeeInvoiceCreateForm';
import NotFound from '../../../../components/NotFound';

class InvoiceCreation extends Component {
  render() {
    const { match } = this.props;
    const type = match.params.type;
    if (type === 'startupfee') {
      return <StartupFeeInvoiceCreateForm {...this.props} />;
    } else if (type === 'fte') {
      return <FTEInvoiceCreateForm {...this.props} />;
    }
    return <NotFound />;
  }
}

export default InvoiceCreation;
