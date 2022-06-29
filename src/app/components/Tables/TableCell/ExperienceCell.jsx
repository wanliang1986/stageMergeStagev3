import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Cell } from 'fixed-data-table-2';

import CreateIcon from '@material-ui/icons/Create';
import MyDialog from '../../Dialog/myDialog';
import ExperienceTemplate from '../../Dialog/DialogTemplates/ExperienceTemplate';
import Grid from '@material-ui/core/Grid';

import { editExperience } from '../../../actions/clientActions';
import { connect } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
const styles = {};

class ExperienceCell extends Component {
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
    let params = {
      applicationId: data.getIn([rowIndex, 'applicationId']),
      highlightExperience: newVal ? newVal : data.getIn([rowIndex, col]),
      companyId: companyId,
    };
    this.setState({ loading: true });
    this.props.dispatch(editExperience(params)).then((res) => {
      if (res.response === 200) {
        this.setState(
          {
            loading: false,
            dialogShow: false,
          },
          () => {
            fetchData();
          }
        );
      }
    });
  };
  getValue = (val) => {
    this.setState({
      newVal: val,
    });
  };
  render() {
    const { rowIndex, data, col, t, classes, ...props } = this.props;
    const { dialogShow, editor, loading } = this.state;
    const experienceText = data.getIn([rowIndex, col]);
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
                xs={10}
                style={{
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  wordBreak: ' break-all',
                }}
              >
                <Tooltip title={experienceText} arrow placement="left-start">
                  <div>{experienceText}</div>
                </Tooltip>
              </Grid>
              {editor === true ? (
                <Grid item xs={2}>
                  <CreateIcon
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
          modalTitle={`Edit Highlighted Experience`}
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
          <ExperienceTemplate
            experienceText={experienceText}
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

export default connect()(withStyles(styles)(ExperienceCell));
