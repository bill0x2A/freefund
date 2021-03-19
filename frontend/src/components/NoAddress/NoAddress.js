import React from 'react';
import classes from './NoAddress.module.sass';

const NoAddress = () => (
    <div className={classes.ModalContainer}>
        <div className={classes.Box}>
            <h2>Please Connect Your Wallet</h2>
            <p>To access this page you must first connect your wallet</p>
        </div>
    </div>
)


export default NoAddress;