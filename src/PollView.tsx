import React from 'react';
import { Poll } from './poll'

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0)
const totalVotes = (poll: Poll) => sum(Object.values(poll.result))
const getPercentageVotes = (alternative: string, poll: Poll) => totalVotes(poll) === 0 ? 0 : 100 * (poll.result[alternative] / totalVotes(poll))
const height = (alternative: string, poll: Poll) => {
  let scaleToMax = 1 / (Math.max(...Object.values(poll.result)) / totalVotes(poll))
  if (totalVotes(poll) === 0) { scaleToMax = 0 }
  return getPercentageVotes(alternative, poll) * scaleToMax
}

export const PollView = ({ onVote = () => {}, poll }: { poll: Poll, onVote?: (vote: string) => any }) => (
  <div className="poll-view">
    <div style={{padding: '20px', maxWidth: '500px'}}>{poll.text}</div>
    <div className="poll-view__result">
      {
        Object.entries(poll.result).map(([alternative]) => (
          <div key={poll.id + alternative}>
            <div className="poll-view__bar"><div style={{ height: `${height(alternative, poll)}%` }}>
              <span className="poll-view__bar-percentage">{Math.round(getPercentageVotes(alternative, poll))}%</span>
            </div>
          </div>
          <button onClick={() => onVote(alternative)} className="poll-view__button"><span>{alternative}</span></button>
        </div>
        ))
      }
    </div>
  </div>
)
