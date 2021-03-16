import React from 'react';
import classes from './ErrorMessage.module.sass';

const ErrorMessage = props => {
    return(
        <div className={classes.Error}>
            <p>{props.error}</p>
        </div>
    )
}

export default ErrorMessage;