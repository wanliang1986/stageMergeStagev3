import React from 'react';
import Loadable from 'react-loadable';
import Loading from '../Loading';

const LoadableContractFrame = Loadable({
  loader: () => import('./index'),
  loading: Loading,
});

export default LoadableContractFrame;
