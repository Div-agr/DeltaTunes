import React from 'react'
import "./App.css"
import { LeftMenu } from '../components/LeftMenu'
import { Playlist } from '../components/PlaylistsContainer'

const Playlists = () => {
  return (
    <div className='App'>
      <LeftMenu />
      <Playlist />
    </div>
  )
}

export default Playlists;
