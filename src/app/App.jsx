import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import store, { history } from './store';
import ThemeProvider from './components/theme/ThemeProvider';
import { ConnectedRouter } from 'connected-react-router';
import ReactTooltip from 'react-tooltip';
import gtag from './gtag';
import { checkLogin, reload } from './actions';

import Root from './pages/Root';
import Loading from './components/particial/Loading';
import i18n from './i18n';

store.dispatch(checkLogin());
store.dispatch(reload());

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
  },
};

class App extends React.Component {
  componentDidMount() {
    console.timeEnd('app mounted');
    if (window.performance) {
      // Gets the number of milliseconds since page load
      // (and rounds the result since the value must be an integer).
      const timeSincePageLoad = window.Math.round(window.performance.now());

      // Sends the timing event to Google Analytics.
      gtag('event', 'timing_complete', {
        name: 'load',
        value: timeSincePageLoad,
        event_category: 'JS Dependencies',
      });
    }

    window.addEventListener('message', (event) => {
      if (event.data['i18nextLng']) {
        i18n.changeLanguage(event.data['i18nextLng']);
      } else if (event.data['checkLogin']) {
        store.dispatch(checkLogin());
      }
    });
    window.addEventListener('storage', handleStorageEvent, false);
  }

  componentWillUnmount() {
    window.removeEventListener('storage', handleStorageEvent);
  }

  render() {
    console.time('app mounted');
    return (
      <Provider store={store}>
        <ThemeProvider>
          <ConnectedRouter history={history}>
            <Suspense
              fallback={
                <div style={styles.container}>
                  <Loading />
                </div>
              }
            >
              <Root />
            </Suspense>
          </ConnectedRouter>
          <ReactTooltip className="global-tooltip" />
        </ThemeProvider>
      </Provider>
    );
  }
}

export default App;

const handleStorageEvent = (e) => {
  if (e.key === 'token') {
    let token = localStorage.getItem('token');
    if (!token) {
      // console.log('logout', localStorage.getItem('token'));
      store.dispatch({ type: 'logout' });
    }
  }
};
