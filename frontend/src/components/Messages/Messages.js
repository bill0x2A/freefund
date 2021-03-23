import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import classes from './Messages.module.sass';
import { DateTime } from 'luxon';
import testpp from '../../assets/defaultpp.png';
import { getChats, loadUser } from '../../mongo/mongo';
import { ethers } from 'ethers';
import { useImperativeHandle } from 'react';

// The only external data source we have now is this.props.match.params.address, passed if we
// wish to start a new chat, this is working + handler in the newChatHandler method.


class Messages extends React.Component {
    constructor(props){
       super(props);
       this.state = {
           loading : true,
           newMessage : "",
           chats: [],
       }
    }

async componentDidMount(){

        // If the user has no connected wallet, redirect them to the homepage
        if(!this.props.user?.address){
            this.props.history.push('/home');
        }
        // Load the active chats
        await this.loadChats();

        // Check if a new chat is being initialised (see newChatHandler for more information)
        this.newChatHandler();

        // Activate listeners
        this.props.socket.on("save", data=> { this.setState({chatId: data}) })
        
        this.props.socket.on("send", data=>{
            const {chatId, message, userId, userName} = data
            //    This is an event listener for message received for first Time
            //    data composes of chatId, message, userId
            this.setState({chatId, _id: userId, name:userName, chats: [...this.state.chats,{name: userName, time: DateTime.fromMillis(Date.now()), message}] })
            this.props.socket.emit("accept", {chatId, _id: userId, userAddress: this.props.user.address})
        })

        this.props.socket.on("accepted", data=>{
            //    This is an event listener to notify the user that the recipient has accepted the chat request
            //    data composes of chatId
            this.setState({chatId: data, accepted: true})
            //console.log("Chat Accepted")
        })

        this.props.socket.on("chatted", data=>{
            //    This is an event listener to notify the user that the recipient has accepted the chat request
            //    data composes of chatId and message
            this.setState({chat: [...this.state.chats, data.message] })
            //console.log("Chat Accepted")
        })
    }

    selectChat = chat => {
        this.setState({selectedChat : chat})
        if(chat.chatId){
            // Load the chat messages to state here
        }
    }

    handleKeyPress = e => {
        if(e.charCode === 13 && !e.shiftKey){
            e.preventDefault();
            this.sendMessage();
        }
    }

    loadChats = async () => {
            // Leaving this up to you
            let {data, response} = await getChats({address: this.props.user.address, token: this.props.token})
            if(data?.data){
            }  
        this.setState({loading: false});
    }

    newChatHandler = async () => {
        // This method places a new chat object in the user's list so they can send the first message.

        const address = this.props.match.params.address

        // Check to see if the address passed in the url params is valid (if one is present at all)
        if(!ethers.utils.isAddress(address)){
            return
        }

        // ADD ANOTHER CHECK TO SEE IF THERE IS AN ALREADY AN ACTIVE CHAT WITH THIS ADDRESS

        const user = await loadUser(address);
        const name = user.data?.firstName ? user.data?.firstName + " " + user.data?.lastName : address;

        const newChat = {
            name,
            imgHash : user.data?.imgHash,
            address,
        }

        const chats  = [...this.state.chats]
        chats.push(newChat);
        this.setState({chats});
    }

    sendMessage =  async () => {
        const {newMessage, selectedChat, chats, _id} = this.state;
        
        // If there is no associated chatId, create a new chat + handle subsequent logic.
        if(!selectedChat.chatId){

            console.log("Creating new chat");
            this.props.socket.emit(
                'createChat', 
                {
                    address : this.props.user.address,
                    userAddress : selectedChat.address,
                    message : newMessage 
                }
            )

            // After the new chat has been created and given an ID on the server, we want to reload the chats
            // so the new chat also has its associated chatId loaded and useable

            // Unless there is a quick way of getting the chat id, in which case we could update the loaded
            // chat objects in state, up to you as to how you want to handle this.

            await this.loadChats()
        
            // Here we might want to consider reselecting the new chat, but with its new chat ID, so that the
            // chat is not deselected after the first message has been sent

        } else {
            // V confused by this, leaving it up to you
            let newer = {name: this.state.name,  time: DateTime.fromMillis(Date.now()), message: newMessage}
            let chats = [...this.state.chats, newer ]
            
            this.props.socket.emit("chat", {chatId : selectedChat.chatId, message:newer, _id})
            this.setState({chats})
        }
        this.setState({newMessage : ""})
    }

    onChange = e => {
        this.setState({[e.target.name] : e.target.value});
    }

    render(){
        const {chats, selectedChat} = this.state;
        console.log(this.state.chats)
        return(
            <div className={classes.messages}>
                <div className={classes.sidebar}>
                    <h2>Messages</h2>
                    {chats.map(chat => (
                        <div
                            style={(selectedChat?.address === chat.address) ? {border : "3px dashed var(--bold)"} : null}
                            className={classes.messageSender}
                            onClick = {() => this.selectChat(chat)}
                        >
                            <img src={`https://ipfs.infura.io/ipfs/${chat?.imgHash}`}/>

                            {chat.name}

                        </div>
                    ))}
                </div>
                <div className={classes.wrapper}>
                    <div className={classes.main}>
                        <div className={classes.messageContainer}>
                            {selectedChat?.messages?.map(message => <Message message={message} user={this.props.user}/>)}
                        </div>
                    </div>
                    {
                        selectedChat &&
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


const Message = ({message}) => {
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
    token: state.token,
    socket : state.socket,
});

export default connect(mapStateToProps)(withRouter(Messages));