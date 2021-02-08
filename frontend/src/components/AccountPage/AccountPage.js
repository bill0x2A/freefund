import React from 'react'
import classes from './AccountPage.module.css';
import NoAddress from '../NoAddress/NoAddress';
import ReactFlagsSelect from 'react-flags-select';
import { connect } from 'react-redux';
import ipfsClient from 'ipfs-http-client';
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

class AccountPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {

        }
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
            this.setState({imgBuffer : Buffer(reader.result)});
        };
    }

    uploadImage = async () => {
            await ipfs.add(this.state.imgBuffer)
                    .then((result, error) => {
                        if(!error){
                            this.setState({imgHash : result.path});
                        } else {
                            console.log(error)
                        }
                    })
    }


    componentDidMount = () => {
        // Load prexisting user data from Mongo to state
    }
    
    onSubmit = () => {
        // Save changes from state to Mongo
    }

    render = () => {
        return(
            <div className ={classes.AccountPage}>
                {!this.props.selectedAddress ? <NoAddress/> :
                    <React.Fragment>
                        <div className={classes.Box}>
                            <h2><span>[</span> Account Information <span>]</span></h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eu eros est. Aliquam et odio efficitur, sodales mi id, pretium nisl. Donec suscipit ultrices ligula, in volutpat est pulvinar in. Praesent eu rhoncus felis. Cras odio nibh, faucibus eu sapien vel, faucibus placerat felis. Nullam ultrices faucibus lobortis. Vestibulum a iaculis diam, et tempor augue. Vestibulum fermentum feugiat dui, blandit fringilla risus feugiat a. Cras sed nisi accumsan, rutrum risus nec, porttitor velit. Proin ultricies ornare dui eget mollis.</p>
                        </div>
                        <div className={classes.Box}>
                            <h3>Email</h3>
                            <input
                                type='text'
                                placeholder="Your email address"
                                name="email"
                                onChange={this.onChange}
                            />
                        </div>
                        <div className={classes.Box}>
                            <h3>Name</h3>
                            <input
                                type='text'
                                placeholder="Your full name"
                                name="name"
                                onChange={this.onChange}
                            />
                        </div>
                        <div className={classes.Box}>
                            <h3>Country</h3>
                            <ReactFlagsSelect
                                selected={this.state.country}
                                onSelect={country => this.setState({country})}
                            />
                        </div>
                        <div className={classes.Box}>
                            <h3>Profile Picture</h3>
                            <div className={classes.ImageUpload}>
                                <input
                                    type='file'
                                    accept=".jpg, .jpeg, .png, .bmp, .gif"
                                    onChange={this.captureFile}
                                />
                                <p>Drag image here</p>
                            </div>
                        </div>
                        <div className={classes.SubmitContainer}>
                            <div 
                                className={classes.SubmitButton}
                                onClick={this.onSubmit}
                            >Submit Changes</div>
                        </div>
                        <div className={classes.Box}>
                            <h2><span>[</span> My Projects <span>]</span></h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eu eros est. Aliquam et odio efficitur, sodales mi id, pretium nisl. Donec suscipit ultrices ligula, in volutpat est pulvinar in. Praesent eu rhoncus felis. Cras odio nibh, faucibus eu sapien vel, faucibus placerat felis. Nullam ultrices faucibus lobortis. Vestibulum a iaculis diam, et tempor augue. Vestibulum fermentum feugiat dui, blandit fringilla risus feugiat a. Cras sed nisi accumsan, rutrum risus nec, porttitor velit. Proin ultricies ornare dui eget mollis.</p>
                        </div>
                        <div className={classes.Box}>
                            {/*<ProjectDisplay /> for each project tied to the user's account*/}
                            <p style = {{textAlign: "center"}}>No projects yet!</p>
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

export default connect(mapStateToProps, null)(AccountPage);