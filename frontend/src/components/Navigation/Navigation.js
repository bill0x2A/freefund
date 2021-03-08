import React from 'react';
import ReactDOM, { render } from 'react-dom';
import {Link} from 'react-router-dom';
import classes from './Navigation.module.css';
import * as ROUTES from '../../constants/routes';
import { connect } from 'react-redux';
import defaultpp from '../../assets/defaultpp.png';
import svgLogo from '../../assets/logo.svg';
import alpha from '../../assets/alpha.png';
import Loading from '../Loading/Loading';
import homeFilled from '@iconify-icons/ant-design/home-filled';
import { InlineIcon } from '@iconify/react';


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

const NetworkAlert = ({networkID, mobile}) => {

    if(mobile){
        return null;
    }

    let alertText;

    if(!networkID){
        return null;
    }
    const id = parseInt(networkID);

    switch(id){
        case 1:
            alertText = "WARNING : Connected to Ethereum Mainnet, please switch to Rinkeby Testnet";
            break;
        case 3:
            alertText = "Connected to Ropsten Testnet, please switch to Rinkeby Testnet";
            break;
        case 5:
            alertText = "Connected to Goerli Testnet, please switch to Rinkeby Testnet";
            break;       
        case 4:
            return null; 
        case 2018:
            alertText = "Connected to Dev Testnet, please switch to Rinkeby Testnet";
            break;
        case 42:
            alertText = "Connected to Kovan Testnet, please switch to Rinkeby Testnet";
            break;
        default:
            alertText = `Connected to network with ID : ${id}`;
            break;                
    }

    return(
        <div className={classes.Alert}>
            {alertText}
        </div>
    )

}

const WalletInfo = ({user}) => {
    const displayAddress = user?.address.substring(0, 4) + '...' + user?.address.substring( 35, user?.address.length-1)
    const profilePicture = user?.imgHash ? `https://ipfs.infura.io/ipfs/${user.imgHash}` : defaultpp
    return (
            <React.Fragment>
                {
                    !user ? (window.ethereum ? <Loading/> : null) : 
                        <Link
                            className={classes.WalletInfo}
                            to={ROUTES.ACCOUNT}
                        >
                            <p>{displayAddress}</p>
                            <img src={profilePicture}/>
                        </Link>
                }
            </React.Fragment>
    )
}

const Navigation = props => {
    const {selectedAddress, connectWallet, user, mobile} = props;
    return (
        <div className={classes.Navigation}>
            {window.ethereum === undefined && <NoWalletDetected/>}
            <NetworkAlert networkID={props.networkID} mobile={mobile}/>
            <div className ={classes.Navbar}>
                <Link
                    className={classes.Logo}
                    to={ROUTES.LANDING}
                >
                    <img src={alpha}/>
                    {/* <h2>FREEFUND</h2> */}
                </Link>
                <div className={classes.RightNav}>
                    {!mobile && <Link to = {ROUTES.HOME} className={classes.NavItem}><InlineIcon icon={homeFilled}/></Link>}
                    {user &&
                        <Link to = {ROUTES.CREATE} className={classes.NavItem}>Create Project</Link>}
                    {(!selectedAddress && window.ethereum) ? <div onClick={connectWallet}
                                              className = {classes.ConnectWallet}
                                              >Connect Wallet</div> :
                                        <WalletInfo 
                                            user={user}
                                            selectedAddress={selectedAddress}
                                        />
                                        }
                </div>
            </div>
        </div>
    )
}
   
const mapStateToProps = state => ({
    selectedAddress : state.selectedAddress,
    networkID       : state.networkID,
    user           : state.user,
    mobile : state.mobile,
})

const mapDispatchToProps = dispatch => ({

})

  export default connect(mapStateToProps, mapDispatchToProps)(Navigation);