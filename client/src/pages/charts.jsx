import React from 'react'
import "./App.css"
import { LeftMenu } from '../components/LeftMenu'
import { Charts } from '../components/Charts'

const charts = () => {
  return (
    <div className='App'>
      <LeftMenu />
      <Charts />
    </div>
  )
}

export default charts