import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  movieId: number;
  text: string;
  rating: number;
  date: string;
  author: string;
}

interface ReviewsProps {
  movieId: number;
}

const Reviews = ({ movieId }: ReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const { themeClasses } = useTheme();

  useEffect(() => {
    const saved = localStorage.getItem(`reviews_${movieId}`);
    if (saved) {
      setReviews(JSON.parse(saved));
    }
  }, [movieId]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const newReview: Review = {
      id: Date.now().toString(),
      movieId,
      text: newReviewText,
      rating: newReviewRating,
      date: new Date().toISOString(),
      author: 'Anonymous User'
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${movieId}`, JSON.stringify(updatedReviews));
    setNewReviewText('');
    setNewReviewRating(5);
  };

  return (
    <div className={`mt-12 border-t ${themeClasses.border}/30 pt-8`}>
      <h2 className={`text-2xl font-bold mb-6 ${themeClasses.textPrimary}`}>User Reviews</h2>

      {/* Write a review */}
      <div className={`bg-black/30 p-6 rounded-xl border ${themeClasses.border}/50 mb-8`}>
        <h3 className={`text-lg font-semibold mb-4 ${themeClasses.textSecondary}`}>Write a Review</h3>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReviewRating(star)}
                  className={`p-1 focus:outline-none`}
                >
                  <Star
                    className={`w-8 h-8 ${star <= newReviewRating ? `${themeClasses.textPrimary} fill-current` : 'text-gray-500'}`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <textarea
              className={`w-full bg-black/50 ${themeClasses.textPrimary} border ${themeClasses.border}/50 rounded-lg p-3 focus:outline-none focus:border-${themeClasses.accent.split('-')[1]}-500`}
              rows={4}
              placeholder="What did you think of the movie?"
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={`px-6 py-2.5 ${themeClasses.accent} text-white rounded-full ${themeClasses.accentHover} transition-colors duration-300 font-medium`}
          >
            Submit Review
          </button>
        </form>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className={`${themeClasses.textSecondary} text-center py-4`}>No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map(review => (
            <div key={review.id} className={`bg-black/20 p-5 rounded-xl border ${themeClasses.border}/30`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${themeClasses.accent}/20 flex items-center justify-center`}>
                    <span className={`${themeClasses.textPrimary} font-bold`}>{review.author[0]}</span>
                  </div>
                  <div>
                    <h4 className={`font-semibold ${themeClasses.textPrimary}`}>{review.author}</h4>
                    <span className={`text-xs ${themeClasses.textSecondary}`}>
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className={`w-4 h-4 ${themeClasses.textPrimary} fill-current`} />
                  <span className={`${themeClasses.textPrimary} font-bold`}>{review.rating}/5</span>
                </div>
              </div>
              <p className={`text-gray-300 leading-relaxed`}>{review.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;
