/**
 * Favorites Panel - Slide-out panel showing user's favorited tools
 * IP-based tracking, no account required
 */

import { Heart, X, ExternalLink, Trash2, Sparkles } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface FavoritesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export default function FavoritesPanel({ isOpen, onClose, isDark }: FavoritesPanelProps) {
  const { data: favorites, isLoading, refetch } = trpc.favorites.list.useQuery(undefined, {
    enabled: isOpen,
  });

  const removeMutation = trpc.favorites.remove.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleRemove = (toolId: string) => {
    removeMutation.mutate({ toolId });
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className={`fixed inset-0 z-[150] transition-opacity duration-300 ${
            isDark ? 'bg-black/60' : 'bg-black/30'
          } backdrop-blur-sm`}
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md z-[160] transition-transform duration-500 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className={`h-full flex flex-col ${
          isDark 
            ? 'bg-gradient-to-b from-slate-900 via-slate-900/98 to-slate-900 border-l border-white/10' 
            : 'bg-gradient-to-b from-white via-white/98 to-white border-l border-slate-200'
        }`}>
          {/* Header */}
          <div className={`flex items-center justify-between px-6 py-5 border-b ${
            isDark ? 'border-white/10' : 'border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${
                isDark 
                  ? 'bg-gradient-to-br from-rose-500/30 to-pink-500/30 border border-rose-500/30' 
                  : 'bg-gradient-to-br from-rose-100 to-pink-100 border border-rose-200'
              }`}>
                <Heart className={`w-5 h-5 ${isDark ? 'text-rose-300' : 'text-rose-600'}`} fill="currentColor" />
              </div>
              <div>
                <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  My Favorites
                </h2>
                <p className={`text-sm ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                  {favorites?.length || 0} saved tools
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

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className={`w-10 h-10 rounded-full border-2 border-t-transparent animate-spin ${
                  isDark ? 'border-purple-500' : 'border-purple-600'
                }`} />
                <p className={`text-sm ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                  Loading favorites...
                </p>
              </div>
            ) : !favorites || favorites.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <div className={`p-6 rounded-2xl ${
                  isDark ? 'bg-white/5' : 'bg-slate-50'
                }`}>
                  <Heart className={`w-12 h-12 mx-auto mb-4 ${
                    isDark ? 'text-white/20' : 'text-slate-300'
                  }`} />
                  <h3 className={`text-lg font-medium mb-2 ${
                    isDark ? 'text-white/70' : 'text-slate-700'
                  }`}>
                    No favorites yet
                  </h3>
                  <p className={`text-sm max-w-xs ${
                    isDark ? 'text-white/40' : 'text-slate-500'
                  }`}>
                    Click the heart icon on any tool to save it here. Your favorites are stored on this device.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {favorites.map((fav) => (
                  <div 
                    key={fav.id}
                    className={`group relative p-4 rounded-2xl transition-all ${
                      isDark 
                        ? 'bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10' 
                        : 'bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {/* Favicon */}
                          {fav.toolUrl && (
                            <img 
                              src={`https://www.google.com/s2/favicons?domain=${new URL(fav.toolUrl).hostname}&sz=32`}
                              alt=""
                              className="w-5 h-5 rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          )}
                          <h3 className={`font-medium truncate ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}>
                            {fav.toolName}
                          </h3>
                        </div>
                        {fav.category && (
                          <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${
                            isDark 
                              ? 'bg-purple-500/20 text-purple-300' 
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {fav.category}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {fav.toolUrl && (
                          <a
                            href={fav.toolUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-2 rounded-lg transition-all ${
                              isDark 
                                ? 'hover:bg-white/10 text-white/50 hover:text-white' 
                                : 'hover:bg-slate-200 text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => handleRemove(fav.toolId)}
                          disabled={removeMutation.isPending}
                          className={`p-2 rounded-lg transition-all ${
                            isDark 
                              ? 'hover:bg-red-500/20 text-white/50 hover:text-red-400' 
                              : 'hover:bg-red-50 text-slate-400 hover:text-red-500'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`px-6 py-4 border-t ${
            isDark ? 'border-white/10' : 'border-slate-200'
          }`}>
            <div className={`flex items-center gap-2 text-xs ${
              isDark ? 'text-white/40' : 'text-slate-400'
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Favorites are saved locally on this device</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
