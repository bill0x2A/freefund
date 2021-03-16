import React from 'react';
import classes from './Contact.module.sass';
import twitterBird from '@iconify-icons/brandico/twitter-bird';
import emailSolid from '@iconify-icons/clarity/email-solid';
import heartFilled from '@iconify-icons/ant-design/heart-filled';
import { Icon, InlineIcon } from '@iconify/react';
import { Link } from 'react-router-dom';


const Contact = props => {
    return(
        <div className={classes.contactPage}>
            <h2>Contact Us</h2>
            <p>We <InlineIcon icon={heartFilled}/> feedback, for any issues or suggestions please do not hesitate to get in contact with us</p>
            <div className={classes.contactContainer}>
                <a href="mailto:dev@freefund.io">By email<InlineIcon icon={emailSolid}/></a>
                or 
                <a href="https://twitter.com/freefund_eth">On Twitter<InlineIcon icon={twitterBird}/></a>
            </div>
        </div>
    )
}


export default Contact;