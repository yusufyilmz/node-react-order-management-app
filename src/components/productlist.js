import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import ProductDetail from './productdetail';
import { getAllProducts } from '../actions/index';
// import './styles.scss'
import FaArrowUp from 'react-icons/lib/fa/arrow-up';
import FaArrowDown from 'react-icons/lib/fa/arrow-down';

class ProductList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      products: [],
      nameOrder: false,
      quantityOrder: false,
      codeOrder: false,
      idOrder: false,
      priceOrder: false
    }
  }


  componentWillMount() {
    this.props.getAllProducts();
  }

  componentDidMount() {
    document.body.scrollTop = 0
    // document.querySelector('.menu').classList.remove('open')
  }

  componentWillReceiveProps(nextProps) {

    var products = _.filter(nextProps.products, (item) => {
      return item;
    });

    if (products && products.length > 0) {
      this.setState({ products: products })
    }

  }


  renderProducts() {
    return _.map(this.state.products, (item) => {
      return (
        <ProductDetail key={item.product_refid} reactKey={item.product_refid} product={item} />
      )
    })
  }


  // const sortedUsers = _.orderBy(users, [user => user.name.toLowerCase()], ['desc']);


  //   renderCollapse () {
  //   return _.map(this.props.products, (item) => {
  //     return (
  //                               
  //     )
  //   })
  // }

  orderProductName(e) {

    console.log(e.target.name);
    console.log(e.target);

    let orderType = '';
    if (this.state.nameOrder == true) {
      orderType = 'asc';
    }
    else {
      orderType = 'desc';
    }

    const sortedProducts = _.sortByOrder(this.state.products, [item => item.product_name.toLowerCase()], [orderType]);
    this.setState({ products: sortedProducts, nameOrder: !this.state.nameOrder });
  }

  orderProductQuantity(e) {
    let orderType = '';
    if (this.state.quantityOrder == true) {
      orderType = 'asc';
    }
    else {
      orderType = 'desc';
    }

    const sortedProducts = _.sortByOrder(this.state.products, [item => item.product_quantity], [orderType]);
    this.setState({ products: sortedProducts, quantityOrder: !this.state.quantityOrder });
  }


  orderProductReferenceCode(e) {
    let orderType = '';
    if (this.state.codeOrder == true) {
      orderType = 'asc';
    }
    else {
      orderType = 'desc';
    }

    const sortedProducts = _.sortByOrder(this.state.products, [item => item.product_refcode.toLowerCase()], [orderType]);
    this.setState({ products: sortedProducts, codeOrder: !this.state.codeOrder });
  }


  orderProductReferenceId(e) {
    let orderType = '';
    if (this.state.idOrder == true) {
      orderType = 'asc';
    }
    else {
      orderType = 'desc';
    }

    const sortedProducts = _.sortByOrder(this.state.products, [item => item.product_refid], [orderType]);
    this.setState({ products: sortedProducts, idOrder: !this.state.idOrder });
  }


  orderProductPrice(e) {
    let orderType = '';
    if (this.state.priceOrder == true) {
      orderType = 'asc';
    }
    else {
      orderType = 'desc';
    }

    const sortedProducts = _.sortByOrder(this.state.products, [item => item.product_refprice], [orderType]);
    this.setState({ products: sortedProducts, priceOrder: !this.state.priceOrder });
  }





  render() {


    const nameArrow = this.state.nameOrder == true ? <FaArrowUp /> : <FaArrowDown/> ; 
    const quantityArrow = this.state.quantityOrder == true ? <FaArrowDown /> : <FaArrowUp/> ; 
    const codeArrow = this.state.codeOrder == true ? <FaArrowUp /> : <FaArrowDown/> ; 
    const idArrow = this.state.idOrder == true ? <FaArrowUp /> : <FaArrowDown/> ; 
    const priceArrow = this.state.priceOrder == true ? <FaArrowUp /> : <FaArrowDown/> ; 


    return (
      <div >
        <table className="table table-hover table-responsive">
          <thead>
            <tr>
              <th name="name" onClick={this.orderProductName.bind(this)} >Name {nameArrow}</th>
              <th onClick={this.orderProductQuantity.bind(this)}>Quantity {quantityArrow}</th>
              <th onClick={this.orderProductReferenceCode.bind(this)}>Reference Code {codeArrow}</th>
              <th onClick={this.orderProductReferenceId.bind(this)} >Reference Id{idArrow}</th>
              <th onClick={this.orderProductPrice.bind(this)} >Price { priceArrow}</th>
              <th></th>
            </tr>
          </thead>
          {this.renderProducts()}
        </table>

      </div>

      // <div className='container'>
      //   <main className='productMain'>
      //     {this.renderProducts()}
      //   </main>
      // </div>
    )
  }
}

function mapStateToProps(state) {
  return { products: (state.products.products) }
}

export default connect(mapStateToProps, { getAllProducts })(ProductList)
