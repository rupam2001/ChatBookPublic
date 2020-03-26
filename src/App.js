import React from 'react';
import './App.css'
import './animate.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Global from './components/global.component';
import axios from 'axios';
import cookie from 'js-cookie';
/////////////////////////////////////////////////////////////////////////////////////
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      add: false,
      global: true,
      chat: false,
      userName: '',
      password: '',
      isLogin: false,
      userId: null,
      navBar: true
    }
  }
  componentWillMount() {
    const userId = cookie.get('userId');
    this.setState({ userId: userId });
    // const userName = cookie.get('userName');
    // const password = cookie.get('password');
    // if (typeof userName != 'undefined' && typeof password != 'undefined') {
    //   axios.post('http://192.168.43.201:3300/login', { userName: userName, password: password, signup: false })
    //     .then(res => {
    //       this.setState({ isLogin: true, userName: userName, password: password });
    //     })
    //     .catch(err => { })
    // }
  }
  setIsLogIn = (l) => {
    this.setState({ isLogin: l });
    console.log("donnnee")
  }
  setNavBar = (n) => {
    this.setState({ navBar: n })
  }


  render() {
    return (
      <div className='contain'>
        {this.state.navBar ? (
          <>

            <div className='nvr d-flex mb-3'>
              {/* <div className="p-2 flex-fill"><span className='add' onClick={() => { if (false) this.setState({ add: true, global: false, chat: false }) }}></span></div> */}
              <div className="p-2 flex-fill"><span className='global' onClick={() => { this.setState({ add: false, global: true, chat: false }) }}></span></div>
              {/* <div className="p-2 flex-fill "><span className='chat' onClick={() => { if (false) this.setState({ add: false, global: false, chat: true }) }}></span></div> */}
              <div className='p-2 flex-fill'><h3 className='htext' >ChatBook</h3></div>
            </div>
          </>
        ) : (
            <></>
          )}


        {this.state.global ? (
          <Global isLogin={this.state.isLogin}
            setIsLogIn={this.setIsLogIn.bind(this)}
            userId={this.state.userId}
            setNavBar={this.setNavBar.bind(this)}

          />
        ) : (
            this.state.chat ? (
              <div><p style={{ color: 'blue' }}>Comming soon..</p></div>
            ) : (
                <div><p style={{ color: 'red' }}>Comming soon..</p></div>
              )
          )}




      </div>
    );
  }
}

export default App;
