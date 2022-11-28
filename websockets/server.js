const express = require('express');
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
let productsExist = false

app.get('/productos', (req, res) => {
    if(products.length > 0){
        productsExist = true
    }
    res.render('index', {
        products, 
        productsExist})
})

IO.on('connection', socket => {
    console.log(`${socket.id} se ha conectado`);

    socket.on('producto', (data) => {
        products.push(data)
        IO.sockets.emit('prueba', products) 
    })
})

