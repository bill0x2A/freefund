import React, {useState} from 'react';
import classes from './Fund.module.sass';

import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { Icon, InlineIcon } from '@iconify/react';
import walletIcon from '@iconify-icons/simple-line-icons/wallet';


import DAI from '../../assets/DAI.png';
import close from '../../assets/close.png';
import transakLogo from '../../assets/transak-logo.png';
import { ethers } from 'ethers';
import Loading from '../Loading/Loading';
import TxInfo from '../TxInfo/TxInfo';

import transakSDK from '@transak/transak-sdk'

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

class Fund extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            pledge : 0,
            confirmingTx : false,
            txError : undefined,
            txSuccess : false,
            txBeingSent : undefined,
            userDaiBalance : 0,
        }
    }

    componentDidMount(){
        const {selectedAddress, daiContract, pledge} = this.props;

        if(selectedAddress){
            this.updateUserBalance();
        }

        if(pledge){
            this.setState({pledge});
        }

        this.setState({
            transak : new transakSDK({
                    apiKey: 'cb4cbbbc-4cf3-445e-9f2e-c6f1e6d7f50f',  // Your API Key
                    environment: 'STAGING', // STAGING/PRODUCTION
                    defaultCryptoCurrency: 'DAI',
                    walletAddress: selectedAddress, // Your customer's wallet address
                    themeColor: '000000', // App theme color
                    fiatCurrency: 'GBP', // INR/GBP
                    email: 'billysmith1998@live.com', // Your customer's email address
                    redirectURL: '',
                    hostURL: window.location.origin,
                    widgetHeight: '650px',
                    widgetWidth: '450px',
                    defaultNetwork : ['matic'],
                    defaultCryptoAmount : pledge / 1000000000000000000,
            })
        }, () => {
            let { transak } = this.state;
            transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, (data) => {
                this.setState({transakOpen : false});
                transak.close();
            });
        })

        this.loadProjectData();
    }

    loadProjectData = () => {
        // Convert to mongo
    }

    

    async _transferTokens(to, amount) {
        if(!(amount > 0)){
            this.setState({txError : "Please enter your pledge amount"})
            return;
        }

        const dai = ethers.utils.parseUnits(amount, 18);

        try {
          // If a transaction fails, we save that error in the component's state.
          // We only save one such error, so before sending a second transaction, we
          // clear it.
          this._dismissTransactionError();
    
          // We send the transaction, and save its hash in the Dapp's state. This
          // way we can indicate that we are waiting for it to be mined.
          const tx = await this.props.daiContract.transfer(to, dai);
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
          console.log("FUNDING: ",this.state.funded)
          const newFunded = parseFloat(this.state.funded) + parseFloat(amount);
          // Funding amount to database
          this.updateUserBalance();
          
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

    updateUserBalance = async () => {
        let balance = await this.props.daiContract?.balanceOf(this.props.user?.address);
        balance = balance / 1000000000000000000;
        this.setState({balance});
    }

    openTransak = () => {
        this.setState({transakOpen : true});
        this.state.transak.init();
    }

    render(){
        let { pledge, txError, txBeingSent, txSuccess, sentTx, balance } = this.state;
        let { dismiss, fundingAddress } = this.props;

        // Billy personal Metamask account for testing / if no funding address is found
        // Should change to multisig incase of bugs, funds will not be lost (unless custodial issues).
        fundingAddress = fundingAddress || "0xa53f2C25278E515851DB513f6C990681429f9a4a";

        // Conditional rendering based on transaction status
        let txInfo = null;
        if(txSuccess || txError || !this.props.selectedAddress || txBeingSent || sentTx){
            txInfo = <TxInfo
                        txError={txError}
                        address={this.props.user?.address}
                        txBeingSent={txBeingSent}
                        txSuccess={txSuccess}
                        sentTx={sentTx}
                    />
        } else {
            // Fund button
            txInfo = (
                <div 
                    className={classes.Submit}
                    onClick = {() => this._transferTokens(fundingAddress, pledge)}
                >Fund</div>
            )
        }

        if(this.state.transakOpen){
            return <div className={classes.Fund}/>
        }

        return(
            <div className={classes.Fund}>

                <div  className={classes.Close} onClick={dismiss}>
                    <img src={close}/>
                </div>
                { !this.props.mobile && (
                <React.Fragment>
                    <h3>Fund this project</h3>
                    <div className={classes.Payment}>
                        <input 
                            type="number"
                            name="pledge"
                            value={pledge}
                            onChange={this.onChange}
                        />
                        <span>DAI <img src={DAI}/></span>
                    </div>
                    <div className={classes.Balance}>
                        <span
                            data-tip={"May not update immediately, this is a MetaMask bug!"}
                        >
                            <InlineIcon icon={walletIcon}/>
                            {balance ? parseFloat(balance).toFixed(2) : "-" }
                            <img src={DAI}/>
                        </span>
                    </div>
                </React.Fragment>)}
                <div className={classes.SubmitContainer}>
                    {/* Conditional rendering function for transaction state */}
                    {txInfo}
                    {txError && <div 
                                    className={classes.Submit} 
                                    style = {{marginLeft : "5px"}}
                                    onClick = {() => this._transferTokens("0xa53f2C25278E515851DB513f6C990681429f9a4a", pledge)}
                                >Fund</div>
                    }
                    <div className={classes.BuyDai} onClick={this.openTransak}>Purchase DAI with <img src={transakLogo}/></div>
                </div>
            <ReactTooltip/>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    daiContract : state.daiContract,
    selectedAddress : state.selectedAddress,
    user : state.user,
    mobile : state.mobile,
})

const mapDispatchToProps = null;

export default connect(mapStateToProps, mapDispatchToProps)(Fund);