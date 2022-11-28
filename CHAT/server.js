const express = require('express');
const { Server: HttpServer } = require('http')
const path = require('path');
const { Server: IOServer } = require('socket.io');

const app = express();
const httpServer = new HttpServer(app);
const IO = new IOServer(httpServer);

const PORT = 3000

const server = httpServer.listen(process.env.PORT || PORT, () => {
    console.log(` server listening on PORT: ${PORT}`)
})

server.on('error', err => console.log(err))

app.use(express.static(path.join(__dirname, 'public')))

IO.on('connection', socket => {
    console.log(`user ${socket.id} is connected`);

    socket.on('chat', (data) => {
       IO.sockets.emit('chat', data)
    })

    socket.on('chat: typing', (data) => {
        socket.broadcast.emit('chat: typing', data)
    })
})