import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import classes from './Navigation.module.css';
import * as ROUTES from '../../constants/routes';
import jazzicon from '@metamask/jazzicon';
import identicon from 'identicon';
import { connect } from 'react-redux';
import { withFirebase } from '../../firebase/index';
import circle from '../../assets/circle.png';
import cheating from '../../assets/cheating.png';


const NoWalletDetected = () => (
    <div className = {classes.Alert}>
            No Ethereum wallet was detected.
            Please install{" "}
            <a
              href="http://metamask.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              MetaMask
            </a>
            .
    </div>
)

const NetworkAlert = ({networkID}) => {

    let alertText;

    if(!networkID){
        return null;
    }

    switch(networkID){
        case "1":
            alertText = "WARNING : Connected to Ethereum Mainnet, please switch to Rinkeby Testnet";
            break;
        case "3":
            alertText = "Connected to Ropsten Testnet, please switch to Rinkeby Testnet";
            break;
        case "5":
            alertText = "Connected to Goerli Testnet, please switch to Rinkeby Testnet";
            break;       
        case "4":
            return null; 
        case "2018":
            alertText = "Connected to Dev Testnet, please switch to Rinkeby Testnet";
            break;
        case "42":
            alertText = "Connected to Kovan Testnet, please switch to Rinkeby Testnet";
            break;
        default:
            alertText = `Connected to network with ID : ${networkID}`;
            break;                
    }
    return(
        <div className={classes.Alert}>
            {alertText}
        </div>
    )

}
 
const WalletInfo = ({selectedAddress}) => {
    // let icon = new Image();
    // identicon.generate({ id: 'ajido', size: 150 }, function(err, buffer) {
    //     if (err) throw err;
    //     icon.src = buffer;
    // });
    const displayAddress = selectedAddress.substring(0, 4) + '...' + selectedAddress.substring( 35, selectedAddress.length-1)
    let image = cheating;
    return(
        <Link
            className={classes.WalletInfo}
            to={ROUTES.ACCOUNT}
        >
            <p>{displayAddress}</p>
            <img src={image}/>
        </Link>
    )

}

const Navigation = props => {
    const {selectedAddress, connectWallet} = props;
    console.log(selectedAddress, connectWallet)
    return (
        <div className={classes.Navigation}>
            {window.ethereum === undefined && <NoWalletDetected/>}
            <NetworkAlert networkID={"4"}/>
            <div className ={classes.Navbar}>
                <Link
                    className={classes.Logo}
                    to={ROUTES.LANDING}
                >
                    <img src = {circle}/>
                    <h2>FREEFUND</h2>
                </Link>
                <div className={classes.RightNav}>
                    <Link to = {ROUTES.PROJECTS} className={classes.NavItem}>Browse Projects</Link>
                    {selectedAddress &&
                        <Link to = {ROUTES.CREATE} className={classes.NavItem}>Create Project</Link>}
                    {!selectedAddress ? <div onClick={() => connectWallet()}
                                              className = {classes.ConnectWallet}
                                              >Connect Wallet</div> :
                                        <WalletInfo selectedAddress={selectedAddress}/>
                                        }
                </div>
            </div>
        </div>
    )
}
   
const mapStateToProps = state => ({
    selectedAddress : state.selectedAddress,
    networkID       : state.networkID,
})

const mapDispatchToProps = dispatch => ({

})

  export default connect(mapStateToProps, mapDispatchToProps)(withFirebase(Navigation));