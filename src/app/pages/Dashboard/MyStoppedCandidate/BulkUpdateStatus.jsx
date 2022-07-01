import React from 'react';
import Immutable from 'immutable';
import { asyncPool } from '../../../../utils/asyncPool';
import { updateApplication } from '../../../../apn-sdk';
import { getRanges, sleep } from '../../../../utils';

import { DateRangePicker } from 'rsuite';

import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Fade from '@material-ui/core/Fade';

import MoreVert from '@material-ui/icons/MoreVert';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Refresh from '@material-ui/icons/Refresh';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import CustomToggleButton from '../../../components/particial/CustomToggleButton';
import zhCN from 'rsuite/lib/IntlProvider/locales/zh_CN';
import enUS from 'rsuite/lib/IntlProvider/locales/en_US';

const options = [
  // { value: '', label: 'All' },
  { value: 'Applied', label: 'Submitted to AM' },
  { value: 'Qualified', label: 'Qualified by AM' },
  { value: 'Submitted', label: 'Submitted to Client' },
  { value: 'Interview', label: 'Interview' },
];

const toOptions = {
  Applied: [
    { value: 'Called_Candidate', label: 'Called Candidate' }, //1
    { value: 'Meet_Candidate_In_Person', label: 'Meet Candidate In Person' }, //2
    { value: 'Internal_Rejected', label: 'Rejected by AM' }, //3
    { value: 'Qualified', label: 'Qualified by AM' }, //4
    { value: 'Submitted', label: 'Submitted to Client' }, //5
    { value: 'Candidate_Quit', label: 'Candidate Rejected Job' }, //14
  ],
  Qualified: [
    { value: 'Submitted', label: 'Submitted to Client' }, //5
    { value: 'Candidate_Quit', label: 'Candidate Rejected Job' }, //14
  ],
  Submitted: [
    { value: 'Shortlisted_By_Client', label: 'Shortlisted by Client' }, //7
    { value: 'Client_Rejected', label: 'Rejected by Client' }, //6
    { value: 'Candidate_Quit', label: 'Candidate Rejected Job' }, //14
  ],
  Interview: [
    { value: 'Client_Rejected', label: 'Rejected by Client' }, //6
    { value: 'Candidate_Quit', label: 'Candidate Rejected Job' }, //14
  ],
};

class BulkUpdateStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      openToStatus: false,
    };
    this.anchorRef = React.createRef();
    this.anchorRef2 = React.createRef();
  }

  handleSelectAll = () => {
    const { selected, data, handleSelect } = this.props;
    const allIds = data.map((v) => v.get('id'));
    if (selected.size > 0) {
      handleSelect(Immutable.Set());
    } else {
      handleSelect(selected.union(allIds));
    }
  };

  handleSelect = (status) => {
    this.setState({ open: false });
    const { data, handleSelect } = this.props;
    handleSelect(
      data
        .filter((d) => d.get('status') === status.value)
        .map((v) => v.get('id'))
        .toSet()
    );
  };

  bulkUpdateStatus = (toStatus) => {
    this.setState({ openToStatus: false });
    console.log(toStatus);
    const { selected, fetchData } = this.props;
    asyncPool(1, selected.toArray(), async (applicationId) => {
      console.log(applicationId);
      const activity = {
        status: toStatus.value,
        memo: 'Bulk Update',
      };
      await sleep(1000);
      return await updateApplication(activity, applicationId).catch(
        console.error
      );
    }).then(fetchData);
  };

  render() {
    const {
      t,
      fetchData,
      data,
      loading,
      selected,
      range,
      i18n,
      onRangeChange,
    } = this.props;
    const isZH = i18n.language.match('zh');

    const { open, openToStatus } = this.state;
    // console.log(data && data.toJS());
    const first = data.find((d) => d.get('id') === selected.first());
    const selectedGroup = selected.groupBy((s) =>
      data.find((d) => d.get('id') === s).get('status')
    );

    return (
      <div
        style={{
          marginBottom: 8,
          color: '#505050',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div ref={this.anchorRef}>
          <Checkbox
            size="small"
            color="primary"
            style={{
              paddingRight: 2,
              paddingLeft: 2,
              marginLeft: 7,
              minWidth: 0,
            }}
            checked={data.size === selected.size && data.size !== 0}
            indeterminate={data.size !== selected.size && selected.size !== 0}
            onChange={this.handleSelectAll}
          />

          <Button
            color="primary"
            variant="text"
            style={{ minWidth: 0, padding: 0, marginRight: 12 }}
            size="small"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            onClick={() => this.setState({ open: !open })}
          >
            <ArrowDropDownIcon />
          </Button>
        </div>

        <Popper
          open={open}
          anchorEl={this.anchorRef.current}
          role={undefined}
          transition
          placement="bottom-start"
          style={{ zIndex: 1200 }}
        >
          {({ TransitionProps, placement }) => (
            <Fade
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper style={{ zIndex: 1200 }}>
                <ClickAwayListener
                  onClickAway={() => this.setState({ open: false })}
                >
                  <MenuList id="split-button-menu" dense>
                    {options.map((option, index) => (
                      <MenuItem
                        key={option.label}
                        onClick={() => this.handleSelect(option)}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Fade>
          )}
        </Popper>

        <div style={{ marginRight: 12 }}>
          <FormReactSelectContainer>
            <DateRangePicker
              value={range}
              ranges={getRanges(t)}
              toggleComponentClass={CustomToggleButton}
              size="md"
              style={{ height: 32, width: 240 }}
              block
              onChange={onRangeChange}
              placeholder={t('message:selectDateRange')}
              locale={isZH ? zhCN.DateRangePicker : enUS.DateRangePicker}
            />
          </FormReactSelectContainer>
        </div>

        <IconButton
          onClick={() => fetchData()}
          disabled={loading}
          size="small"
          style={{ marginRight: 4 }}
        >
          <Refresh />
        </IconButton>
        <IconButton
          size="small"
          style={{ marginRight: 4 }}
          ref={this.anchorRef2}
          disabled={selected.size === 0 || selectedGroup.size > 1}
          onClick={() => this.setState({ openToStatus: true })}
        >
          <MoreVert />
        </IconButton>

        <Popper
          open={openToStatus}
          anchorEl={this.anchorRef2.current}
          role={undefined}
          transition
          placement="bottom-start"
          style={{ zIndex: 1200 }}
        >
          {({ TransitionProps, placement }) => (
            <Fade
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper style={{ zIndex: 1200 }}>
                <ClickAwayListener
                  onClickAway={() => this.setState({ openToStatus: false })}
                >
                  <MenuList id="split-button-menu" dense>
                    {toOptions[first.get('status')].map((option, index) => (
                      <MenuItem
                        key={option.label}
                        onClick={() => this.bulkUpdateStatus(option)}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Fade>
          )}
        </Popper>
        <div
          className="flex-child-auto"
          style={{ overflow: 'hidden', flexBasis: '0' }}
        >
          {selected.size > 0 ? (
            <Typography variant="subtitle1" color="primary" noWrap>
              Selected:
              {selectedGroup.keySeq().map((status, index) => {
                return (
                  <span>
                    {' '}
                    {selectedGroup.get(status).size} {status}
                    {index !== selectedGroup.size - 1 && ','}
                  </span>
                );
              })}
            </Typography>
          ) : (
            <Typography variant="subtitle1" noWrap>
              Total Count: {data.size}
            </Typography>
          )}
        </div>
      </div>
    );
  }
}

export default BulkUpdateStatus;
