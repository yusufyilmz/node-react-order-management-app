import React, { Component } from 'react';
// import {Link} from 'react-router';
import { browserHistory } from 'react-router';
import { updateProduct } from '../actions';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import {getCustomStyle } from '../utils/index';

// import './styles.scss'


class ProductDetail extends Component {
  constructor(props) {
    super(props)

    var price = (this.props.product.product_refprice * 18 / 100 ) + this.props.product.product_refprice;
    this.state = {
      product_refprice: price,
      product_quantity: this.props.product.product_quantity,
      product_id: this.props.product.product_refid

    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.success && nextProps.success.product_id == this.state.product_id) {
      this.setState({ modalIsOpen: true })
    }
  }

  updateProduct(values) {

    var price = (this.state.product_refprice  * 100 / 118 );

     var item = {
      product_refprice: price,
      product_quantity: this.props.product.product_quantity,
      product_id: this.props.product.product_refid
    }

    this.props.updateProduct(this.state)
  }

  onChangePrice(e) {
    this.setState({
      product_refprice: e.target.value
    })
  }

  openModal() {
    this.setState({ modalIsOpen: true })
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    // this.subtitle.style.color = '#f00'
  }

  closeModal() {
    this.setState({ modalIsOpen: false })
  }

  onChangeQuantity(e) {
    this.setState({
      product_quantity: e.target.value
    })
  }

  render() {
    const id = this.props.reactKey;

    return (
      <tbody>
        <tr >
          <td>{this.props.product.product_name}</td>
          <td><input type='number' name='quantity' min='1' value={this.state.product_quantity} onChange={this.onChangeQuantity.bind(this)} /></td>
          <td>{this.props.product.product_refcode}</td>
          <td>{this.props.product.product_refid}</td>
          <td><input ref='text' name='quantity' onChange={this.onChangePrice.bind(this)} value={parseFloat(Math.round(this.state.product_refprice * 100) / 100).toFixed(3).toString()} />TL </td>
          <td><button onClick={this.updateProduct.bind(this)}>Update</button></td>

          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={getCustomStyle()}
            contentLabel='eee'
          >
            <button onClick={this.closeModal.bind(this)}>close</button>
            <div>Update is successful</div>
          </Modal>
        </tr>
        {/*<tr id={id} className="collapse"><td>asldsaldsakdsd</td></tr>*/}
      </tbody>

    )
  }
}

function mapStateToProps(state) {
  // console.log(state.itemUpdateSuccess.id)
  return {
    success: state.products.productUpdateSuccess,
    // hasErrored: state.product.itemsHasErrored
    // isLoading: state.product.orderItemIsLoading
  }
}

export default connect(mapStateToProps, { updateProduct })(ProductDetail)


// import React, { Component } from 'react';
// // import {Link} from 'react-router';
// import { browserHistory } from 'react-router';
// import { updateProduct } from '../actions';
// import { connect } from 'react-redux';
// import Modal from 'react-modal';
// // import './styles.scss'
// const customStyle = {
//   content: {
//     top: '50%',
//     left: '50%',
//     right: 'auto',
//     bottom: 'auto',
//     marginRight: '-50%',
//     transform: 'translate(-50%, -50%)'
//   }
// }

// class ProductDetail extends Component {
//   constructor(props) {
//     super(props)

//     this.state = {
//       product_refprice: this.props.product.product_refprice,
//       product_quantity: this.props.product.product_quantity,
//       product_id: this.props.product.product_refid

//     }
//   }

//   componentWillReceiveProps(nextProps) {
//     if (nextProps.success && nextProps.success.product_id == this.state.product_id) {
//       this.setState({ modalIsOpen: true })
//     }
//   }

//   updateProduct(values) {
//     this.props.updateProduct(this.state)
//   }

//   onChangePrice(e) {
//     this.setState({
//       product_refprice: e.target.value
//     })
//   }

//   openModal() {
//     this.setState({ modalIsOpen: true })
//   }

//   afterOpenModal() {
//     // references are now sync'd and can be accessed.
//     // this.subtitle.style.color = '#f00'
//   }

//   closeModal() {
//     this.setState({ modalIsOpen: false })
//   }

//   onChangeQuantity(e) {
//     this.setState({
//       product_quantity: e.target.value
//     })
//   }

//   render() {
//     return (

//       <div className='item'>

//         <Modal
//           isOpen={this.state.modalIsOpen}
//           onAfterOpen={this.afterOpenModal}
//           onRequestClose={this.closeModal}
//           style={customStyle}
//           contentLabel='eee'
//         >

//           <button onClick={this.closeModal.bind(this)}>close</button>
//           <div>Update is successful</div>

//         </Modal>



//         <div className='productContent' >
//           <h3> {this.props.product.product_name} </h3>
//           <label>quantity: </label><input type='number' name='quantity' min='1' value={this.state.product_quantity} onChange={this.onChangeQuantity.bind(this)} />
//           <div className='platformitem'>

//             <h5>{this.props.product.platform_name}: </h5>
//             <label>Reference: {this.props.product.product_refcode}</label>
//             <br />
//             <label>Id: {this.props.product.product_refid}</label>
//             <br />
//             <label>Price:
//                          <input ref='text' name='quantity' onChange={this.onChangePrice.bind(this)} value={this.state.product_refprice} /></label>
//           </div>
//           <div>
//             <button className='productButton normalBtn' onClick={this.updateProduct.bind(this)}>Update</button>
//           </div>
//         </div>
//       </div>

//     )
//   }
// }

// function mapStateToProps(state) {
//   // console.log(state.itemUpdateSuccess.id)
//   return {
//     success: state.products.productUpdateSuccess,
//     // hasErrored: state.product.itemsHasErrored
//     // isLoading: state.product.orderItemIsLoading
//   }
// }

// export default connect(mapStateToProps, { updateProduct })(ProductDetail)
