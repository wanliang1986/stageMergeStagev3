import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';

import PrimaryButton from '../../../components/particial/PrimaryButton';
import SecondaryButton from '../../../components/particial/SecondaryButton';
import StatsDetailBounce from './StatsDetailBounce';
import ReportsChart from './ReportsChart';

import { emailHistoryStatus } from '../../../constants/formOptions';

const styles = {
  dataList: {
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #e0e0e0',
    padding: '0px 20px',
  },
  percentAndNum: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    top: 16,
    left: 310,
    bottom: 16,
    justifyContent: 'space-between',
  },
  dl: {
    borderBottom: '1px solid #edeeef',
    '& dd': {
      paddingLeft: 30,
      listStyleType: 'none',
      borderTop: '1px solid #edeeef',
      marginBottom: 0,
      padding: 10,
      lineHeight: 1.2,
      position: 'relative',
      '& span': {
        position: 'absolute',
        right: 0,
        top: 10,
        color: '#505050',
      },
    },
    '& dt': {
      listStyleType: 'none',
      borderTop: '1px solid #edeeef',
      marginBottom: 0,
      padding: 10,
      lineHeight: 1.2,
      position: 'relative',
      color: '#505050',
      fontWeight: '500',
      '& span': {
        position: 'absolute',
        right: 0,
        top: 10,
      },
    },
  },
  ul: {
    borderBottom: '1px solid #edeeef',
    '& li': {
      padding: 10,
      lineHeight: 1.2,
      listStyleType: 'none',
      borderTop: '1px solid #edeeef',
      position: 'relative',
      color: '#505050',
      fontWeight: '500',
      '& span': {
        position: 'absolute',
        right: 0,
        top: 10,
        color: '#3398dc',
        cursor: 'pointer',
      },
    },
  },
  main: {
    display: 'flex',
    '& > *': {
      flex: '1 1 auto',
      margin: '0px 30px 30px 30px',
    },
  },
};

const options = {
  legend: {
    display: false,
  },
  maintainAspectRatio: false,
  cutoutPercentage: 85,
};

const labels = [
  'Delivery rate',
  'Open rate',
  'Click rate',
  'Bounce rate',
  'Unsubscribe rate',
];
const colors = ['#3398db', '#3398db', '#3398db', '#f56d50', '#f56d50'];
const bounces = [
  'BOUNCE',
  'SOFT_BOUNCE',
  'BLOCK_BOUNCE',
  'ADMIN_BOUNCE',
  'UNDETERMINED_BOUNCE',
  'HARD_BOUNCE',
];

class StatsDetailDialog extends Component {
  constructor(props) {
    super(props);
    const history = props.sent.toJS();
    let success = 0;
    let opens = 0;
    let clicks = 0;
    let bounces = 0;
    let unsubscribe = 0;
    let sum = 0;
    const allBounces = {};

    history.stats.forEach((ele, i) => {
      if (emailHistoryStatus.opens.indexOf(ele.status) !== -1) {
        opens += ele.count;
      }
      if (emailHistoryStatus.clicks.indexOf(ele.status) !== -1) {
        clicks += ele.count;
      }
      if (emailHistoryStatus.bounces.indexOf(ele.status) !== -1) {
        bounces += ele.count;
        allBounces[ele.status] = ele.count;
      }
      if (emailHistoryStatus.unsubscribe.indexOf(ele.status) !== -1) {
        unsubscribe += ele.count;
      }

      if (emailHistoryStatus.success.indexOf(ele.status) !== -1) {
        sum += ele.count;
        success += ele.count;
      }
      if (emailHistoryStatus.fail.indexOf(ele.status) !== -1) {
        sum += ele.count;
      }
    });
    const dataShow = [];
    dataShow.push(
      success,
      opens,
      clicks,
      bounces,
      unsubscribe,
      sum,
      allBounces
    );

    this.state = {
      blastId: history.id,
      dataShow,
      step: 1,
    };
  }

  // chartClickHandler = (e, elements) => {
  //   if (elements[0]) {
  //     const { _index } = elements[0];
  //     console.log('selected', elements, _index);
  //     getEmailDetailByIdByStatus(
  //       this.state.blastId,
  //       statusOptions[_index]
  //     ).then(res => {
  //       console.log('hahhah dara', res.response);
  //       this.setState({
  //         selectedTableData: Immutable.fromJS(res.response),
  //         step: 2,
  //         selectedTableCount: this.state.dataShow[statusOptions[_index]],
  //         selectedLabel: statusOptions[_index],
  //         selectedLabelIndex: _index
  //       });
  //     });
  //   }
  // };

  handleBack = () => this.setState({ step: 1 });

  render() {
    const { dataShow, step, status } = this.state;
    console.log('dataShow', dataShow);
    const { sent, t, classes, onClose } = this.props;

    return (
      <>
        <DialogTitle disableTypography id="draggable-dialog-title">
          <Typography variant="h6">
            {step === 1 ? (
              <> Subject: {sent.get('subject')}</>
            ) : (
              <>
                <p style={{ fontSize: '13px', color: '#939393' }}>
                  {sent.get('subject')}
                </p>
                <p
                  style={{
                    fontSize: '18px',
                    color: '#505050',
                    fontWeight: 500,
                  }}
                >
                  Recipients Details
                </p>
              </>
            )}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {step === 1 && (
            <>
              <header
                style={{
                  margin: 0,
                  position: 'relative',
                  display: 'flex',
                  padding: 0,
                  height: 190,
                }}
              >
                {Array(5)
                  .fill(1)
                  .map((ele, index) => (
                    <ReportsChart
                      key={index}
                      label={labels[index]}
                      dataShow={dataShow[index]}
                      sum={dataShow[5]}
                      color={colors[index]}
                      marginRight={20}
                      height={130}
                      fromDialog
                    />
                  ))}
              </header>

              <main className={classes.main}>
                <ul className={classes.ul}>
                  <li>
                    Sent{' '}
                    <span style={{ color: '#505050', cursor: 'auto' }}>
                      {dataShow[5]}
                    </span>
                  </li>
                  <li>
                    Delivered{' '}
                    <span
                      onClick={() =>
                        this.setState({ status: 'DELIVERED', step: 2 })
                      }
                    >
                      {dataShow[0]}
                    </span>
                  </li>
                  <li>
                    Opens{' '}
                    <span
                      onClick={() =>
                        this.setState({ status: 'OPENS', step: 2 })
                      }
                    >
                      {dataShow[1]}
                    </span>
                  </li>
                  <li>
                    Clicks{' '}
                    <span
                      onClick={() =>
                        this.setState({ status: 'CLICKS', step: 2 })
                      }
                    >
                      {dataShow[2]}
                    </span>
                  </li>
                  <li>
                    Unsubscribes{' '}
                    <span
                      onClick={() =>
                        this.setState({ status: 'UNSUBSCRIBES', step: 2 })
                      }
                    >
                      {dataShow[4]}
                    </span>
                  </li>
                </ul>

                <dl className={classes.dl}>
                  <dt>
                    Bounces{' '}
                    <span
                      onClick={() => {
                        if (dataShow[3]) {
                          this.setState({ status: 'SOFT_BOUNCE', step: 2 });
                        }
                      }}
                      style={
                        dataShow[3]
                          ? { cursor: 'pointer', color: '#3398dc' }
                          : {}
                      }
                    >
                      {dataShow[3]}
                    </span>
                  </dt>
                  <dd>
                    Soft Bounce <span>{dataShow[6].SOFT_BOUNCE || 0}</span>{' '}
                  </dd>
                  <dd>
                    Hard Bounce<span>{dataShow[6].HARD_BOUNCE || 0}</span>{' '}
                  </dd>
                  <dd>
                    Undetermined
                    <span>{dataShow[6].UNDETERMINED_BOUNCE || 0}</span>{' '}
                  </dd>
                  <dd>
                    Block<span>{dataShow[6].BLOCK_BOUNCE || 0}</span>{' '}
                  </dd>
                  <dd>
                    Admin Bounce<span>{dataShow[6].ADMIN_BOUNCE || 0}</span>{' '}
                  </dd>
                  <dd>
                    Bounce<span>{dataShow[6].BOUNCE || 0}</span>{' '}
                  </dd>
                </dl>
              </main>
            </>
          )}
          {step === 2 && (
            <StatsDetailBounce
              t={t}
              subject={sent.get('subject')}
              blastId={sent.get('id')}
              handleBack={this.handleBack}
              dataShow={dataShow}
              status={status}
            />
          )}
        </DialogContent>
        <DialogActions>
          {step === 1 ? (
            <PrimaryButton onClick={onClose}>{t('action:close')}</PrimaryButton>
          ) : (
            <>
              <SecondaryButton onClick={this.handleBack}>
                {t('action:back')}
              </SecondaryButton>
              <PrimaryButton onClick={onClose}>
                {t('action:close')}
              </PrimaryButton>
            </>
          )}
        </DialogActions>
      </>
    );
  }
}

export default withStyles(styles)(StatsDetailDialog);
