import React from 'react'
import "./App.css"
import { Friends } from '../components/Friends'
import { LeftMenu } from '../components/LeftMenu'

const friends = () => {
  return (
    <div className='App'>
      <LeftMenu />
      <Friends />
    </div>
    
  )
}

export default friends;