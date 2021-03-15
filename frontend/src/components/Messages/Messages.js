import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import classes from './Messages.module.sass';
import { DateTime } from 'luxon';

class Messages extends React.Component {
    constructor(props){
       super(props);
       this.state = {
           loading : true,
           messageSenders : [
               {
                   name : "Elon Musk",
                   messages : [{
                       timeSent : DateTime.fromISO("2021-05-15T08:30:00"),
                       message : "This is a test message"
                   }]
               },
               {
                name : "Elon blyat",
                messages : [{
                    timeSent : DateTime.fromISO("2021-03-12T08:30:00"),
                    message : "This is a test message"
                }]
            },
            {
                name : "Elon Minsk",
                messages : [{
                    timeSent : DateTime.fromISO("2021-01-15T08:30:00"),
                    message : "This is a test message"
                }]
            },
            {
                name : "Elon Moosk",
                messages : [{
                    timeSent : DateTime.fromISO("2021-03-15T08:30:00"),
                    message : "This is a test message This is a test message",
                    sender : "Elon Moosk"
                },{
                    timeSent : DateTime.fromISO("2021-03-15T10:30:00"),
                    message : "cool",
                    sender : "Me"
                },{
                    timeSent : DateTime.fromISO("2021-03-15T08:30:00"),
                    message : "This is a test message This is a test message",
                    sender : "Elon Moosk"
                },{
                    timeSent : DateTime.fromISO("2021-03-15T10:30:00"),
                    message : "cool",
                    sender : "Me"
                },{
                    timeSent : DateTime.fromISO("2021-03-15T08:30:00"),
                    message : "This is a test message This is a test message",
                    sender : "Elon Moosk"
                },{
                    timeSent : DateTime.fromISO("2021-03-15T10:30:00"),
                    message : "cool",
                    sender : "Me"
                },{
                    timeSent : DateTime.fromISO("2021-03-15T08:30:00"),
                    message : "This is a test message This is a test message",
                    sender : "Elon Moosk"
                },{
                    timeSent : DateTime.fromISO("2021-03-15T10:30:00"),
                    message : "cool",
                    sender : "Me"
                },{
                    timeSent : DateTime.fromISO("2021-03-15T08:30:00"),
                    message : "This is a test message This is a test message",
                    sender : "Elon Moosk"
                },{
                    timeSent : DateTime.fromISO("2021-03-15T10:30:00"),
                    message : "cool",
                    sender : "Me"
                },{
                    timeSent : DateTime.fromISO("2021-03-15T08:30:00"),
                    message : "This is a test message This is a test message",
                    sender : "Elon Moosk"
                },{
                    timeSent : DateTime.fromISO("2021-03-15T10:30:00"),
                    message : "cool",
                    sender : "Me"
                },{
                    timeSent : DateTime.fromISO("2021-03-15T08:30:00"),
                    message : "This is a test message This is a test message",
                    sender : "Elon Moosk"
                },{
                    timeSent : DateTime.fromISO("2021-03-15T10:30:00"),
                    message : "cool",
                    sender : "Me"
                },{
                    timeSent : DateTime.fromISO("2021-03-15T08:30:00"),
                    message : "This is a test message This is a test message",
                    sender : "Elon Moosk"
                },{
                    timeSent : DateTime.fromISO("2021-03-15T10:30:00"),
                    message : "cool",
                    sender : "Me"
                },
            
            ]
            },
            
           ]
       }
    }

    componentDidMount(){
        if(!this.props.user?.address){
            this.props.history.push('/home');
        }
        this.setState({loading: false});
    }

    selectSender = (sender) => {
        this.setState({selectedSender : sender})
    }

    handleKeyPress = e => {
        if(e.keyCode === 13){
            this.sendMessage();
        }
    }

    sendMessage(){
        const {newMessage, selectedSender} = this.state;

        // Send message here
    }

    render(){
        const {messageSenders, selectedSender} = this.state;
        return(
            <div className={classes.messages}>
                <sidebar>
                    <h2>Messages</h2>
                    {messageSenders.map(messageSender => (
                        <div
                            style={(selectedSender?.name === messageSender.name) ? {border : "3px dashed var(--bold)"} : null}
                            className={classes.messageSender}
                            onClick = {() => this.selectSender(messageSender)}
                        >
                            {messageSender.name}
                        </div>
                    ))}
                </sidebar>
                <div className={classes.wrapper}>
                    <div className={classes.main}>
                        <div className={classes.messageContainer}>
                            {selectedSender?.messages.map(message => <Message message={message} user={this.props.user}/>)}
                        </div>
                    </div>
                    {
                        selectedSender &&
                            <input
                                placeholder ="Send a new message"
                                type="text"
                                onChange = {e => this.setState({newMessage : e.target.value})}
                                onKeyPress = {this.handleKeyPress}
                            />
                    }
                </div>
            </div>
        )
    }
}


const Message = ({message, user}) => {
    const userSent = message.sender === "Me";
    const now = DateTime.now();
    const diff = now.diff(message.timeSent, ["months", "days", "hours", "minutes"]);
    console.log(diff);
    let timeString = [];
    if(diff.months > 0){
        if(diff.months == 1){
            timeString.push(`${diff.months} month `);
        } else {
            timeString.push(`${diff.months} months `);
        }
    }
    if(diff.days > 0){
        if(diff.days == 1){
            timeString.push(`${diff.days} day `);
        } else {
            timeString.push(`${diff.days} days `);
        }
    } else if(diff.months < 1){
        if(diff.hours > 0){
            if(diff.hours == 1){
                timeString.push(`${diff.hours.toFixed(0)} hour `);
            } else {
                timeString.push(`${diff.hours.toFixed(0)} hours `);
            }
        }
        if(diff.minutes > 0){
            if(diff.minutes == 1){
                timeString.push(`${diff.minutes.toFixed(0)} minute `);
            } else {
                timeString.push(`${diff.minutes.toFixed(0)} minutes `);
            }
        }
    }

    if(timeString.length < 1){
        timeString.push("Moments ");
    }

    timeString.push("ago")
    timeString.join(" ");

    return(
        <div className={[classes.message, userSent ? classes.myMessage : null].join(" ")}>
            <p>{message.message}</p>
            <span>{timeString}</span>
        </div>
    )
}

const mapStateToProps = state =>({
    user : state.user,
});

export default connect(mapStateToProps)(withRouter(Messages));