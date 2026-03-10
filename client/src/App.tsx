import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import MoviePlayer from './pages/MoviePlayer'
import Favorites from './pages/Favorites'
import Watchlist from './pages/Watchlist'
import ActorProfile from './pages/ActorProfile'
import History from './pages/History'
import Profile from './pages/Profile'
import Collections from './pages/Collections'
import SearchPage from './pages/SearchPage'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/movie/:id' element={<MoviePlayer />} />
      <Route path='/person/:id' element={<ActorProfile />} />
      <Route path='/favorites' element={<Favorites />} />
      <Route path='/watchlist' element={<Watchlist />} />
      <Route path='/history' element={<History />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/collections' element={<Collections />} />
      <Route path='/search' element={<SearchPage />} />
    </Routes>
  )
}

export default App
