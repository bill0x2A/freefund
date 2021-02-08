import React from 'react';
import classes from './CreateProject.module.css';
import NoAddress from '../NoAddress/NoAddress';
import { connect } from 'react-redux';

import ipfsClient from 'ipfs-http-client';
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

class CreateProject extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            tags : [],
            imageHashes: [],
            imgBuffers: [],
        }
    }

    onChange = (e) => {
        this.setState({[e.target.name] : e.target.value});
    }
    
    onSubmit = () => {
        // FORMAT DATA CORRECTLY AND UPLOAD TO MONGO

        //Format tags as an array of lowercase strings, removing 
        let tags = this.state.tags.split(',')
        //note make this recursive
        tags = tags.map(tag => {
            if(tag[0] === ' '){
                tag = tag.substring(1);
            }
            if(tag[tag.length-1] === ' '){
                tag = tag.slice(0, -1);
            }
            return tag.toLowerCase();
        })
        console.log(this.state);
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

    // CHECK THE USER HAS ACCOUNT INFORMATION 
    
    render(){
        return (
            <div className={classes.CreateProject}>
                {!this.props.selectedAddress ? <NoAddress/> : 
                    <React.Fragment>
                        <div className={classes.Box}>
                            <h2><span>[</span> Create New Project <span>]</span></h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eu eros est. Aliquam et odio efficitur, sodales mi id, pretium nisl. Donec suscipit ultrices ligula, in volutpat est pulvinar in. Praesent eu rhoncus felis. Cras odio nibh, faucibus eu sapien vel, faucibus placerat felis. Nullam ultrices faucibus lobortis. Vestibulum a iaculis diam, et tempor augue. Vestibulum fermentum feugiat dui, blandit fringilla risus feugiat a. Cras sed nisi accumsan, rutrum risus nec, porttitor velit. Proin ultricies ornare dui eget mollis.</p>
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
                                <textarea
                                    placeholder = "Project Description"
                                    name = "description"
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className={classes.Box}>
                                <h3>Contribution Tiers</h3>
                                <div className={classes.Tiers}>
                                    <div className={classes.Tier}>
                                        <h4>Tier 1</h4>
                                        <textarea
                                            placeholder="Tier Rewards Description"
                                            name="t1rewards"
                                            onChange={this.onChange}
                                        />
                                        <input
                                            type='number'
                                            placeholder="Minimum funding"
                                            name="t1funding"
                                            onChange={this.onChange}
                                        />
                                    </div>
                                    <div className={classes.Tier}>
                                        <h4>Tier 2</h4>
                                        <textarea
                                            placeholder="Tier Rewards Description"
                                            name="t2rewards"
                                            onChange={this.onChange}
                                        />
                                        <input
                                            type='number'
                                            placeholder="Minimum funding"
                                            name="t2funding"
                                            onChange={this.onChange}
                                        />
                                    </div>
                                    <div className={classes.Tier}>
                                        <h4>Tier 3</h4>
                                        <textarea
                                            placeholder="Tier Rewards Description"
                                            name="t3rewards"
                                            onChange={this.onChange}
                                        />
                                        <input
                                            type='number'
                                            placeholder="Minimum funding"
                                            name="t3funding"
                                            onChange={this.onChange}
                                        />
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
                                <h3>Add Some Tags</h3>
                                <input
                                    type='text'
                                    placeholder="Separate your tags with a comma"
                                    name="tags"
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className={classes.SubmitContainer}>
                                <div 
                                    className={classes.SubmitButton}
                                    onClick={this.onSubmit}
                                >Submit</div>
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

export default connect(mapStateToProps, null)(CreateProject);
