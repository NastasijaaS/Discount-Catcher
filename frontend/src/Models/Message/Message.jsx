import React from 'react'
import './message.css'

import { read_message } from '../../Axios/Axios.js'
import { useState, useEffect } from 'react';


export default function Message({message_data}) {

  const [messageStatus, setMessageStatus] = useState(message_data.status)

  const set_read = async () => {
    if(!messageStatus) {
      await read_message({message_id: message_data.message_id})
      setMessageStatus(true)
      const div = document.getElementById(message_data.message_id)
      div.classList.toogle('unread_message')
    }
  }

  return (
    <div className={messageStatus ? 'message old_message' : 'message new_message'} onClick={() => set_read()}>
      <label className="message_data">{message_data.data}</label>
    </div>
  )
}
