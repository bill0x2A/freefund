import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import classes from './Messages.module.sass';
import { DateTime } from 'luxon';
import testpp from '../../assets/defaultpp.png';
import { io } from 'socket.io-client'
import { getChats } from '../../mongo/mongo';

//props:
// user -> address, firstName, lastName
// token from cookies
// other user address as userAddress
// chat id as chatId, you can get list of chatIds and their names from "/getChats"

const socket = io("https://floating-temple-50905.herokuapp.com")

class Messages extends React.Component {
    constructor(props){
       super(props);
       this.state = {
           loading : true,
           newMessage : "",
           chatId: this.props.chatId || null, //id of chat to help store the chat
           _id: this.props.id || null, // id of person chatting with,
           accepted: false,
           name: this.props.user.firstName+" "+this.props.user.lastName || "Me",
           chats: [{
                name: "Elon Musk",
                time: DateTime.fromISO("2021-05-15T08:30:00"),
                message: "This is a test message"
           },
           {
            name: "Elon Moosk",
            time: DateTime.fromISO("2021-05-15T08:30:00"),
            message: "This is a test message"
            }]
       }
    }

async componentDidMount(){
        if(!this.props.user?.address){
            this.props.history.push('/home');
        }
        await this.loadData();
        this.setState({loading: false});

        socket.save("save", data=> { this.setState({chatId: data}) })
        
        socket.on("send", data=>{
            const {chatId, message, userId, userName} = data
            //    This is an event listener for message received for first Time
            //    data composes of chatId, message, userId
            this.setState({chatId, _id: userId, name:userName, chats: [...this.state.chats,{name: userName, time: DateTime.fromMillis(Date.now()), message}] })
            socket.emit("accept", {chatId, _id: userId, userAddress: this.props.user.address})
        })

        socket.on("accepted", data=>{
            //    This is an event listener to notify the user that the recipient has accepted the chat request
            //    data composes of chatId
            this.setState({chatId: data, accepted: true})
            //console.log("Chat Accepted")
        })

        socket.on("chatted", data=>{
            //    This is an event listener to notify the user that the recipient has accepted the chat request
            //    data composes of chatId and message
            this.setState({chat: [...this.state.chats, data.message] })
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

    loadData = async () => {
        // Load all required data here
        if(this.state.chatId){
            let {data, response} = await getChats({chatId: this.state.chatId, token: this.props.token})
            if(data){
                this.setState({chats: data.data})
            }  
        }
        
    }

    sendMessage(){
        const {newMessage, selectedSender, chatId, chats, _id} = this.state;
        this.setState({newMessage : ""})
        //console.log(newMessage)
        // Send message here
        if(chats.length>0 && this.state.chatId){
            // continue chat with user
            let newer = {name: this.state.name,  time: DateTime.fromMillis(Date.now()), message: newMessage}
            let chats = [...this.state.chats, newer ]
            
            socket.emit("chat", {chatId, message:newer, _id})
            this.setState({chats})
        }else{
            // Initialise a chat with a user
            socket.emit('createChat', {address:this.props.user.address,
                                  name:"Elon Musk", userAddress: this.props.userAddress, message:newMessage })
        }
        
    }

    onChange = e => {
        this.setState({[e.target.name] : e.target.value});
    }

    render(){
        const {chats, selectedSender} = this.state;
        return(
            <div className={classes.messages}>
                <sidebar>
                    <h2>Messages</h2>
                    {chats.map(messageSender => (
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
    const userSent = message.sender === this.state.name;
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
    token: state.token
});

export default connect(mapStateToProps)(withRouter(Messages));