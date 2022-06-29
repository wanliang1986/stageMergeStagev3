import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { getInvoiceDetailList } from '../../../../actions/invoiceActions';
import { makeCancelable } from '../../../../../utils';
import { getInvoiceByInvoiceNumber } from '../../../../selectors/invoiceSelector';

import InvoiceDetailItem from './InvoiceDetailItem';
import Loading from '../../../../components/particial/Loading';
import NotFound from '../../../../components/NotFound';

class InvoiceDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    //fetch invoice by invoiceNo
    const { dispatch, invoiceNo } = this.props;
    this.task = makeCancelable(dispatch(getInvoiceDetailList(invoiceNo)));
    this.task.promise.then(() => {
      this.setState({ loading: false });
    });
  };

  render() {
    const { loading } = this.state;
    if (loading) {
      return <Loading />;
    }
    const { invoiceDetailList /*location*/, invoiceNo, ...props } = this.props;
    // console.log('[detailFromStore]',invoiceDetailListFromStore);
    console.log('stepper index', invoiceDetailList.toJS());
    if (invoiceDetailList.size === 0) {
      return <NotFound />;
    }
    const invoiceType = invoiceDetailList.getIn([0, 'invoiceType']);
    console.log(invoiceType);
    return (
      <InvoiceDetailItem
        invoiceDetailList={invoiceDetailList}
        {...props}
        onUpdate={this.fetchData}
      />
    );
  }
}

const mapStateToProps = (state, { match }) => {
  const invoiceNo = match.params.invoiceNo;

  return {
    invoiceNo,
    invoiceDetailList: getInvoiceByInvoiceNumber(state, invoiceNo),
  };
};

export default withTranslation(['action', 'field', 'message'])(
  connect(mapStateToProps)(InvoiceDetail)
);
