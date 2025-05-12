import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const location = useLocation()

  const scrollToSection = (sectionId: string) => {
    // If we're not on the home page, navigate there first
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`
      return
    }

    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <footer className="bg-amber-100 text-amber-900 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">MoviesDB</h3>
            <p className="text-sm">
              Your ultimate destination for movies information, ratings, and reviews.
              Discover the latest releases and timeless classics.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-amber-700 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-amber-700 transition-colors">
                  Favorites
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('popular')}
                  className="hover:text-amber-700 transition-colors w-full"
                >
                  Popular Movies
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('top-rated')}
                  className="hover:text-amber-700 transition-colors w-full"
                >
                  Top Rated Movies
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('now-playing')}
                  className="hover:text-amber-700 transition-colors w-full"
                >
                  Now Playing
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('upcoming')}
                  className="hover:text-amber-700 transition-colors w-full"
                >
                  Upcoming Releases
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="hover:text-amber-700 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-amber-700 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="hover:text-amber-700 transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Me</h3>
            <div className="flex justify-center space-x-4">
              <a 
                href="https://www.facebook.com/rv.imman.7" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <img width="30" height="30" src="https://img.icons8.com/fluency/48/facebook-new.png" alt="facebook-new"/>
              </a>
              <a 
                href="https://x.com/rvimman_" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <img width="30" height="30" src="https://img.icons8.com/ios-filled/50/twitterx--v1.png" alt="twitterx--v2"/>
              </a>
              <a 
                href="https://www.instagram.com/rv_imman" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <img width="30" height="30" src="https://img.icons8.com/color/48/instagram-new--v1.png" alt="instagram-new--v1"/>
              </a>
              <a 
                href="https://www.linkedin.com/in/rv3d" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <img width="30" height="30" src="https://img.icons8.com/color/48/linkedin.png" alt="linkedin"/>
              </a>
              <a 
                href="https://github.com/Inman2004" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <img width="30" height="30" src="https://img.icons8.com/fluency/48/github.png" alt="github"/>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-amber-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              © {currentYear} MoviesDB. All rights reserved.
            </p>
            <p className="text-sm mt-2 md:mt-0">
              Powered by{' '}
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-amber-700 transition-colors"
              >
                TMDB
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
