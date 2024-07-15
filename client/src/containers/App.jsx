import React,{Suspense} from 'react'
import { Routes, Route, Sus} from "react-router-dom"
import { Layout, AuthLayout } from '../layouts'
import {Home, Authentication, SignUp, Playlists, Search, Friends, Charts, Party} from "../pages"


const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>

        <Route element={<Layout />}>
          <Route path="/Home/*" element={<Home />} />
        </Route>

        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Authentication />} />
        </Route>

        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Authentication />} />
        </Route>

        <Route path="/signup/*" element={<AuthLayout />}>
          <Route index element={<SignUp/>} />
        </Route>

        <Route path="/playlists/*" element={<Layout />}>
          <Route index element={<Playlists/>} />
        </Route>

        <Route path="/friends/*" element={<Layout />}>
          <Route index element={<Friends />} />
        </Route>

        <Route path="/charts/*" element={<Layout />}>
          <Route index element={<Charts />} />
        </Route>

        <Route path="/party/*" element={<Layout />}>
          <Route index element={<Party />}/>
        </Route>

        <Route path="/search/*" element={<Layout />}>
          <Route index element={<Search/>}></Route>
        </Route>

      </Routes>
    </Suspense>
  )
}

export default App