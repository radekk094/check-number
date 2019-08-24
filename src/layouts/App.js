import React, { Component } from 'react';
import '../styles/App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './Header';
import Navigation from './Navigation';
import Page from './Page';
import Footer from './Footer';

class App extends Component {
  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <div className="app">
          <>
            <Navigation />
          </>
          <header>
            <Header />
          </header>
          <main>
            <Page />
          </main>
          <footer>
            <Footer />
          </footer>
        </div>
      </Router>
    );
  }
}

export default App;
