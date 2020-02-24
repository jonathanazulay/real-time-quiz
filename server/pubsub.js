function pubsub () {
  const topics = {}

  function getSubscribedTopics (socket) {
    return Object.keys(topics).reduce((subscribedTopics, topicName) => (
      topics[topicName].has(socket)
        ? [...subscribedTopics, topicName]
        : subscribedTopics
    ), [])
  }

  return {
    subscribe (socket, topicName) {
      topics[topicName] = topics[topicName] || new Set()
      topics[topicName].add(socket)
    },
    unsubscribe (socket, topicName) {
      const unsibscribeThese = topicName ? [topicName] : getSubscribedTopics(socket)
      unsibscribeThese.forEach(t => topics[t].delete(socket))
    },
    broadcast (topicName, data) {
      topics[topicName].forEach(socket => { socket.send(data) })
    },
  }
}

module.exports = pubsub
