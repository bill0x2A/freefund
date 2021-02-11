import React from 'react';
import ReactDOM, { render } from 'react-dom';
import {Link} from 'react-router-dom';
import classes from './Navigation.module.css';
import * as ROUTES from '../../constants/routes';
import jazzicon from '@metamask/jazzicon';
import identicon from 'identicon';
import { connect } from 'react-redux';
import { withFirebase } from '../../firebase/index';
import circle from '../../assets/circle.png';
import defaultpp from '../../assets/defaultpp.png';
import Loading from '../Loading/Loading';


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
 
class WalletInfo extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading : true,
            image : defaultpp,
        }
    }

    componentDidMount(){
        this.setProfilePicture()
    }
    
    setProfilePicture = () => {
        const selectedAddress = this.props.selectedAddress;
        const displayAddress = selectedAddress.substring(0, 4) + '...' + selectedAddress.substring( 35, selectedAddress.length-1)
        let image = defaultpp;
        this.props.firebase.user(selectedAddress).on("value", snap => {
            const data = snap.val();
            if(data.profileHash){
                const image = `https://ipfs.infura.io/ipfs/${data.profileHash}`
                this.setState({ image, displayAddress: displayAddress, loading:false })
            } else {
                this.setState({image : image, displayAddress : displayAddress, loading : false})
            }
        })
        
    }
    render(){
        return(
            <React.Fragment>
                {
                    this.state.loading ? <Loading/> : 
                        <Link
                            className={classes.WalletInfo}
                            to={ROUTES.ACCOUNT}
                        >
                            <p>{this.state.displayAddress}</p>
                            <img src={this.state.image}/>
                        </Link>
                }
            </React.Fragment>

        )
    }

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
                                        <WalletInfo 
                                            firebase={props.firebase}
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
})

const mapDispatchToProps = dispatch => ({

})

  export default connect(mapStateToProps, mapDispatchToProps)(withFirebase(Navigation));