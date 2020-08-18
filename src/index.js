const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { log } = require('console')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
  console.log('New Web Socket connection')

  socket.emit('message', 'Welcome!')
  socket.broadcast.emit('message', 'A new user has joined!') // emits to every connected client but the current one
  
  socket.on('sendMessage', (message) => { 
    io.emit('message', message)
  })

  socket.on('sendLocation', (location) => {
    io.emit('message', `https://google.com/maps?=${location.latitude},${location.longitude}`)
  })

  socket.on('disconnect', () => {
    io.emit('message', 'A user has left!')
  })
})

server.listen(port, () => {
  console.log(`Listening on port ${port}!`)
})