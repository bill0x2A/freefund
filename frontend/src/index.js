import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Dapp from './components/Dapp/Dapp';
import {BrowserRouter as Router} from 'react-router-dom';
import {createStore} from 'redux';
import { Provider } from 'react-redux';
import reducer from './store/reducer';
import { io } from 'socket.io-client'

const socket = io("https://floating-temple-50905.herokuapp.com")

const getCookie=(name)=>{
  var ident
  let t = decodeURIComponent(document.cookie).split(';')
  t.map(i => {
      let b = i.trim().split('=')
      if (b[0] == name) {
          ident = b[1]
      }
  })
  return ident
};

const setCookie=(token)=>{
  let date = new Date()
  date.setTime(date.getTime() + (1*24*3600*1000))
  let expires = `; Expires=${date.toUTCString()}`
  document.cookie = `state=${token || ""}${expires}; Path=/`
}

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

const realtimeComm=()=>{

  // These set of functions are the event listeners waiting for the triggers from the backend

  // Indicate connection to socket server and store unique session id
  socket.on("User", id=>{
    //store session id for socket
    // send back 
  })

  socket.on("projectCreated", data=>{
    // pop up a notification here to show project created to author
    // with room id of socket connection room 
    // and this id is stored in the db under the name room
  })

  socket.on("projectFunded", data=>{
    // pop up a notification here to show the everyone that another person has also funded this project

  })

  socket.on("aNewContributor", data=>{
    // pop up a notification here to show the contributors except the person that paid that another person has also funded this project
  })

  socket.on("goalReached", data=>{
    // pop up a notification here to show everyone that has funded this project
    // and including the author that the goal has been reached.
    // This should be triggered by new payments or contract response
  })

  socket.on("newProjectAdded", data=>{
    // this adds to the notification box of everyone that a new project has been added and can be checked out (beta/alpha)
  })

  function emitTriggers(){
    // These are the triggers that will be sent to the event listeners in the backend
    // The places or reasons to use them have been explained a bit above them
    // They can be used anywhere in the frontend just required io which can be stored in the redux
    // They were placed in the function emitTriggers to avoid triggering unexpectedly or unintentionally
    // You'll have to pick them and place them where needed, the needed data was specified and explained

    //new project by creator
    socket.emit("newProject", {id:"id of project created, gotten from the backend"})

    // new contributor to the project by funding shoud add the user to the project room
    socket.emit("newContributor", {address:"address of the new contributor/user",
                                  room: "room id of the project",
                                  id: 'id of funded project'})
    
    // new contributor to the project by funding should add the user to the project room
    socket.emit("fund", {room: "room id of the project"})

    // new contributor to the project by funding should add the user to the project room
    // similar to fund but doesn't notify the immediate contributor
    socket.emit("funded", {room: "room id of the project"})

    // send trigger that goal has been reached
    socket.emit("goal", {room: "room id of the project"})

    // send trigger that a new project has been successfully added to the platform
    socket.emit("add", "arbitrary data can be put here")

    }

    
  
}

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
