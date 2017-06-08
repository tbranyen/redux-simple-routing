import Route from 'route-parser';
import RouteTypes from './route-types';
import { addInternalRoutes, getActiveRoute, setActiveRoute } from './utils';

const { assign } = Object;

export default routes => {
  addInternalRoutes(routes);

  const initialState = {
    ...getActiveRoute(),
  };

  return function route(state = initialState, action) {
    switch (action.type) {
      case RouteTypes.POP_STATE: {
        return assign({}, state, getActiveRoute());
      }

      case RouteTypes.PUSH_STATE: {
        return assign({}, state, setActiveRoute(state, action));
      }

      default: {
        return state;
      }
    }
  }
};
