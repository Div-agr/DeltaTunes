import React from 'react'
import "./App.css"
import { LeftMenu } from '../components/LeftMenu'
import { SearchResults } from '../components/SearchResults'

const Search = () => {
  return (
    <div className='App'>
      <LeftMenu />
      <SearchResults />
    </div>
  )
}

export default Search