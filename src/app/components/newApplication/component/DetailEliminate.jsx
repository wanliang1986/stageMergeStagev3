import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit';
import moment from 'moment-timezone';
import {
  userTypeForCommission as userTypeOptions,
  currency as currencyOptions,
  payRateUnitTypes,
} from '../../../constants/formOptions';

const styles = {
  root: {
    width: '100%',
    '& .MuiAccordionSummary-root.Mui-expanded': {
      backgroundColor: 'rgba(0,0,0,0.1)',
    },
    '& .MuiAccordionSummary-content.Mui-expanded': {
      margin: '0',
    },
    '& .columns': {
      padding: '0',
    },
  },
  flexBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  projectName: {
    height: 32,
  },
  projectNum: {
    backgroundColor: 'rgba(24,144,255,0.05)',
    color: '#1890ff',
    border: '1px solid #1890ff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 32,
    width: 32,
  },
  processBtn: {
    minWidth: 280,
  },
  eliminateBtn: {
    minWidth: 140,
    color: '#ef4529',
    border: '1px solid #ef4529 !important',
  },
  processTime: {
    color: 'rgba(0,0,0,0.3)',
    cursor: 'pointer',
  },
  fontDetail: {
    color: 'rgba(0,0,0,0.3)',
  },
  fontTitle: {
    color: 'rgba(0,0,0,0.5)',
  },
};

class EliminateDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitToJobFlag: true,
    };
  }

  changeActiveStep = (num) => {
    this.setState({
      activeStep: num,
    });
  };

  changeOpen = () => {
    this.setState({
      submitToJobFlag: !this.state.submitToJobFlag,
    });
  };

  handleOpen = (e) => {
    e.stopPropagation();
    this.props.handleOpenEditDialog();
  };

  render() {
    const { submitToJobFlag } = this.state;
    const { classes, t, application, job, candidate } = this.props;
    const IPGKpiUser = application.getIn(['submitToClient', 'ipgKpiUsers'])
      ? application.getIn(['submitToClient', 'ipgKpiUsers']).toJS()
      : [];
    const AgreedPayRate = application.getIn(['submitToClient', 'agreedPayRate'])
      ? application.getIn(['submitToClient', 'agreedPayRate']).toJS()
      : null;
    return (
      <div className={classes.root}>
        {application.get('eliminate').size !== 0 ? (
          <Accordion onChange={this.changeOpen}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <div className={classes.flexBtn}>
                <Typography>淘汰</Typography>
                {submitToJobFlag ? (
                  <Typography>
                    {moment(application.get('lastModifiedDate')).format(
                      'YYYY-MM-DD HH:mm:ss'
                    )}
                  </Typography>
                ) : null}
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ width: '100%' }}>
                <div className={classes.flexBtn}>
                  <Typography className={classes.fontDetail}>
                    {'张三 (操作者)'}
                  </Typography>
                  <Typography className={classes.fontDetail}>
                    {moment(application.get('lastModifiedDate')).format(
                      'YYYY-MM-DD HH:mm:ss'
                    )}
                  </Typography>
                </div>
                <div className="row expanded small-12">
                  <div className="small-3 columns">
                    <Typography className={classes.fontTitle}>
                      {'原因'}
                    </Typography>
                  </div>
                  <div className="small-9 columns">
                    <Typography>
                      {application.getIn(['eliminate', 'note'])}
                    </Typography>
                  </div>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state, { application }) => {
  return {
    job: state.model.jobs.get(String(application.get('jobId'))),
    candidate: state.model.talents.get(String(application.get('talentId'))),
  };
};

export default connect(mapStateToProps)(withStyles(styles)(EliminateDetail));
