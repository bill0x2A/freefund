import React from 'react';
import classes from './ProjectCard.module.css';
import DAI from '../../assets/DAI.png';
import Flag from 'react-country-flag';
import {Link} from 'react-router-dom';
import Loading from '../Loading/Loading';
import { withFirebase } from '../../firebase/index';

const ProgressBar = (props) =>{
    const progress = props.funded / props.fundingLimit * 100
    console.log(progress);
    return (
        <div className={classes.ProgressBar}>
            <div style={{
                height: "100%",
                width : progress + "%",
                background: "#5CDB95",
                borderRight : "2px solid white"
            }}/>
        </div>
    )
}

class ProjectCard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading : true,
        }
    }

    loadData = () => {
        this.props.firebase.project(this.props.projectID)
            .on("value", data => {
                const project = data.val();
                this.setState({project : project});
                this.loadCreatorData(project.creatorAddress);
            })
    }

    loadCreatorData = creatorAddress => {
        this.props.firebase.user(creatorAddress)
            .once("value", data => {
                const creatorInfo = data.val();
                console.log("CREATOR: ", creatorInfo)
                this.setState({creatorInfo : creatorInfo, loading:false});
            })
    }

    componentDidMount(){
        this.loadData();
    }

    render(){
        const {project, creatorInfo} = this.state
        console.log(project)
        console.log(creatorInfo)
        return(
            <React.Fragment>
                {this.state.loading ? <Loading/> : 
                    <div className={classes.ProjectCard}>
                        <div className = {classes.FundingInfo}>
                            <span style ={{color:"#5CDB95"}}>{project.funded.toFixed(2)}</span>
                            <span style ={{color:"#606060"}}>/{project.fundingLimit}</span>
                            <img src = {DAI}/>
                        </div>
                        <div className ={classes.Topline}>
                            <h3>{project.title}</h3>
                            <ProgressBar funded = {project.funded} fundingLimit={project.fundingLimit}/>
                        </div>
                        <div className={classes.CreatorInfo}>
                            <img src={`https://ipfs.infura.io/ipfs/${creatorInfo.profileHash}`}/>
                            <div className={classes.CreatorName}>
                                <span>{creatorInfo.firstName} {creatorInfo.lastName}</span>
                                <Flag countryCode={creatorInfo.country} svg/>
                            </div>
                        </div>
                        <p>{project.description}</p>
                        <div className = {classes.FadeOut}/>
                        <Link 
                            className={classes.SeeMore}
                            to={"projects/" + this.props.projectID}
                        >See more</Link>
                    </div>
                }
            </React.Fragment>
            
        )
    }
}

export default withFirebase(ProjectCard);