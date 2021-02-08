import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Dapp from './components/Dapp/Dapp';
import {BrowserRouter as Router} from 'react-router-dom';
import {createStore} from 'redux';
import { Provider } from 'react-redux';
import reducer from './store/reducer';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if(serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (e) {

  }
};

const debug = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
const peristedState = loadState();
const store = createStore(reducer, peristedState, debug);

store.subscribe(() => {
  saveState(store.getState());
});


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
