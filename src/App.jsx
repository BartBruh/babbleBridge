import { useState } from 'react'
import ChatContainer from './components/chatContainer'
import "./css/App.css";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ChatContainer />
    </>
  )
}

export default App
