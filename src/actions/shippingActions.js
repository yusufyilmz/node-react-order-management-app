import _ from 'lodash'
import { SHIPPING_UPLOAD_SUCCESS, SHIPPING_UPDATE_SUCCESS, SHIPPING_DATA_HAS_ERRORED, SHIPPING_DATA_IS_LOADING } from './types';

function shippingsHasErrored(bool) {
    return {
        type: SHIPPING_DATA_HAS_ERRORED,
        payload: bool
    }
}
function shippingsIsLoading(bool) {
    return {
        type: SHIPPING_DATA_IS_LOADING,
        payload: bool
    }
}

function shippingsUploadSuccess(values) {
    return {
        type: SHIPPING_UPLOAD_SUCCESS,
        payload: values
    }
}

function shippingsUpdateSuccess(bool) {
    return {
        type: SHIPPING_UPDATE_SUCCESS,
        payload: bool
    }
}



export function uploadShipping(file) {

    const data = new FormData();
    data.append('file', file);
    data.append('name', 'some value user types');
    data.append('description', 'some value user types');
    // '/files' is your node.js route that triggers our middleware
    // axios.post('/files', data).then((response) => {
    // });
    return (dispatch) => {

        dispatch(shippingsIsLoading(true))

        fetch("api/shipping/upload", {
            mode: 'no-cors',
            method: "POST",
            body: data
        }).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText)
            }

            dispatch(shippingsIsLoading(false));
            console.log("response");
            console.log(response);

            return response
        }).then((response) => response.json())
            .then((items) => dispatch(shippingsUploadSuccess(items)))
            .catch((error) => {
                console.log(error)
                dispatch(shippingsHasErrored(true))
            })

    }

}


export function updateOrderAllShippingIds(values) {

    return (dispatch) => {

        dispatch(shippingsIsLoading(true))

        fetch("api/shipping/update", {
            method: 'POST',
            body: JSON.stringify({
                items: values,
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            if (!response.ok) {
                throw Error(response.statusText)
            }
            console.log("response");
           // console.log(response);

            dispatch(shippingsIsLoading(false))
            return response
        }).then((response) => {
            let res = response.json()
            console.log("res")
            console.log(res)
            return res

        })
            .then(() => dispatch(shippingsUpdateSuccess(true)))
            .catch((error) => {
                console.log(error)
                dispatch(shippingsHasErrored(true))
            })

    }

}
