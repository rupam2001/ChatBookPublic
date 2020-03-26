import React, { Component } from 'react';
import Axios from 'axios';
import './styles/login.css'
import Cookie from 'js-cookie';
import io from 'socket.io-client';
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signup: this.props.signup,
            userName: '',
            password: '',
            disable: false,
            wrong: false,
            message: 'wrong usernmae or password',
            ENDPOINT: '192.168.43.238:3300'

        }
    }
    valid = false
    checkCritarias = () => {
        if (this.state.userName.length != 0 || this.state.password.length != 0) {
            if (this.state.password.length < 5) {
                this.setState({ wrong: true, message: 'password too short' })
            }
            else if (this.state.userName.length > 10) {
                this.setState({ wrong: true, message: 'username too long' })
            }
            else {
                this.valid = true
            }
        }
        else {
            this.setState({ wrong: true, message: 'Please fill out the fields' })
        }
    }
    onSubmit = (e) => {
        e.preventDefault();
        this.checkCritarias();
        if (this.valid) {
            //////////////////////axios request post
            this.setState({ disable: true })
            Axios.post('http://192.168.43.238:3300/login', { userName: this.state.userName, password: this.state.password, signup: this.state.signup })
                .then(res => {
                    if (res.data.success) {
                        Cookie.set('userName', this.state.userName, { expires: 100 });
                        Cookie.set('password', this.state.password, { expires: 100 });
                        Cookie.set('userId', res.data.userId, { expires: 100 });
                        this.setState({ wrong: true, message: res.data.message })
                        // const userName = Cookies.get('userName');
                        // this.setState({ userName: userName })
                        const userName = this.state.userName;
                        let socket = io(this.state.ENDPOINT)
                        socket.emit('join', { userName }, ({ response }) => {
                            console.log(response);
                        });
                        setTimeout(() => {
                            // this.props.getBack();
                            window.location.reload()
                        }, 2000);
                        document.getElementById('wrong').style.color = 'green';
                        this.props.setIsLogin(true);
                    }
                    else {
                        this.setState({ wrong: true, message: res.data.message })
                    }
                })
                .catch(err => {
                    this.setState({ wrong: true, message: err.message, disable: false })
                })
            console.log('ok')
        }
        else {
            console.log('not ok')
        }
    }
    onChangeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value, wrong: false, disable: false })
    }
    render() {
        return (
            <div>
                <div className='formBox' >
                    {this.state.wrong ? (<p style={{ color: 'red' }} className='animated tada' id='wrong'>{this.state.message}</p>) : (<></>)}
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label >UserName</label>
                            <input type="name" className="form-control" placeholder="userName" id="email" name='userName' onChange={this.onChangeHandler} />
                        </div>
                        <div className="form-group">
                            <label >Password:</label>
                            <input type="password" className="form-control" placeholder="password" id="pwd" name='password' onChange={this.onChangeHandler} />
                        </div>
                        {this.state.signup ? (
                            <div>
                                {this.state.disable ? (<div className="spinner-border text-info"></div>) : (
                                    <button className='btn btn-primary' type='submit' disabled={this.state.disable}>SignUp</button>
                                )}                                {/* <button className='btn btn-link' onClick={() => { this.setState({ signup: false }) }}>already have an account?</button> */}
                            </div>

                        ) : (
                                <div>
                                    {this.state.disable ? (<div class="spinner-border text-info"></div>) : (
                                        <button className='btn btn-primary' type='submit' disabled={this.state.disable}>Login</button>
                                    )}
                                    {/* <button className='btn btn-link' onClick={() => { this.setState({ signup: true }) }}>create an account</button> */}

                                </div>
                            )}
                    </form>

                    <button className='btn btn-link' onClick={this.props.getBack}>Back</button>

                </div>
                <strong>Note:</strong>
                <p>This site doesnot require any of your  information such as email/phone no. etc.
                You can use any userName you want!Means you can be anonymous in this site!
              </p>
            </div>
        );
    }
}

export default Login;