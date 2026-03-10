import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { FavoritesProvider } from './context/FavoritesContext'
import { WatchlistProvider } from './context/WatchlistContext'
import { ThemeProvider } from './context/ThemeContext'
import { WatchedProvider } from './context/WatchedContext'
import { CollectionsProvider } from './context/CollectionsContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <FavoritesProvider>
          <WatchlistProvider>
            <WatchedProvider>
              <CollectionsProvider>
                <div><Toaster position="bottom-right" reverseOrder={false} toastOptions={{ duration: 3000 }} /></div>
                <App />
              </CollectionsProvider>
            </WatchedProvider>
          </WatchlistProvider>
        </FavoritesProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
