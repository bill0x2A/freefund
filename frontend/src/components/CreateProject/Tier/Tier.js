import React from 'react'
import classes from './Tier.module.sass';
import sharedClasses from '../CreateProject.module.sass';
import { Icon, InlineIcon } from '@iconify/react';
import closeLine from '@iconify-icons/clarity/close-line';

import DAI from '../../../assets/DAI.png';

const Tier = ({tier, index, onChangeDesc, onChangeFund, onRemove})=> {
    return (
        <div className={classes.Tier}>
            <h4>Tier {index + 1}</h4>
            <div
                className={classes.DeleteTier}
                onClick = {() => onRemove(index)}
            >x</div>
            <textarea
                placeholder="Tier Rewards Description"
                onChange={ e => {onChangeDesc(e, index)}}
                value = {tier.description}
            />
            <div className={sharedClasses.Payment}>
                <input 
                    type="number"
                    placeholder="Minimum funding"
                    onChange={ e => {onChangeFund(e, index)}}
                    value = {tier.funding}
                />
                <span>DAI <img src={DAI}/></span>
            </div>
        </div>
    )
}

export default Tier;