function pubsub () {
  const topics = {}

  function getTopic (name) {
    return topics[name] || new Set()
  }

  function getSubscribedTopics (socket) {
    return Object.keys(topics).reduce((subscribedTopics, topicName) => (
      topics[topicName].has(socket)
        ? [...subscribedTopics, topicName]
        : subscribedTopics
    ), [])
  }

  return {
    subscribe (socket, topicName) {
      topics[topicName] = getTopic(topicName)
      topics[topicName].add(socket)
    },
    unsubscribe (socket, topic) {
      const topics = topic ? [getTopic(topic)] : getSubscribedTopics(socket)
      topics.forEach(t => t.delete(socket))
    },
    broadcast (topic, data) {
      getTopic(topic).forEach(socket => socket.send(data))
    },
  }
}

module.exports = pubsub
