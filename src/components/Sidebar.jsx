import React, { useContext } from 'react'
import Navbar from './Navbar'
import Search from './Search'
import Chats from './Chats'
import { OpenSidebarContext } from '../context/OpenSidebarContext';

function Sidebar() {
  const { openSidebar, setOpenSidebar } = useContext(OpenSidebarContext);

  return (
    <div className={'sidebar' + (openSidebar ? " openSidebar" : "")}>
      <Navbar />
      <Search />
      <Chats />
    </div>
  )
}

export default Sidebar