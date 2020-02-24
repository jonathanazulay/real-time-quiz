import React from 'react';

const placeholderText = `Visualize the results in real-time of a poll: Anyone should be able to see the results of a poll. If user A is casting a vote "2", user B should in real-time be able to see that the point "2" has a value of 1.`
const randomGreeting = (() => {
  const greetings = [
    'Hej',
    'Yo',
    'Hey',
    'Hello',
    'Shalom',
    'Ciao',
    'Tjena',
    'Salam',
    'Namaste',
    'Hola',
    'Bonjour',
    'Guten tag',
  ]
  return greetings[Math.floor(Math.random() * (greetings.length))]
})()


export const CreatePoll = ({ onChangeText = (_e: any) => {}, onSubmit = () => {}, text = '' }) => (
  <div className="poll__form">
    <h2><span>{randomGreeting},</span><br /> what do you want to make a poll about today?</h2>
    <textarea placeholder={placeholderText} onChange={e => onChangeText(e.target.value)} value={text}></textarea>
    <button onClick={() => onSubmit()}>Continue...</button>
  </div>
)
