import React, { useEffect, useState } from 'react';
import classes from './Home.module.css';
import testImage from '../../assets/yosemite.png';
import timeDifferece from '../../util/timeDifferece';
import DAI from '../../assets/DAI.png';
import clock16Regular from '@iconify-icons/fluent/clock-16-regular';
import world from '../../assets/world.png';
import community from '../../assets/community.png';
import ethereum from '../../assets/ethereum.png';

import { Icon, InlineIcon } from '@iconify/react';
import { Link } from 'react-router-dom';

const project = {
    title : "Test Project Title",
    tagline : "This is a test tagline for a test project",
    id : "spGAQPteC",
    headerImg : testImage,
    funding: 10,
    fundingLimit : 50,
    endTime : new Date(2021, 3, 20, 10, 33, 30, 0),
}

const otherProjects = [project, project, project, project];

const creatorInfo = {
    firstName : "Richard",
    lastName : "Roll",
}

const Home = props => {

    const [timeLeft, setTimeLeft] = useState({days : 0, hours : 0});

    useEffect( () => {
            const timeNow = new Date();
            setTimeLeft(timeDifferece(timeNow, project.endTime));
            },
        []
    );

    return (
        <div className={classes.Home}>
            <div className={classes.Toprow}>
                <Link className={classes.Featured} to = {`/projects/${project.id}`}>
                    <h4>Featured Project</h4>
                    <img src={project.headerImg}/>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                        <div>
                            <h3>{project.title}</h3>
                            <p>{project.tagline}</p>
                        </div>
                        <div>
                            <div className = {classes.FundingInfo}>
                                <span style ={{color:"#5CDB95"}}>{project.funding.toFixed(0)} </span>
                                <span style ={{color:"white"}}> / {project.fundingLimit}</span>
                                <img src = {DAI}/>
                            </div>
                            <div className = {classes.TimeInfo}>
                                <InlineIcon icon={clock16Regular}/>
                                <span>{timeLeft.days}d {timeLeft.hours}h</span>
                            </div>
                        </div>
                    </div>
                </Link>
                <div className={classes.NewProjects}>
                    {otherProjects.map( project => (
                        <Link className={classes.ProjectSmall}>
                            <img src={project.headerImg}/>
                            <div className={classes.TextContainer}>
                                <h3>{project.title}</h3>
                                <div style={{display:"flex"}}>
                                    <div className = {classes.FundingInfoSmall}>
                                        <span style ={{color:"#5CDB95"}}>{( 100 * project.funding / project.fundingLimit ).toFixed(0)}% <span style={{fontWeight:"400"}}>funded</span></span>
                                    </div>
                                    <div className = {classes.TimeInfoSmall}>
                                        <InlineIcon icon={clock16Regular}/>
                                        <span>{timeLeft.days}d {timeLeft.hours}h</span>
                                    </div>
                                </div>
                                <p>{creatorInfo.firstName} {creatorInfo.lastName}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className={classes.MoreInformation}>
                    <div className={classes.Section}>
                    <div>
                        <h2>Crowdfunding on Ethereum</h2>
                        <h3>Stablecoin based, with an open and unstoppable foundation. All the best of blockchain.</h3>
                    </div>
                    <img src={ethereum}/>
                </div>
                <div className={classes.Section} style={{flexDirection:"row-reverse"}}>
                    <div>
                        <h2>Each Project, a Community</h2>
                        <h3>Feedback from your community of investors, as standard</h3>
                        <h3>Lowest commision fee of any crowdfunding platform</h3>
                    </div>
                    <img src={community}/>
                </div>
                <div className={classes.Section}>
                    <div>
                        <h2>Global Crowds</h2>            
                        <h3>By harnessing the power of payments on Ethereum, Freefund enables the connection of creators and investors worldwide</h3>
                    </div>
                    <img src={world}/>
                </div>

                <div className={classes.Buttons}>
                    <button>Roadmap</button>
                    <button>Join our Alpha</button>
                    <button>Contact Us</button>
                </div>
            </div>
        </div>
    )
}

export default Home;