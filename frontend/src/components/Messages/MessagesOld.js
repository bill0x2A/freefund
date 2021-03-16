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
           messageSenders : [
               {
                   name : "Elon Musk",
                   address : "0x8y219d7b1927dgh179u2dh",
                   imgHash : "ajna[0pdw89hjap098hdjc0p9on20[9jc0oi2jmco[",
                   chatId : "mcnoapwicj09awjcpioajwcpoimapcowk",
               },
               {
                name : "Elon Musk",
                address : "0x8y219d7b1927dgh179u2dh",
                imgHash : "ajna[0pdw89hjap098hdjc0p9on20[9jc0oi2jmco[",
                chatId : "iopajcsp9ajcw9mac-wp9ja-cwkj",
            }
           ],
           openChat : [
               {
                   message : "This is a test message",
                   sender : "0ksinfmaf0sh09290mn092j"
               },
               {
                    message : "This is a test message",
                    sender : "0ksinfmaf0sh09290mn092j"
               },
               {
                    message : "This is a test message",
                    sender : "0ksinfmaf0sh09290mn092j"
               }
           ]
       }
    }

    componentDidMount(){
        // If the user is not logged in, redirect them to the homepage
        if(!this.props.user?.address){
            this.props.history.push('/home');
        }
        
        // Load the list of active chats
        this.loadChats();

       
        
        socket.on("send", data=>{
            const {chatId, message, temp, userId, userName} = data
            //    This is an event listener for message received for first Time
            //    data composes of chatId, message, userId
            this.setState({chatId, _id: userId, name:userName, messageSender: [...this.state.messageSenders,{name:userName, messages:[{timeSent: new Date(), message}] }] })
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

    selectChat = chatID => {
        // Use chatID to load messages and save them to state as openChat
    }

    handleKeyPress = e => {
        if(e.charCode === 13 && !e.shiftKey){
            e.preventDefault();
            this.sendMessage();
        }
    }

    loadChats = () => {
        const userAddress = this.props.user.address;

        // If this is a new chat, include the other user in the messageSenders array 
        
        // Creators also need a chat to broadcast messages to all their funders here (one -> many)

        // Use userAddress to load messageSenders to state

        
        this.setState({loading: false}); // Show the component
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
                                  name:"Elon Musk", address: this.props.userAddress, message:newMessage })
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