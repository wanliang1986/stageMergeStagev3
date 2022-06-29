import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Cell } from 'fixed-data-table-2';

import AddCircleIcon from '@material-ui/icons/AddCircle';
import MyDialog from '../../Dialog/myDialog';
import AmUpdateTemplate from '../../Dialog/DialogTemplates/AmUpdateTemplate';
import Grid from '@material-ui/core/Grid';

import { editExperience } from '../../../actions/clientActions';
import { connect } from 'react-redux';
import { saveActivities } from '../../../actions/clientActions';
import {
  getApplication,
  updateApplication,
} from '../../../actions/applicationActions';
import { showErrorMessage } from '../../../actions';
import Tooltip from '@material-ui/core/Tooltip';

const styles = {};

class AmUpdatesCell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editor: false,
      dialogShow: false,
      newVal: null,
      loading: false,
    };
  }
  Sumbit = () => {
    const { rowIndex, data, col, t, classes, companyId, fetchData } =
      this.props;
    const { newVal } = this.state;
    if (!newVal) {
      this.props.dispatch(showErrorMessage('AM Updates cannot be empty '));
      return;
    } else {
      this.setState({ loading: true });
      let applicationId = data.getIn([rowIndex, 'applicationId']);
      this.props.dispatch(getApplication(applicationId)).then((res) => {
        let resumeId = res.resumeId;
        let status = res.status;
        let params = {
          memo: newVal,
          status: status,
          resumeId: resumeId,
        };
        this.props
          .dispatch(updateApplication(params, applicationId))
          .then((res) => {
            this.setState(
              {
                dialogShow: false,
                loading: false,
              },
              () => {
                fetchData();
              }
            );
          });
      });
    }
  };
  getValue = (val) => {
    this.setState({
      newVal: val,
    });
  };
  openDialog = () => {
    const { rowIndex, data, col, t, classes, companyId, fetchData } =
      this.props;
    let id = data.getIn([rowIndex, 'applicationId']);

    this.setState({ dialogShow: true });
  };
  render() {
    const { rowIndex, data, col, t, classes, ...props } = this.props;
    const { dialogShow, editor, loading } = this.state;
    const note = data.getIn([rowIndex, col]);
    return (
      <>
        <Cell
          {...props}
          onMouseEnter={() => {
            this.setState({ editor: true });
          }}
          onMouseLeave={() => {
            this.setState({ editor: false });
          }}
        >
          <div
            className="overflow_ellipsis_1"
            style={{
              width: props.width - 26,
              textTransform: 'none',
            }}
          >
            <Grid container spacing={1}>
              <Grid
                item
                xs={8}
                style={{
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  wordBreak: ' break-all',
                }}
              >
                <Tooltip title={note} arrow placement="left-start">
                  <div>{note}</div>
                </Tooltip>
              </Grid>
              {editor === true ? (
                <Grid item xs={4}>
                  <AddCircleIcon
                    onClick={() => {
                      this.setState({ dialogShow: true });
                    }}
                    fontSize={'small'}
                  />
                </Grid>
              ) : null}
            </Grid>
          </div>
        </Cell>
        <MyDialog
          show={dialogShow}
          modalTitle={`AM Updates`}
          btnShow={true}
          SubmitBtnShow={true}
          SubmitBtnMsg={'Sumbit'}
          SumbitBtnVariant={'contained'}
          CancelBtnShow={true}
          CancelBtnMsg={'Back'}
          CancelBtnVariant={''}
          creating={loading}
          primary={() => {
            this.Sumbit();
          }}
          handleClose={() => {
            this.setState({
              dialogShow: false,
            });
          }}
        >
          <AmUpdateTemplate
            note={note}
            {...props}
            getValue={(val) => {
              this.getValue(val);
            }}
          />
        </MyDialog>
      </>
    );
  }
}

export default connect()(withStyles(styles)(AmUpdatesCell));
