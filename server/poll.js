const make = function makePoll (text, possibleVotes) {
  return {
    text,
    voters: new Set(),
    votes: possibleVotes.reduce((acc, possibleVote) => ({ ...acc, [possibleVote]: 0 }), {}),
  }
}

const vote = function votePoll (poll, vote, voter) {
  if (!(vote in poll.votes)) { throw new Error("not valid vote") }
  if (poll.voters.has(voter)) { throw new Error("voter already voted") }

  const newVotes = {
    ...poll.votes,
    [vote]: poll.votes[vote] + 1
  }

  return {
    ...poll,
    voters: new Set([...poll.voters, voter]),
    votes: newVotes
  }
}

module.exports = {
  make,
  vote,
}
