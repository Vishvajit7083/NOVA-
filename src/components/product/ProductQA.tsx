import React, { useState, useEffect } from 'react';
import { HelpCircle, MessageSquare, ThumbsUp, Send, CheckCircle2, ShieldCheck, Search, Plus, X, User } from 'lucide-react';
import { Product, ProductQuestion } from '../../types';
import { useShop } from '../../context/ShopContext';
import { getQuestionsForProductFromDB } from '../../lib/db';

interface ProductQAProps {
  product: Product;
}

export const ProductQA: React.FC<ProductQAProps> = ({ product }) => {
  const { currentUser, submitProductQuestion, upvoteProductQuestion, setIsAuthModalOpen, showToast } = useShop();

  const [questions, setQuestions] = useState<ProductQuestion[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [questionInput, setQuestionInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchQuestions = async () => {
    try {
      const list = await getQuestionsForProductFromDB(product.id);
      setQuestions(list);
    } catch (err) {
      console.warn('Error loading questions:', err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [product.id]);

  const handleAskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!questionInput.trim() || questionInput.trim().length < 5) {
      showToast('Question too short', 'Please provide a descriptive question (at least 5 characters).', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitProductQuestion(product.id, product.name, questionInput.trim());
      if (res.success) {
        setIsAskModalOpen(false);
        setQuestionInput('');
        await fetchQuestions();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredQuestions = questions.filter(
    (q) =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.answer && q.answer.answerText.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div id="product-qa-section" className="space-y-6">
      {/* Header & Ask question CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 border border-gray-200 rounded-2xl p-6">
        <div>
          <h3 className="text-xl font-serif font-bold text-gray-900 flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-[#9A7B38]" />
            <span>Have a Styling Inquiry about {product.name}?</span>
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Get verified answers from {product.sellerName || 'SINDHUDURG GARMENTS Textile Specialists'}, certified handloom experts, and clients.
          </p>
        </div>

        <button
          id="btn-ask-question"
          onClick={() => {
            if (!currentUser) {
              setIsAuthModalOpen(true);
            } else {
              setIsAskModalOpen(true);
            }
          }}
          className="inline-flex items-center justify-center space-x-2 bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Ask a Question</span>
        </button>
      </div>

      {/* Search Q&A */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          id="input-qa-search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search asked questions and answers (e.g. wattage, warranty, fast charging, compatibility)..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EB0028] focus:border-transparent transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-medium"
          >
            Clear
          </button>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q) => (
            <div key={q.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors shadow-xs">
              {/* Question Row */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-md bg-gray-100 text-gray-800 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                    Q
                  </span>
                  <div>
                    <p className="text-base font-bold text-gray-900 leading-snug">{q.question}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Asked by <span className="font-medium text-gray-700">{q.userName || 'Community Member'}</span> •{' '}
                      {new Date(q.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Upvote Button */}
                <button
                  id={`btn-upvote-${q.id}`}
                  onClick={() => upvoteProductQuestion(q.id)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-medium transition-colors shrink-0"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{q.upvotes || 0}</span>
                </button>
              </div>

              {/* Answer Row */}
              {q.answer ? (
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-start space-x-3 bg-gray-50/70 -mx-5 -mb-5 p-5 rounded-b-xl">
                  <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                    A
                  </span>
                  <div className="space-y-1.5 flex-1">
                    <p className="text-sm text-gray-800 leading-relaxed">{q.answer.answerText}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span className="font-semibold text-gray-800 flex items-center space-x-1">
                        {q.answer.answeredByRole === 'admin' ? (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5 text-[#9A7B38]" />
                            <span>SINDHUDURG GARMENTS Concierge</span>
                          </>
                        ) : q.answer.answeredByRole === 'seller' ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Verified Seller ({q.answer.answeredBy})</span>
                          </>
                        ) : (
                          <span>{q.answer.answeredBy} (Verified Buyer)</span>
                        )}
                      </span>
                      <span>•</span>
                      <span>{new Date(q.answer.answeredAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-3 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg flex items-center space-x-2">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Awaiting official technical response from manufacturer/seller.</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-6">
            <HelpCircle className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-800">
              {searchQuery ? 'No matching questions found' : 'No questions asked yet'}
            </p>
            <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
              {searchQuery
                ? 'Try searching with different keywords or ask your specific question to our hardware engineers.'
                : `Be the first customer to ask a question regarding ${product.name}.`}
            </p>
            <button
              onClick={() => {
                if (!currentUser) {
                  setIsAuthModalOpen(true);
                } else {
                  setIsAskModalOpen(true);
                }
              }}
              className="mt-4 inline-flex items-center space-x-1.5 bg-[#EB0028] hover:bg-[#c80022] text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ask First Question</span>
            </button>
          </div>
        )}
      </div>

      {/* Ask Question Modal */}
      {isAskModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-[#EB0028] flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-base">Ask a Question</h4>
                  <p className="text-xs text-gray-500">{product.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsAskModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAskSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Your Question
                </label>
                <textarea
                  id="textarea-ask-question"
                  rows={4}
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  placeholder="e.g. Does this support Samsung 45W Super Fast Charging 2.0 protocol? What are the cable length options?"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#EB0028] focus:border-transparent transition-all"
                  required
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Posted as <span className="font-semibold text-gray-800">{currentUser?.name}</span> ({currentUser?.email})
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs text-gray-600 space-y-1">
                <p className="font-semibold text-gray-800">Guidelines for helpful questions:</p>
                <ul className="list-disc list-inside space-y-0.5 text-gray-500 text-[11px]">
                  <li>Focus on product features, specs, compatibility, and usage.</li>
                  <li>For order delivery issues, please use Customer Support.</li>
                </ul>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAskModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center space-x-2 px-5 py-2 text-sm font-bold text-white bg-[#EB0028] hover:bg-[#c80022] rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Posting...' : 'Post Question'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
