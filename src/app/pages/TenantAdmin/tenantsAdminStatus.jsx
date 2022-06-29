import React from 'react';
import { tenantAdmin } from '../../constants/formOptions';
import { putTenantAdmin } from '../../actions/tenantAdmin';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import moment from 'moment-timezone';
import lodash from 'lodash';

class TenantsAdminStatus extends React.Component {
  //   handleSelect = (status) => {
  //     const { dispatch, selectData, onClose, tenantId } = this.props;
  //     let newSelectData = selectData
  //       .set('status', status)
  //       .set('')
  //     dispatch(putTenantAdmin(newSelectData.toJS()));
  //     // dispatch(updateJobStatus(id, status));
  //     // dispatch({ type: 'UPDATE_DB_DATA' });
  //     onClose();
  //   };
  handleSelect = (status) => {
    const { dispatch, selectedTenant, onClose, fetchData } = this.props;
    let data = lodash.cloneDeep(selectedTenant);
    data.status = status;
    if (data.address) {
      data.cityId = data.address.cityId;
      data.address = data.address.address;
    }
    dispatch(putTenantAdmin(data)).then((res) => {
      if (res) {
        fetchData();
      }
    });
    onClose();
  };

  render() {
    return (
      <div>
        <MenuList dense>
          {tenantAdmin.map((status) => {
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

export default TenantsAdminStatus;
