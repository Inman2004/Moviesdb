import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MovieSection from '../components/MovieSection';
import { getPersonDetails, getPersonMovieCredits } from '../services/api';
import { useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Calendar, MapPin, User as UserIcon } from 'lucide-react';

interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  profile_path: string;
  birthday: string;
  place_of_birth: string;
  known_for_department: string;
}

interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  vote_average: number;
  genres: string[];
}

const ActorProfile = () => {
  const { id } = useParams();
  const [person, setPerson] = useState<PersonDetails | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { themeClasses } = useTheme();

  useEffect(() => {
    const fetchPersonData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        window.scrollTo(0, 0);
        const personDetails = await getPersonDetails(Number(id));
        const personMovies = await getPersonMovieCredits(Number(id));
        setPerson(personDetails);
        setMovies(personMovies);
      } catch (error) {
        console.error('Error fetching person data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPersonData();
  }, [id]);

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${themeClasses.bgGradient} flex flex-col`}>
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className={`w-32 h-32 ${themeClasses.accent}/20 rounded-full flex items-center justify-center`}>
              <div className={`w-24 h-24 ${themeClasses.accent}/40 rounded-full animate-spin`}></div>
            </div>
            <p className={`${themeClasses.textPrimary} mt-4 text-xl font-semibold`}>Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!person) {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${themeClasses.bgGradient} flex flex-col`}>
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className={`${themeClasses.textPrimary} text-xl font-semibold animate-fade-in`}>Person not found</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${themeClasses.bgGradient} flex flex-col transition-colors duration-300`}>
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow animate-fade-in">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Image */}
          <div className="md:w-1/3 lg:w-1/4">
            <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
              <img
                src={person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                alt={person.name}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Person Details */}
          <div className="md:w-2/3 lg:w-3/4 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{person.name}</h1>

            <div className="flex flex-wrap gap-6 mb-8">
              {person.known_for_department && (
                <div className="flex items-center gap-2">
                  <UserIcon className={`w-5 h-5 ${themeClasses.textSecondary}`} />
                  <span className="text-gray-300">{person.known_for_department}</span>
                </div>
              )}
              {person.birthday && (
                <div className="flex items-center gap-2">
                  <Calendar className={`w-5 h-5 ${themeClasses.textSecondary}`} />
                  <span className="text-gray-300">{new Date(person.birthday).toLocaleDateString()}</span>
                </div>
              )}
              {person.place_of_birth && (
                <div className="flex items-center gap-2">
                  <MapPin className={`w-5 h-5 ${themeClasses.textSecondary}`} />
                  <span className="text-gray-300">{person.place_of_birth}</span>
                </div>
              )}
            </div>

            {person.biography && (
              <div className="mb-8">
                <h2 className={`text-2xl font-bold mb-4 ${themeClasses.textPrimary}`}>Biography</h2>
                <div className={`prose prose-invert max-w-none text-gray-300 leading-relaxed`}>
                  {person.biography.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Known For Section */}
        {movies.length > 0 && (
          <div className={`mt-12 border-t ${themeClasses.border}/30 pt-8`}>
            <MovieSection title="Known For" movies={movies} loading={false} />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ActorProfile;
