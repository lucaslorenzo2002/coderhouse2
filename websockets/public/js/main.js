const socket = io()

const form = document.querySelector('#form');
const producto = document.querySelector('#producto');
const precio = document.querySelector('#precio');
const file = document.querySelector('#file')
const outputProducto = document.querySelector('#productoOutput')
const outputPrecio = document.querySelector('#precioOutput')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    let objeto =  {
        producto: producto.value,
        precio: precio.value,
        file: file.value
    }
    socket.emit('producto', objeto)
})

socket.on('prueba', (data) => {
    console.log(data);
})