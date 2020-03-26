import React, { Component } from 'react';
import Axios from 'axios';
import './styles/global.css'
import './login.component';
import Login from './login.component';
import Cookies from 'js-cookie'
import ChatBox from './chatBox.component'
import io from 'socket.io-client';
let socket;
class Global extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topics: [
                { _id: 1, userName: 'Loading........', newMessages: false, allMessage: [{ owner: 'me', content: 'hii' }] },
                // { _id: 2, title: 'About World', memebers: 7 }
            ],
            isLogin: this.props.isLogin,
            loginRoute: false,
            signup: false,
            cookieCheck: true,
            chat: false,
            userId: this.props.userId,
            chatId: null,
            ENDPOINT: '192.168.43.238:3300',
            chatTitle: null,
            currentChat: []
        }

    }
    componentWillMount() {
        const userName = Cookies.get('userName');
        const password = Cookies.get('password');
        if ((typeof userName != 'undefined' && typeof password != 'undefined') && !this.props.isLogin) {
            Axios.post('http://192.168.43.238:3300/login', { userName: userName, password: password, signup: false })
                .then(res => {
                    if (res.data.success) {
                        this.setState({ isLogin: true, userName: userName, password: password, cookieCheck: false });
                        this.props.setIsLogIn(true)
                        socket = io(this.state.ENDPOINT);
                        // const userName = Cookies.get('userName');
                        // this.setState({ userName: userName })
                        socket.emit('join', { userName }, ({ response }) => {
                            // console.log(response);
                        });


                        socket.on(`getMessage`, ({ messageFromServer, from, to }, callback) => {
                            if (to == this.state.userName) {
                                console.log("kam krise")
                                //increase the noOfmessage of topics to sort them
                                let temp = this.state.topics
                                let edited = [];
                                for (let i = 0; i < this.state.topics.length; i++) {
                                    if (from == temp[i].userName) {
                                        if (this.state.currentChat.length != 0) {
                                            if (this.state.currentChat._id != temp[i]._id) {
                                                temp[i].newMessages = true;
                                            }
                                        } else {
                                            temp[i].newMessages = true;
                                        }
                                        temp[i].tempMessages.push(messageFromServer);
                                        temp[i].allMessages.push({ owner: 'other', content: messageFromServer });
                                        edited.push(temp[i]);
                                        // if (this.state.currentChat.length != 0) {
                                        //     this.setState({ currentChat: temp[i] });
                                        // }
                                    }
                                    else {
                                        edited.push(temp[i]);
                                    }
                                }
                                // console.log(edited)
                                //sorting
                                edited.sort(function (a, b) { return b.tempMessages.length - a.tempMessages.length });


                                this.setState({ topics: edited })

                                //add the message with them also to send it as props to the chatBox
                            } else { console.log("not mine hahah") }
                        })



                        if (this.state.userId == undefined)
                            this.setState({ userId: res.data.userId })
                    } else {
                        this.setState({ cookieCheck: false })
                    }
                })
                .catch(err => {
                    this.setState({ cookieCheck: false })
                })
        } else {
            this.setState({ cookieCheck: false })
        }
        Axios.get("http://192.168.43.238:3300/chatTopics")
            .then(res => {
                let temp = res.data.chatTopics;
                // temp.sort(function (a, b) { return b.newMessage - a.newMessage });
                this.setState({ topics: [...temp] });
                // console.log(temp);
            })
            .catch(err => { })
    }
    loadChat = (_id) => {
        if (this.state.isLogin) {
            let temp = this.state.topics.find((obj) => obj._id == _id);
            temp.newMessages = false;
            let all = [];
            for (let i = 0; i < this.state.topics.length; i++) {
                if (this.state.topics[i]._id == _id) {
                    all.push(temp)
                } else {
                    all.push(this.state.topics[i]);
                }
            }
            // this.setState({  });


            this.setState({ currentChat: temp, chat: true, chatId: _id, chatTitle: temp.userName, topics: all })
            this.props.setNavBar(false);
        } else {
            var x = document.getElementById("snackbar");
            x.className = "show";
            setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
        }
    }
    getBack = () => {
        this.setState({ loginRoute: false })
    }
    setIsLogin = (l) => {
        this.setState({ isLogin: l })
        this.props.setIsLogIn(l)
    }
    getBackFromChats = () => {

        //we have to update the state topics currentMessage one
        let temp = this.state.topics;
        let updated = [];
        let currentChat = this.state.currentChat;
        currentChat.tempMessages = []
        for (let i = 0; i < temp.length; i++) {
            if (temp[i]._id == this.state.currentChat._id) {
                updated.push(currentChat);
            }
            else {
                updated.push(temp[i]);
            }
        }
        this.setState({ chat: false, currentChat: [], topics: updated });

    }
    rearrange = () => {

    }

    // componentDidMount() {
    //     if (this.state.isLogin) {

    //     }
    // }

    // setMessages = () => {//it will be used when we go to the chatbox and chats there we have to save those messages in the topics here
    //     ////or we can recieve the messages here only hmmmmmmmmmmm good idea

    // }
    setOtherMessage = (message) => {
        let temp = this.state.currentChat;
        temp.allMessages.push({ owner: 'me', content: message });
        this.setState({ currentChat: temp });
    }
    render() {
        return (
            <>
                {this.state.chat ? (
                    <ChatBox chatId={this.state.chatId}
                        chatTitle={this.state.chatTitle}
                        getBackFromChats={this.getBackFromChats.bind(this)}
                        setNavBar={this.props.setNavBar.bind(this)}
                        currentChat={this.state.currentChat}
                        setOtherMessage={this.setOtherMessage.bind(this)}
                    />
                ) : (
                        <div className="container">
                            {this.state.cookieCheck && !this.state.isLogin ? (<p>SignIn Checking...</p>) : (<></>)}
                            {this.state.loginRoute ? (
                                <Login getBack={this.getBack.bind(this)} signup={this.state.signup} setIsLogin={this.setIsLogin.bind(this)} />
                            ) : (
                                    this.state.topics.map(each => {
                                        if (each._id == this.state.userId) {
                                            return (<></>)
                                        }
                                        return (
                                            <div key={each._id}>
                                                <div className='eachChat d-flex' onClick={() => this.loadChat(each._id)}>
                                                    <div className='p-2'><span className="people"></span></div>
                                                    <div className='p-2 flex-grow-1'>{each.userName}</div>
                                                    {each.newMessages ? (<p><strong>{each.tempMessages.length} new messages</strong></p>) : (<></>)}
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            {}
                            <div id="snackbar"><button className="btn btn-link" onClick={() => { this.setState({ loginRoute: true, signup: false }) }}>login</button> or <button className='btn btn-link' onClick={() => { this.setState({ loginRoute: true, signup: true }) }}>Signup</button></div>
                        </div>
                    )}
            </>

        );
    }
}

export default Global;