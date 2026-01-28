/**
 * Admin Dashboard - Tool Submission Management
 * Passkey-protected admin area for reviewing and approving tool submissions
 */

import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { 
  Shield, 
  Check, 
  X, 
  Clock, 
  ExternalLink, 
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Link } from 'wouter';

type SubmissionStatus = 'pending' | 'approved' | 'rejected';

interface Submission {
  id: number;
  toolName: string;
  toolUrl: string;
  category: string | null;
  description: string | null;
  submitterEmail: string | null;
  status: SubmissionStatus;
  isHiddenGem: boolean;
  aiValidated: boolean;
  aiScore: number | null;
  aiNotes: string | null;
  createdAt: Date;
}

export default function Admin() {
  const [passkey, setPasskey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasskey, setShowPasskey] = useState(false);
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'all'>('pending');
  const [isFirstSetup, setIsFirstSetup] = useState(false);
  const [newPasskey, setNewPasskey] = useState('');
  const [confirmPasskey, setConfirmPasskey] = useState('');
  const [setupError, setSetupError] = useState('');

  const loginMutation = trpc.admin.login.useMutation();
  const setPasskeyMutation = trpc.admin.setPasskey.useMutation();
  const updateStatusMutation = trpc.admin.updateStatus.useMutation();

  const { data: submissionsData, refetch } = trpc.admin.getSubmissions.useQuery(
    { passkey, status: statusFilter === 'all' ? undefined : statusFilter },
    { enabled: isAuthenticated }
  );

  const handleLogin = async () => {
    const result = await loginMutation.mutateAsync({ passkey });
    if (result.success) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_session', passkey);
    } else {
      alert('Invalid passkey');
    }
  };

  const handleSetupPasskey = async () => {
    setSetupError('');
    
    if (newPasskey.length < 8) {
      setSetupError('Passkey must be at least 8 characters');
      return;
    }
    
    if (newPasskey !== confirmPasskey) {
      setSetupError('Passkeys do not match');
      return;
    }

    const result = await setPasskeyMutation.mutateAsync({ passkey: newPasskey });
    if (result.success) {
      setPasskey(newPasskey);
      setIsAuthenticated(true);
      localStorage.setItem('admin_session', newPasskey);
      setIsFirstSetup(false);
    } else {
      setSetupError(result.error || 'Failed to set passkey');
    }
  };

  const handleStatusUpdate = async (submissionId: number, status: SubmissionStatus) => {
    await updateStatusMutation.mutateAsync({ passkey, submissionId, status });
    refetch();
  };

  // Check for stored session on mount
  useEffect(() => {
    const stored = localStorage.getItem('admin_session');
    if (stored) {
      setPasskey(stored);
      // Verify stored passkey
      loginMutation.mutateAsync({ passkey: stored }).then(result => {
        if (result.success) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('admin_session');
        }
      });
    }
  }, []);

  const submissions = submissionsData?.submissions || [];
  const pendingCount = submissions.filter(s => s.status === 'pending').length;

  // First-time setup screen
  if (isFirstSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Setup Admin Passkey</h1>
              <p className="text-white/60 text-sm">Create a secure passkey to access the admin dashboard</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">New Passkey</label>
                <div className="relative">
                  <input
                    type={showPasskey ? 'text' : 'password'}
                    value={newPasskey}
                    onChange={(e) => setNewPasskey(e.target.value)}
                    placeholder="Enter passkey (min 8 characters)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Confirm Passkey</label>
                <div className="relative">
                  <input
                    type={showPasskey ? 'text' : 'password'}
                    value={confirmPasskey}
                    onChange={(e) => setConfirmPasskey(e.target.value)}
                    placeholder="Confirm passkey"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasskey(!showPasskey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                  >
                    {showPasskey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {setupError && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {setupError}
                </div>
              )}

              <button
                onClick={handleSetupPasskey}
                disabled={setPasskeyMutation.isPending}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {setPasskeyMutation.isPending ? 'Setting up...' : 'Create Passkey'}
              </button>

              <p className="text-white/40 text-xs text-center">
                Store this passkey securely in Proton Pass or your password manager
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-white/60 text-sm">Enter your passkey to access</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type={showPasskey ? 'text' : 'password'}
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Enter passkey"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPasskey(!showPasskey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                >
                  {showPasskey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <button
                onClick={handleLogin}
                disabled={loginMutation.isPending || !passkey}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loginMutation.isPending ? 'Verifying...' : 'Login'}
              </button>

              <button
                onClick={() => setIsFirstSetup(true)}
                className="w-full text-white/50 text-sm hover:text-white/70 transition-colors"
              >
                First time? Set up passkey
              </button>
            </div>

            <Link href="/" className="flex items-center justify-center gap-2 mt-6 text-white/40 hover:text-white/60 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to AI Library
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-white/60 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Admin Dashboard</h1>
                <p className="text-white/50 text-sm">Tool Submission Management</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setPasskey('');
                localStorage.removeItem('admin_session');
              }}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-white/50 text-sm">Pending</p>
                <p className="text-2xl font-bold text-white">{submissions.filter(s => s.status === 'pending').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Check className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-white/50 text-sm">Approved</p>
                <p className="text-2xl font-bold text-white">{submissions.filter(s => s.status === 'approved').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <X className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-white/50 text-sm">Rejected</p>
                <p className="text-2xl font-bold text-white">{submissions.filter(s => s.status === 'rejected').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-violet-500 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status === 'pending' && pendingCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {submissions.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white/30" />
              </div>
              <p className="text-white/50">No submissions found</p>
            </div>
          ) : (
            submissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/[0.07] transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Tool Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${new URL(submission.toolUrl).hostname}&sz=32`}
                        alt=""
                        className="w-8 h-8 rounded-lg bg-white/10"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23666"><rect width="24" height="24" rx="4"/></svg>';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white truncate">{submission.toolName}</h3>
                        <a
                          href={submission.toolUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-violet-400 text-sm hover:underline flex items-center gap-1 truncate"
                        >
                          {submission.toolUrl}
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      </div>
                    </div>

                    {submission.description && (
                      <p className="text-white/60 text-sm mb-3 line-clamp-2">{submission.description}</p>
                    )}

                    <div className="flex flex-wrap gap-2 text-xs">
                      {submission.category && (
                        <span className="px-2 py-1 bg-white/10 rounded-md text-white/70">
                          {submission.category}
                        </span>
                      )}
                      {submission.isHiddenGem && (
                        <span className="px-2 py-1 bg-violet-500/20 rounded-md text-violet-300 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Hidden Gem
                        </span>
                      )}
                      {submission.submitterEmail && (
                        <span className="px-2 py-1 bg-white/5 rounded-md text-white/50">
                          {submission.submitterEmail}
                        </span>
                      )}
                      <span className="px-2 py-1 bg-white/5 rounded-md text-white/40">
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* AI Validation */}
                  <div className="lg:w-48 flex-shrink-0">
                    <div className={`p-3 rounded-lg ${
                      submission.aiValidated
                        ? submission.aiScore && submission.aiScore >= 70
                          ? 'bg-green-500/10 border border-green-500/20'
                          : submission.aiScore && submission.aiScore >= 40
                          ? 'bg-yellow-500/10 border border-yellow-500/20'
                          : 'bg-red-500/10 border border-red-500/20'
                        : 'bg-white/5 border border-white/10'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-white/70">AI Score</span>
                        {submission.aiValidated ? (
                          <span className={`text-lg font-bold ${
                            submission.aiScore && submission.aiScore >= 70
                              ? 'text-green-400'
                              : submission.aiScore && submission.aiScore >= 40
                              ? 'text-yellow-400'
                              : 'text-red-400'
                          }`}>
                            {submission.aiScore}%
                          </span>
                        ) : (
                          <span className="text-white/40 text-sm">Pending</span>
                        )}
                      </div>
                      {submission.aiNotes && (
                        <p className="text-xs text-white/50 line-clamp-2">{submission.aiNotes}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2 lg:w-32 flex-shrink-0">
                    {submission.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(submission.id, 'approved')}
                          disabled={updateStatusMutation.isPending}
                          className="flex-1 lg:flex-none px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(submission.id, 'rejected')}
                          disabled={updateStatusMutation.isPending}
                          className="flex-1 lg:flex-none px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </button>
                      </>
                    ) : (
                      <div className={`px-4 py-2 rounded-lg text-sm font-medium text-center ${
                        submission.status === 'approved'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
