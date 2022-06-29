import React from 'react';
import { jobStatus } from '../../../constants/formOptions';
import { updateJobStatus } from '../../../actions/jobActions';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

const jobStatusOptions = jobStatus.filter((status) => !status.disabled);
class JobStatus extends React.Component {
  handleSelect = (status) => {
    const { dispatch, jobId, onClose, fetchData } = this.props;
    console.log(jobId, status);
    dispatch(updateJobStatus(jobId, status));
    dispatch({ type: 'UPDATE_DB_DATA' });
    onClose();
    fetchData();
  };

  render() {
    return (
      <div>
        <MenuList dense>
          {jobStatusOptions.map((status) => {
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

export default JobStatus;
