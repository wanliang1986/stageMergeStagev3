import React from 'react';
import { connect } from 'react-redux';

import Typography from '@material-ui/core/Typography';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Divider from '@material-ui/core/Divider';

import TalentPool from './TalentPool';
import CommonSearch from './CommonSearch';

class CandidateRecommendation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      source: 'talentPool', //commonSearch
    };
    this.metaContainer = React.createRef();
  }
  componentDidMount() {
    this.setState({
      metaContainer: this.metaContainer.current,
    });
  }

  render() {
    const { source, metaContainer } = this.state;
    // const { jobId } = this.props;
    return (
      <div className="flex-child-auto flex-container flex-dir-column">
        <div>
          <div
            className="flex-container align-middle item-padding"
            style={{ minHeight: 56 }}
          >
            <Typography style={{ marginRight: 20 }}>{'Source'}:</Typography>
            <RadioGroup
              row
              value={source}
              onChange={(e) => this.setState({ source: e.target.value })}
            >
              <FormControlLabel
                value="talentPool"
                control={<Radio color="primary" />}
                label={'Talent Pool'}
              />
              <FormControlLabel
                value="commonSearch"
                control={<Radio color="primary" />}
                label={'Common Search'}
              />
            </RadioGroup>
            <div className="flex-child-auto" />
            <div ref={this.metaContainer} />
          </div>
          <Divider />
        </div>
        <div className="flex-child-auto" style={{ overflow: 'hidden' }}>
          {source === 'talentPool' && (
            <TalentPool {...this.props} metaContainer={metaContainer} />
          )}
          {source === 'commonSearch' && (
            <CommonSearch {...this.props} metaContainer={metaContainer} />
          )}
        </div>
      </div>
    );
  }
}

export default connect()(CandidateRecommendation);
