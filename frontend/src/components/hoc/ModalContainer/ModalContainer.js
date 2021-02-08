import React from 'react';
import classes from './ModalContainer.module.css';


const ModalContainer = props => {

    return(
        <div className={classes.ModalContainer}>
            {props.children}
        </div>
    )
}


export default ModalContainer