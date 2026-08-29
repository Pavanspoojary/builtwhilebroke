import React, { useState, useMemo, useEffect } from 'react';
import {
  PackagePlus,
  Search,
  ThumbsUp,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  MessageSquare,
  Send,
  Loader2,
  Database,
  User,
} from 'lucide-react';
import { RequestedToolItem, RequestedToolStatus, REQUESTED_TOOLS } from '../data/requestedToolsData';
import { SeoHead } from '../components/SeoHead';
import { sound } from '../lib/soundFx';
import {
  fetchRequestedTools,
  toggleToolUpvote,
  fetchToolComments,
  postToolComment,
  ToolComment,
} from '../lib/supabaseClient';

export const RequestedToolsPage: React.FC = () => {
  const [tools, setTools] = useState<RequestedToolItem[]>(REQUESTED_TOOLS);
  const [isLoadingTools, setIsLoadingTools] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeStatus, setActiveStatus] = useState<string>('all');
  const [upvotedMap, setUpvotedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('bwb_tool_upvotes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Comments drawer state
  const [selectedToolForComments, setSelectedToolForComments] = useState<RequestedToolItem | null>(null);
  const [comments, setComments] = useState<ToolComment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false);
  const [newCommentAuthor, setNewCommentAuthor] = useState<string>('');
  const [newCommentContent, setNewCommentContent] = useState<string>('');
  const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false);

  // Initial fetch from Supabase
  useEffect(() => {
    let isMounted = true;
    fetchRequestedTools().then((fetched) => {
      if (isMounted) {
        setTools(fetched);
        setIsLoadingTools(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch comments when a tool is selected
  useEffect(() => {
    if (!selectedToolForComments) return;
    setIsLoadingComments(true);
    fetchToolComments(selectedToolForComments.id).then((data) => {
      setComments(data);
      setIsLoadingComments(false);
    });
  }, [selectedToolForComments]);

  const handleUpvote = async (toolId: string) => {
    sound.pop();
    const wasUpvoted = !!upvotedMap[toolId];
    const nextState = !wasUpvoted;

    // Optimistic UI update
    setUpvotedMap((prev) => {
      const next = { ...prev, [toolId]: nextState };
      try {
        localStorage.setItem('bwb_tool_upvotes', JSON.stringify(next));
      } catch {}
      return next;
    });

    setTools((prevTools) =>
      prevTools.map((t) =>
        t.id === toolId
          ? { ...t, upvotes: Math.max(0, t.upvotes + (nextState ? 1 : -1)) }
          : t
      )
    );

    // Sync with Supabase
    await toggleToolUpvote(toolId);
  };

  const handleOpenComments = (tool: RequestedToolItem) => {
    sound.click();
    setSelectedToolForComments(tool);
    setNewCommentContent('');
  };

  const handleCloseComments = () => {
    sound.toggle();
    setSelectedToolForComments(null);
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedToolForComments || !newCommentContent.trim()) return;

    setIsSubmittingComment(true);
    sound.pop();

    const created = await postToolComment(
      selectedToolForComments.id,
      newCommentAuthor,
      newCommentContent
    );

    if (created) {
      setComments((prev) => [created, ...prev]);
      setNewCommentContent('');
    } else {
      // Local fallback representation
      const fallbackComment: ToolComment = {
        id: 'local_' + Date.now(),
        tool_id: selectedToolForComments.id,
        author_name: newCommentAuthor.trim() || 'Anonymous Builder',
        content: newCommentContent.trim(),
        created_at: new Date().toISOString(),
      };
      setComments((prev) => [fallbackComment, ...prev]);
      setNewCommentContent('');
    }

    setIsSubmittingComment(false);
  };

  const filteredTools = useMemo(() => {
    return tools
      .filter((t) => {
        if (activeStatus !== 'all' && t.status !== activeStatus) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            t.name.toLowerCase().includes(q) ||
            t.tagline.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.techStack.some((tech) => tech.toLowerCase().includes(q))
          );
        }
        return true;
      })
      .sort((a, b) => b.upvotes - a.upvotes);
  }, [tools, searchQuery, activeStatus]);

  const renderStatusBadge = (status: RequestedToolStatus) => {
    switch (status) {
      case 'in-dev':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 text-[10px] font-mono font-bold text-amber-800 shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>In Development</span>
          </span>
        );
      case 'planned':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 text-[10px] font-mono font-bold text-blue-800 shadow-2xs">
            <Clock className="h-2.5 w-2.5 text-blue-600" />
            <span>Planned</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-800 shadow-2xs">
            <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
            <span>Shipped & Live</span>
          </span>
        );
      case 'under-review':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 border border-zinc-200/80 px-2.5 py-0.5 text-[10px] font-mono font-bold text-zinc-700 shadow-2xs">
            <span>Under Review</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen py-12 sm:py-16 bg-[#fafafa]">
      <SeoHead
        title="Community Requested Tools & Roadmap"
        description="Explore in-browser developer workbenches and sandbox engines requested by the developer community. Live Supabase upvoting & real-time feedback."
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header with Direct Action */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-200/80">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-800 shadow-2xs mb-3">
              <Sparkles className="h-3.5 w-3.5 text-zinc-900" />
              <span>Community Roadmap & Directory</span>
            </div>
            <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-950">
              Requested Tools
            </h1>
            <p className="mt-2 max-w-xl text-xs sm:text-sm text-zinc-500 font-normal leading-relaxed">
              Explore open-source in-browser workbenches suggested by developers. Real-time upvotes and comments are synchronized directly via Supabase.
            </p>
          </div>

          {/* Big Request Button linking to Tally */}
          <a
            href="https://tally.so/r/J9va1d"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.launch()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-zinc-800 hover:shadow-lg active:scale-95 transition-all select-none shrink-0"
          >
            <PackagePlus className="h-4 w-4" />
            <span>Request a Tool</span>
          </a>
        </div>

        {/* Database Scope Notice Banner */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-zinc-200/80 bg-white/80 backdrop-blur-md p-4 shadow-2xs">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 border border-zinc-200/80">
            <Database className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-zinc-900">Supabase Database Scope: </span>
            <span className="text-zinc-600">
              Cloud database persistence (Supabase) is strictly and exclusively utilized for this community directory to store public tool suggestions, real-time upvotes, and builder discussions. All 34+ developer workbenches (PGlite, SQLime, CyberChef, etc.) continue to run 100% in-browser with zero server data transmission.
            </span>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-zinc-100/90 border border-zinc-200/80">
            {[
              { id: 'all', label: 'All Requests' },
              { id: 'in-dev', label: 'In Dev' },
              { id: 'planned', label: 'Planned' },
              { id: 'under-review', label: 'Under Review' },
              { id: 'shipped', label: 'Shipped' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  sound.toggle();
                  setActiveStatus(tab.id);
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeStatus === tab.id
                    ? 'bg-white text-zinc-950 shadow-2xs font-bold'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search requested tools..."
              className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-8 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-950 focus:outline-none shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-zinc-400 hover:text-zinc-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* List of Requested Tools */}
        <div className="mt-6 space-y-3.5">
          {isLoadingTools ? (
            <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white">
              <Loader2 className="h-6 w-6 text-zinc-900 animate-spin" />
              <p className="mt-2 text-xs font-mono text-zinc-400">Loading community directory from Supabase...</p>
            </div>
          ) : filteredTools.length > 0 ? (
            filteredTools.map((tool) => {
              const isUpvoted = !!upvotedMap[tool.id];

              return (
                <div
                  key={tool.id}
                  className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-zinc-200/80 bg-white p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_28px_-10px_rgba(0,0,0,0.06)] hover:border-zinc-300 transition-all duration-200"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="font-sans text-base font-bold text-zinc-950 tracking-tight">
                        {tool.name}
                      </h3>
                      {renderStatusBadge(tool.status)}
                    </div>

                    <p className="text-xs font-semibold text-zinc-700">
                      {tool.tagline}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500 leading-relaxed font-normal">
                      {tool.description}
                    </p>

                    {/* Tech tags & Comments button */}
                    <div className="mt-3.5 flex flex-wrap items-center gap-2">
                      {tool.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md bg-zinc-50 border border-zinc-200/80 px-2 py-0.5 text-[10px] font-mono font-medium text-zinc-600 shadow-2xs"
                        >
                          {tech}
                        </span>
                      ))}

                      <div className="h-3 w-[1px] bg-zinc-200 mx-1 hidden sm:block" />

                      <button
                        onClick={() => handleOpenComments(tool)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200/80 bg-zinc-50/80 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 transition-colors shadow-2xs"
                      >
                        <MessageSquare className="h-3 w-3 text-zinc-500" />
                        <span>Discussion</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Actions: Upvote Button & GitHub Link */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2.5 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                    <button
                      onClick={() => handleUpvote(tool.id)}
                      className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition-all shadow-2xs active:scale-95 ${
                        isUpvoted
                          ? 'border-zinc-950 bg-zinc-950 text-white shadow-sm'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 hover:bg-white hover:text-zinc-950'
                      }`}
                      title={isUpvoted ? 'Remove upvote' : 'Upvote in Supabase'}
                    >
                      <ThumbsUp
                        className={`h-3.5 w-3.5 ${
                          isUpvoted ? 'fill-white text-white' : 'text-zinc-500'
                        }`}
                      />
                      <span>{tool.upvotes}</span>
                    </button>

                    {tool.githubUrl && (
                      <a
                        href={tool.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => sound.click()}
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-zinc-900 transition-colors"
                        title="Upstream Repository"
                      >
                        <span>Upstream repo</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-3xl border border-zinc-200/90 bg-white p-12 sm:p-16 text-center shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-900 shadow-2xs mb-4">
                <PackagePlus className="h-7 w-7 stroke-[1.5]" />
              </div>
              <h3 className="text-base font-bold text-zinc-950">
                {searchQuery || activeStatus !== 'all'
                  ? 'No matching tool requests found'
                  : 'No tool requests submitted yet'}
              </h3>
              <p className="mt-1.5 text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                {searchQuery || activeStatus !== 'all'
                  ? 'Try clearing your search or status filter to see all submissions.'
                  : 'Be the first to suggest an in-browser open-source utility, diagram engine, or WebAssembly sandbox!'}
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="https://tally.so/r/J9va1d"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.launch()}
                  className="inline-flex items-center gap-2 rounded-2xl bg-zinc-950 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-zinc-800 active:scale-95 transition-all"
                >
                  <PackagePlus className="h-4 w-4" />
                  <span>Submit the First Tool Request</span>
                </a>

                {(searchQuery || activeStatus !== 'all') && (
                  <button
                    onClick={() => {
                      sound.pop();
                      setSearchQuery('');
                      setActiveStatus('all');
                    }}
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Community Comments Drawer / Modal */}
      {selectedToolForComments && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/45 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative flex flex-col h-[85vh] max-h-[640px] w-full max-w-lg rounded-2xl border border-zinc-200/90 bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-200/80 px-5 py-4 bg-zinc-50/70">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-sans text-sm font-bold text-zinc-950">
                    {selectedToolForComments.name}
                  </h3>
                  {renderStatusBadge(selectedToolForComments.status)}
                </div>
                <p className="text-[11px] text-zinc-400">Community Discussion & Architecture Notes</p>
              </div>

              <button
                onClick={handleCloseComments}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-200/80 hover:text-zinc-900 transition-colors"
                title="Close (Esc)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {isLoadingComments ? (
                <div className="flex h-32 flex-col items-center justify-center">
                  <Loader2 className="h-5 w-5 text-zinc-900 animate-spin" />
                  <p className="mt-2 text-xs font-mono text-zinc-400">Loading comments...</p>
                </div>
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-xl border border-zinc-200/80 bg-zinc-50/60 p-3.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200 text-zinc-700 text-[10px] font-bold">
                          <User className="h-3 w-3" />
                        </div>
                        <span className="font-sans text-xs font-bold text-zinc-900">
                          {comment.author_name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {comment.created_at ? new Date(comment.created_at).toLocaleDateString() : 'Today'}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-wrap pl-6">
                      {comment.content}
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center">
                  <MessageSquare className="mx-auto h-7 w-7 text-zinc-300" />
                  <p className="mt-2 text-xs font-semibold text-zinc-700">No comments yet</p>
                  <p className="text-[11px] text-zinc-400">Be the first to share an implementation idea or use case!</p>
                </div>
              )}
            </div>

            {/* Post Comment Form */}
            <form onSubmit={handlePostComment} className="border-t border-zinc-200/80 p-4 bg-zinc-50/50">
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={newCommentAuthor}
                  onChange={(e) => setNewCommentAuthor(e.target.value)}
                  placeholder="Your Name / GitHub handle (optional)"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-950 focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  <input
                    required
                    type="text"
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                    placeholder="Share feedback, WASM build tips, or use cases..."
                    className="flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-950 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingComment || !newCommentContent.trim()}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-950 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 transition shadow-sm shrink-0"
                  >
                    {isSubmittingComment ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                    <span>Post</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
