import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { FavoritesProvider } from './context/FavoritesContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <FavoritesProvider>
        <div><Toaster position="bottom-right" reverseOrder={false} toastOptions={{ duration: 3000 }} /></div>
        <App />
      </FavoritesProvider>
    </BrowserRouter>
  </StrictMode>,
)
