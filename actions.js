import types from './route-types';

export const push = (routeName, params) => {
  // Allow `routeName` aliased to `to` to be optional.
  if (typeof routeName === 'object') {
    params = routeName;
    routeName = null;
  }

  return { type: types.PUSH_STATE, routeName, params };
};

export const replace = (routeName, params) => {
  // Allow `routeName` aliased to `to` to be optional.
  if (typeof routeName === 'object') {
    params = routeName;
    routeName = null;
  }

  return { type: types.REPLACE_STATE, routeName, params };
};

export default { push, replace };
