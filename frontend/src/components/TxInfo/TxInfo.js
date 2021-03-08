import React from 'react';
import classes from './TxInfo.module.css';
import Loading from '../Loading/Loading';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const TxInfo = ({txError, address, txBeingSent, txSuccess, sentTx, create, projectID, mobile}) => {
    let txInfo = null;
    if(mobile){
        txInfo = (
            <div className={classes.TxMessage} style={{color : "orange", border : "3px dashed orange", alignItems: "center", justifyContent: "center"}}>
                <p>This feature is not available on mobile</p>
            </div>
        )
    } else if(txSuccess){
        // Transaction success message
        if(create){
            txInfo = (
                <div className={classes.TxMessage}>
                    <p>Transaction successful</p>
                    <p><a target="_blank" href={`https://rinkeby.etherscan.io/tx/${sentTx}`}>View transaction here</a></p>
                    <Link to = {`projects/${projectID}`}>Go to project page</Link>
                </div>
            )
        } else {
            txInfo = (
                <div className={classes.TxMessage}>
                    <p>Transaction successful</p>
                    <p><a target="_blank" href={`https://rinkeby.etherscan.io/tx/${sentTx}`}>View transaction here</a></p>
                </div>
            )
        }
        
    } else if (txError){
        txInfo = (
                <div className={classes.TxMessage} style={{color : "var(--warning)", border : "3px dashed var(--warning)"}}>
                    <p>{create ? "Project creation" : "Transaction"} failed with error message:</p>
                    <p style={{textAlign:"left", maxWidth: "500px", overflow:"hidden"}}>{txError.message}</p>
                    <p>If you require help, email us at <strong>support@freefund.io</strong></p>
                </div>
        )
    } else if (txBeingSent){
        // Spinner and transaction information
        txInfo = (
            <div className={classes.TxMessage}>
                <Loading style={{position: "absolute", top : "5px", right : "5px"}}/>
                <p>Sending transaction:</p>
                <p><a target="_blank" href={`https://rinkeby.etherscan.io/tx/${txBeingSent}`}>{txBeingSent}</a></p>
            </div>
        )
    } else if(!address){
        txInfo = (
            <div className={classes.TxMessage} style={{color : "orange", border : "3px dashed orange", alignItems: "center", justifyContent: "center"}}>
                <p>Please connect your wallet first</p>
            </div>
    )
        }

    return txInfo;
}

const mapStateToProps = state => ({
    mobile : state.mobile,
});

export default connect(mapStateToProps)(TxInfo);