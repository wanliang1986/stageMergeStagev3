import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import MyDialog from '../../../components/Dialog/myDialog';
import CandidateNoteTemplate from '../../../components/Dialog/DialogTemplates/CandidateNoteTemplate';
import AddCandidateNoteTemplate from '../../../components/Dialog/DialogTemplates/AddCandidateNoteTemplate';
const styles = {};

class CandidateNoteCell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editor: false,
      NotesDialogShow: false,
      selectData: null,
      addNotesDialogShow: false,
    };
  }
  closed = () => {
    this.setState({
      addNotesDialogShow: false,
    });
  };
  render() {
    const { classes, data, ...props } = this.props;
    const { editor, NotesDialogShow, addNotesDialogShow, selectData } =
      this.state;
    return (
      <React.Fragment>
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
                {data.candidateNote}
              </Grid>
              {editor === true ? (
                <>
                  <Grid item xs={2}>
                    <RemoveRedEyeIcon
                      style={{ verticalAlign: 'middle' }}
                      onClick={() => {
                        this.setState({
                          NotesDialogShow: true,
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
                          addNotesDialogShow: true,
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
          show={NotesDialogShow}
          modalTitle={`Candidate Notes`}
          disableBackdropClick={false}
          handleClose={() => {
            this.setState({
              NotesDialogShow: false,
            });
          }}
        >
          <CandidateNoteTemplate
            talentId={selectData ? selectData.talentId : null}
          />
        </MyDialog>
        <MyDialog
          show={addNotesDialogShow}
          modalTitle={`Create Candidate Notes`}
          disableBackdropClick={false}
          handleClose={() => {
            this.closed();
          }}
        >
          <AddCandidateNoteTemplate
            talentId={selectData ? selectData.talentId : null}
            closed={() => {
              this.closed();
            }}
            fetchData={() => {
              this.props.props.fetchData();
            }}
          />
        </MyDialog>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(CandidateNoteCell);
