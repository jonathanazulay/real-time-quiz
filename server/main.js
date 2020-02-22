const express = require('express')
const WebSocket = require('ws')
const http = require('http')
const cookieParser = require('cookie-parser')
const cookie = require('cookie')
const app = express()

const server = http.createServer({}, app)
const ws = new WebSocket.Server({ server: server, path: '/ws' })
const { make: makeQuiz, vote: voteQuiz } = require('./quiz')
const createPubsub = require('./pubsub')

let quizes = {}
let pubsub = createPubsub()

function handleMessage (fromSocket, data, user) {
  if (!data.type) { return }
  switch (data.type) {
    case 'votequiz':
      createVote(data.quizId, data.vote, user)
      break
    case 'createquiz':
      createQuiz(data.text)
      break
    case 'subscribequiz':
      createSubscription(fromSocket, data.quizId)
      pubsub.broadcast(data.quizId, 'hello from ' + data.quizId)
      break
    default:
      break
  }
}

function createSubscription (socket, quizId) {
  pubsub.subscribe(socket, quizId)
}

function createVote (quizId, vote, user) {
  if (!quizes[quizId]) { throw new Error("quiz does not exist") }
  quizes[quizId] = {
    ...quizes[quizId],
    quiz: voteQuiz(quizes[quizId].quiz, vote, user)
  }
}

function createQuiz (text) {
  const id = (Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)).toString(36);
  const newQuiz = {
    id,
    voters: new Set(),
    quiz: makeQuiz(text, ["1/2", "2", "4"])
  }
  quizes = {
    ...quizes,
    [id]: newQuiz,
  }
  return newQuiz
}

app.use(cookieParser())
app.use((req, res, next) => {
  if (req.cookies.voter) { return next() }
  res.cookie('voter', Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(36))
  next()
})

app.get('/quizes', function getQuizes (req, res) {
  res.send(quizes)
})

ws.on('connection', (sock, req) => {
  const user = req.headers.cookie && cookie.parse(req.headers.cookie).voter
  //connections.push(sock)
  sock.on('message', (d) => {
    let message;
    try {
      message = JSON.parse(d)
    } catch (e) { console.log(e) }
    if (message) {
      try { handleMessage(sock, message, user) } catch (e) { }
    }
  });
})

server.listen(1234)


/*
  console.log(handleNewQuiz('Göra frukost'))
  console.log(handleNewQuiz('Göra frukost'))
  console.log(handleNewQuiz('Göra frukost'))
  console.log(handleNewQuiz('Göra frukost'))
  console.log(handleVote(
    quizes[Object.keys(quizes)[3]].id,
    "2",
    "kallenaka"
  ))
  console.log(handleVote(
    quizes[Object.keys(quizes)[3]].id,
    "2",
    "kallenaka2"
  ))

  console.log(quizes[Object.keys(quizes)[3]])
  */
