import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getJob } from '../../actions/jobActions';
import { updateCollect } from '../../../apn-sdk/newSearch';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import StarBorder from '@material-ui/icons/StarBorder';
import Star from '@material-ui/icons/Star';

import * as Colors from '../../styles/Colors';

class FavorJobButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isFavorite: props.favoriteType,
    };
  }

  onFavorite = (e) => {
    let { isFavorite } = this.props;
    if (!isFavorite) {
      updateCollect(this.props.jobId, 'POST')
        .then((res) => {
          console.log(123);
          console.log(this.props);
          this.props.getJob(this.props.jobId);
        })
        .catch((err) => {});
    } else {
      updateCollect(this.props.jobId, 'DELETE')
        .then(() => {
          this.props.getJob(this.props.jobId);
        })
        .catch((err) => {});
    }
  };

  render() {
    const { t, isFavorite } = this.props;
    // console.log(favoriteType);
    return (
      <Tooltip title={t('action:Favorite')} disableFocusListener arrow>
        <IconButton onClick={this.onFavorite} size="small">
          {isFavorite ? <Star htmlColor={Colors.YELLOW} /> : <StarBorder />}
        </IconButton>
      </Tooltip>
    );
  }
}

FavorJobButton.propTypes = {
  t: PropTypes.func.isRequired,
};

const mapStateToProps = (state, { jobId }) => {
  const favorite = state.model.jobs.getIn([String(jobId), 'favorite']);
  console.log(jobId, favorite);
  return {
    isFavorite: favorite,
  };
};

export default connect(mapStateToProps, {
  getJob,
})(FavorJobButton);
