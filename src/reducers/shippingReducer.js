import { SHIPPING_UPLOAD_SUCCESS, SHIPPING_UPDATE_SUCCESS, SHIPPING_DATA_HAS_ERRORED, SHIPPING_DATA_IS_LOADING } from '../actions/types';

import _ from 'lodash';

const INITIAL_STATE = {
  items: [],
  isLoading: false,
  hasErrored: false,
  success: false
}

export function shippingReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SHIPPING_UPLOAD_SUCCESS:
    console.log("action.payload");
    
    console.log(action.payload);
      return { ...state, items: _.mapKeys(action.payload, 'shipping_number') }
    case SHIPPING_UPDATE_SUCCESS:
      return { ...state, success: action.payload }
    case SHIPPING_DATA_HAS_ERRORED:
      return { ...state, hasErrored: action.payload }
    case SHIPPING_DATA_IS_LOADING:
      return { ...state, isLoading: action.payload }

    default:
      return state
  }
}
