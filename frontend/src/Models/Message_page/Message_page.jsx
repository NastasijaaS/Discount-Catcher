import './message_page.css'

import React from 'react'

import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react';

import { user_messages } from '../../Axios/Axios.js'

import Message from '../Message/Message.jsx'

export default function Message_page() {

  const navigate = useNavigate()
  let user = useSelector(state => state.user);

  const [messages, setMessages] = useState([])

  const fetch_messages = async () => {
    const response = await user_messages({user_id: user.id})
    setMessages(response.data)
  }

  useEffect(() => {
    if(user)
      fetch_messages()
  }, [])

  if(user) {
    return (
      <div className="message_main_div">
        {
          (messages) && (messages.map(x => {
            return (
              <Message message_data={x}/>
            )
          }))
        }
      </div>
    )
  } else {
    return (
      <div>You are not logged in!</div>
    )
  }
}
