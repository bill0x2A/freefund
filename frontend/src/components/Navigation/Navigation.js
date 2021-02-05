import React from 'react';
import {Link} from 'react-router-dom';
import classes from './Navigation.module.css';
import * as ROUTES from '../../constants/routes';
import blockies from 'ethereum-blockies';

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
    const icon = blockies.create({
        seed : selectedAddress
    }).toDataURL()

    const displayAddress = selectedAddress.substring(0, 4) + '...' + selectedAddress.substring( 35, selectedAddress.length-1)
    return(
        <div className={classes.WalletInfo}>
            <p>{displayAddress}</p>
            <img src ={icon}/>
        </div>
    )

}

const Navigation = ({ selectedAddress, connectWallet }) => {
    
    return (
        <div className={classes.Navigation}>
            {window.ethereum === undefined && <NoWalletDetected/>}
            <div className ={classes.Navbar}>
                <h2>FREEFUND</h2>
                <div className={classes.RightNav}>
                    <Link to = {ROUTES.PROJECTS} className={classes.NavItem}>Browse Projects</Link>
                    <Link to = {ROUTES.CREATE} className={classes.NavItem}>Create Project</Link>
                    {!selectedAddress ? <div onClick={() => connectWallet()}
                                              className = {classes.ConnectWalletButton}
                                              >Connect Wallet</div> :
                                        <WalletInfo selectedAddress={selectedAddress}/>
                                        }
                </div>
            </div>
        </div>
    )
}
   

  export default Navigation;