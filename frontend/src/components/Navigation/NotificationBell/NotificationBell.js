import React, {useState} from 'react';
import classes from './NotificationBell.module.sass';
import bellIcon from '@iconify-icons/bx/bxs-bell';
import bellIconRinging from '@iconify-icons/bx/bxs-bell-ring';
import bxsMessage from '@iconify-icons/bx/bxs-message';
import success from '@iconify-icons/clarity/success-standard-solid';
import dollarCircleFilled from '@iconify-icons/ant-design/dollar-circle-filled';
import circleWithCross from '@iconify-icons/entypo/circle-with-cross';
import { InlineIcon } from '@iconify/react';
import testImg from '../../../assets/defaultpp.png';
import * as ROUTES from '../../../constants/routes';
import { Link } from 'react-router-dom';

const testNotifications = [
    {
        type : "newMessage"
    },
    {
        type : "fundingSuccess"
    },
    {
        type : "fundingFailiure"
    },
    {
        type : "creatorSuccess"
    },
    {
        type : "creatorFailiure"
    },
    {
        type : "newFunder"
    },
    {
        type : "funded"
    },
    

]

const NotificationBell = props => {
    const newMessage = true;
    const [messagesOpen, setMessagesOpen] = useState(false);
    return (
        <div onClick = {() => setMessagesOpen(!messagesOpen)}className={classes.bell}>
            {messagesOpen ? <InlineIcon style={{fontSize : "22px"}} icon={circleWithCross}/> : <InlineIcon icon={newMessage ? bellIconRinging : bellIcon}/>}
            {messagesOpen && (
                <div class={classes.messages}>
                    <h2>Notifications</h2>
                    {
                        testNotifications.map(notification => <Notification notification={notification}/>)
                    }
                </div>
            )}

        </div>
    )
}

const Notification = ({notification}) => {
    let content, link;
    switch(notification.type){
        case "newMessage":
            content = <span><InlineIcon icon={bxsMessage}/>You have new messages</span>;
            break;
        case "fundingSuccess":
            content = <span><InlineIcon icon ={success}/>A project you funded has reached its goal!</span>;
            break;
        case "fundingFailiure":
            content = <span><InlineIcon style={{color: "var(--warning)"}} icon ={circleWithCross}/>A project you funded has not reached it's goal</span>;
            break;
        case "creatorSuccess":
            content = <span><InlineIcon icon ={success}/>Your project has reached its funding goal!</span>;
            break;
        case "creatorFailiure":
            content = <span><InlineIcon style={{color: "var(--warning)"}} icon ={circleWithCross}/>Your project did not reach it's goal in time</span>;
            break;
        case "newFunder":
            content = <span><InlineIcon icon ={dollarCircleFilled}/>Someone has funded your project!</span>
            break;
        case "funded":
            content = <span><InlineIcon icon ={success}/>You have successfully funded a project</span>;
            break;
        default:
            content = null;
            break;
    }
    return (
        <Link to={notification.projectId ? notification.projectId : ROUTES.MESSAGES} className={classes.notification}>
            <h3>{content}</h3>
        </Link>
    )
}

export default NotificationBell