import React, { useState, useEffect } from 'react';
import { Star, User, MessageSquare, Send, CheckCircle2, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getReviewsByCafeId, postReview } from '../lib/getCafes';
import { Review, Cafe } from '../types/cafe';
import { useAuth } from '../context/AuthContext';
import { LoginModal } from '../components/auth/LoginModal';

interface ReviewSectionProps {
  cafe: Cafe;
  onRefresh?: () => void;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ cafe, onRefresh }) => {
  const cafeId = cafe.id;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadReviews();
  }, [cafeId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await getReviewsByCafeId(cafeId);
      setReviews(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await postReview(cafeId, rating, comment);

      // Reset form
      setRating(0);
      setComment('');
      setShowSuccess(true);

      // Refresh list
      await loadReviews();

      // Refresh parent cafe data
      if (onRefresh) onRefresh();

      // Clear success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="mt-20 mb-24 max-w-6xl mx-auto px-6 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="space-y-2">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold text-[#1E2020] tracking-tight leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Community Voices
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#7A8478] font-medium"
          >
            Real experiences from the WIMC community.
          </motion.p>
        </div>

        {cafe.displayRating > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-6 bg-white pl-6 pr-8 py-4 rounded-[2rem] border border-[#EAEEE8] shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A8B0A0]">Rating</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-[#1E2020]">{cafe.displayRating.toFixed(1)}</span>
                <div className="flex items-center text-[#FFB800]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 
                      ${i < Math.round(cafe.displayRating) ? 'fill-[#FFB800]' : 'text-[#EAEEE8]'} 
                    `} />
                  ))}
                </div>
              </div>
            </div>
            <div className="w-px h-10 bg-[#EAEEE8]" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A8B0A0]">Count</span>
              <span className="text-xl font-bold text-[#1E2020]">{cafe.displayReviewCount} <span className="text-sm font-medium text-[#7A8478]">Total</span></span>
            </div>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Review Form - Stick it for better UX */}
        <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] border border-[#EAEEE8] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 relative overflow-hidden"
          >
            {/* Background design elements */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#F8F6F1] rounded-full blur-3xl opacity-50" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#0b4e9d]/5 rounded-full blur-2xl" />

            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-[#1E2020] mb-8" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Add your voice
              </h3>

              {isAuthenticated ? (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#A8B0A0] block mb-4">
                      Your Rating
                    </label>
                    <div className="flex justify-between px-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="group focus:outline-none transition-all duration-300 relative"
                        >
                          <Star
                            className={`w-10 h-10 transition-all duration-300
                              ${(hoverRating || rating) >= star
                                ? 'fill-[#FFB800] text-[#FFB800] scale-110'
                                : 'text-[#EAEEE8]'
                              }
                              group-hover:scale-125
                            `}
                          />
                          {rating === star && (
                            <motion.div
                              layoutId="star-active"
                              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#FFB800] rounded-full"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#A8B0A0] block mb-4">
                      The Experience
                    </label>
                    <div className="group relative">
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        maxLength={500}
                        placeholder="Share what makes this place special..."
                        className="w-full h-40 bg-[#FBFBFB] rounded-3xl p-6 text-[15px] font-medium
                                  border border-[#EAEEE8] focus:outline-none focus:ring-4 
                                  focus:ring-[#0b4e9d]/5 focus:border-[#0b4e9d]/20 transition-all 
                                  resize-none placeholder-[#A8B0A0] leading-relaxed shadow-inner"
                      />
                      <div className="absolute bottom-4 right-6 flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#EAEEE8] group-focus-within:bg-[#0b4e9d] transition-colors" />
                        <span className="text-[11px] font-bold text-[#A8B0A0]">
                          {comment.length}/500
                        </span>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#FFF1F1] text-[#E53E3E] text-xs font-bold py-4 px-6 rounded-2xl flex items-center gap-3 border border-[#E53E3E]/10"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#E53E3E]" />
                      {error}
                    </motion.div>
                  )}

                  <AnimatePresence>
                    {showSuccess && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-[#F0FFF4] text-[#2F855A] text-sm font-bold py-4 px-6 rounded-2xl flex items-center gap-3 border border-[#2F855A]/10 mb-2"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Posted anonymously!
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full py-5 rounded-3xl bg-[#0b4e9d] text-white
                               text-[13px] font-black uppercase tracking-[0.2em]
                               hover:bg-[#0a3d7a] transition-all duration-300
                               shadow-[0_15px_35px_rgba(11,78,157,0.25)]
                               active:scale-[0.98]
                               flex items-center justify-center gap-3
                               ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {submitting ? (
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Post Review
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div
                  onClick={() => setShowLoginPrompt(true)}
                  className="border-2 border-dashed border-[#EAEEE8] rounded-[2rem] p-8 
                  text-center cursor-pointer hover:border-[#0b4e9d]/30 transition-all group bg-[#FBFBFB]/50"
                >
                  <div className="w-12 h-12 bg-[#0b4e9d]/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#0b4e9d] transition-colors">
                    <User className="w-5 h-5 text-[#0b4e9d] group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-[#1E2020] text-sm font-bold mb-1">
                    Sign in to leave a review
                  </p>
                  <p className="text-[#7A8478] text-[11px] font-medium">
                    Takes 30 seconds · No spam
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-[#0b4e9d]/10 border-t-[#0b4e9d] rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#0b4e9d]/5 animate-pulse" />
                </div>
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#A8B0A0] animate-pulse">Gathering community wisdom...</p>
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              {reviews.map((review, i) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(i * 0.1, 0.4), duration: 0.6 }}
                  className="bg-white rounded-[2rem] border border-[#EAEEE8] p-8 shadow-[0_5px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_45px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-1 relative group"
                >
                  {/* Subtle quote icon decoration */}

                  <div className="flex items-start justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#EAF0FB] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                        <img
                          src={`${import.meta.env.BASE_URL}media/map-pin.png`}
                          alt="WIMC"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-base font-bold text-[#1E2020] tracking-tight">{review.anonymousId}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-[11px] font-bold text-[#A8B0A0] uppercase tracking-wider">
                            {formatDate(review.createdAt)}
                          </p>
                          <div className="w-1 h-1 rounded-full bg-[#EAEEE8]" />
                          <div className="flex items-center gap-0.5 text-[#FFB800]">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-[#FFB800]' : 'text-[#EAEEE8]'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {review.comment && (
                    <div className="relative z-10">
                      <p className="text-[16px] text-[#4A4E4F] leading-[1.7] font-medium italic">
                        "{review.comment}"
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#F8F6F1]/50 rounded-[3rem] border-2 border-dashed border-[#EAEEE8] py-32 px-12 text-center"
            >
              <div className="w-24 h-24 rounded-[2rem] bg-white flex items-center justify-center mx-auto mb-10 shadow-[0_10px_30px_rgba(0,0,0,0.04)] rotate-3">
                <MessageSquare className="w-10 h-10 text-[#0b4e9d]/20" />
              </div>
              <h4 className="text-3xl font-bold text-[#1E2020] mb-6" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Silence is golden...
              </h4>
              <p className="text-[16px] text-[#7A8478] max-w-sm mx-auto leading-relaxed font-medium mb-10">
                But your thoughts are more valuable. Be the first to grace this café with a review.
              </p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className="w-5 h-5 text-[#EAEEE8] animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      <LoginModal 
        isOpen={showLoginPrompt} 
        onClose={() => setShowLoginPrompt(false)} 
        dismissible={false} 
      />
    </div>
  );
};
