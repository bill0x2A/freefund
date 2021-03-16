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

import Navigation from '../Navigation/Navigation';
import ProjectBrowser from '../ProjectBrowser/ProjectBrowser';
import CreateProject from '../CreateProject/CreateProject';
import AccountPage from '../AccountPage/AccountPage';
import ProjectPage from '../ProjectPage/ProjectPage';
import MissingPage from '../MissingPage/MissingPage';
import Messages from '../Messages/Messages';
import Home from '../Home/Home';
import Footer from '../Footer/Footer';
import ContactPage from '../Contact/Contact';
import AlphaPage from '../JoinAlpha/JoinAlpha';
// import FundingDao from '../FundingDao/FundingDao';

import onMobile from '../../util/detectMobile';

import { daiAbi, rinkebyDaiAddress } from '../../constants/contractData';
import * as artifacts from '../../artifacts/contracts/FreeFund.sol/FreeFund.json';

const HARDHAT_NETWORK_ID = '31337'
const MAINNET_NETWORK_ID = '42'
const RINKEBY_NETWORK_ID = '4'
const MUMBAI_NETWORK_ID = '80001'
const MATIC_NETWORK_ID = '137'

class Dapp extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      selectedAddress: undefined,
    };
    this.state = this.initialState;
  }

  render() {
    const { mobile } = this.props;
    return (
      <React.Fragment>
        <div className={classes.Wrapper}>
            <div className={classes.Dapp}>
              <Navigation
                selectedAddress={this.state.selectedAddress}
                connectWallet = {this._connectWallet}
              />
              <div className={classes.Layout}>
                <div className={classes.Main}>
                  <Switch>
                    <Route exact path={ROUTES.LANDING} component={Home}/>
                    <Route path={ROUTES.HOME} component={Home}/>
                    <Route exact path={ROUTES.PROJECTS} component={ProjectBrowser}/>
                    <Route path={ROUTES.PROJECT} component={ProjectPage}/>
                    <Route path={ROUTES.CREATE} component = {CreateProject}/>
                    <Route path={ROUTES.ALPHA} component = {AlphaPage}/>
                    <Route path={ROUTES.ACCOUNT} component = {AccountPage}/>
                    <Route path={ROUTES.CONTACT} component = {ContactPage}/>
                    <Route path={ROUTES.MESSAGES} component = {Messages}/>
                    <Route component = {MissingPage}/>
                  </Switch>
                </div>
              </div>
            </div>
        </div>
        <div className={classes.Push}/>
        {/* <Footer/> */}
      </React.Fragment>
    );
  }

  componentDidMount(){
    this.props.setMobile( onMobile() );
    this.checkConnection();
  }

  // ####### METAMASK API #######
  // Would preferably handle this in it's own file but it needs to dispatch Redux state changes,
  // so must be included in a React component.
  
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
      if(!this.props.provider){
        this._initialize(accounts[0]);
      }
    }
    // Check login token here
  }

  _connectWallet =  async () => {
    // This method is run when the user clicks Connect. It connects the
    // dapp to the user's wallet, and initializes it.

    const [selectedAddress] = await window.ethereum.enable();

    if (!this._checkNetwork()) {
      // If the current network is not in the list of approved network, do not connect the wallet
      return;
    }

    this._initialize(selectedAddress);
  }

  _initialize = async userAddress => {
    console.log("RUNNING  _initialize")
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
    console.log("RUNNING _initializeEthers()");
    console.dir(window.ethereum);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    this.props.connectProvider(provider);

    const signer = provider.getSigner();
    const rinkebyDai = new ethers.Contract(rinkebyDaiAddress, daiAbi);
    const rinkebyDaiWithSigner = rinkebyDai.connect(signer);


    this.props.connectDaiContract(signer ? rinkebyDaiWithSigner : rinkebyDai);

    const scInterface = new ethers.utils.Interface(artifacts.abi);
    const freefundFactory  = new ethers.ContractFactory(scInterface, artifacts.bytecode, signer);
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

  // This method checks if Metamask selected network is Localhost:8545 / Rinkeby Testnet / Mumbai Testnet / Matic Testnet.
  _checkNetwork() {
    if ([HARDHAT_NETWORK_ID, RINKEBY_NETWORK_ID, MUMBAI_NETWORK_ID, MATIC_NETWORK_ID].includes(window.ethereum.networkVersion)) {
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
  mobile : state.mobile,
  provider : state.provider,
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
  connectFactory      : factory         => dispatch({type : actionTypes.connectFactory, factory : factory}),
  setMobile           : mobile          => dispatch({type : actionTypes.onMobile, mobile : mobile}),
})

export default connect(mapStateToProps, mapDispatchToProps)(Dapp);