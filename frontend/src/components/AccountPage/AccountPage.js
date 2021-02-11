import React from 'react'
import classes from './AccountPage.module.css';
import NoAddress from '../NoAddress/NoAddress';
import ReactFlagsSelect from 'react-flags-select';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import ProjectCard from '../ProjectCard/ProjectCard';
import Loading from '../Loading/Loading';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import { withFirebase } from '../../firebase/index';
import {withRouter} from 'react-router-dom';
import ipfsClient from 'ipfs-http-client';
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

const Required = () => (
    <span data-tip="required field">*</span>
)

class AccountPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            bio : "",
            profileHash : "QmVLKVhG5VNfpXDfUpa81xpHR7TmCtUx3rtoEewkAowZse",
            submitting : false,
        }
    }

    loadUserData = () => {
        this.props.firebase.user(this.props.selectedAddress)
        .once("value", snap => {
            const data = snap.val();
            const accountData = {
                ...data,
                projects : (data.projects ? [...Object.keys(data.projects)] : null),
            }
            console.log(accountData);
            this.setState({...accountData});
        })
    }

    onChange = (e) => {
        this.setState({[e.target.name] : e.target.value});
    }

    captureFile = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        const reader = new window.FileReader();
    
        reader.readAsArrayBuffer(file)
    
        reader.onloadend = () => {
            this.setState({imgBuffer : Buffer(reader.result), newProfilePicture : true});
        };
    }

    uploadImage = async () => {
            await ipfs.add(this.state.imgBuffer)
                    .then((result, error) => {
                        if(!error){
                            this.setState({profileHash : result.path});
                            console.log("IPFS: ", result.path)
                        } else {
                            console.log(error)
                        }
                    })
    }

    componentDidMount = () => {
        this.loadUserData();
    }
    
    onSubmit = async () => {
        this.setState({submitting : true});
        if(this.state.newProfilePicture){
            await this.uploadImage();
        }
        const userData = {
            email : this.state.email,
            firstName  : this.state.firstName,
            lastName : this.state.lastName,
            bio   : this.state.bio,
            country : this.state.country,
            profileHash : this.state.profileHash,
        }
        this.props.firebase.user(this.props.selectedAddress).set(userData);
        this.props.history.push('/')
    }

    render = () => {
        let disabled = false;
        const {email, firstName, lastName, country, submitting} = this.state;
        if(!email || !firstName || !lastName || !country){
            disabled = true;
        }

        let submitButton = (
            <div 
                className={classes.SubmitButton}
                onClick={this.onSubmit}
            >Submit</div>
        )
        if(disabled){
            submitButton = (
                <div 
                    className={classes.SubmitButton}
                    style ={{background : "gray", cursor: "none"}}
                >Please fill out all required fields</div>
            )
        }
        if(submitting){
            submitButton = <Loading/>
        }
        return(
            <div className ={classes.AccountPage}>
                {!this.props.selectedAddress ? <NoAddress/> :
                    <React.Fragment>
                        {this.state.errorMessage && <ErrorMessage message={this.state.errorMessage}/>}
                        <div className={classes.Box}>
                            <h2> Account Information </h2>
                            <p>Before you are able to fund or create projects, we need to know a little bit about you first. Please fill in the form below.</p>
                        </div>
                        <div className={classes.Box}>
                            <h3>Email<Required/></h3>
                            <input
                                type='text'
                                placeholder="Your email address"
                                name="email"
                                onChange={this.onChange}
                                value={this.state.email}
                            />
                        </div>
                        <div className={classes.Box}>
                            <h3>Name<Required/></h3>
                            <div style={{width: "100%", display: "flex"}}>
                                <input
                                    type='text'
                                    placeholder="First name"
                                    name="firstName"
                                    onChange={this.onChange}
                                    value={this.state.firstName}
                                    style={{borderRight: "none"}}
                                />
                                                            <input
                                    type='text'
                                    placeholder="Last name"
                                    name="lastName"
                                    onChange={this.onChange}
                                    value={this.state.lastName}
                                />
                            </div>
                        </div>
                        <div className={classes.Box}>
                            <h3>Bio</h3>
                            <textarea
                                type='text'
                                placeholder="A short description of yourself"
                                name="bio"
                                onChange={this.onChange}
                                value={this.state.bio}
                            />
                        </div>
                        <div className={classes.Box}>
                            <h3>Country<Required/></h3>
                            <ReactFlagsSelect
                                selected={this.state.country}
                                onSelect={country => this.setState({country})}
                            />
                        </div>
                        <div className={classes.Box}>
                            <h3>Profile Picture</h3>
                            <div className={classes.ImageUploadContainer}>
                                <img src = {`https://ipfs.infura.io/ipfs/${this.state.profileHash}`}/>
                                <div className={classes.ImageUpload}>
                                    <input
                                        type='file'
                                        accept=".jpg, .jpeg, .png, .bmp, .gif"
                                        onChange={this.captureFile}
                                    />
                                    <p>Drag image here</p>
                                </div>
                            </div>
                        </div>
                        <div className={classes.SubmitContainer}>
                            {submitButton}
                        </div>
                        <div className={classes.Box}>
                            <h2> My Projects </h2>
                        </div>

                        {this.state.projects ? this.state.projects.map(project => <div style={{marginBottom: "20px"}}><ProjectCard projectID = {project}/></div>) : <div className={classes.Box}><p style = {{textAlign: "center"}}>No projects yet!</p></div>}
                        <ReactTooltip/>
                    </React.Fragment>
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    selectedAddress : state.selectedAddress,
})

export default connect(mapStateToProps, null)(withFirebase(withRouter(AccountPage)));