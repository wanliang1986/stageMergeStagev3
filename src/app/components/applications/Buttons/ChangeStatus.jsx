import React from 'react';
import memoizeOne from 'memoize-one';
import { getApplicationStatusLabel } from '../../../constants/formOptions';

import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import AddActivity from '../forms/AddActivity';
import { withTranslation } from 'react-i18next';
class NextStepsButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      formOpen: false,
      toStatus: null,
    };
    this.anchorRef = React.createRef();
  }

  handleOpenForm = (toStatus) => {
    this.setState({
      menuOpen: false,
      formOpen: true,
      toStatus,
    });
  };

  handleOpenMenu = () => {
    this.setState({
      menuOpen: true,
    });
  };

  handleCloseForm = () => {
    this.setState({ formOpen: false });
  };

  handleCloseMenu = (event) => {
    this.setState({
      menuOpen: false,
    });
  };
  handleToggleMenu = () => {
    this.setState({
      menuOpen: !this.state.menuOpen,
    });
  };

  render() {
    const { menuOpen, formOpen, toStatus } = this.state;
    const { application, ...props } = this.props;
    const step = getNextStepsByStatus(application.get('status'));
    return (
      <div>
        <Button
          color={'primary'}
          ref={this.anchorRef}
          onClick={this.handleToggleMenu}
          endIcon={
            step.menu.length > 0 ? (
              menuOpen ? (
                <ArrowDropUpIcon />
              ) : (
                <ArrowDropDownIcon />
              )
            ) : null
          }
        >
          {this.props.t(
            `tab:${getApplicationStatusLabel(
              application.get('status')
            ).toLowerCase()}`
          )}
        </Button>

        {/* 下拉框内容 */}
        <Popover
          elevation={4}
          open={step.menu.length > 0 && menuOpen}
          anchorEl={this.anchorRef.current}
          onClose={this.handleCloseMenu}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuList dense>
            {step.menu.map((option) => (
              <MenuItem
                key={option.value}
                onClick={() => this.handleOpenForm(option.value)}
              >
                {this.props.t(`tab:${option.label.toLowerCase()}`)}
              </MenuItem>
            ))}
          </MenuList>
        </Popover>

        <AddActivity
          open={formOpen}
          onClose={this.handleCloseForm}
          application={application}
          formType={toStatus}
          activityFromJob
          {...props}
        />
      </div>
    );
  }
}

export default withTranslation('tab')(NextStepsButton);

const getNextStepsByStatus = memoizeOne((status) => {
  switch (status) {
    case 'Applied':
    case 'Called_Candidate':
    case 'Meet_Candidate_In_Person':
    // case 'Internal_Rejected':
    case 'Qualified':
      return {
        menu: [
          { value: 'Submitted', label: 'Submitted To Client' },
          { value: 'Called_Candidate', label: 'Called Candidate' },
          {
            value: 'Meet_Candidate_In_Person',
            label: 'Meet Candidate In Person',
          },
          { value: 'Qualified', label: 'Qualified by AM' },
          { value: 'updateResume', label: 'Update Resume' },
          { value: 'addNote', label: 'Add Note To Current Status' },
          { value: 'updateUserRoles', label: 'Update User Roles' },
          { value: 'Internal_Rejected', label: 'Rejected by AM' },
          { value: 'Candidate_Quit', label: 'Candidate Rejected Job' },
        ],
      };

    case 'Submitted':
    case 'Shortlisted_By_Client':
      return {
        menu: [
          { value: 'Interview', label: 'Interview' },
          { value: 'Shortlisted_By_Client', label: 'Shortlisted By Client' },
          { value: 'addNote', label: 'Add Note To Current Status' },
          { value: 'updateCommissions', label: 'Update Commissions' },
          { value: 'Client_Rejected', label: 'Rejected by Client' },
          { value: 'Candidate_Quit', label: 'Candidate Rejected Job' },
        ],
      };

    case 'Interview':
      return {
        menu: [
          { value: 'Offered', label: 'Offered By Client' },
          { value: 'Interview', label: 'Add Interview' },
          { value: 'addNote', label: 'Add Note To Current Status' },
          { value: 'updateCommissions', label: 'Update Commissions' },
          { value: 'Client_Rejected', label: 'Rejected by Client' },
          { value: 'Candidate_Quit', label: 'Candidate Rejected Job' },
        ],
      };
    case 'Offered':
      return {
        menu: [
          { value: 'Offer_Accepted', label: 'Offer Accepted' },
          { value: 'Offer_Rejected', label: 'Offer Declined' },
          { value: 'addNote', label: 'Add Note To Current Status' },
          { value: 'updateCommissions', label: 'Update Commissions' },
        ],
      };
    case 'Offer_Accepted':
      return {
        menu: [
          { value: 'Offer_Accepted', label: 'Update Offer' },
          { value: 'addNote', label: 'Add Note To Current Status' },
          { value: 'Offer_Rejected', label: 'Offer Declined' },
        ],
      };
    case 'Offer_Rejected':
    case 'FAIL_TO_ONBOARD':
      return {
        menu: [
          {
            value: 'Offer_Accepted',
            label: 'Offer Accepted',
          },
          { value: 'addNote', label: 'Add Note To Current Status' },
        ],
      };
    default:
      return {
        menu: [],
      };
  }
});
