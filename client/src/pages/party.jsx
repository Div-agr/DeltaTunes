import React from 'react'
import "./App.css"
import { LeftMenu } from '../components/LeftMenu'
import { Party } from '../components/Party'

const party = () => {
  return (
    <div className='App'>
        <LeftMenu />
        <Party />
    </div>
  )
}

export default party