import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, ThumbsUp, Plus, X, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Review, Product } from '../../types';
import { useShop } from '../../context/ShopContext';
import { getReviewsForProductFromDB } from '../../lib/db';

interface ProductReviewsProps {
  product: Product;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ product }) => {
  const { showToast, currentUser, setIsAuthModalOpen, submitVerifiedReview, checkIsPurchased } = useShop();

  const [reviewsList, setReviewsList] = useState<Review[]>(product.reviews || []);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest'>('recent');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isUserVerifiedBuyer, setIsUserVerifiedBuyer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for writing a review
  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');
  const [formName, setFormName] = useState(currentUser?.name || '');

  // Load reviews from Firestore
  useEffect(() => {
    let isMounted = true;
    const fetchReviews = async () => {
      try {
        const dbReviews = await getReviewsForProductFromDB(product.id);
        if (isMounted && dbReviews.length > 0) {
          setReviewsList(dbReviews);
        } else if (isMounted && product.reviews && product.reviews.length > 0) {
          setReviewsList(product.reviews);
        }
      } catch (err) {
        console.warn('Error loading product reviews from Firestore:', err);
      }
    };
    fetchReviews();
    return () => {
      isMounted = false;
    };
  }, [product.id, product.reviews]);

  // Check verified purchase when opening write modal
  useEffect(() => {
    if (currentUser) {
      setFormName(currentUser.name);
      checkIsPurchased(product.id).then((purchased) => {
        setIsUserVerifiedBuyer(purchased);
      });
    } else {
      setIsUserVerifiedBuyer(false);
    }
  }, [currentUser, product.id, checkIsPurchased]);

  const handleVoteHelpful = (reviewId: string) => {
    setReviewsList((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          const already = r.userVotedHelpful;
          return {
            ...r,
            helpfulCount: already ? r.helpfulCount - 1 : r.helpfulCount + 1,
            userVotedHelpful: !already,
          };
        }
        return r;
      })
    );
    showToast('Feedback noted', 'Thank you for your feedback!');
  };

  const handleOpenWriteModal = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsWriteModalOpen(true);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formComment.trim()) {
      showToast('Incomplete Review', 'Please fill in all review fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitVerifiedReview(product.id, formRating, formTitle.trim(), formComment.trim());
      if (res.success) {
        // Append locally
        const newRev: Review = {
          id: res.reviewId || `rev-${Date.now()}`,
          author: formName.trim() || currentUser?.name || 'Flagship Member',
          rating: formRating,
          date: 'Just now',
          verified: res.isVerified,
          title: formTitle.trim(),
          comment: formComment.trim(),
          helpfulCount: 0,
          userVotedHelpful: false,
        };
        setReviewsList((prev) => [newRev, ...prev]);
        setIsWriteModalOpen(false);
        setFormTitle('');
        setFormComment('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReviews = reviewsList
    .filter((r) => (filterRating === 'all' ? true : r.rating === filterRating))
    .sort((a, b) => {
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'lowest') return a.rating - b.rating;
      return 0; // recent
    });

  // Calculate rating breakdown distribution
  const totalCount = reviewsList.length;
  const rating5 = reviewsList.filter((r) => r.rating === 5).length;
  const rating4 = reviewsList.filter((r) => r.rating === 4).length;
  const rating3 = reviewsList.filter((r) => r.rating === 3).length;
  const rating2 = reviewsList.filter((r) => r.rating === 2).length;
  const rating1 = reviewsList.filter((r) => r.rating === 1).length;

  return (
    <div id="product-reviews-section" className="space-y-8">
      {/* Top Rating Summary Card */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Rating big score */}
          <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0 md:pr-6">
            <div className="text-5xl font-black text-black tracking-tight">
              {product.rating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-1 text-amber-500 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(product.rating)
                      ? 'fill-amber-500 text-amber-500'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500">
              Based on <strong>{totalCount}</strong> verified owner reviews
            </p>
            <div className="mt-4 flex items-center justify-center md:justify-start space-x-2 text-xs text-emerald-700 font-bold">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>100% Genuine Authenticated Purchases</span>
            </div>
          </div>

          {/* Rating distribution progress bars */}
          <div className="space-y-2 text-xs">
            {[
              { star: 5, count: rating5 },
              { star: 4, count: rating4 },
              { star: 3, count: rating3 },
              { star: 2, count: rating2 },
              { star: 1, count: rating1 },
            ].map(({ star, count }) => {
              const pct = totalCount > 0 ? (count / totalCount) * 100 : 0;
              return (
                <div
                  key={star}
                  onClick={() => setFilterRating(filterRating === star ? 'all' : star)}
                  className="flex items-center space-x-3 cursor-pointer group"
                >
                  <span className="w-8 text-gray-600 group-hover:text-black font-bold">
                    {star} ★
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full bg-black rounded-full transition-all duration-500"
                    />
                  </div>
                  <span className="w-8 text-right text-gray-400 text-[11px] font-mono">{count}</span>
                </div>
              );
            })}
          </div>

          {/* Write a review button */}
          <div className="text-center space-y-3">
            <h4 className="text-sm font-black uppercase text-black tracking-tight">Own this accessory?</h4>
            <p className="text-xs text-gray-500 font-normal">
              Share your real-world experience and earn 50 NovaCoins reward.
            </p>
            <button
              onClick={handleOpenWriteModal}
              className="px-6 py-3 rounded-full bg-black hover:bg-[#EB0028] text-white font-bold text-xs uppercase tracking-widest transition-all shadow-md inline-flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Sort bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center space-x-2 overflow-x-auto max-w-full pb-1 text-xs">
          <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Filter:</span>
          <button
            onClick={() => setFilterRating('all')}
            className={`px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              filterRating === 'all'
                ? 'bg-black text-white border-black'
                : 'bg-white border-gray-200 text-gray-600 hover:text-black'
            }`}
          >
            All Ratings ({totalCount})
          </button>
          {[5, 4, 3].map((star) => (
            <button
              key={star}
              onClick={() => setFilterRating(star)}
              className={`px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                filterRating === star
                  ? 'bg-[#EB0028] text-white border-[#EB0028]'
                  : 'bg-white border-gray-200 text-gray-600 hover:text-black'
              }`}
            >
              {star} Stars
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-gray-200 rounded-full px-3 py-1.5 text-black text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black cursor-pointer shadow-xs"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="p-8 bg-gray-50 border border-gray-200 rounded-2xl text-center text-xs text-gray-500">
            No reviews yet for this rating. Be the first to share your experience!
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 bg-white border border-gray-200 rounded-2xl space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-black uppercase">
                    {rev.author?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs sm:text-sm font-bold text-black">{rev.author}</span>
                      {rev.verified && (
                        <span className="inline-flex items-center text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold uppercase tracking-wider">
                          <CheckCircle className="w-3 h-3 mr-1 text-emerald-600" />
                          Verified Buyer
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-400">{rev.date}</span>
                  </div>
                </div>

                {/* Star score */}
                <div className="flex items-center space-x-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= rev.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h5 className="text-sm font-bold text-black">{rev.title}</h5>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">{rev.comment}</p>

              {/* Helpful voting */}
              <div className="pt-2 flex items-center space-x-3 text-xs text-gray-500">
                <button
                  onClick={() => handleVoteHelpful(rev.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-colors cursor-pointer ${
                    rev.userVotedHelpful
                      ? 'bg-black text-white border-black'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:text-black'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful ({rev.helpfulCount})</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Write Review Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white border border-gray-200 rounded-3xl p-8 shadow-2xl relative space-y-5 text-black">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <h3 className="text-base font-black uppercase text-black tracking-tight">Write a Verified Review</h3>
                <p className="text-xs text-gray-500 mt-0.5">{product.name}</p>
              </div>
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="text-gray-400 hover:text-black p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isUserVerifiedBuyer ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified purchase confirmed from your order history. Your review will display the <strong>Verified Buyer</strong> badge.</span>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Note: Reviews are checked against order records to verify doorstep delivery.</span>
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-black font-bold uppercase tracking-wider text-[11px] mb-1.5">Your Rating</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormRating(s)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          s <= formRating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-black ml-2 font-bold">{formRating} / 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-black font-bold uppercase tracking-wider text-[11px] mb-1.5">Your Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Aditya Varma"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-black placeholder-gray-400 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-black font-bold uppercase tracking-wider text-[11px] mb-1.5">Review Headline</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Fast charging speed and pristine unboxing!"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-black placeholder-gray-400 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-black font-bold uppercase tracking-wider text-[11px] mb-1.5">Your Experience & Details</label>
                <textarea
                  rows={4}
                  required
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="How does it feel in hand? What device did you pair it with?"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-black placeholder-gray-400 focus:outline-none focus:border-black"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="px-5 py-3 rounded-full bg-gray-100 text-gray-600 font-bold uppercase tracking-wider text-xs hover:bg-gray-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-full bg-black hover:bg-[#EB0028] text-white font-bold uppercase tracking-widest text-xs shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Publishing...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const ProductSpecTable: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div id="product-spec-table" className="space-y-6">
      {product.specifications.map((specGroup, idx) => (
        <div
          key={idx}
          className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs"
        >
          <div className="bg-gray-50 px-6 py-3.5 border-b border-gray-200 text-xs font-black uppercase tracking-wider text-black flex items-center justify-between">
            <span>{specGroup.group}</span>
          </div>
          <div className="divide-y divide-gray-100">
            {specGroup.items.map((item, itemIdx) => (
              <div
                key={itemIdx}
                className="grid grid-cols-1 sm:grid-cols-3 p-4 text-xs hover:bg-gray-50/50 transition-colors"
              >
                <div className="font-bold text-gray-500 sm:col-span-1">{item.label}</div>
                <div className="text-black sm:col-span-2 font-medium mt-0.5 sm:mt-0">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
