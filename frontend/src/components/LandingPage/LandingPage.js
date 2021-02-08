import React from 'react';
import classes from './LandingPage.module.css';
import world from '../../assets/world.png';
import community from '../../assets/community.png';
import ethereum from '../../assets/ethereum.png';

const LandingPage =  () => {
    return(
        <div className={classes.LandingPage}>
            <h1>BUILDING,</h1>
            <h1>BUT BETTER</h1>
            <h3>Freefund is a new way to create, fund and develop projects</h3>
            <div className={classes.Section}>
                <div>
                    <h2>Quick, Simple and Borderless</h2>            
                    <h3>By harnessing the power of payments on Ethereum, Freefund enables the connection of creators and investors worldwide</h3>
                </div>
                <img src={world}/>
            </div>
            <div className={classes.Section}>
                <div>
                    <h2>Each Project, a Community</h2>
                    <h3>Feedback from your community of investors, as standard</h3>
                </div>
                <img src={community}/>
            </div>
            <div className={classes.Section}>
                <div>
                    <h2>It's Your Money</h2>
                    <h3>Transparent cashflow, reviewed at every step by the project community</h3>
                </div>
                <img src={ethereum}/>
            </div>
        </div>
    )
}

export default LandingPage;