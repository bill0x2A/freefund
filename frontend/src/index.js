import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Dapp from './components/Dapp/Dapp';
import {BrowserRouter as Router} from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Dapp />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
