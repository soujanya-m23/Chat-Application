//Node server which will handle socket io connections
const io = require('socket.io')(8000, { cors: { origin: "*" } });

const users = {};

io.on('connection', socket => {   
//If any user joins,let other users connected to the server know!, io.on is an instance of Socket.io,it will listen
    socket.on('new-user-joined', userName => {
        console.log("New user", userName)    //socket.on will an event i.e user-joined event,if it listens then sets name to user
        users[socket.id] = userName;
        socket.broadcast.emit('user-joined', userName)
    });
    //If someone sends a message,broadcast it to other people



    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, userName: users[socket.id] })//if any person sents msg, msg should be broadcasted to other ppl in the chat
    })
    
//If someone leaves the chat,let others know (a disconnect event fires)
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    })
});             