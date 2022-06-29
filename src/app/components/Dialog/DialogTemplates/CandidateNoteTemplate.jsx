import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTalent } from '../../../actions/talentActions';
import Loading from '../../../components/particial/Loading';
import CandidateNotesOptions from './CandidateNotesOptions';
import talentNoteSelector from '../../../selectors/talentNoteSelector';
const styles = {
  dialogBox: {
    width: '640px',
    maxHeight: '500px',
    minHeight: '250px',
    padding: '20px 0px',
    overflowY: 'scroll',
  },
  dialogBox1: {
    width: '640px',
    height: '100px',
  },
};

class CandidateNoteTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      talent: null,
    };
  }
  componentDidMount() {
    const { talentId } = this.props;
    this.props.dispatch(getTalent(talentId)).then((res) => {
      console.log(res);
      this.setState({ talent: res });
    });
  }
  render() {
    const { classes, notes } = this.props;
    const { talent } = this.state;
    console.log(notes.toJS());
    if (!talent) {
      return (
        <div className={classes.dialogBox1}>
          <Loading />
        </div>
      );
    }
    if (talent && !talent.notes) {
      return <div className={classes.dialogBox1}>Notes has not been added</div>;
    }
    return (
      <div className={classes.dialogBox}>
        {notes.map((item, index) => {
          return <CandidateNotesOptions key={index} data={item} />;
        })}
      </div>
    );
  }
}

const mapStoreStateToProps = (state, { talentId }) => {
  return {
    talents: state.model.talents,
    notes: talentNoteSelector(state, talentId),
  };
};

export default connect(mapStoreStateToProps)(
  withStyles(styles)(CandidateNoteTemplate)
);
