const make = function makePoll (text, possibleVotes) {
  return {
    text,
    voters: {},
    votes: possibleVotes.reduce((acc, possibleVote) => ({ ...acc, [possibleVote]: 0 }), {}),
  }
}

const removeVote = function removeVotePoll (poll, voter) {
  const vote = poll.voters[voter]
  const newVotes = {
    ...poll.votes,
    [vote]: poll.votes[vote] - 1
  }

  return {
    ...poll,
    voters: {
      ...poll.voters,
      [voter]: undefined,
    },
    votes: newVotes
  }
}

const vote = function votePoll (poll, vote, voter) {
  if (!(vote in poll.votes)) { throw new Error("not valid vote") }

  if (poll.voters[voter] !== undefined) {
    poll = removeVote(poll, voter)
  }

  const newVotes = {
    ...poll.votes,
    [vote]: poll.votes[vote] + 1
  }

  return {
    ...poll,
    voters: {
      ...poll.voters,
      [voter]: vote,
    },
    votes: newVotes
  }
}

module.exports = {
  make,
  vote,
}
