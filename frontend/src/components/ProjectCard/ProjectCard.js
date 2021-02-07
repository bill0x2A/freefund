import React from 'react';
import classes from './ProjectCard.module.css';
import DAI from '../../assets/DAI.png';
import Flag from 'react-country-flag';
import {Link} from 'react-router-dom';

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

const ProjectCard = ({project}) => {
    return(
        <div className={classes.ProjectCard}>
            <div className = {classes.FundingInfo}>
                <span style ={{color:"#5CDB95"}}>{project.funded}</span>
                <span style ={{color:"#606060"}}>/{project.fundingLimit}</span>
                <img src = {DAI}/>
            </div>
            <div className ={classes.Topline}>
                <h3>{project.title}</h3>
                <ProgressBar funded = {project.funded} fundingLimit={project.fundingLimit}/>
            </div>
            <div className={classes.CreatorInfo}>
                <img src={project.creatorImage} alt = "Creator Profile Image"/>
                <div className={classes.CreatorName}>
                    <span>{project.creatorName}</span>
                    <Flag countryCode={project.creatorCountryCode} svg/>
                </div>
            </div>
            <p>{project.description}</p>
            <div className = {classes.FadeOut}/>
            <Link 
                className={classes.SeeMore}
                to={"projects/" + project.projectID}
            >See more</Link>
        </div>
    )
}

export default ProjectCard;