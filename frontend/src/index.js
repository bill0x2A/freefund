import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Dapp from './components/Dapp/Dapp';
import {BrowserRouter as Router} from 'react-router-dom';
import {createStore} from 'redux';
import { Provider } from 'react-redux';
import reducer from './store/reducer';
import { setCookie, getCookie } from './util/cookies';


const loadState = () => {
  try {
    const serializedState = getCookie('state');
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
    setCookie(serializedState);
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
  <Provider store ={store}> 
      <Router>
        <Dapp />
      </Router>
  </Provider>,
  document.getElementById('root')
);
