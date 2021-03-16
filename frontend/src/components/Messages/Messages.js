import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import classes from './Messages.module.sass';
import { DateTime } from 'luxon';
import testpp from '../../assets/defaultpp.png';
import { io } from 'socket.io-client'

const socket = io("https://floating-temple-50905.herokuapp.com")

class Messages extends React.Component {
    constructor(props){
       super(props);
       this.state = {
           loading : true,
           newMessage : "",
           chatId: 1, //id of chat to help store the chat
           _id: this.props.id || 2, // id of person chatting with,
           chat: [{
               name: "Elon Musk",
               messages:{
                   time: DateTime.fromISO("2021-05-15T08:30:00"),
                   message: "This is a test message"
               }
           },
           {
            name: "Me",
            messages:{
                time: DateTime.fromISO("2021-05-15T08:30:00"),
                message: "This is a test message"
            }
            }],

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
                    message : "This is a test message This is a test message This is a test message This is a test message This is a test message This is a test message This is a test message This is a test message This is a test message This is a test message This is a test message This is a test message This is a test message This is a test message This is a test message This is a test message This is a test message This is a test message This is a test message This is a test message This is a test message ",
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
        this.loadData();
        this.setState({loading: false});
        
        socket.on("send", data=>{
            const {chatId, message, temp, userId, userName} = data
            //    This is an event listener for message received for first Time
            //    data composes of chatId, message, userId
            this.setState({chatId, _id: userId, name:userName, messageSender: [...this.state.messageSenders,{name:userName, message:[{timeSent: new Date(), message}] }] })
            socket.emit("accept", {chatId, _id: userId})
        })

        socket.on("accepted", data=>{
            //    This is an event listener to notify the user that the recipient has accepted the chat request
            //    data composes of chatId
            this.setState({chatId: data})
            //console.log("Chat Accepted")
        })

        socket.on("chatted", data=>{
            //    This is an event listener to notify the user that the recipient has accepted the chat request
            //    data composes of chatId
            this.setState({chatId: data.chatId, newMessage: data.message})
            //console.log("Chat Accepted")
        })
    }

    selectSender = (sender) => {
        this.setState({selectedSender : sender})
    }

    handleKeyPress = e => {
        if(e.charCode === 13 && !e.shiftKey){
            e.preventDefault();
            this.sendMessage();
        }
    }

    loadData = () => {
        // Load all required data here
    }

    sendMessage(){
        const {newMessage, selectedSender, chatId, messageSenders, _id} = this.state;
        this.setState({newMessage : ""})
        //console.log(newMessage)
        // Send message here
        if(messageSenders.length>0){
            // continue chat with user
            socket.emit("chat", {chatId, mesage:newMessage, _id})
        }else{
            // Initialise a chat with a user
            socket.emit('createChat', {userAddress:this.props.user.address,
                                  name:"Elon Musk", _id, message:newMessage })
        }
        
    }

    onChange = e => {
        this.setState({[e.target.name] : e.target.value});
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
                            <img src={testpp}/>
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
                            <textarea
                                placeholder ="Send a new message"
                                value={this.state.newMessage}
                                name="newMessage"
                                onChange = {this.onChange}
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