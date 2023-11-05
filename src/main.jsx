import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthContextProvider } from './context/AuthContext'
import { ChatContextProvider } from './context/ChatContext'
import { OpenSidebarContextProvider } from './context/OpenSidebarContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <ChatContextProvider>
      <OpenSidebarContextProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>,
      </OpenSidebarContextProvider>
    </ChatContextProvider>
  </AuthContextProvider>
)