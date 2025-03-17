import React, { useEffect, useState } from 'react'
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");
export const Create = () => {
  const [jd, setJD] = useState('')
  const [questions, setquestions] = useState('')
  useEffect(() => {
    socket.on('recievequestions', (data) => {
      setquestions(data)
      console.log(questions)
    })

    return () => {
      socket.off('recievequestions')
    }
  } , [])

  function sendJD() {
    if(jd.trim() != "") {
      socket.emit('sendjd' , jd)
      setJD("")
    }
  }
  return (
    <div>
      <input
      type='text'
      onChange={e => setJD(e.target.value)}/>
      <button onClick={sendJD}>Send</button>


      <h3>{questions}</h3>
    </div>
  )
}
