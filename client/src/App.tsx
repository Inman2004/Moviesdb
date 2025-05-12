import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import MoviePlayer from './pages/MoviePlayer'
import Favorites from './pages/Favorites'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/movie/:id' element={<MoviePlayer />} />
      <Route path='/favorites' element={<Favorites />} />
    </Routes>
  )
}

export default App
