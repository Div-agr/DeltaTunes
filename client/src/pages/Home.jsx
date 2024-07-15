import React, {useState} from 'react'
import "./App.css"
import { LeftMenu } from '../components/LeftMenu'
import { MainContainer } from '../components/MainContainer'

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <div className='App'>
      <LeftMenu searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <MainContainer />
    </div>
  )
}

export default Home
