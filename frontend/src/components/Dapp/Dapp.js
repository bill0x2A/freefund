import React from "react";
import classes from './Dapp.module.css';
import * as ROUTES from '../../constants/routes';
import * as actionTypes from '../../store/actionTypes';
import { connect } from 'react-redux';
import { login } from '../../mongo/mongo';
import detectEthereumProvider from '@metamask/detect-provider';

import { BrowserRouter as Router,
  Route,
  Switch
 } from 'react-router-dom';

import { ethers } from "ethers";


// import TokenArtifact from "../../contracts/Token.json";
// import contractAddress from "../../contracts/contract-address.json";

import Navigation from '../Navigation/Navigation';
import LandingPage from '../LandingPage/LandingPage';
import ProjectBrowser from '../ProjectBrowser/ProjectBrowser';
import CreateProject from '../CreateProject/CreateProject';
import AccountPage from '../AccountPage/AccountPage';
import ProjectPage from '../ProjectPage/ProjectPage';
import MobileMessage from '../MobileMessage/MobileMessage';
import MissingPage from '../MissingPage/MissingPage';
// import FundingDao from '../FundingDao/FundingDao';

import onMobile from '../../util/detectMobile';

import { daiAbi, rinkebyDaiAddress, freefundFactoryAbi } from '../../constants/contractData';

const HARDHAT_NETWORK_ID = '31337'
const MAINNET_NETWORK_ID = '42'
const RINKEBY_NETWORK_ID = '4'

class Dapp extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      selectedAddress: undefined,
      mobile: false,
    };

    this.state = this.initialState;
  }

  render() {
    const { mobile } = this.state;
    return (
      <React.Fragment>
        { mobile ? <MobileMessage/> :
          <div className={classes.Dapp}>
            <Navigation
              selectedAddress={this.state.selectedAddress}
              connectWallet = {this._connectWallet}
            />
            <div className={classes.Layout}>
              <div className={classes.Main}>
                <Switch>
                  <Route exact path={ROUTES.LANDING} component={LandingPage}/>
                  <Route exact path={ROUTES.PROJECTS} component={ProjectBrowser}/>
                  <Route path={ROUTES.PROJECT} component={ProjectPage}/>
                  <Route path={ROUTES.CREATE} component = {CreateProject}/>
                  <Route path={ROUTES.ACCOUNT} component = {AccountPage}/>
                  <Route component = {MissingPage}/>
                </Switch>
              </div>
            </div>
          </div>
        }
      </React.Fragment>
    );
  }

  componentDidMount(){
    this.setState({mobile : onMobile()});
    this.checkConnection();
  }

  // ####### METAMASK API #######
  // Would preferably handle this in it's own file but it needs to dispatch Redux state changes
  
  checkConnection = async () => {
    // This is run every time the Dapp component is mounted (i.e. on page reload),
    // it should account for all possibilities.

    const provider = await detectEthereumProvider();
    let chainID;
    if (provider){
        if (provider !== window.ethereum) {
            console.error('Do you have multiple wallets installed?');
            // Give the user visual feedback here
          } else {

            // Handle chain ID detection and switching
            chainID = await window.ethereum.request({method : 'eth_chainId'});
            this.props.setNetworkID(chainID);
            window.ethereum.on('chainChanged', chainID => {
                this.handleChainChanged(chainID);
            });

            // Detect accounts
            window.ethereum
                .request({ method : 'eth_accounts'})
                .then(this.handleAccountsChanged)
                .catch(err => {
                    console.log(err);
                })

            window.ethereum.on('accountsChanged', accounts => {
                this.handleAccountsChanged(accounts);
            });

          }
    }
  }

  handleChainChanged = () => {
    // As recommended by MetaMask docs
    console.log("CHAIN CHANGED");
    window.location.reload();
  }

  handleAccountsChanged = accounts => {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      this.props.resetState();
      console.log('Please connect to MetaMask.');
    } else if (accounts[0] !== this.props.user?.address) {
      console.log(accounts[0], this.props.user?.address)
      console.log("Account diff found");
      // Account is not what we have in state, reinitialize everything for a new account
      this._initialize(accounts[0]);
    } else {
      console.log("STATE = METAMASK, ALL GOOD!")
    }
    // Check login token here
  }

  _connectWallet =  async () => {
    // This method is run when the user clicks the Connect. It connects the
    // dapp to the user's wallet, and initializes it.

    const [selectedAddress] = await window.ethereum.enable();

    if (!this._checkNetwork()) {
      return;
    }

    this._initialize(selectedAddress);
  }

  _initialize = async userAddress => {
    this.props.resetState();
    this.props.connectWallet(userAddress);

    // FETCH USER INFORMATION HERE
    console.log("Running login");
    const data = await login(userAddress);
      if(!data.token){
        // User is not registered
        this.props.setToken(null)
        this.props.setUser({address : userAddress})
      } else {
        // User is registered
        this.props.setToken(data?.token)
        this.props.setUser(data?.data)
      }

    
    this._intializeEthers();
  }

  // ####### ETHERS #######

  async _intializeEthers() {
    // We first initialize ethers by creating a provider using window.ethereum
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // // alternative provider options
    // const provider = new ethers.providers.JsonRpcProvider('<...Rinkeby...>');
    this.props.connectProvider(provider);

    const rinkebyDai = new ethers.Contract(rinkebyDaiAddress, daiAbi, provider);
    const rinkebyDaiWithSigner = rinkebyDai.connect(provider.getSigner());
    this.props.connectDaiContract(rinkebyDaiWithSigner);

    const freefundFactory  = new ethers.ContractFactory(interface, bytecode, signer)
    this.props.connectFactory(freefundFactory);

    // INITIALISE CONTRACTS HERE
  }

  // This is an utility method that turns an RPC error into a human readable message.
  _getRpcErrorMessage(error) {
    if (error.data) {
      return error.data.message;
    }

    return error.message;
  }

  // This method checks if Metamask selected network is Localhost:8545 / Kovan Testnet
  _checkNetwork() {
    if ([HARDHAT_NETWORK_ID, RINKEBY_NETWORK_ID].includes(window.ethereum.networkVersion)) {
      return true;
    }

    this.setState({ 
      networkError: 'Please connect Metamask to Localhost:8545, or Rinkeby Testnet'
    });

    return false;
  }
}


// Redux connection
const mapStateToProps = state => ({
  user : state.user,
});

const mapDispatchToProps = dispatch => ({
  connectProvider     : provider        => dispatch({type : actionTypes.connectProvider, provider : provider}),
  connectWallet       : selectedAddress => dispatch({type : actionTypes.connectWallet, selectedAddress : selectedAddress}),
  connectDaiContract  : contract        => dispatch({type : actionTypes.connectDaiContract, contract : contract}),
  disconnectWallet    : ()              => dispatch({type : actionTypes.disconnectWallet}),
  resetState          : ()              => dispatch({type : actionTypes.resetState}),
  setNetworkID        : networkId       => dispatch({type : actionTypes.setNetworkID, id : networkId}),
  setToken            : tokenId         => dispatch({type : actionTypes.setToken, token : tokenId}),
  setUser             : userData        => dispatch({type : actionTypes.setUser, user : userData}),
})

export default connect(mapStateToProps, mapDispatchToProps)(Dapp);