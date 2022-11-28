const socket = io()

let btn = document.querySelector('#btn');
let messaje = document.querySelector('#messaje');
let output = document.querySelector('#output');
let actions = document.querySelector('#actions');
let username = document.querySelector('#username');

btn.addEventListener('click', () => {
    const mensaje = {
        username: username.value,
        messaje: messaje.value
    }
    socket.emit('chat', mensaje)
})

messaje.addEventListener('keypress', () => {
    socket.emit('chat: typing', username.value) })

socket.on('chat', (data) => {
    actions.innerHTML = ''
    output.innerHTML += `<p>
    <strong>${data.username}: </strong> ${data.messaje}
    </p>`
})

socket.on('chat: typing', data => {
    actions.innerHTML += `<p>
    <strong>${data}:</strong> is typing...
    </p>`
})

