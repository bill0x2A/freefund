import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Dapp from './components/Dapp/Dapp';
import {BrowserRouter as Router} from 'react-router-dom';
import {createStore} from 'redux';
import { Provider } from 'react-redux';
import reducer from './store/reducer';

const debug = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
const store = createStore(reducer, debug);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Dapp />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
