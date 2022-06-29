import React from 'react';
import { connect } from 'react-redux';
import memoizeOne from 'memoize-one';
import { getApplicationStatusLabel } from '../../../constants/formOptions';
import { getApplicationByApplicationId } from '../../../actions/applicationActions';

import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import AddActivity from '../forms/AddActivity';

import CreateIcon from '@material-ui/icons/Create';

const blueStatus = [
  'Applied',
  'Called_Candidate',
  'Meet_Candidate_In_Person',
  'Qualified',
];
const greenStatus = ['Submitted', 'Shortlisted_By_Client'];
const orangeStatus = ['Offered', 'Offer_Accepted', 'Started'];
const redStatus = ['Started', 'START_EXTENSION', 'START_RATE_CHANGE'];
const yellowStatus = ['Interview'];
const greyStatus = [
  'Internal_Rejected',
  'Candidate_Quit',
  'Client_Rejected',
  'Offer_Rejected',
  'START_TERMINATED',
  'START_FAIL_WARRANTY',
  'FAIL_TO_ONBOARD',
];

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
    const { applicationLoaded } = this.state;
    const { dispatch, applicationId } = this.props;
    if (!applicationLoaded) {
      dispatch(getApplicationByApplicationId(applicationId)).then(() => {
        this.setState({
          applicationLoaded: true,
          menuOpen: false,
          formOpen: true,
          toStatus,
        });
      });
    } else {
      this.setState({ menuOpen: false, formOpen: true, toStatus });
    }
  };

  handleOpenMenu = () => {
    this.setState({
      menuOpen: true,
    });
  };

  handleCloseForm = () => {
    this.setState({ formOpen: false }, () => {
      if (this.props.fetchData) {
        this.props.fetchData();
      } else if (this.props.props && this.props.props.props.fetchData) {
        this.props.props.props.fetchData();
      }
    });
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
    const { application, status, ...props } = this.props;
    console.log(this.props);
    const step = getNextStepsByStatus(status);
    const styling = {
      display: 'inline-flex',
      height: '25px',
      lineHeight: '20px',
      borderRadius: '25px',
      fontSize: 12,
      color: 'white',
      padding: '1px 10px',
      cursor: 'pointer',
    };
    if (greenStatus.includes(status)) {
      styling.background = '#21b66e';
    }
    if (blueStatus.includes(status)) {
      styling.background = '#3398db';
    }

    if (yellowStatus.includes(status)) {
      styling.background = '#fdab29';
    }
    if (orangeStatus.includes(status)) {
      styling.background = '#f56d50';
    }

    if (greyStatus.includes(status)) {
      styling.background = '#818181';
    }
    if (redStatus.includes(status)) {
      styling.background = '#dd265f';
    }
    return (
      <div>
        <div
          style={styling}
          ref={this.anchorRef}
          onClick={this.handleToggleMenu}
        >
          <span style={{ verticalAlign: 'middle' }}>
            {this.props.t(
              `tab:${getApplicationStatusLabel(status).toLowerCase()}`
            )}
          </span>
          {step.menu.length > 0 ? (
            <CreateIcon
              size={'small'}
              style={{ width: '.8em', height: '.8em', marginLeft: '3px' }}
            />
          ) : // menuOpen ? (
          //   <ArrowDropUpIcon
          //     style={{ width: '.8em', height: '.8em', marginLeft: '3px' }}
          //   />
          // ) : (
          //   <ArrowDropDownIcon
          //     style={{ width: '.8em', height: '.8em', marginLeft: '3px' }}
          //   />
          // )
          null}
        </div>

        {/* 下拉框内容 */}
        <Popover
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

        {application && (
          <AddActivity
            open={formOpen}
            onClose={this.handleCloseForm}
            application={application}
            formType={toStatus}
            {...props}
          />
        )}
      </div>
    );
  }
}
const mapStateToProps = (state, { applicationId }) => {
  return {
    application: state.relationModel.applications.get(String(applicationId)),
  };
};

export default connect(mapStateToProps)(NextStepsButton);

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
          { value: 'updateCommissions', label: 'Update Commissions' },
          { value: 'Offer_Rejected', label: 'Offer Declined' },
        ],
      };
    case 'Offer_Rejected':
      return {
        menu: [
          {
            value: 'Offer_Accepted',
            label: 'Offer Accepted',
          },
          { value: 'addNote', label: 'Add Note To Current Status' },
          { value: 'updateCommissions', label: 'Update Commissions' },
        ],
      };
    default:
      return {
        menu: [],
      };
  }
});
