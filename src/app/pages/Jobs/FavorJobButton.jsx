import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getJob,
  addFavoriteJob,
  deleteFavoriteJob,
  getFavoriteJobList,
} from '../../actions/jobActions';
import * as Colors from '../../styles/Colors/index';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import StarBorder from '@material-ui/icons/StarBorder';
import Star from '@material-ui/icons/Star';
import {
  saveCollect,
  deleteCollect,
  updateCollect,
} from '../../../apn-sdk/newSearch';

class FavorJobButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isFavorite: props.favoriteType,
    };
  }

  onFavorite = (e) => {
    let { favoriteType } = this.props;
    if (!favoriteType) {
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
    const { t, favoriteType } = this.props;
    // console.log(favoriteType);
    return (
      <Tooltip title={t('action:Favorite')} disableFocusListener arrow>
        <IconButton onClick={this.onFavorite} size="small">
          {favoriteType ? <Star htmlColor={Colors.YELLOW} /> : <StarBorder />}
        </IconButton>
      </Tooltip>
    );
  }
}

FavorJobButton.propTypes = {
  t: PropTypes.func.isRequired,
};

const mapStateToProps = (state, { jobId }) => {
  console.log(jobId);

  const favJobIds = state.controller.searchJobs.favor.ids;
  const favorite =
    state.model.jobs.toJS()[jobId] && state.model.jobs.toJS()[jobId].favorite;
  console.log(favorite);
  return {
    isFavorite: favJobIds && favJobIds.includes(jobId),
    isLoaded: Boolean(favJobIds),
    favoriteType: favorite,
  };
};

export default connect(mapStateToProps, {
  addFavoriteJob,
  deleteFavoriteJob,
  getFavoriteJobList,
  getJob,
})(FavorJobButton);
