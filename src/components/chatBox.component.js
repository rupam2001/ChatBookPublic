import React, { Component } from 'react';
import Axios from 'axios';
import io from 'socket.io-client';
import Cookies from 'js-cookie';
import './styles/chatBox.css';

let socket;

class ChatBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chatId: this.props.chatId,
            chatTitle: this.props.chatTitle,
            ENDPOINT: '192.168.43.238:3300',
            texts: [{ _id: 2032, userWhoTextedId: 213131, userWhoTextedName: 'Rupam', content: 'Welcome! Chats are being loaded...' }],
            socket: null,
            mymessage: '',
            userName: '',
            chatContent: []

        }
    }
    componentWillMount() {
        // Axios.get('http://192.168.43.201:3300/loadchat/' + this.state.chatId)
        //     .then(res => {
        //         this.setState({ texts: [...res.data.texts] });
        //     })
        //     .catch(err => { });
        socket = io(this.state.ENDPOINT)
        this.setState({ socket: socket })
        const userName = Cookies.get('userName');
        this.setState({ userName: userName, chatContent: this.props.currentChat })
        // socket.emit('join', { userName }, ({ response }) => {
        //     console.log(response);
        // });

        // socket.on(`getMessage`, ({ messageFromServer, from, to }, callback) => {
        //     if (to == this.state.userName) {
        //         console.log(from, ":", messageFromServer);

        //     } else { console.log("not mine") }
        // })





    }
    componentWillReceiveProps() {
        // console.log("props pass update cwrp: ", this.props.currentChat);
        this.setState({ chatContent: this.props.currentChat })

    }

    componentDidMount() {
        // const userName = Cookies.get('userName');
        // let socket = io(this.state.ENDPOINT)
        // socket.on(`${userName}`, ({ messageFromServer, from }, callback) => {
        //     console.log(from, ":", messageFromServer);
        // })
        // console.log(this.state.chatContent)
    }
    sendMessage = () => {

        if (this.state.mymessage.length != 0) {
            let a = document.getElementById('sendAudio');
            a.volume = 0.1;
            a.play();

            socket.emit('messageSend', { mymessage: this.state.mymessage, userName: this.state.userName, to: this.state.chatTitle }, (res) => {
                // console.log("Message has been sent")

            })

            this.props.setOtherMessage(this.state.mymessage);
            this.setState({ mymessage: '' });

        }

    }



    render() {
        return (
            <div className='mainDiv'>
                <div className='headr d-flex'>
                    <div className="p-2">
                        <button className="btn btn-link" onClick={() => { this.props.setNavBar(true); this.props.getBackFromChats(); this.state.socket.emit('disconnect') }}><span className='back'></span></button>
                    </div>
                    <div className="p-2 flex-grow-1">
                        <h5 style={{ color: 'white' }}> {this.state.chatTitle}</h5>
                    </div>
                </div>

                <div className='box'>
                    {/* {this.state.chatConetent.allMessages == undefined?} */}
                    {

                        this.state.chatContent.allMessages.map(each => {
                            return (
                                each.owner == 'me' ? (<>
                                    <div className="bubbleWrapper">
                                        <div className="inlineContainer own">
                                            <div className="ownBubble own">
                                                {each.content}
                                            </div>
                                        </div>
                                    </div>
                                </>) : (
                                        <>
                                            <div className="bubbleWrapper">
                                                <div className="inlineContainer">
                                                    <div className="otherBubble other">
                                                        {each.content}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )
                            )
                        })
                    }

                </div>




                <div className='launchBar input-group mb-3'>
                    <audio hidden id='sendAudio'>
                        <source src="https://res.cloudinary.com/rupamcloud/video/upload/v1579700375/zapsplat_cartoon_ascending_blip_slip_44565_zyofdi.mp3"></source>
                    </audio>
                    <input className="form-control" value={this.state.mymessage} placeholder="Type a message" onChange={(e) => this.setState({ mymessage: e.target.value })} />
                    <div className="input-group-append">
                        <span className="send" onClick={this.sendMessage}></span>
                    </div>
                </div>
            </div>
        );
    }
}

export default ChatBox;