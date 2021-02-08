import React, {useState} from 'react';
import classes from './Fund.module.css';

import DAI from '../../assets/DAI.png';
import {RinkebyDAI} from '../../constants/tokenAddresses';
import {ethers} from 'ethers';
import Loading from '../Loading/Loading';

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner();


// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

const daiAbi = [
    // Some details about the token
    "function name() view returns (string)",
    "function symbol() view returns (string)",
  
    // Get the account balance
    "function balanceOf(address) view returns (uint)",
  
    // Send some of your tokens to someone else
    "function transfer(address to, uint amount)",
  
    // An event triggered whenever anyone transfers to someone else
    "event Transfer(address indexed from, address indexed to, uint amount)"
  ];

  const daiContract = new ethers.Contract(RinkebyDAI, daiAbi, provider)
  const daiWithSigner = daiContract.connect(signer);

class Fund extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            pledge : 0,
            confirmingTx : false,
            txError : undefined,
            txSuccess : false,
            txBeingSent : undefined,

        }
    }

    async _transferTokens(to, amount) {
        // Sending a transaction is a complex operation:
        //   - The user can reject it
        //   - It can fail before reaching the ethereum network (i.e. if the user
        //     doesn't have ETH for paying for the tx's gas)
        //   - It has to be mined, so it isn't immediately confirmed.
        //     Note that some testing networks, like Hardhat Network, do mine
        //     transactions immediately, but your dapp should be prepared for
        //     other networks.
        //   - It can fail once mined.
        //
        // This method handles all of those things, so keep reading to learn how to
        // do it.
        const dai = ethers.utils.parseUnits(amount, 18);

        try {
          // If a transaction fails, we save that error in the component's state.
          // We only save one such error, so before sending a second transaction, we
          // clear it.
          this._dismissTransactionError();
    
          // We send the transaction, and save its hash in the Dapp's state. This
          // way we can indicate that we are waiting for it to be mined.
          const tx = await daiWithSigner.transfer(to, dai);
          this.setState({ txBeingSent: tx.hash });
    
          // We use .wait() to wait for the transaction to be mined. This method
          // returns the transaction's receipt.
          const receipt = await tx.wait();
    
          // The receipt, contains a status flag, which is 0 to indicate an error.
          if (receipt.status === 0) {
            // We can't know the exact error that make the transaction fail once it
            // was mined, so we throw this generic one.
            throw new Error("Transaction failed");
          }
    
          // TX SUCCESSFUL, UPDATE STATE ACCORDINGLY
          this.setState({ txSuccess : true, sentTx : tx.hash })
          
        } catch (error) {
          // We check the error code to see if this error was produced because the
          // user rejected a tx. If that's the case, we do nothing.
          if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
            return;
          }

          console.error(error);
          this.setState({ txError: error });
        } finally {
          // If we leave the try/catch, we aren't sending a tx anymore, so we clear
          // this part of the state.
          this.setState({ txBeingSent: undefined });
        }
      }

    _dismissTransactionError() {
        this.setState({ txError: undefined });
    }  

    onChange = e => {
        this.setState({[e.target.name] : e.target.value});
    }

    render(){
        let { pledge, txError, txBeingSent, txSuccess, sentTx } = this.state;
        let { dismiss } = this.props;

        // Conditional rendering based on transaction status
        let txInfo = null;
        if(txSuccess || true){
            // Transaction success message
            txInfo = (
                <div className={classes.TxMessage}>
                    <p>Transaction successful</p>
                    <p>Tx Hash: {sentTx}</p>
                </div>
            )
        } else if (txError){
            txInfo = (
                <div className={classes.TxMessage} style={{color : "var(--warning)", border : "3px dashed var(--warning)"}}>
                    <p>Transaction failed with error message:</p>
                    <p>{txError}</p>
                </div>
            )
        } else if (txBeingSent){
            // Spinner and transaction information
            txInfo = (
                <div className={classes.SendingTx}>
                    <p style={{color:"var(--accent)"}}>Sending transaction: {txBeingSent}</p>
                    <Loading/>
                </div>
            )
        } else {
            // Fund button
            txInfo = (
                <div 
                    className={classes.Submit}
                    onClick = {() => this._transferTokens("0xa53f2C25278E515851DB513f6C990681429f9a4a", pledge)}
                >Fund</div>
            )
        }
        return(
            <div className={classes.Fund}>
                <div  className={classes.Close} onClick={dismiss}>X</div>
                <div className={classes.Payment}>
                    <input 
                        type="number"
                        name="pledge"
                        value={pledge}
                        onChange={this.onChange}
                    />
                    <span>DAI <img src={DAI}/></span>
                </div>
                {txError && <div className={classes.TxError}><p>TX Error : {txError}</p></div>}
                <div className={classes.SubmitContainer}>
                    {/* Conditional rendering function for transaction state */}
                    {txInfo}
                </div>
            </div>
        )
    }
}

export default Fund