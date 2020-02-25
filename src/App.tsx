import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { CreatePoll } from './CreatePoll'
import { PollView } from './PollView'
import { Poll } from './poll'

const addr = `ws://${window.location.host}/ws`

interface PollAPI {
  create: (text: string) => void,
  vote: (pollId: string, vote: string) => void,
  join: (pollId: string) => void,
}

const usePollBackend: () => [Poll | undefined, PollAPI | undefined] = function usePollBackend() {
  const [currentPoll, setCurrentPoll] = useState<Poll | undefined>(undefined)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const api = useRef<PollAPI>({
    create: (text) => ws.current?.send(JSON.stringify({ type: 'createpoll', text })),
    join: (pollId) => ws.current?.send(JSON.stringify({ type: 'subscribepoll', pollId: pollId })),
    vote: (pollId, vote) => ws.current?.send(JSON.stringify({ type: 'votepoll', pollId: pollId, vote })),
  })
  const ws = useRef<WebSocket>()
  useEffect(() => {
    ws.current = new WebSocket(addr)
    ws.current.addEventListener('message', (m) => {
      const message = JSON.parse(m.data)
      setCurrentPoll({
        id: message.id,
        activeVote: message.activeVote,
        result: message.result,
        text: message.text
      })
    })
    ws.current.addEventListener('open', (s) => setIsOpen(true))
  }, [])
  return [
    currentPoll,
    isOpen ? api.current : undefined
  ]
}

function App() {
  const [text, setText] = useState<string>()
  const [activePoll, PollAPI] = usePollBackend()
  const resultPageEl = useRef<any>(null)

  useEffect(() => {
    const urlFragment = window.location.pathname.substring(1)
    if (!urlFragment) { return }
    window.history.pushState(null, '', urlFragment)
    PollAPI && PollAPI.join(urlFragment)
  }, [PollAPI])

  useEffect(() => {
    const urlFragment = window.location.pathname.substring(1)
    if (!activePoll || activePoll.id === urlFragment) { return }
    window.history.pushState(null, '', activePoll?.id)
  }, [activePoll])

  useLayoutEffect(() => {
    if (!activePoll || !resultPageEl.current) { return }
    window.scrollTo({
      top: resultPageEl.current.offsetTop,
      left: 0,
      behavior: 'smooth'
    })
  }, [activePoll])

  return (
    <div>
      <div className="slide">
        {
          PollAPI
            ? <CreatePoll
                onSubmit={PollAPI ? () => PollAPI.create(text || '') : () => { }}
                onChangeText={setText}
                text={text} />
            : null}
      </div>
      {
        activePoll !== undefined
          ? <div className="slide" ref={resultPageEl}>
              <PollView
                onVote={(alternative) => PollAPI?.vote(activePoll?.id, alternative)}
                poll={activePoll} />
            </div>
          : null
      }
    </div>
  )
}

export default App
