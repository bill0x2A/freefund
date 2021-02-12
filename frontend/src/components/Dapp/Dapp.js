import React from "react";
import classes from './Dapp.module.css';
import * as ROUTES from '../../constants/routes';
import * as actionTypes from '../../store/actionTypes';
import { connect } from 'react-redux';
import { withFirebase } from '../../firebase/index';

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
import FundingDao from '../FundingDao/FundingDao';

import onMobile from '../../util/detectMobile';

import { daiAbi, rinkebyDaiAddress } from '../../constants/tokenData';

const HARDHAT_NETWORK_ID = '31337';
const KOVAN_NETWORK_ID = '42'
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
                  <Route path={ROUTES.FUNDING_DAO} component={FundingDao}/>
                  <Route path={ROUTES.CREATE} render = {() => <CreateProject selectedAddress={this.state.selectedAddress}/>}/>
                  <Route path={ROUTES.ACCOUNT} render = {() => <AccountPage selectedAddress={this.state.selectedAddress}/>}/>
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
  }

  _connectWallet =  async () => {
    // This method is run when the user clicks the Connect. It connects the
    // dapp to the user's wallet, and initializes it.

    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.
    const [selectedAddress] = await window.ethereum.enable();
    // Once we have the address, we can initialize the application.

    // First we check the network
    if (!this._checkNetwork()) {
      return;
    }

    this._initialize(selectedAddress);

    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", ([newAddress]) => {
      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the "Connected
      // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      // To avoid errors, we reset the dapp state 
      if (newAddress === undefined) {
        this.props.disconnectWallet();
        return;
      }
      
      this._initialize(newAddress);
    });
    
    // We reset the dapp state if the network is changed
    window.ethereum.on("networkChanged", ([networkId]) => {
      this.props.resetState();
      this.props.setNetworkID(networkId);
    });
  }

  _initialize(userAddress) {

    this.props.connectWallet(userAddress);

    // FETCH USER INFORMATION HERE

    this._intializeEthers();
  }

  async _intializeEthers() {
    // We first initialize ethers by creating a provider using window.ethereum
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    this.props.connectProvider(provider);

    const rinkebyDai = new ethers.Contract(rinkebyDaiAddress, daiAbi, provider);
    const rinkebyDaiWithSigner = rinkebyDai.connect(provider.getSigner());
    this.props.connectDaiContract(rinkebyDaiWithSigner);

    // INITIALISE CONTRACTS HERE
  }

  // This is an utility method that turns an RPC error into a human readable
  // message.
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
const mapStateToProps = null;

const mapDispatchToProps = dispatch => ({
  connectProvider     : provider        => dispatch({type : actionTypes.connectProvider, provider : provider}),
  connectWallet       : selectedAddress => dispatch({type : actionTypes.connectWallet, selectedAddress : selectedAddress}),
  connectDaiContract  : contract        => dispatch({type : actionTypes.connectDaiContract, contract : contract}),
  disconnectWallet    : ()              => dispatch({type : actionTypes.disconnectWallet}),
  resetState          : ()              => dispatch({type : actionTypes.resetState}),
  setNetworkID        : networkId              => dispatch({type : actionTypes.setNetworkID, id : networkId}),
})

export default connect(mapStateToProps, mapDispatchToProps)(withFirebase(Dapp));