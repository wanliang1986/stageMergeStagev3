import Loadable from 'react-loadable';
import Loading from '../../particial/Loading';

//点击进来到模态框 ，单独loader里面
const LoadableAddActivityForm = Loadable({
  loader: () => import('./index'),
  loading: Loading,
});

export default LoadableAddActivityForm;
