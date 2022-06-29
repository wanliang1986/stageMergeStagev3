/**
 * Created by leonardli on 3/24/17.
 */
import './app/gtag';

import React from 'react';
import ReactDOM from 'react-dom';
import './app/styles/index.scss';
import App from './app/App';

//Initialize
import 'react-dates/initialize';
// const main = import(/* webpackPrefetch: true */ './app/styles/index.scss');
const third = import(
  /* webpackPrefetch: true */ './app/styles/less/index.less'
);
const utils = import(/* webpackPrefetch: true */ './utils');

ReactDOM.render(<App />, document.getElementById('react-app'));
