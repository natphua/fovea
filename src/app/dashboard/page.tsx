"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import NavBar from "@/components/NavBar";
import { Eye, FileText, Clock, TrendingUp, Plus } from "lucide-react";

interface FocusSession {
  id: string;
  start_time: string;
  end_time: string;
  metrics: {
    focusScore: number;
    sessionSummary: string;
    attentionStability: string;
  };
  file_protocol?: string;
  created_at: string;
}

interface PrevFile {
  id: string;
  file_protocol: string;
  file_name: string;
  last_accessed: string;
  created_at: string;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [prevFiles, setPrevFiles] = useState<PrevFile[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
      return;
    }

    if (user) {
      fetchUserData();
    }
  }, [user, loading, router]);

  const fetchUserData = async () => {
    try {
      // Fetch focus sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (sessionsError) throw sessionsError;

      // Fetch previous files
      const { data: filesData, error: filesError } = await supabase
        .from('prev_files')
        .select('*')
        .eq('user_id', user!.id)
        .order('last_accessed', { ascending: false })
        .limit(20);

      if (filesError) throw filesError;

      setSessions(sessionsData || []);
      setPrevFiles(filesData || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-base-100">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="text-base-content/70 mt-1">Track your focus progress and manage your files</p>
          </div>
          <button 
            onClick={() => router.push('/session')}
            className="btn btn-primary gap-2"
          >
            <Plus className="w-4 h-4" />
            Start New Session
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Sessions */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-lg border border-base-300">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Eye className="w-4 h-4 text-primary-content" />
                  </div>
                  <h2 className="card-title">Recent Focus Sessions</h2>
                </div>

                {sessions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-base-content/50" />
                    </div>
                    <p className="text-base-content/70 mb-4">No focus sessions yet</p>
                    <button 
                      onClick={() => router.push('/session')}
                      className="btn btn-primary"
                    >
                      Start Your First Session
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <div key={session.id} className="p-4 border border-base-300 rounded-lg hover:bg-base-50 transition-colors cursor-pointer"
                           onClick={() => router.push(`/results?session=${session.id}`)}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`text-2xl font-bold ${getScoreColor(session.metrics.focusScore)}`}>
                                {session.metrics.focusScore}%
                              </span>
                              <div className="text-sm text-base-content/70">
                                <Clock className="w-4 h-4 inline mr-1" />
                                {formatDate(session.created_at)}
                              </div>
                            </div>
                            <p className="text-sm text-base-content/70">
                              {session.metrics.sessionSummary}
                            </p>
                            {session.file_protocol && (
                              <div className="text-xs text-base-content/50 mt-1">
                                File: {session.file_protocol}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className={`badge ${session.metrics.attentionStability === 'High' ? 'badge-success' : 
                              session.metrics.attentionStability === 'Medium' ? 'badge-warning' : 'badge-error'}`}>
                              {session.metrics.attentionStability}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Previous Files */}
          <div>
            <div className="card bg-base-100 shadow-lg border border-base-300">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-secondary-content" />
                  </div>
                  <h2 className="card-title">Previous Files</h2>
                </div>

                {prevFiles.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-6 h-6 text-base-content/50" />
                    </div>
                    <p className="text-sm text-base-content/70">No files accessed yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {prevFiles.map((file) => (
                      <div key={file.id} className="p-3 border border-base-300 rounded-lg hover:bg-base-50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-base-content/70 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.file_name}</p>
                            <p className="text-xs text-base-content/50">
                              {formatDate(file.last_accessed)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
