import React from 'react';
import Immutable from 'immutable';
import { getCommissionsByUser } from '../../../../../apn-sdk/commission';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import Loading from './../../../../components/particial/Loading';
import CommissionTable from '../../../../components/Tables/CommissionTable3';

class CommissionsByRecruiter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  componentDidMount(): void {
    const { commission } = this.props;
    getCommissionsByUser(
      commission.get('userId'),
      commission.get('commissionIds')
    ).then(({ response }) => {
      console.log(response);
      this.setState({ data: Immutable.fromJS(response) });
    });
  }

  render() {
    const { data } = this.state;
    if (!data) {
      return <Loading />;
    }
    const { commission } = this.props;
    const totalCommission = Number(data.getIn(['metadata', 'totalCommission']));
    return (
      <div
        className="flex-child-auto flex-container flex-dir-column"
        style={{ overflow: 'hidden' }}
      >
        <div className="item-padding" style={{ marginTop: 8 }}>
          <Typography variant="subtitle2" gutterBottom>
            {commission.get('userName')}
            &nbsp;&nbsp;&nbsp;Total commission:{' '}
            {totalCommission ? totalCommission.toLocaleString() : ''}
          </Typography>
        </div>

        <Divider />
        <div
          className="flex-child-auto"
          style={{ height: 600, overflow: 'hidden' }}
        >
          <CommissionTable dataList={data.get('elements')} />
        </div>
      </div>
    );
  }
}

export default CommissionsByRecruiter;
