import React from 'react';
import classes from './ProjectCard.module.css';
import DAI from '../../assets/DAI.png';
import Flag from 'react-country-flag';
import {Link} from 'react-router-dom';
import Loading from '../Loading/Loading';
import timeLeft from '../../util/timeDifferece';
import MarkdownIt from 'markdown-it';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

const md = new MarkdownIt();

const ProgressBar = (props) =>{
    const progress = props.funded / props.fundingLimit * 100
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

const ProjectCard = props => {
    const {project, creatorInfo} = props
    const funding = parseFloat(project.funding)
        console.log(project)
        return(
                    <div className={classes.ProjectCard}>
                        <div className = {classes.FundingInfo}>
                            <span style ={{color:"#5CDB95"}}>{funding.toFixed(2)}</span>
                            <span style ={{color:"#606060"}}>/{project.fundingLimit}</span>
                            <img src = {DAI}/>
                        </div>
                        <div className ={classes.Topline}>
                            <h3>{project.title}</h3>
                            <ProgressBar funded = {project.funded} fundingLimit={project.fundingLimit}/>
                        </div>
                        <div className={classes.CreatorInfo}>
                            <img src={`https://ipfs.infura.io/ipfs/${creatorInfo?.profileHash}`}/>
                            <div className={classes.CreatorName}>
                                <span>{creatorInfo?.firstName} {creatorInfo?.lastName}</span>
                                <Flag countryCode={creatorInfo?.country} svg/>
                            </div>
                        </div>
                        <div>{(typeof(project.description) == "string") ? project.description : ReactHtmlParser(md.render(project.description.text))}</div>
                        <div className={classes.TimeLeft}>
                            <span>{timeLeft(project.createdAt)}</span>
                        </div>
                        <div className = {classes.FadeOut}/>
                        <Link 
                            className={classes.SeeMore}
                            to={"projects/" + project.id}
                        >See more</Link>
                    </div>
            
        )
    }

export default ProjectCard;