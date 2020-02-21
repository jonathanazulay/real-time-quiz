const express = require('express')
const WebSocket = require('ws')
const http = require('http')
const app = express()
const server = http.createServer({}, app)
const ws = new WebSocket.Server({ server: server, path: '/ws' })
const { make: makeQuiz, vote: voteQuiz } = require('./quiz')

const quizes = [

]
console.log(quizes);
let connections = []

app.get('/quizes', function getQuizes (req, res) {
  res.send(quizes)
})

ws.on('connection', (sock, req) => {
  console.log('got ocnnection');
  connections = [...connections, sock]
})

server.listen(1234)
