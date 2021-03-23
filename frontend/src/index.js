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
  console.log("Running loadState()");
  try {
    const serializedState = getCookie('state');
    if(serializedState === null) {
      return undefined;
    }
    const state = JSON.parse(serializedState);
    const loadedState = {
      user : {
        address : state.address,
        imgHash : state.imgHash,
      },
      selectedAddress : state.selectedAddress,
      token : state.token,
    }
    console.log(loadedState);
    return loadedState;
  } catch (e) {
    console.log(e)
    return undefined;
  }
};

const saveState = (state) => {
  console.log("Running saveState()");
  const saveState = {
    address : state.user?.address,
    imgHash : state.user?.imgHash,
    selectedAddress : state.selectedAddress,
    token : state.token,
  }
  console.dir(saveState)
  try {
    const serializedState = JSON.stringify(saveState);
    setCookie(serializedState);
  } catch (e) {
    console.log(e)
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
