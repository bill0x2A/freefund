import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import classes from './Navigation.module.css';
import * as ROUTES from '../../constants/routes';
import jazzicon from '@metamask/jazzicon';
import identicon from 'identicon';
import { connect } from 'react-redux';
import circle from '../../assets/circle.png';
import cheating from '../../assets/cheating.png';


const NoWalletDetected = () => (
    <div className = {classes.NoWallet}>
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

const WalletInfo = ({selectedAddress}) => {
    let icon = new Image();
    identicon.generate({ id: 'ajido', size: 150 }, function(err, buffer) {
        if (err) throw err;
        icon.src = buffer;
    });
    const displayAddress = selectedAddress.substring(0, 4) + '...' + selectedAddress.substring( 35, selectedAddress.length-1)
    return(
        <Link
            className={classes.WalletInfo}
            to={ROUTES.ACCOUNT}
        >
            <p>{displayAddress}</p>
            <img src={cheating}/>
        </Link>
    )

}

const Navigation = props => {
    const {selectedAddress, connectWallet} = props;
    console.log(selectedAddress, connectWallet)
    return (
        <div className={classes.Navigation}>
            {window.ethereum === undefined && <NoWalletDetected/>}
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
})

const mapDispatchToProps = dispatch => ({

})

  export default connect(mapStateToProps, mapDispatchToProps)(Navigation);