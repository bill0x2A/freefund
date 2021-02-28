import React from 'react';
import classes from './CreateProject.module.css';

import NoAddress from '../NoAddress/NoAddress';
import Loading from '../Loading/Loading';
import MarkdownEditor from './MarkdownEditor/MarkdownEditor';
import Tier from './Tier/Tier';
import TxInfo from '../TxInfo/TxInfo';
import DateTimePicker from 'react-datetime-picker'
import Modal from '../hoc/ModalContainer/ModalContainer';
import ImageCropper from '../ImgCropper/ImgCropper';
import { arrayBufferToBuffer, blobToURL, getCanvasBlob, createCanvas, fileToDataUri } from '../../util/imageProcessing';
import placeholderImage from '../../assets/placeholderImage.png';
import { Icon, InlineIcon } from '@iconify/react';
import closeLine from '@iconify-icons/clarity/close-line';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { addProject } from '../../mongo/mongo';
import { ethers } from 'ethers';

import DAI from '../../assets/DAI.png';

import ipfsClient from 'ipfs-http-client';
import ImgCropper from '../ImgCropper/ImgCropper';
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

class CreateProject extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            imgHashes: [],
            imgBuffers: [],
            fileNames : [],
            tiers : [],
            submitting : false,
            test : false,
        }
    }

    onChange = (e) => {
        this.setState({[e.target.name] : e.target.value});
    }

    addTierHandler = () => {
        const emptyTier = {
            description : "",
            funding : undefined,
        };
        let tiers = [...this.state.tiers];
        tiers.push(emptyTier);
        this.setState({ tiers });
    }

    removeTierHandler = index => {
        console.log(index);
        this.setState(prevState => {
            prevState.tiers.splice(index, 1)
            return { tiers : prevState.tiers }
        });
    }

    onChangeDesc = (e, index) => {
        this.setState(prevState => {
            let tiers = prevState.tiers;
            tiers[index].description = e.target.value
            return { tiers }
        })
    }

    onChangeFunding = (e, index) => {
        this.setState(prevState => {
            let tiers = prevState.tiers;
            tiers[index].funding = e.target.value;
            return { tiers }
        })
    }    

    dateTimeChangeHandler = (value) => {
        const date = new Date(value);
        const utc = date.toUTCString();
        this.setState({endTime : utc});
    }
    
    handleEditorChange = ({html, text}) => { 
        const markdown = {
            html : html,
            text : text,
        }
        this.setState({description : markdown});
    }

    onSubmit = async () => {
        this.setState({submitting : true});

        await this.uploadImages();

        let {fundingLimit, endTime} = this.state;
        const endTimeDate = new Date(endTime);
        
        // #### SC Constructor variables ####
        // parseInt is needed to prevent BigNumber conversion errors
        let endTimeSC = parseInt(endTimeDate.getTime()/1000);
        let timeNow = new Date();
        let startTimeSC = parseInt(timeNow.getTime()/1000);
        let targetSC = fundingLimit.toString();

        /*
            https://www.unixtimestamp.com/index.php
            Human Readable Unix timestamp converter
                Time                    Seconds
                1 Hour	                3600 Seconds
                1 Day	                86400 Seconds
                1 Week	                604800 Seconds
                1 Month (30.44 days)	2629743 Seconds
                1 Year (365.24 days)	31556926 Seconds
        */

        // 1. Creator submits data in FE
        // 2. onclick data is send to ... ? 
        // 3. Depoloy SC
        // 4. Get SC address, ABI, maybe bytecode?
        // 5. Send to BE database.
        
        // 6. Project ended, check:
        // 7. if balance < target then revert tx
        // 8. else balance >= target, creator can withdraw funds
        // 9. timer if creator does not withdraw within 60 days, also revert

        ////////////////// Nino: Variables requied to initialize SC
        // creator address = this.props.user.address
        // startTime is automated onSubmit
        // endTime = endTimeSC
        // target =  fundingLimit

        ///////////////// FE 

        ////////////////// Nino: Once the SC is created, return variables to FE
        // smartContractAddress = 0xSC123....
        // supporter can send DAI directly to the SC 0xSC123...
        // 

        try {
            // If a transaction fails, we save that error in the component's state.
            // We only save one such error, so before sending a second transaction, we
            // clear it.
            this._dismissTransactionError();
      
            // We send the transaction, and save its hash in the Dapp's state. This
            // way we can indicate that we are waiting for it to be mined.
            const contract = await this.props.factory.deploy(targetSC, endTimeSC);
            const contractTx = contract.deployTransaction;
            this.setState({ txBeingSent: contractTx.hash });
      
            // We use .wait() to wait for the transaction to be mined. This method
            // returns the transaction's receipt.
            const receipt = await contractTx.wait();
      
            // The receipt, contains a status flag, which is 0 to indicate an error.
            if (receipt.status === 0) {
              // We can't know the exact error that make the transaction fail once it
              // was mined, so we throw this generic one.
              throw new Error("Transaction failed");
            }
      
            // ~~~ TX SUCCESSFUL ~~~

            // Format variables for database
            const { title, imgHashes, description, fundingLimit, tiers } = this.state;
            const project = {
                    title : title,
                    creatorAddress : this.props.user.address,
                    fundingAddress : contract.address,
                    imgHashes : imgHashes,
                    description : description,
                    fundingLimit : fundingLimit.toString(), 
                    funding : "0",
                    tiers : tiers,
                    funders : [],
                    token : this.props.token,
                }
            console.dir(project);
            // Send project data to backend
            const { data, response } = await addProject(project);
            if(response.ok){
                this.setState({ projectID : data.id }, () => {
                    // One we have the response from the backend show a completed tx
                    this.setState({ txSuccess : true, sentTx : contractTx.hash })
                });
            } else {
                // Handle the error with a lovely litte popup
                console.log("Something went wrong");
            }

            
          } catch (error) {
            // We check the error code to see if this error was produced because the
            // user rejected a tx. If that's the case, we do nothing.
            if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
              return;
            }
            
            // Handle the error by displaying it to the user, allow the user to try again.
            console.error(error);
            this.setState({ txError: error, submitting : false });
          } finally {
            // If we leave the try/catch, we aren't sending a tx anymore, so we clear
            // this part of the state.
            this.setState({ txBeingSent: undefined });
          }
    }

    _dismissTransactionError() {
        this.setState({ txError: undefined });
    }  

    captureFiles = async (e) => {
        e.preventDefault();
        const files = e.target.files;
        console.dir(files)
        for (const file of files){
            const reader = new window.FileReader();
            reader.readAsArrayBuffer(file)
            reader.onloadend = () => {
                this.setState(prevState => ({
                    imgBuffers : prevState.imgBuffers.push(Buffer(reader.result)),
                    filenames : prevState.fileNames.push(file.name),
                }));
            };
        }
    };
    
    uploadImages = async () => {
        // Takes all image buffers in state and uploads them to to ipfs, storing the hashes in state.
        let imgHashes = [];
        for(const imgBuffer of this.state.imgBuffers){
            await ipfs.add(imgBuffer)
                    .then((result, error) => {
                        if(!error){
                            imgHashes.push(result.path)
                        } else {
                            console.log(error)
                        }
                    })
        }
        this.setState({imgHashes});
    }

    checkUser = () => {
        // Replace with token logic
    }

    captureFile = async e => {
        e.preventDefault();
        const file = e.target.files[0];
        const reader = new window.FileReader();

        const dataURL = await fileToDataUri(file);
        reader.readAsArrayBuffer(file)
    
        reader.onloadend = () => {
            console.log(dataURL)
            this.setState({imgBuffer : Buffer(reader.result), editing : dataURL});
        };
    }

    onSubmitCrop = async crop => {
        const canvas = createCanvas(this.state.editing, crop);
        const blob = await getCanvasBlob(canvas);
        const url = await blobToURL(blob);
        const arrayBuffer = await blob.arrayBuffer()
        const buffer = Buffer.from(arrayBufferToBuffer(arrayBuffer));
        this.setState({processedImage : url, imgBuffer : buffer, editing : undefined});
    }

    componentDidMount(){
        this.checkUser();
    }

    render(){
        
        let disabled = false;
        const { title,
                description,
                tags,
                fundingLimit,
                endTime,
                fileNames,
                submitting,
                tiers,
                txError,
                txBeingSent,
                txSuccess,
                sentTx,
                projectID,
            } = this.state;

        if(!title || !description || !tags || !fundingLimit, !endTime){
            disabled = true;
        }

        if(this.state.test){
            disabled = false;
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
                    >Please fill out all fields
                </div>
            )
        }
        if(submitting){
            submitButton = <Loading/>
        }

        let imageMessage = <span>Drag images here</span>;
        if(fileNames.length > 0){
            imageMessage = <React.Fragment>{fileNames.map(fileName => <p>{fileName}</p>)}</React.Fragment>
        }
        console.log(this.state.editing);
        return (
            <div className={classes.CreateProject}>
                {this.state.editing && (
                    <Modal>
                        <ImgCropper newImg={this.state.editing} close = {() => this.setState({editing : undefined})} submit = {this.onSubmitCrop}/>
                    </Modal>
                )}
                {!this.props.selectedAddress ? <NoAddress/> : 
                    <React.Fragment>
                        <div className={classes.Box}>
                            <h2>Create New Project</h2>
                            <p>This is how you're going to sell your idea to the world! Make sure to include a comprehensive, well formatted description and add some great images to get your funders excited.</p>
                        </div>
                        <div className={classes.Box}>
                            <h3>Title</h3>
                            <input
                                type='text'
                                placeholder="Project Title"
                                name="title"
                                onChange={this.onChange}
                            />
                        </div>
                        <div className={classes.Box}>
                            <h3>Tagline</h3>
                            <p>One sentence to summarise your project.</p>
                            <input
                                type='text'
                                placeholder="Tagline"
                                name="tagline"
                                onChange={this.onChange}
                            />
                        </div>
                        <div className={classes.Box}>
                            <h3>Description</h3>
                            <MarkdownEditor handleEditorChange={(html, text) => this.handleEditorChange(html, text)}/>
                        </div>
                        <div className={classes.Box}>
                            <h3>How much are you asking for?</h3>
                            <div className={classes.Payment}>
                                <input 
                                    type="number"
                                    name="fundingLimit"
                                    placeholder="Funding"
                                    onChange={this.onChange}
                                />
                                <span>DAI <img src={DAI}/></span>
                            </div>
                            </div>
                            <div className={classes.Box}>
                                <h3>Contribution Tiers</h3>
                                <div
                                    className={classes.AddTier}
                                    onClick = {this.addTierHandler}
                                    >Add Tier
                                </div>
                                <div className={classes.Tiers}>
                                   {!(tiers.length > 0) ?
                                    <div className={classes.NoTiersContainer}>
                                        <p>No Tiers Yet</p>
                                    </div> : 
                                    <React.Fragment>
                                        {tiers.map((tier, index) => <Tier
                                                onRemove = {this.removeTierHandler}
                                                onChangeDesc = {this.onChangeDesc}
                                                onChangeFund = {this.onChangeFunding}
                                                tier = {tier}
                                                index = {index}
                                                key = {index}
                                            />)}
                                    </React.Fragment>
                                    }
                                </div>
                            </div>
                            <div className={classes.Box}>
                                <h3>Upload a Header Image</h3>
                                <p>Make this the most exciting representation of your  project, it's the first impression your funders will have</p>
                                <div className={classes.ImageUploadContainer}>
                                    <img src = {this.state.processedImage || placeholderImage}/>
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
                            <div className={classes.Box}>
                                <h3>Upload More Images</h3>
                                <div className={classes.ImagesUpload}>
                                    <input
                                        type='file'
                                        multiple
                                        accept=".jpg, .jpeg, .png, .bmp, .gif"
                                        onChange={this.captureFiles}
                                    />
                                    {imageMessage}
                                </div>
                            </div>
                            <div className={classes.Box}>
                                <h3>End of funding period</h3>  
                                <DateTimePicker
                                    onChange = {this.dateTimeChangeHandler}
                                    value = {this.state.endTime && new Date(this.state.endTime)}
                                    className={classes.DateTime}
                                />
                            </div>
                            {/* <div className={classes.Box}>
                                <h3>Add Some Tags</h3>
                                <input
                                    type='text'
                                    placeholder="Separate your tags with a comma"
                                    name="tags"
                                    onChange={this.onChange}
                                />
                            </div> */}
                            <div className={classes.SubmitContainer}>
                                { ((!txBeingSent && !txSuccess && !sentTx) || txError) && 
                                    submitButton
                                }
                            </div>
                            <TxInfo 
                                    txError={txError}
                                    address={this.props.user?.address}
                                    txBeingSent={txBeingSent}
                                    txSuccess={txSuccess}
                                    sentTx={sentTx}
                                    projectID={projectID}
                                    create
                            />
                    </React.Fragment>
                }
            </div>
        )
    }
    
}

const mapStateToProps = state => ({
    selectedAddress : state.selectedAddress,
    token : state.token,
    mainContract : state.mainContract,
    factory : state.factory,
    user : state.user,
})

export default connect(mapStateToProps, null)(withRouter(CreateProject));
