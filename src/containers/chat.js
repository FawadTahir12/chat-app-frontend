import React from "react";
import Sidepanel from "./sidepanel";
import WebSocketInstance from "../websocket";


class Chat extends React.Component{


    constructor(props){
        super(props)
        this.state = {}
        this.waitForSocketConnection(()=>{
            WebSocketInstance.addCallBacks(
                this.setMessages.bind(this),
                this.addMessage.bind(this)   
            );
            WebSocketInstance.fetchMessages(this.props.currentuser);
        })
    }

    waitForSocketConnection(callback){
        const component = this;

        setTimeout(
            function(){
                if(WebSocketInstance.state() === 1){
                    console.log('conection is secure');
                    
                    callback();
                }else{
                    console.log("waiting for connection");
                    component.waitForSocketConnection(callback)
                }
            },100
        )
    }

    setMessages(messages){
        this.setState({
            messages: messages
        });
    }


    addMessage(message){
        this.setState(
            {
                messages: [...this.state.messages, message]
            }
        )
    }

    rendermessage = (messages) =>{
        const currentUser = 'admin';
        return messages.map((message)=>{
            return(
            <li key={message.id}
            className={message.author === currentUser ? 'sent': 'replies'}
            >
                <img src="http://emilcarlsson.se/assets/mikeross.png"></img>
                <p>
                    {message.content}
                    <small>
                    <br />
                    {Math.round((new Date().getTime() -  new Date(message.timestamp).getTime())/60000)} minutes ago
                </small>
                </p>
                
               
            </li>
         ) })
    }


    
    sendMessageHandler  = e =>{
        e.preventDefault();
        const messageObject = {
            'from': 'admin',
            'content': this.state.message
        }
        WebSocketInstance.chatNewMessage(messageObject)

        this.setState({
            message: ''
        })
    };

    messageChangeHandler = event =>{
        this.setState({
            message: event.target.value
        })
    };
    render(){

        const messages = this.state.messages;
        return(
            <div id="frame">
            <Sidepanel/>
            <div className="content">
                <div className="contact-profile">
                    <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
                    <p>username</p>
                    <div className="social-media">
                        <i className="fa fa-facebook" aria-hidden="true"></i>
                        <i className="fa fa-twitter" aria-hidden="true"></i>
                         <i className="fa fa-instagram" aria-hidden="true"></i>
                    </div>
                </div>
                <div className="messages">
                    <ul id="chat-log">
                            {messages && this.rendermessage(messages)}
                    </ul>
                </div>
                <div className="message-input">
                    <form onSubmit={this.sendMessageHandler}>
                    <div className="wrap">
                    <input id="chat-message-input" 
                    onChange={this.messageChangeHandler}
                    type="text" 
                    placeholder="Write your message..." 
                    value={this.state.message}/>
                    <i className="fa fa-paperclip attachment" aria-hidden="true"></i>
                    <button id="chat-message-submit" className="submit"><i className="fa fa-paper-plane" aria-hidden="true"></i></button>
                    </div>
                    </form>
                </div>
            </div>
        </div>
        )
    }
}

export default Chat;