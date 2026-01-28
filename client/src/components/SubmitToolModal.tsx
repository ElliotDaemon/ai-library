/**
 * Submit Tool Modal - Minimal Futuristic Design
 * A sleek modal for users to suggest new AI tools
 */

import { useState } from 'react';
import { X, Sparkles, Send, Loader2, CheckCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface SubmitToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  categories: string[];
}

export default function SubmitToolModal({ isOpen, onClose, isDark, categories }: SubmitToolModalProps) {
  const [formData, setFormData] = useState({
    toolName: '',
    toolUrl: '',
    category: '',
    description: '',
    submitterEmail: '',
    isHiddenGem: false,
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const submitMutation = trpc.submissions.create.useMutation({
    onSuccess: () => {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          toolName: '',
          toolUrl: '',
          category: '',
          description: '',
          submitterEmail: '',
          isHiddenGem: false,
        });
        onClose();
      }, 2000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.toolName || !formData.toolUrl) return;
    
    submitMutation.mutate({
      toolName: formData.toolName,
      toolUrl: formData.toolUrl,
      category: formData.category || undefined,
      description: formData.description || undefined,
      submitterEmail: formData.submitterEmail || undefined,
      isHiddenGem: formData.isHiddenGem,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 transition-all duration-500 ${
          isDark 
            ? 'bg-black/80 backdrop-blur-xl' 
            : 'bg-white/80 backdrop-blur-xl'
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className={`relative w-full max-w-lg rounded-3xl overflow-hidden transition-all duration-500 transform ${
          isDark 
            ? 'bg-gradient-to-br from-slate-900/95 via-purple-900/20 to-slate-900/95 border border-white/10 shadow-2xl shadow-purple-500/10' 
            : 'bg-gradient-to-br from-white/95 via-purple-50/50 to-white/95 border border-slate-200 shadow-2xl shadow-slate-200/50'
        }`}
        style={{
          animation: 'modalSlideIn 0.4s ease-out',
        }}
      >
        {/* Glow effect */}
        <div className={`absolute inset-0 opacity-30 pointer-events-none ${
          isDark ? 'bg-gradient-to-br from-purple-500/20 via-transparent to-cyan-500/20' : ''
        }`} />

        {/* Header */}
        <div className={`relative px-8 pt-8 pb-4 border-b ${
          isDark ? 'border-white/10' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${
                isDark 
                  ? 'bg-gradient-to-br from-purple-500/30 to-cyan-500/30 border border-purple-500/30' 
                  : 'bg-gradient-to-br from-purple-100 to-cyan-100 border border-purple-200'
              }`}>
                <Sparkles className={`w-5 h-5 ${isDark ? 'text-purple-300' : 'text-purple-600'}`} />
              </div>
              <div>
                <h2 className={`text-xl font-semibold tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  Submit an AI Tool
                </h2>
                <p className={`text-sm ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                  Help us grow the library
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-all ${
                isDark 
                  ? 'hover:bg-white/10 text-white/50 hover:text-white' 
                  : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative p-8 space-y-5">
          {/* Tool Name */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-white/70' : 'text-slate-700'
            }`}>
              Tool Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.toolName}
              onChange={(e) => setFormData({ ...formData, toolName: e.target.value })}
              placeholder="e.g., ChatGPT, Midjourney"
              required
              className={`w-full px-4 py-3 rounded-xl transition-all outline-none ${
                isDark 
                  ? 'bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:bg-white/10' 
                  : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-400 focus:bg-white'
              }`}
            />
          </div>

          {/* Tool URL */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-white/70' : 'text-slate-700'
            }`}>
              Website URL <span className="text-red-400">*</span>
            </label>
            <input
              type="url"
              value={formData.toolUrl}
              onChange={(e) => setFormData({ ...formData, toolUrl: e.target.value })}
              placeholder="https://example.com"
              required
              className={`w-full px-4 py-3 rounded-xl transition-all outline-none ${
                isDark 
                  ? 'bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:bg-white/10' 
                  : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-400 focus:bg-white'
              }`}
            />
          </div>

          {/* Category */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-white/70' : 'text-slate-700'
            }`}>
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl transition-all outline-none appearance-none cursor-pointer ${
                isDark 
                  ? 'bg-white/5 border border-white/10 text-white focus:border-purple-500/50 focus:bg-white/10' 
                  : 'bg-slate-50 border border-slate-200 text-slate-900 focus:border-purple-400 focus:bg-white'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-white/70' : 'text-slate-700'
            }`}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What does this tool do? What makes it special?"
              rows={3}
              className={`w-full px-4 py-3 rounded-xl transition-all outline-none resize-none ${
                isDark 
                  ? 'bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:bg-white/10' 
                  : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-400 focus:bg-white'
              }`}
            />
          </div>

          {/* Email (optional) */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-white/70' : 'text-slate-700'
            }`}>
              Your Email <span className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-400'}`}>(optional)</span>
            </label>
            <input
              type="email"
              value={formData.submitterEmail}
              onChange={(e) => setFormData({ ...formData, submitterEmail: e.target.value })}
              placeholder="you@example.com"
              className={`w-full px-4 py-3 rounded-xl transition-all outline-none ${
                isDark 
                  ? 'bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:bg-white/10' 
                  : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-purple-400 focus:bg-white'
              }`}
            />
          </div>

          {/* Hidden Gem Toggle */}
          <div className={`flex items-center gap-3 p-4 rounded-xl ${
            isDark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'
          }`}>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isHiddenGem: !formData.isHiddenGem })}
              className={`relative w-12 h-6 rounded-full transition-all ${
                formData.isHiddenGem 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                  : isDark ? 'bg-white/20' : 'bg-slate-300'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all ${
                formData.isHiddenGem ? 'left-7' : 'left-1'
              }`} />
            </button>
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                💎 This is a hidden gem
              </p>
              <p className={`text-xs ${isDark ? 'text-amber-300/60' : 'text-amber-600/70'}`}>
                Mark if this tool is lesser-known but valuable
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitMutation.isPending || isSuccess || !formData.toolName || !formData.toolUrl}
            className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
              isSuccess
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                : submitMutation.isPending
                ? isDark 
                  ? 'bg-white/10 text-white/50 cursor-wait' 
                  : 'bg-slate-200 text-slate-400 cursor-wait'
                : isDark
                ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40'
                : 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSuccess ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Submitted Successfully!
              </>
            ) : submitMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Tool
              </>
            )}
          </button>

          {submitMutation.isError && (
            <p className="text-red-400 text-sm text-center">
              Something went wrong. Please try again.
            </p>
          )}
        </form>
      </div>

      <style>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
