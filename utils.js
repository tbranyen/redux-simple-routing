import RouteTypes from './route-types';

const { assign, keys } = Object;
const routeMap = {};

export const addInternalRoutes = routes => assign(routeMap, routes);

export const getActiveRoute = () => {
  const { pathname, search } = location;
  const activeRoute = { routeName: 'notFound' };

  keys(routeMap).some(routeName => {
    const route = routeMap[routeName];
    const params = route.match(`${pathname}${search}`);

    if (params) {
      assign(activeRoute, { params, routeName, route });
      return true;
    }
  });

  return activeRoute;
};

export const setActiveRoute = (state, newRoute, replace = false) => {
  const { pathname, search } = location;
  const activeRoute = assign({}, state);

  if (newRoute.routeName) {
    activeRoute.routeName = newRoute.routeName;
  }

  if (newRoute.params) {
    const { params } = newRoute;

    activeRoute.params = params;

    // Coerce all params to String as that is what would come back from
    // URL parsing.
    keys(params).forEach(key => {
      const value = params[key];

      if (value !== null && value !== undefined) {
        params[key] = String(params[key])
      }
      else {
        delete params[key];
      }
    });
  }

  const route = routeMap[activeRoute.routeName] || routeMap.notFound;
  const url = route.reverse(activeRoute.params);
  const stateMethod = replace ? 'replaceState' : 'pushState';

  if (url && `${pathname}${search}` !== url) {
    history[stateMethod](null, null, url);
  }
  else if (!url) {
    throw new Error('Invalid push');
  }

  return activeRoute;
};

export const monitorActiveRoute = store => {
  // Initial route.
  store.dispatch({ type: RouteTypes.POP_STATE });

  // Monitor for changes.
  window.onpopstate = () => store.dispatch({ type: RouteTypes.POP_STATE });
};
