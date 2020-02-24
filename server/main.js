const express = require('express')
const WebSocket = require('ws')
const http = require('http')
const cookie = require('cookie')
const app = express()
const path = require('path')

const { make: makePoll, vote: votePoll } = require('./poll')
const createPubsub = require('./pubsub')

let polls = {}
let pubsub = createPubsub()

function handleMessage(fromSocket, data, user) {
  if (!data.type) { return }
  switch (data.type) {
    case 'votepoll':
      createVote(data.pollId, data.vote, user)
      broadcastPoll(data.pollId)
      break
    case 'createpoll':
      const votedPoll = createPoll(data.text)
      subscribeToPoll(fromSocket, votedPoll)
      break
    case 'subscribepoll':
      subscribeToPoll(fromSocket, polls[data.pollId])
      break
    default:
      break
  }
}

function subscribeToPoll(socket, poll) {
  pubsub.unsubscribe(socket)
  pubsub.subscribe(socket, poll.id)
  broadcastPoll(poll.id)
}

function broadcastPoll(pollId) {
  const poll = polls[pollId]
  if (!poll) { return }
  pubsub.broadcast(poll.id, JSON.stringify({ id: poll.id, activeVote: null, text: poll.poll.text, result: poll.poll.votes }))
}

function createVote(pollId, vote, user) {
  if (!polls[pollId]) { throw new Error("poll does not exist") }
  polls[pollId] = {
    ...polls[pollId],
    poll: votePoll(polls[pollId].poll, vote, user)
  }
}

function createPoll(text) {
  const id = (Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)).toString(36);
  const newPoll = {
    id,
    voters: new Set(),
    poll: makePoll(text, ["0", "1/2", "1", "2", "3", "5", "8", "13"])
  }
  polls = {
    ...polls,
    [id]: newPoll,
  }
  return newPoll
}

app.use(express.static('./build'))
app.use('*', function (req, res) {
  res.sendFile(path.resolve(__dirname + '/../build/index.html'))
});

const server = http.createServer({}, app)
const ws = new WebSocket.Server({ server: server, path: '/ws' })

ws.on('headers', (headers, req, res) => {
  const userCookie = cookie.parse(req.headers.cookie || '')
  if (!userCookie.voter) {
    const newCookie = cookie.serialize('voter', Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(36))
    headers.push('Set-Cookie: ' + newCookie)
    req.headers.cookie = newCookie // Hack to get the new cookie in the connection callback
  }
});

ws.on('connection', (sock, req) => {
  const user = (req.headers.cookie && cookie.parse(req.headers.cookie).voter)
  if (!user) { sock.close() }
  sock.on('message', (d) => {
    let message;
    try {
      message = JSON.parse(d)
    } catch (e) { console.log(e) }
    if (message) {
      try { handleMessage(sock, message, user) } catch (e) { console.log(e) }
    }
  });
})

server.listen(1234)
