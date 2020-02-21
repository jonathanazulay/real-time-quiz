const make = function makeQuiz (text, possibleVotes) {
  return {
    text,
    votes: possibleVotes.reduce((acc, v) => ({ ...acc, [v]: 0 }), {}),
  }
}

const vote = function vote (quiz, vote) {
  if (!(vote in quiz.votes)) { throw new Error("not valid vote") }
  const newVotes = {
    ...quiz.votes,
    [vote]: quiz.votes[vote] + 1
  }
  return {
    ...quiz,
    votes: newVotes
  }
}

module.exports = {
  make,
  vote,
}
