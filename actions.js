import types from './route-types';

export const push = (to, params) => {
  // Allow `routeName` aliased to `to` to be optional.
  if (typeof to === 'object') {
    params = to;
    to = null;
  }

  return { type: types.PUSH_STATE, routeName: to, params };
};

export const replace = (to, params) => {
  // Allow `routeName` aliased to `to` to be optional.
  if (typeof to === 'object') {
    params = to;
    to = null;
  }

  return { type: types.REPLACE_STATE, routeName: to, params };
};

export default { push, replace };
