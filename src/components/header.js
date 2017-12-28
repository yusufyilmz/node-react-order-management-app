import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {
    this.previousWidth = 0
    this.setNav()
    this.setMenuState(window.innerWidth)
    this.previousWidth = window.innerWidth

  }

  componentDidMount() {
    window.addEventListener('resize', () => {
      this.setMenuState(window.innerWidth)
    })
  }

  setMenuState(width) {
    if (this.previousWidth !== width) {
      if (width > 768) {
        const menu = document.querySelector('div.menu')
        if (menu) {
          menu.classList.remove('open')
        }
        this.setState({ menuActive: false })
      } else {
        this.setState({ menuActive: true })
      }

      this.previousWidth = width
    }
  }

  setNav() {
    // check for auth here
    const True = true
    if (True) {
      this.setState({ nav: this.loggedInMenu })
    } else {
      this.setState({ nav: this.loggedOutMenu })
    }
  }

  renderTabs() {

    if (this.props.authenticated == "admin") {

      // show a link to sign in or sign up
      return [

        <Link key={1} to='/' className='navbar-brand'>
          Home
        </Link>,
        <Link key={2} to='/products' className='navbar-brand'>
          Products
        </Link>,
        <Link key={3} to='/orders' className='navbar-brand'>
          Orders
        </Link>,
        <Link key={4} to='/n11orders' className='navbar-brand'>
          N11 Orders
        </Link>,
        <Link key={5} to='/invoices' className='navbar-brand'>
          Invoices
        </Link>,
        <Link key={6} to='/shipping' className='navbar-brand'>
          Shippings
        </Link>,

        <Link key={7} to='/deliveredorders' className='navbar-brand'>
          Delivered Orders
        </Link>,
        <Link key={8} to='/archivedorders' className='navbar-brand'>
          Archived Orders
        </Link>,

      ];
    }

    else if (this.props.authenticated == "user") {

      // show a link to sign in or sign up
      return [

        <Link key={1} to='/' className='navbar-brand'>
          Home
        </Link>,
        <Link key={5} to='/invoices' className='navbar-brand'>
          Invoices
        </Link>,
      ];
    }
    else {
       return [

        <Link key={1} to='/' className='navbar-brand'>
          Home
        </Link>,
      
      ];
    }

  }



  renderLinks() {
    if (this.props.authenticated) {
      // show a link to sign out
      return <li className="omlogin nav-item">
        <Link className="nav-link" to="/signout">Sign Out</Link>
      </li>
    } else {
      // show a link to sign in or sign up
      return [
        <li className="omlogin nav-item" key={1}>
          <Link className="nav-link" to="/signin">Sign In</Link>
        </li>
        // <li className="nav-item" key={2}>
        //   <Link className="nav-link" to="/signup">Sign Up</Link>
        // </li>
      ];
    }
  }

  render() {
    return (

      <nav id="header" className="navbar navbar-light">
        {/*<Link to="/" className="navbar-brand">Redux Auth</Link>*/}
        {this.renderTabs()}
        {/*<ul className="nav navbar-nav">*/}
        {this.renderLinks()}
        {/*</ul>*/}
      </nav>

      // <header id='header' className='header'>
      //   <div id="headerTab" className='react-tabs'>
      //     {this.renderLinks()}
      //   </div>
      // </header>
    )
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated
  };
}

export default connect(mapStateToProps)(Header);