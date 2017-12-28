import { INIT_INVOICE, ADD_INVOICE_SUCCESS, INVOICE_GET_LIST_DATA_SUCCESS, GET_INVOICE_SUCCESS, INVOICE_GET_DATA_SUCCESS, INVOICE_SET_STYLE_SUCCESS, INVOICE_GET_STYLE_SUCCESS, INVOICE_DATA_HAS_ERRORED, INVOICE_DATA_IS_LOADING, INVOICE_CREATE_PDF_SUCCESS } from './types'


function addInvoicesSuccess(items) {
  return {
    type: ADD_INVOICE_SUCCESS,
    payload: true
  }
}

function getInvoicesSuccess(items) {
  
    return {
    type: GET_INVOICE_SUCCESS,
    payload: items
  }
}

function invoiceHasErrored(bool) {
  return {
    type: INVOICE_DATA_HAS_ERRORED,
    hasErrored: bool
  }
}
function invoiceIsLoading(bool) {
  return {
    type: INVOICE_DATA_IS_LOADING,
    isLoading: bool
  }
}

function invoiceGetDataSuccess(values) {
  return {
    type: INVOICE_GET_DATA_SUCCESS,
    payload: values
  }
}
function invoiceListGetDataSuccess(values) {
  return {
    type: INVOICE_GET_LIST_DATA_SUCCESS,
    payload: values
  }
}



function invoiceGetStyleSuccess(values) {
  return {
    type: INVOICE_GET_STYLE_SUCCESS,
    payload: values
  }
}

function invoiceSetStyleSuccess(values) {
  return {
    type: INVOICE_SET_STYLE_SUCCESS,
    payload: values
  }
}



function invoiceCreatePdfSuccess(values) {
  return {
    type: INVOICE_CREATE_PDF_SUCCESS,
    payload: values
  }
}

export function initInvoice() {

  return {
    type: INIT_INVOICE,
  }
}






export function getN11InvoiceDetails(id) {
  //  console.log(JSON.stringify({
  //    template: value
  //  }))

  let url = `/api/invoice/details?n11orderId=${id}`

  return (dispatch) => {
    dispatch(invoiceIsLoading(true))

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText)
        } else {
        }
        dispatch(invoiceIsLoading(false))
        return response
      })
      .then(response => response.json())
      .then(items => {
        // console.log(items)
        dispatch(invoiceGetDataSuccess(items))
      })
      .catch((error) => {
        console.log(error)
        dispatch(invoiceHasErrored(true))
      })
  }
}


export function getInvoiceDetails(id) {
  //  console.log(JSON.stringify({
  //    template: value
  //  }))

  let url = `/api/invoice/details?orderId=${id}`

  return (dispatch) => {
    dispatch(invoiceIsLoading(true))

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText)
        } else {
        }
        dispatch(invoiceIsLoading(false))
        return response
      })
      .then(response => response.json())
      .then(items => {
        // console.log(items)
        dispatch(invoiceGetDataSuccess(items))
      })
      .catch((error) => {
        console.log(error)
        dispatch(invoiceHasErrored(true))
      })
  }
}





export function filterInvoiceList(date) {
  //  console.log(JSON.stringify({
  //    template: value
  //  }))

  let url = `/api/invoice/filter?startdate=${date.startDate}&enddate=${date.endDate}`

  return (dispatch) => {
    dispatch(invoiceIsLoading(true))

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText)
        } else {
        }
        dispatch(invoiceIsLoading(false))
        return response
      })
      .then(response => response.json())
      .then(items => {
        // console.log(items)
        dispatch(getInvoicesSuccess(items))
      })
      .catch((error) => {
        console.log(error)
        dispatch(invoiceHasErrored(true))
      })
  }
}

export function createInvoice(value) {
  //  console.log(JSON.stringify({
  //    template: value
  //  }))

  let url = '/api/invoice/create'

  return (dispatch) => {
    dispatch(invoiceIsLoading(true))

    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        template: value.template,
        orderId: value.orderId,
        invoice: value.invoice,
        platformId: value.platformId
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText)
        } else {
        }
        dispatch(invoiceIsLoading(false))
        return response
      })
      .then(response => response.blob())
      .then(blob => {
        dispatch(invoiceCreatePdfSuccess(blob))
      })
      // .then(() => dispatch(invoiceCreatePdfSuccess({})))
      .catch((error) => {
        console.log(error)
        dispatch(invoiceHasErrored(true))
      })
  }
}

export function createInvoiceWithData(value) {
  //  console.log(JSON.stringify({
  //    template: value
  //  }))

  let url = '/api/invoice/createwithdata'

  return (dispatch) => {
    dispatch(invoiceIsLoading(true))

    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        data: value.data,
        orderId: value.orderId
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText)
        } else {
        }
        dispatch(invoiceIsLoading(false))
        return response
      })
      .then(response => response.blob())
      .then(blob => {
        dispatch(invoiceCreatePdfSuccess(blob))
      })
      .catch((error) => {
        console.log(error)
        dispatch(invoiceHasErrored(true))
      })
  }
}



export function saveInvoiceStyle(value) {

  let url = '/api/invoicestyle/savestyle'

  console.log("saveInvoiceStyle");
  var val = JSON.stringify(value);
  console.log(val);

  return (dispatch) => {
    dispatch(invoiceIsLoading(true))

    fetch(url, {
      method: 'POST',
      body: val,
      //JSON.stringify({
      // customerLabel: value.customerLabel,
      // invoicePriceTextlabel: value.invoicePriceTextlabel,
      // invoicePriceTable: value.invoicePriceTable,
      // invoiceProductTable: value.invoiceProductTable,
      // customerControlledPositionX: value.customerControlledPositionX,
      // customerControlledPositionY: value.customerControlledPositionY,
      // invoicePriceTextControlledPositionX: value.invoicePriceTextControlledPositionX,
      // invoicePriceTextControlledPositionY: value.invoicePriceTextControlledPositionY,
      // invoicePriceControlledPositionX: value.invoicePriceControlledPositionX,
      // invoicePriceControlledPositionY: value.invoicePriceControlledPositionY,
      // invoicePriceTableControlledPositionX: value.invoicePriceTableControlledPositionX,
      // invoicePriceTableControlledPositionY: value.invoicePriceTableControlledPositionY,
      // dateControlledPositionX: value.dateControlledPositionX,
      // dateControlledPositionY: value.dateControlledPositionY
      //     productTableControlledPositionX: this.state.productTableControlledPosition.x,
      // productTableControlledPositionY: this.state.productTableControlledPosition.y,
      // taxLabelControlledPositionX: this.state.taxLabelControlledPosition.x,
      // taxLabelControlledPositionY: this.state.taxLabelControlledPosition.y,
      //   value

      // }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText)
        } else {
        }
        dispatch(invoiceIsLoading(false))
        return response
      })
      .then(response => {
        var a = response.text()
        console.log("a");
        console.log(a);
        return a;
      })
      .then(items => {
        // console.log(items)
        dispatch(invoiceSetStyleSuccess(items))
      })
      .catch((error) => {
        console.log(error)
        dispatch(invoiceHasErrored(true))
      })
  }
}



export function getInvoiceStyle(value) {

  let url = '/api/invoicestyle/getstyle'

  return (dispatch) => {
    dispatch(invoiceIsLoading(true))

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText)
        } else {
        }
        dispatch(invoiceIsLoading(false))

        console.log("b");
        console.log(response);

        return response
      })
      .then(response => {
        var a = response.text()
        console.log("a");
        console.log(a);
        return a;
      })
      .then(items => {
        // console.log(items)
        dispatch(invoiceGetStyleSuccess(items))
      })
      .catch((error) => {
        console.log(error)
        dispatch(invoiceHasErrored(true))
      })
  }
}



export function addInvoice(value) {
  //  console.log(JSON.stringify({
  //    template: value
  //  }))

  let url = '/api/invoice/addinvoice';

  return (dispatch) => {
    dispatch(invoiceIsLoading(true))

    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        value
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText)
        } else {
        }
        dispatch(invoiceIsLoading(false))
        return response
      })
      .then((response) => response.json())
      .then((items) => dispatch(addInvoicesSuccess(items)))
      .catch((error) => {
        console.log(error)
        dispatch(invoiceHasErrored(true))
      })
  }
}


export function getInvoices() {
  let url = '/api/invoice/getinvoices'

  // _.forEach(values, (value, key) => {
  //   url += key + '=' + value + '&'
  // })

  return (dispatch) => {
    dispatch(invoiceIsLoading(true))
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText)
        } else {
        }
        dispatch(invoiceIsLoading(false))
        return response
      })
      .then((response) => response.json())
      .then((items) => dispatch(getInvoicesSuccess(items)))
      .catch((error) => {
        console.log(error)
        dispatch(invoiceHasErrored(true))
      })
  }
}