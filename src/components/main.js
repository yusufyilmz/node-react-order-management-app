import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ProductList from './productlist';
import OrderList from './orderlist';
import N11OrderList from './n11orderlist';


import InvoiceList from './invoicelist';
import Shipping from './shipping';
import Home from './home';
import Invoice from './invoice';
import Parameter from './parameter';
import DeliveredOrderList from './deliveredorderlist';
import ArchivedOrderList from './archivedorderlist';

import Login from './login';
import Logout from './logout';
import RequireAuth from './requireauth';
import RequireAdminAuth from './requireadminauth';


const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route path='/products' component={RequireAdminAuth(ProductList)} />
      <Route path='/orders' component={RequireAdminAuth(OrderList)} />
      <Route path='/n11orders' component={RequireAdminAuth(N11OrderList)} />
      <Route path='/invoices' component={RequireAuth(InvoiceList)} />
      <Route path='/invoice/:orderId' component={RequireAdminAuth(Invoice)} />
      <Route path='/invoicen11/:n11orderId' component={RequireAdminAuth(Invoice)} />

      <Route path='/shipping' component={RequireAdminAuth(Shipping)} />
      <Route path='/parameter' component={RequireAdminAuth(Parameter)} />
      <Route path='/deliveredorders' component={RequireAdminAuth(DeliveredOrderList)} />
      <Route path='/archivedorders' component={RequireAdminAuth(ArchivedOrderList)} />
      <Route path='/signin' component={Login} />
      <Route path='/signout' component={Logout} />
      
    </Switch>
  </main>
)

export default Main
