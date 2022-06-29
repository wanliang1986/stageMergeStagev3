import ReactTooltip from 'react-tooltip';
import routerStatus from './reducers/controller/routerStatus';

window.dataLayer = window.dataLayer || [];

function gtag() {
  window.dataLayer.push(arguments);
}

gtag('js', new Date());
gtag('config', 'UA-129111595-1', {
  // 'send_page_view': false,
  cookie_name: 'gaCookie',
  cookie_domain: window.location.hostname,
  cookie_expires: 2419200, // 28 days, in seconds
  custom_map: {
    dimension2: 'userInfo',
    metric5: 'queryInfo'
  }
});

export default gtag;

export const trackPageView = () => {
  console.log(window.location.pathname);
  gtag('config', 'UA-129111595-1', {
    page_title: window.location.pathname,
    page_path: window.location.pathname,
    page_location: window.location.href
  });
};

export const setUserId = user_id => {
  gtag('config', 'UA-129111595-1', {
    user_id: window.location.hostname + '-' + user_id
  });
};

export const setParams = (params = {}) => {
  gtag('set', params);
};

export const pageViewLogger = ({ dispatch, getState }) => next => action => {
  console.log('%c Action ', 'color: green', action);
  if (action.type === '@@router/LOCATION_CHANGE') {
    trackPageView();

    ReactTooltip.hide();

    const currentRouter = action.payload;
    if (currentRouter.isFirstRendering) {
      dispatch({
        type: 'SET_ROUTER',
        router: currentRouter
      });
    } else {
      const preRouter = getState().router;
      const preInitRouter = getState().controller.routerStatus;

      if (
        preRouter.location.key === preInitRouter.location.key &&
        action.payload.action === 'REPLACE'
      ) {
        // console.log('pageViewLogger', preRouter, preInitRouter, action.payload);
        dispatch({
          type: 'SET_ROUTER',
          router: currentRouter
        });
      }
    }
  }
  return next(action);
};

export const trackCommonSearch = (query = {}, user = {}) => {
  // console.log(query, user);
  gtag('event', 'search', {
    event_category: 'engagement',
    event_label: JSON.stringify(query),
    value: JSON.stringify(user),
    userInfo: JSON.stringify(user),
    queryInfo: JSON.stringify(query)
  });
};
