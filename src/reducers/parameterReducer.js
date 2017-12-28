import { GET_PARAMETERS_SUCCESS, SET_PARAMETERS_SUCCESS, PARAMETERS_ERROR, PARAMETER_DATA_IS_LOADING } from '../actions/types'

const INITIAL_STATE = {
  error: null,
  parameters: null,
  setParameterResult: null,
  parameterIsLoading: false,

}

export function parameterReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_PARAMETERS_SUCCESS:
      console.log(action.payload);
      return { ...state, setParameterResult: null, parameters: action.payload }
    case SET_PARAMETERS_SUCCESS:
      return { ...state, parameters: null, setParameterResult: action.payload }
    case PARAMETERS_ERROR:
      return { ...state, error: action.payload }
    case PARAMETER_DATA_IS_LOADING:
      return { ...state, parameterIsLoading: action.payload }
    default:
      return state
  }
}
