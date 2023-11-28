import React, { useContext } from 'react'
import Messages from './Messages'
import Input from './Input'
import { ChatContext } from '../context/ChatContext';
import { OpenSidebarContext } from '../context/OpenSidebarContext';

function Chat() {
  const { activeChatInfo } = useContext(ChatContext);
  const { openSidebar, setOpenSidebar } = useContext(OpenSidebarContext);

  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar)
  }

  return (
    <div className='chat'>
      {activeChatInfo.otherUserInfo.photoURL
        ? <>
          <div className="chatLabel">
            <button id="toggleSidebarBtn" onClick={toggleSidebar}>
              <i className={"fa-solid fa-circle-chevron-" + (openSidebar ? "left" : "right")} />
            </button>
            <span className="activeChatInfo">
              {/* <img src={activeChatInfo.otherUserInfo.photoURL} alt="" /> */}
              {
                activeChatInfo.otherUserInfo.photoURL
                  ? <img src={activeChatInfo.otherUserInfo.photoURL} alt="" />
                  : <i className="fa-solid fa-user"></i>
              }
              <p>{activeChatInfo.otherUserInfo.username}</p>
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