import React, { useContext } from 'react'
import Messages from './Messages'
import Input from './Input'
import { ChatContext } from '../context/ChatContext';
import { OpenSidebarContext } from '../context/OpenSidebarContext';

function Chat() {
  const { data } = useContext(ChatContext);
  const { openSidebar, setOpenSidebar } = useContext(OpenSidebarContext);

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar)
  }

  return (
    <div className='chat'>
      {data.user.photoURL
        ? <>
          <div className="chatLabel">
            <button id="toggleSidebarBtn" onClick={toggleSidebar}>
              <i className={"fa-solid fa-circle-chevron-" + (openSidebar ? "left" : "right")} />
            </button>
            <span className="chatInfo">
              <img src={data.user.photoURL} alt="" />
              <p>{data.user.username}</p>
              <div className="chatIcons">
                <i className="fa-solid fa-video"></i>
                <i className="fa-solid fa-circle-info"></i>
              </div>
            </span>
          </div>
          <Messages />
          <Input />
        </>
        : <div id='selectChatLabel'>
          <p>
            Search or select a user to chat
          </p>
        </div>
      }
    </div>
  )
}

export default Chat