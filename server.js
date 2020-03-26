const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');

const port = 3300;
app.use(cors());
app.use(express.json());

// const moongose = require('mongoose');
// const uri = process.env.ATLAS_URI;
// const uri2 = 'mongodb+srv://RupamJdas:<iwillnotdie>@cluster0-omljr.mongodb.net/test?retryWrites=true&w=majority';
// moongose.connect(uri2, { useNewUrlParser: true });
// const connection = moongose.connection;
// connection.once('open', () => { console.log("Database connection successfull..") })


// moongose.connect('mongodb://localhost/ChatBook');



const server = http.createServer(app);
const io = socketio(server)

/////////////////////////////////database stuffs
// const UserSchema = moongose.Schema({
//     userName: String,
//     password: String,
//     newMessages: Boolean,
//     tempMessages: [String],
//     allMessages: [String]
// })
// const UserBase = moongose.model('userDataBase_2', UserSchema);

// const MessageSchema = moongose.Schema({
//     userName: String,
//     userId: moongose.Types.ObjectId,
//     texts: [{
//         to: moongose.Types.ObjectId,
//         content: String
//     }]
// })

let UserBase = [];


/////////////////////////////////end of database stuffs

//session

//////////////////>>>>code here

////




////io
io.on('connection', socket => {
    console.log("New connection");
    socket.on('join', ({ userName }, callback) => {
        // console.log(`${userName} has join the chat`);
        callback({ response: 'response sended' })
        socket.join(userName)
    })

    socket.on('messageSend', ({ mymessage, userName, to }, callback) => {
        // console.log(mymessage, "user:", userName, "to:", to)

        io.emit(`getMessage`, { messageFromServer: mymessage, from: userName, to: to });

    })





    socket.on('disconnect', () => {
        // console.log("Left")
    })
})





app.get('/chatTopics', (req, res) => {
    if (UserBase.length != 0) {
        res.json({ chatTopics: UserBase });
    } else {
        res.json(
            {
                chatTopics:
                    [{ _id: 1, useName: 'First', memebers: 10 }]
            });
    }

    // UserBase.find({}, (err, foundUser) => {

    //     if (foundUser.length == 0) {
    //         res.json(
    //             {
    //                 chatTopics:
    //                     [{ _id: 1, useName: 'First', memebers: 10 }]
    //             })
    //     } else
    //         res.json({ chatTopics: foundUser })
    // })
    // res.json(
    //     {
    //         chatTopics:
    //             [{ _id: 1, useName: 'About Sex ', memebers: 10 },
    //             { _id: 2, title: 'About World', memebers: 7 },
    //             { _id: 3, title: 'About Space', memebers: 11 },
    //             { _id: 4, title: 'About Sex ', memebers: 10 },
    //             { _id: 5, title: 'About World', memebers: 7 },
    //             { _id: 6, title: 'About Space', memebers: 11 },
    //             { _id: 7, title: 'About Sex ', memebers: 10 },
    //             { _id: 8, title: 'About World', memebers: 7 },
    //             { _id: 9, title: 'About Space', memebers: 11 }]
    //     })
    // console.log("chatTopics")
})



app.post('/login', (req, res) => {
    const userName = req.body.userName;
    const password = req.body.password;
    const signup = req.body.signup;
    if (typeof userName != 'undefined' && typeof password != 'undefined' && typeof signup != 'undefined') {
        if (signup) {

            const user = UserBase.find((user) => user.userName == userName);
            if (typeof user == 'undefined') {
                const _id = parseInt(Math.random() * 1000000);
                UserBase.push({ _id: _id, userName: userName, password: password, newMessages: false, tempMessages: [], allMessages: [] })
                res.json({ message: 'Successfully Signed Up!', userId: _id, success: true });
            } else {
                res.json({ message: 'Username already exist' })
            }

            // UserBase.findOne({ userName: userName }, (err, foundUser) => {
            //     if (err) { res.status(500).json({ message: 'something went wrong...' }); console.log("yaat") }
            //     if (foundUser == null) {
            //         //means there is no existing username like this
            //         UserBase.create({ userName: userName, password: password, newMessages: false }, (error, createdUser) => {
            //             if (error) { res.status(500).json({ message: 'Something went wrong..' }) }
            //             else {
            //                 res.json({ message: 'Successfully Signed Up!', userId: createdUser._id, success: true });
            //             }
            //         })
            //     } else {
            //         res.json({ message: 'Username already exist' })
            //     }
            // })
        }
        else {
            //means login
            const user = UserBase.find((user) => user.userName == userName && user.password == password);
            if (typeof user == 'undefined') {
                res.json({ message: "Wrong password or userName." })
            }
            else {
                res.json({ message: 'You are logged in!', userId: user._id, success: true });
            }



            // UserBase.findOne({ userName: userName, password: password }, (err, foundUser) => {
            //     if (err) { res.status(500).json({ message: 'Something went wrong' }) }
            //     else if (foundUser != null) {
            //         res.json({ message: 'You are logged in!', userId: foundUser._id, success: true });
            //     }
            //     else {
            //         res.json({ message: "Wrong password or userName." })
            //     }
            // })
        }
    }
    // console.log("login");
});



app.get('/loadchat/:chatId', (req, res) => {

})

server.listen(port, () => { console.log(`Server is running at port ${port}`) });
