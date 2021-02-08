import React from 'react'
import classes from './MobileMessage.module.css';
import circle from '../../assets/circle.png';

const MobileMessage = props => {
    return(
        <div className = {classes.MobileMessage}>
            <div
                className={classes.Logo}
            >
                <img src = {circle}/>
                <h2>FREEFUND</h2>
            </div>
            <div className={classes.Message}>
                <p>This application does not support mobile browsers</p>
            </div>
        </div>
    )
}

export default MobileMessage;