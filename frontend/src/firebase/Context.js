import React, { Component } from 'react';

const FirebaseContext = React.createContext(null);

export const withFirebase = Component => props => {
    return (
        <FirebaseContext.Consumer>
            {firebase => <Component {...props} firebase={firebase} />}
        </FirebaseContext.Consumer>
    )
}

export default FirebaseContext;