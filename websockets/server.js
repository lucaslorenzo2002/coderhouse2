const express = require('express');
const fs = require('fs')
const { json } = require('express');
const { Server: HttpServer } = require('http');
const path = require('path');
const { Server: IOServer } = require('socket.io');

const app = express();
const httpServer = new HttpServer(app);
const IO = new IOServer(httpServer);

const exphbs = require('express-handlebars');

const PORT = 8080

const server = httpServer.listen(process.env.PORT || PORT, () => {
    console.log(` server listening on PORT: ${PORT}`)
})

server.on('error', err => console.log(err))

app.engine('handlebars', exphbs.engine())

app.set('view engine', 'handlebars')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

let products = [];
let messages = [];

const writeFile = async(data, file) => {
    try{
        await fs.promises.writeFile(file, JSON.stringify(data, null, 2));
        console.log('producto agregado');
    }catch(err){
        throw new Error('hubo un error: ' + err)
    }
}

const getAll = async() => {
    try{
        let productos =  await fs.promises.readFile('productos.txt', 'utf-8');
        return JSON.parse(productos); 
        } catch(err){
            if(err.message.includes('no such file or directory')) return [];
            console.log('error: ' + err);
    }
}

app.get('/productos', (req, res) => {
    res.render('index', {
        products
    })
})

IO.on('connection', socket => {
    console.log(`${socket.id} se ha conectado`);
    socket.on('product', (data) => {
        products.push(data)
        writeFile(products, 'productos.txt')
        IO.sockets.emit('new product', products) 
    })

    socket.on('message', (data) => {
        messages.push(data)
        writeFile(messages, 'mensajes.txt')
        IO.sockets.emit('new message', messages)
    })

    socket.on('chat: typing', (data) => {

        socket.broadcast.emit('typing', data)
    })
})



