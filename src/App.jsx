import { useState, useEffect } from 'react'
import './App.scss'
import HomePage from '@pages/HomePage'

function App() {
  useEffect(() => {
    console.log('If you are reading this, Greetings! Thank you for visiting and do not forget to hire me')
    console.log('Sincerely,')
    console.log('Audruey Gana')
  }, [])
  return (
    <>
      <HomePage />
    </>
  )
}

export default App
