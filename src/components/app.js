import React, { Component } from 'react';
import Header from './header';
import Main from './main';



class App extends Component {
  render() {
    return (
      <div id="wrapperApp" className="wrapper">
        <Header />
        <Main />

      </div>
    );
  };
};

export default App;
