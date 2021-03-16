import React from 'react';
import classes from './ModalContainer.module.sass';


const ModalContainer = props => {

    return(
        <div
            className={classes.ModalContainer}
            onClick={props.click}
        >
            {props.children}
        </div>
    )
}


export default ModalContainer