import React from 'react';
import classes from './CreateProject.module.css';

import NoAddress from '../NoAddress/NoAddress';
import Loading from '../Loading/Loading';
import MarkdownEditor from './MarkdownEditor/MarkdownEditor';
import Tier from './Tier/Tier';
import DateTimePicker from 'react-datetime-picker'

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { addProject } from '../../mongo/mongo';
import { ethers } from 'ethers';

import DAI from '../../assets/DAI.png';

import ipfsClient from 'ipfs-http-client';
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

class CreateProject extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            project : {},
            imageHashes: [],
            imgBuffers: [],
            fileNames : [],
            tiers : [],
            submitting : false,
        }
    }

    onChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[e.target.name] : e.target.value});
    }

    addTierHandler = () => {
        const emptyTier = {
            description : null,
            funding : null,
        };
        let tiers = [...this.state.tiers];
        tiers.push(emptyTier);
        this.setState({tiers});
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

        const {fundingLimit, endTime} = this.state;
        const endTimeDate = new Date(endTime);
        console.log("ENDTIME: ", endTime);
        
        // #### SC Constructor variables ####
        const endTimeSC = endTimeDate.getTime()/1000;
        const timeNow = new Date();
        const startTimeSC = timeNow.getTime()/1000;
        const targetSC = ethers.utils.parseUnits(fundingLimit, 18)

        /*
            https://www.unixtimestamp.com/index.php
            Human Readable Unix timestampo converter
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
        console.log({address : this.props.user.address, endTimeSC, startTimeSC, targetSC});
        const contract = await this.props.factory.deploy(this.props.user.address, endTimeSC, startTimeSC, targetSC);
        const contractAddress = contract.address; // Available before deployment

        if(!contractAddress){
            throw new Error("Contract address is not defined, initialisation failed");
        }

        console.log(contract.deployTransaction);

        let receipt;
        try {
            // Try to deploy the contract
            receipt = contract.deployTransaction.wait();
        } catch {
            // Contract deployment failed
        }


        // Format variables for database
        const project = {
            ...this.state.project,
            creatorAddress : contractAddress,
            funding : 0,
            reason : "",
            token : this.props.token,
        }

        // Push project to database
        const { data, response } = await addProject(project);
        if(response.ok){
            this.props.history.push(`/projects/${data.id}`);
        } else {
            // Handle the error with a lovely litte popup
            console.log("Something went wrong");
        }

    }

    captureFile = async (e) => {
        e.preventDefault();
        const files = e.target.files;
        console.dir(files)
        for (const file of files){
            const reader = new window.FileReader();
            reader.readAsArrayBuffer(file)
            reader.onloadend = () => {
                let imgBuffers = this.state.imgBuffers;
                let fileNames = this.state.fileNames;
                imgBuffers.push(Buffer(reader.result))
                fileNames.push(file.name);
                this.setState({imgBuffers : imgBuffers, fileNames : fileNames}, () => console.log(this.state.fileNames));
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

    componentDidMount(){
        this.checkUser();
    }

    render(){
        
        let disabled = false;
        const { title, description, t1desc, t2desc, t3desc, t1funding, t2funding, t3funding, tags, imgHashes, fundingLimit, endTime, fileNames, submitting, tiers} = this.state;
        if(!title || !description || !t1desc || !t2desc || !t3desc || !t1funding || !t2funding || !t3funding || !tags || !fundingLimit, !endTime){
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

        return (
            <div className={classes.CreateProject}>
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
                                    <div style = {{display :"flex", alignItems : "center", justifyContent : "center"}}>
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
                                <h3>Upload Some Images</h3>
                                <div className={classes.ImageUpload}>
                                    <input
                                        type='file'
                                        multiple
                                        accept=".jpg, .jpeg, .png, .bmp, .gif"
                                        onChange={this.captureFile}
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
                                {submitButton}
                            </div>
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
