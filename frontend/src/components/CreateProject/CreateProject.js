import React from 'react';
import classes from './CreateProject.module.css';
import NoAddress from '../NoAddress/NoAddress';
import MarkdownEditor from './MarkdownEditor/MarkdownEditor';
import { connect } from 'react-redux';
import { withFirebase } from '../../firebase/index';
import { withRouter } from 'react-router-dom';
import DAI from '../../assets/DAI.png';
import DateTimePicker from 'react-datetime-picker'
import testpp from '../../assets/testpp.png'
import ipfsClient from 'ipfs-http-client';
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

class CreateProject extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            project : {},
            imageHashes: [],
            imgBuffers: [],
        }
    }


    onChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        console.log({name , value});
        this.setState({[e.target.name] : e.target.value});
    }

    dateTimeChangeHandler = (value) => {
        const date = new Date(value);
        console.log(date);
        this.setState({endTime : date}, () => console.log(this.state.endTime));
    }
    
    handleEditorChange = ({html, text}) => { 
        const markdown = {
            html : html,
            text : text,
        }
        this.setState({description : markdown});
    }

    onSubmit = async () => {

        //Format tags as an array of lowercase strings, removing 
        await this.uploadImages();

        const projectID = Math.random().toString(36).substr(2, 9);
        const { title, description, t1desc, t2desc, t3desc, t1funding, t2funding, t3funding, tags, imgHashes, fundingLimit, endTime} = this.state;
        
        const project = {
            ...this.state.project,
            title : title,
            description : description,
            t1desc : t1desc,
            t2desc : t2desc,
            t3desc : t3desc,
            t1funding : t1funding,
            t2funding : t2funding,
            t3funding : t3funding,
            fundingLimit : fundingLimit,
            creatorAddress : this.props.selectedAddress,
            imgHashes : imgHashes,
            funded : 0,
            endTime : endTime,
        }


        // We will leave out tags for now....

        // if(this.state.tags.length > 0){
        //     let tags = this.state.tags.split(',')
        //     //note make this recursive
        //     tags = tags.map(tag => {
        //         if(tag[0] === ' '){
        //             tag = tag.substring(1);
        //         }
        //         if(tag[tag.length-1] === ' '){
        //             tag = tag.slice(0, -1);
        //         }
        //         return tag.toLowerCase();
        //     })
        // }

        
        this.props.firebase.project(projectID).set(project);
        this.props.firebase.user(this.props.selectedAddress).child('projects').child(projectID).set(projectID);
        this.props.history.push(`/projects/${projectID}`);

    }

    captureFile = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        const reader = new window.FileReader();
    
        reader.readAsArrayBuffer(file)
    
        reader.onloadend = () => {
            let imgBuffers = this.state.imgBuffers;
            imgBuffers.push(Buffer(reader.result))
            this.setState({imgBuffers});
        };
    }
    
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
        this.props.firebase.user(this.props.selectedAddress).once("value", snap => {
            const data = snap.val();
            if(!data){
                this.props.history.push('/account');
                return;
            }
            if(!data.email || !data.firstName || !data.lastName || !data.country){
                this.props.history.push('/account');
                return;
            }
        })
    }

    componentDidMount(){
        this.checkUser();
    }


    
    render(){
        let disabled = false;
        const { title, description, t1desc, t2desc, t3desc, t1funding, t2funding, t3funding, tags, imgHashes, fundingLimit, endTime} = this.state;
        if(!title || !description || !t1desc || !t2desc || !t3desc || !t1funding || !t2funding || !t3funding || !tags || !fundingLimit, !endTime){
            disabled = true;
        }
        
        return (
            <div className={classes.CreateProject}>
                {!this.props.selectedAddress ? <NoAddress/> : 
                    <React.Fragment>
                        <div className={classes.Box}>
                            <h2> Create New Project </h2>
                            <p>This is how you're going to sell your idea to the world! Make sure to include a comprehensive, well formatted description and add some great images to get your potential funders excited about your project.</p>
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
                                <div className={classes.Tiers}>
                                    <div className={classes.Tier}>
                                        <h4>Tier 1</h4>
                                        <textarea
                                            placeholder="Tier Rewards Description"
                                            name="t1desc"
                                            onChange={this.onChange}
                                        />
                                    <div className={classes.Payment}>
                                        <input 
                                            type="number"
                                            name="t1funding"
                                            placeholder="Minimum funding"
                                            onChange={this.onChange}
                                        />
                                        <span>DAI <img src={DAI}/></span>
                                    </div>
                                    </div>
                                    <div className={classes.Tier}>
                                        <h4>Tier 2</h4>
                                        <textarea
                                            placeholder="Tier Rewards Description"
                                            name="t2desc"
                                            onChange={this.onChange}
                                        />
                                     <div className={classes.Payment}>
                                        <input 
                                            type="number"
                                            name="t2funding"
                                            placeholder="Minimum funding"
                                            onChange={this.onChange}
                                        />
                                        <span>DAI <img src={DAI}/></span>
                                    </div>
                                    </div>
                                    <div className={classes.Tier}>
                                        <h4>Tier 3</h4>
                                        <textarea
                                            placeholder="Tier Rewards Description"
                                            name="t3desc"
                                            onChange={this.onChange}
                                        />
                                    <div className={classes.Payment}>
                                        <input 
                                            type="number"
                                            name="t3funding"
                                            placeholder="Minimum funding"
                                            onChange={this.onChange}
                                        />
                                        <span>DAI <img src={DAI}/></span>
                                    </div>
                                    </div>
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
                                    <p>Drag Files here</p>
                                </div>
                            </div>
                            <div className={classes.Box}>
                                <h3>End of funding period</h3>
                                <DateTimePicker
                                    onChange = {this.dateTimeChangeHandler}
                                    value = {this.state.endTime}
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
                                {disabled ? 
                                <div 
                                    className={classes.SubmitButton}
                                    style ={{background : "gray", cursor: "none"}}
                                >Please fill out all fields</div> :
                                    <div 
                                        className={classes.SubmitButton}
                                        onClick={this.onSubmit}
                                    >Submit</div>
                                }
                            </div>
                    </React.Fragment>
                }
            </div>
        )
    }
    
}

const mapStateToProps = state => ({
    selectedAddress : state.selectedAddress,
})

export default connect(mapStateToProps, null)(withFirebase(withRouter(CreateProject)));
