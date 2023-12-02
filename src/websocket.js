class WebSocketService{

    static instance = null
    callbacks = {}

    static getInstance(){
        if(!WebSocketService.instance){
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    constructor(){
        this.socketRef = null;
    }

    connect(){
        const path = 'ws://127.0.0.1:8000/ws/chat/fawad/';
        this.socketRef = new WebSocket(path);
        this.socketRef.onopen = () =>{
            console.log("WebSocket open");
        }
        this.socketNewMessage(JSON.stringify({
            commands: 'fetch_messages'
        }))
        this.socketRef.onmessage = e => {
            this.socketNewMessage(e.data)
        }
        this.socketRef.onerror = e => {
            console.log(e.message);
        }

        this.socketRef.onclose = () =>{
            console.log('websocket closed');
            this.connect()
        }



    }


    socketNewMessage(data) {
        const parsedData = JSON.parse(data);
        const command = parsedData.command;
        if(Object.keys(this.callbacks).length === 0){
            return
        }
        if(command === 'messages'){
            this.callbacks[command](parsedData.messages)
        }
        if(command === 'new_message'){        
            this.callbacks[command](parsedData.message)
        }

        }

    


    fetchMessages(username){
        this.sendMessage({commands: 'fetch_messages', username: username});
    }


    chatNewMessage(message){
        this.sendMessage({commands: 'new_message', from: message.from, message: message.content});
    }

    addCallBacks(messageCallBack, newMessageCallback){
        this.callbacks['messages'] = messageCallBack
        this.callbacks['new_message'] = newMessageCallback
    }

    sendMessage(data){
        try{
                this.socketRef.send(JSON.stringify({...data}))
        }catch(err){
            console.log(err.message);
        }
    }

    state(){   
        return this.socketRef.readyState;
    }

    // waitForSocketConnection(callback){
        
    // }
}


const WebSocketInstance  = WebSocketService.getInstance();
export default  WebSocketInstance;