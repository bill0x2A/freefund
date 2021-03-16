import React from 'react';
import classes from './JoinAlpha.module.sass';
import emailSolid from '@iconify-icons/clarity/email-solid';
import heartFilled from '@iconify-icons/ant-design/heart-filled';
import { Icon, InlineIcon } from '@iconify/react';



const Alpha = ({fakeProject}) => {
    return(
        <div className={classes.alphaPage}>
            {fakeProject || true && <h2 style={{marginTop : "70px"}}>Unfortunately, that isn't a real project, but yours could have it's place on our homepage</h2>}
            <h1>α</h1>
            <h2>Join Our Alpha!</h2>
            <p>During alpha, project creation is not public. We would still love to have you though!</p>
            <p>If you have an idea you want to fund on our platform, get in touch below - we'll help publicize your project and stick it right on the front page</p>
            <p>Be sure to include:</p>
            <ul>
                <li>A brief description of your project</li>
                <li>Your Ethereum address, so we can whitelist you</li>
            </ul>
            <p>We'll be back in touch as soon as possible</p>
            <div className={classes.alphaContainer}>
                <a href="mailto:dev@freefund.io">Send us an email<InlineIcon icon={emailSolid}/></a>
                <p>dev@freefund.io <InlineIcon icon={heartFilled}/></p>
            </div>
        </div>
    )
}


export default Alpha;