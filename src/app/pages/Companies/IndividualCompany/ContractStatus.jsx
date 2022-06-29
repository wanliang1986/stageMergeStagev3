import React from 'react';
import { contractStatus } from '../../../constants/formOptions';
import {
  createContract,
  getContractsByCompany,
} from '../../../actions/clientActions';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import moment from 'moment-timezone';

class ContractStatus extends React.Component {
  handleSelect = (status) => {
    console.log(status);
    const { dispatch, selectData, onClose, companyId, fetchData } = this.props;
    let startDate = moment(moment(selectData.get('startDate'))).toJSON();
    let endDate = moment(moment(selectData.get('endDate'))).toJSON();
    let newSignnes = [];
    selectData.get('signers').forEach((item, index) => {
      newSignnes.push({ id: item.get('id') });
    });
    let newSelectData = selectData
      .set('status', status)
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('signers', newSignnes);
    // .set('requiredFile', true);
    dispatch(createContract(newSelectData.toJS(), companyId)).then((res) => {
      this.props.fetchData();
    });
    // dispatch(updateJobStatus(id, status));
    // dispatch({ type: 'UPDATE_DB_DATA' });
    onClose();
  };

  render() {
    const { id } = this.props;
    return (
      <div>
        <MenuList dense>
          {contractStatus.map((status) => {
            return (
              <MenuItem
                dense
                key={status.value}
                onClick={() => this.handleSelect(status.value)}
              >
                {status.label}
              </MenuItem>
            );
          })}
        </MenuList>
      </div>
    );
  }
}

export default ContractStatus;
