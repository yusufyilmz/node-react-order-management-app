import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  FETCH_MESSAGE
} from './types';


// dispatch({ type: AUTH_USER });
// - Save the JWT token
// - redirect to the route '/feature'
// browserHistory.push('/feature');


export function loginUser(username, password) {

  let url = '/api/auth/login'


  return (dispatch) => {
    // dispatch(invoiceIsLoading(true))
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText)
      }
      // dispatch(getOrderIsLoading(false))
      return response
    }).then((response) => response.json())
      .then((item) => dispatch(loginFetchResult(item)))
      .catch((error) => {
        console.log(error)
        dispatch(authError(error))
      })

  }
}



export function logoutUser() {
  localStorage.removeItem('token');

  return { type: UNAUTH_USER };
}



export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  };
}

export function loginFetchResult(result) {

  console.log(result);

  if (result.result == true) {
    localStorage.setItem('token', result.message);
    // browserHistory.push('/feature');
        // browserHistory.push('/products');

    return {
      type: AUTH_USER,
      payload: result.authentication
    };
  }
  if (result.result == false) {
    return {
      type: AUTH_ERROR,
      payload: result.message
    };
  }

}


// export function loginUser({ username, password }) {


//   return function(dispatch) {
//     // Submit email/password to the server
//     axios.post(`${ROOT_URL}/api/auth/login`, { username, password })
//       .then(response => {
//         // If request is good...
//         // - Update state to indicate user is authenticated
//         dispatch({ type: AUTH_USER });
//         // - Save the JWT token
//         // localStorage.setItem('token', response.data.token);
//         // - redirect to the route '/feature'
//         // browserHistory.push('/feature');
//       })
//       .catch(() => {
//         // If request is bad...
//         // - Show an error to the user
//         dispatch(authError('Bad Login Info'));
//       });
//   }
// }

// export function signupUser({ email, password }) {
//   return function(dispatch) {
//     axios.post(`${ROOT_URL}/api/auth/signup`, { email, password })
//       .then(response => {
//         dispatch({ type: AUTH_USER });
//         localStorage.setItem('token', response.data.token);
//         browserHistory.push('/feature');
//       })
//       .catch(response => dispatch(authError(response.data.error)));
//   }
// }



// export function fetchMessage() {
//   return function(dispatch) {
//     axios.get(ROOT_URL, {
//       headers: { authorization: localStorage.getItem('token') }
//     })
//       .then(response => {
//         dispatch({
//           type: FETCH_MESSAGE,
//           payload: response.data.message
//         });
//       });
//   }
// }