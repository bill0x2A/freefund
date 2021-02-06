import React from 'react';
import classes from './ProjectCard.module.css';
import testProfilePic from '../../assets/testpp.png';
import DAI from '../../assets/DAI.png';
import Flag from 'react-country-flag';
import {Link} from 'react-router-dom';


const testProps = {
    title : "Test title",
    description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam interdum, enim vel vulputate tempor, libero erat rhoncus dolor, rutrum scelerisque ex lectus vitae est. Donec a porttitor nisi. Nam ac urna eget mi venenatis interdum nec quis lacus. Nulla molestie dapibus nisl eget tincidunt. Vivamus finibus ultricies viverra. Ut mauris urna, tincidunt a tristique in, sollicitudin at est. Aliquam in ullamcorper leo. Nulla facilisi. Aenean pretium nunc ut metus vehicula efficitur sed eget nulla. Mauris pulvinar dignissim turpis, et posuere lacus lacinia vel. Phasellus id leo ultrices, lobortis felis in, malesuada diam. Donec auctor massa sit amet dui pharetra pulvinar vitae quis metus. Donec id turpis massa. Proin ut tempus lacus, at sagittis augue. Nam interdum odio vel quam finibus euismod. Pellentesque quis facilisis urna.",
    creatorImage : testProfilePic,
    creatorName : "Bert Brown",
    creatorCountryCode : "BR",
    funded : 5000,
    fundingLimit : 7000,
    projectID : "opaemf-9j1028c9j"
}

const ProgressBar = (props) =>{
    const progress = props.funded / props.fundingLimit * 100
    console.log(progress);
    return (
        <div className={classes.ProgressBar}>
            <div style={{
                height: "100%",
                width : progress + "%",
                background: "green",
                borderRight : "2px solid white"
            }}/>
        </div>
    )
}

const ProjectCard = (props) => {
    return(
        <div className={classes.ProjectCard}>
            <div className ={classes.Topline}>
                <h3>{testProps.title}</h3>
                <ProgressBar funded = {testProps.funded} fundingLimit={testProps.fundingLimit}/>
                <div className = {classes.FundingInfo}>
                    {testProps.funded}
                     / 
                    {testProps.fundingLimit}
                    <img src = {DAI}/>
                </div>
            </div>
            <div className={classes.CreatorInfo}>
                <img src={testProps.creatorImage} alt = "Creator Profile Image"/>
                <span>{testProps.creatorName}<Flag countryCode={testProps.creatorCountryCode} svg/></span>
            </div>
            <p>{testProps.description}</p>
            <div className = {classes.FadeOut}/>
            <Link 
                className={classes.SeeMore}
                to={"projects/" + testProps.projectID}
            >See more</Link>
        </div>
    )
}

export default ProjectCard;