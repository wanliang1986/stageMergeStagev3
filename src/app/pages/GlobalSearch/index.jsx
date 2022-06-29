import React from 'react';
import { Route } from 'react-router';
import { connect } from 'react-redux';

import CommonSearch from './Search';


const Search = ({ match, reloadKey }) => (
    <React.Fragment key={reloadKey}>
        <Route exact path={match.url} component={CommonSearch} />
    </React.Fragment>
);
export default connect((state) => ({ reloadKey: state.controller.reload }))(Search);
