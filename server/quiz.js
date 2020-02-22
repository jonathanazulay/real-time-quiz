const make = function makeQuiz (text, possibleVotes) {
  return {
    text,
    voters: new Set(),
    votes: possibleVotes.reduce((acc, possibleVote) => ({ ...acc, [possibleVote]: 0 }), {}),
  }
}

const vote = function voteQuiz (quiz, vote, voter) {
  if (!(vote in quiz.votes)) { throw new Error("not valid vote") }
  if (quiz.voters.has(voter)) { throw new Error("voter already voted") }

  const newVotes = {
    ...quiz.votes,
    [vote]: quiz.votes[vote] + 1
  }

  return {
    ...quiz,
    voters: new Set([...quiz.voters, voter]),
    votes: newVotes
  }
}

module.exports = {
  make,
  vote,
}
