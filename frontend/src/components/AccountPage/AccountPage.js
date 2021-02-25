import React, { useState } from 'react'
import classes from './AccountPage.module.css';

import NoAddress from '../NoAddress/NoAddress';
import ReactFlagsSelect from 'react-flags-select';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import ProjectCard from '../ProjectCard/ProjectCard';
import Loading from '../Loading/Loading';
import ReactTooltip from 'react-tooltip';
import ImgCropper from './ImgCropper/ImgCropper';
import * as actionTypes from '../../store/actionTypes';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { register } from '../../mongo/mongo';



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
            imgHash : "QmVLKVhG5VNfpXDfUpa81xpHR7TmCtUx3rtoEewkAowZse",
            submitting : false,
        }
    }

    onChange = (e) => {
        this.setState({[e.target.name] : e.target.value});
    }

    handleCrop = crop => {
        this.setState({crop});
    }

    handleNewImage = file => {
        var fr = new FileReader();
        fr.onload = () => {
            this.setState({image : fr.result, newProfilePicture : true});
        }
        fr.readAsDataURL(file);
    }

    uploadImage = async () => {
        console.log("Uploading image")

        const blob = await getCroppedImg(this.state.image, this.state.crop);
        console.log(this.state.image)

        // Testing only
        // const img = await blobToURL(blob);
        // this.setState({testImg : img});

        const arrayBuffer = await blob.arrayBuffer()
        const buffer = arrayBufferToBuffer(arrayBuffer);
        console.log(buffer);

        await ipfs.add(buffer)
                .then((result, error) => {
                    if(!error){
                        this.setState({imgHash : result.path});
                        console.log("IPFS: ", result.path)
                    } else {
                        console.log(error)
                    }
                })
    }

    componentDidMount = () => {
        this.setState({...this.props.user})
    }
    
    onSubmit = async () => {
        this.setState({submitting : true});
        if(this.state.newProfilePicture){
            await this.uploadImage();
        }
        const userData = {
            address : this.props.selectedAddress,
            email : this.state.email,
            firstName  : this.state.firstName,
            lastName : this.state.lastName,
            bio   : this.state.bio,
            countryCode : this.state.country,
            imgHash : this.state.imgHash,
        }

        const data = await register(userData);
        console.log("TOKEN", data?.token);
        this.props.setToken(data?.token)

        this.props.history.push('/')
    }

    render = () => {
        let disabled = false;
        const {email, firstName, lastName, countryCode, submitting} = this.state;
        if(!email || !firstName || !lastName || !countryCode){
            disabled = true;
        }

        let submitButton = (
            <div 
                className={classes.SubmitButton}
                onClick={this.onSubmit}
                >Submit
            </div>
        )
        if(disabled){
            submitButton = (
                <div 
                    className={classes.SubmitButton}
                    style ={{background : "gray", cursor: "none"}}
                    >Please fill out all required fields
                </div>
            )
        }
        if(submitting){
            submitButton = <Loading/>
        }
        return(
            <div className ={classes.AccountPage}>
                {!this.props.user ? <NoAddress/> :
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
                                selected={this.state.countryCode}
                                onSelect={countryCode => this.setState({countryCode})}
                            />
                        </div>
                        <div className={classes.Box}>
                            <h3>Profile Picture</h3>
                            <ImgCropper
                                imgHash={this.state.imgHash}
                                sendCrop={this.handleCrop}
                                handleNewImage={this.handleNewImage}
                            />
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

// #### Image cropping code ####

var isArrayBufferSupported = (new Buffer(new Uint8Array([1]).buffer)[0] === 1);

var arrayBufferToBuffer = isArrayBufferSupported ? arrayBufferToBufferAsArgument : arrayBufferToBufferCycle;

function arrayBufferToBufferAsArgument(ab) {
  return new Buffer(ab);
}

function arrayBufferToBufferCycle(ab) {
  var buffer = new Buffer(ab.byteLength);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
      buffer[i] = view[i];
  }
  return buffer;
}

function getCroppedImg(imageSrc, crop) {
    let image = new Image();
    image.src = imageSrc;
    const canvas = document.createElement('canvas');
    canvas.style.display = "none";
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
   
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );
   
    // As Base64 string
    // const base64Image = canvas.toDataURL('image/jpeg');
   
    // As a blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        resolve(blob);
      }, 'image/jpeg', 1);
    });
  }

  const blobToURL = (blob) => {
    return new Promise(resolve => {
      const url = URL.createObjectURL(blob)
      resolve(url);
    })
  }

const mapStateToProps = state => ({
    selectedAddress : state.selectedAddress,
    user : state.user,
})

const mapDispatchToProps = dispatch => ({
    setToken : tokenId => dispatch({type : actionTypes.setToken, token : tokenId}),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AccountPage));
