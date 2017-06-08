import RouteTypes from './route-types';

const { assign, keys } = Object;
const routeMap = {};

export const addInternalRoutes = routes => assign(routeMap, routes);

export const getActiveRoute = () => {
  const { pathname } = location;
  const activeRoute = { routeName: 'notFound' };

  keys(routeMap).some(routeName => {
    const route = routeMap[routeName];
    const params = route.match(pathname);

    if (params) {
      assign(activeRoute, { params, routeName, route });
      return true;
    }
  });

  return activeRoute;
};

export const setActiveRoute = (state, newRoute) => {
  const { search } = location;
  const activeRoute = assign({}, state);

  if (newRoute.routeName) {
    activeRoute.routeName = newRoute.routeName;
  }

  if (newRoute.params) {
    activeRoute.params = newRoute.params;
  }

  const route = routeMap[activeRoute.routeName] || routeMap.notFound;
  const url = route.reverse(activeRoute.params);

  history.pushState(null, null, `${url}${search}`);

  return activeRoute;
};

export const monitorActiveRoute = store => {
  // Initial route.
  store.dispatch({ type: RouteTypes.POP_STATE });

  // Monitor for changes.
  window.onpopstate = () => store.dispatch({ type: RouteTypes.POP_STATE });
};
