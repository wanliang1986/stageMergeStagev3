import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import MyDialog from '../../Dialog/myDialog';
import CurrentStatusNoteTemplate from '../../Dialog/DialogTemplates/CurrentStatusNoteTemplate';
import CreateCurrentStatusNoteTemplate from '../../Dialog/DialogTemplates/CreateCurrentStatusNoteTemplate';
const styles = {};

class CurrentStatusNoteCell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editor: false,
      dialogShow: false,
      createDialogShow: false,
      selectData: null,
    };
  }
  closed = () => {
    this.setState({
      createDialogShow: false,
    });
  };
  render() {
    const { classes, data } = this.props;
    const { editor, dialogShow, createDialogShow, selectData } = this.state;
    return (
      <>
        <div
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
              minHeight: '40px',
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
                {data.currentStatusNote}
              </Grid>
              {editor === true ? (
                <>
                  <Grid item xs={2}>
                    <RemoveRedEyeIcon
                      style={{ verticalAlign: 'middle' }}
                      onClick={() => {
                        this.setState({
                          dialogShow: true,
                          selectData: data,
                        });
                      }}
                      fontSize={'small'}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <AddCircleIcon
                      style={{ verticalAlign: 'middle' }}
                      onClick={() => {
                        this.setState({
                          createDialogShow: true,
                          selectData: data,
                        });
                      }}
                      fontSize={'small'}
                    />
                  </Grid>
                </>
              ) : null}
            </Grid>
          </div>
        </div>
        <MyDialog
          show={dialogShow}
          // modalTitle={`Current Status Note`}
          disableBackdropClick={false}
          handleClose={() => {
            this.setState({
              dialogShow: false,
            });
          }}
        >
          <CurrentStatusNoteTemplate
            applicationId={selectData ? selectData.applicationId : null}
            status={selectData ? selectData.status : null}
          />
        </MyDialog>
        <MyDialog
          show={createDialogShow}
          disableBackdropClick={false}
          handleClose={() => {
            this.closed();
          }}
        >
          <CreateCurrentStatusNoteTemplate
            applicationId={selectData ? selectData.applicationId : null}
            closed={() => {
              this.closed();
            }}
            fetchData={() => {
              this.props.props.fetchData();
            }}
            status={selectData ? selectData.status : null}
          />
        </MyDialog>
      </>
    );
  }
}

export default withStyles(styles)(CurrentStatusNoteCell);
