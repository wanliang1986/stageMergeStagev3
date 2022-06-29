import React from 'react';
import Immutable from 'immutable';

import Paper from '@material-ui/core/Paper';

// import CandidateCreateForm from './CandidateCreateForm';
import CandidateCreateForm from './Basicform/index';
import CandidateLayout from '../../../components/particial/CandidateLayout';

class CandidateCreation extends React.PureComponent {
  render() {
    const { ...props } = this.props;
    const location = Immutable.fromJS(this.props.location);
    const candidate = location.getIn(['state', 'candidate']);
    return (
      <CandidateLayout>
        <Paper
          className="flex-container flex-dir-column"
          style={{ userSelect: 'text' }}
        >
          <CandidateCreateForm {...props} candidate={candidate} />
        </Paper>
      </CandidateLayout>
    );
  }
}

export default CandidateCreation;
