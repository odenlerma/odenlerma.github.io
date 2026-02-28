import { useEffect } from 'react'
import './App.scss'
import HomePage from '@pages/HomePage'
import * as COMPONENTS from '@components'
import { ChatProvider } from '@/context/ChatContext'

function App() {
  useEffect(() => {
    console.log('If you are reading this, Greetings! Thank you for visiting and do not forget to hire me')
    console.log('Sincerely,')
    console.log('Audruey Gana')
  }, [])
  return (
    <ChatProvider>
      <HomePage />
      <COMPONENTS.CHAT_WIDGET />
    </ChatProvider>
  )
}

export default App
