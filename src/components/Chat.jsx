import React, { useContext } from 'react'
import Messages from './Messages'
import Input from './Input'
import { ChatContext } from '../context/ChatContext';

function Chat() {
  const { data } = useContext(ChatContext);

  return (
    <div className='chat'>
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
        <div className="chatIcons">
          <span className="fa-solid fa-video"></span>
          <span className="fa-solid fa-circle-info"></span>
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  )
}

export default Chat