import { createClient } from '@supabase/supabase-js';
import { REQUESTED_TOOLS, RequestedToolItem } from '../data/requestedToolsData';

// Supabase project URL and anon public key
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://giyzluujybzqvyxwxfox.supabase.co';

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpeXpsdXVqeWJ6cXZ5eHd4Zm94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwMDAwMDAsImV4cCI6MjA0MDUwMDAwMH0.placeholder';

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && !SUPABASE_URL.includes('placeholder')
);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export interface ToolComment {
  id: string;
  tool_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

// Generate or retrieve anonymous local client id for unique upvotes
export const getAnonymousClientId = (): string => {
  let clientId = localStorage.getItem('bwb_anon_client_id');
  if (!clientId) {
    clientId = 'builder_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    localStorage.setItem('bwb_anon_client_id', clientId);
  }
  return clientId;
};

// 1. Fetch all requested tools from Supabase (or fallback to local dataset)
export const fetchRequestedTools = async (): Promise<RequestedToolItem[]> => {
  try {
    const { data, error } = await supabase
      .from('tool_requests')
      .select('*')
      .order('upvotes', { ascending: false });

    if (error || !data || data.length === 0) {
      return REQUESTED_TOOLS;
    }

    return data.map((row) => ({
      id: row.id,
      name: row.name,
      tagline: row.tagline,
      description: row.description,
      category: row.category,
      status: row.status,
      upvotes: row.upvotes || 0,
      githubUrl: row.github_url || undefined,
      techStack: row.tech_stack || [],
      requestedDate: row.created_at?.split('T')[0] || '2026-08-30',
    }));
  } catch {
    return REQUESTED_TOOLS;
  }
};

// 2. Toggle Upvote in Supabase
export const toggleToolUpvote = async (
  toolId: string
): Promise<{ isUpvoted: boolean; newCount: number }> => {
  const clientId = getAnonymousClientId();

  try {
    // Check if already upvoted
    const { data: existingVote } = await supabase
      .from('tool_upvotes')
      .select('id')
      .eq('tool_id', toolId)
      .eq('client_id', clientId)
      .single();

    if (existingVote) {
      // Remove upvote
      await supabase
        .from('tool_upvotes')
        .delete()
        .eq('tool_id', toolId)
        .eq('client_id', clientId);

      // Decrement upvotes count in tool_requests
      const { data: toolData } = await supabase
        .from('tool_requests')
        .select('upvotes')
        .eq('id', toolId)
        .single();

      const newCount = Math.max(0, (toolData?.upvotes || 1) - 1);
      await supabase
        .from('tool_requests')
        .update({ upvotes: newCount })
        .eq('id', toolId);

      return { isUpvoted: false, newCount };
    } else {
      // Add upvote
      await supabase
        .from('tool_upvotes')
        .insert({ tool_id: toolId, client_id: clientId });

      // Increment upvotes count in tool_requests
      const { data: toolData } = await supabase
        .from('tool_requests')
        .select('upvotes')
        .eq('id', toolId)
        .single();

      const newCount = (toolData?.upvotes || 0) + 1;
      await supabase
        .from('tool_requests')
        .update({ upvotes: newCount })
        .eq('id', toolId);

      return { isUpvoted: true, newCount };
    }
  } catch (err) {
    console.warn('Supabase upvote sync fallback:', err);
    return { isUpvoted: true, newCount: 1 };
  }
};

// 3. Fetch Comments for a tool
export const fetchToolComments = async (toolId: string): Promise<ToolComment[]> => {
  try {
    const { data, error } = await supabase
      .from('tool_comments')
      .select('*')
      .eq('tool_id', toolId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
};

// 4. Post a new community comment
export const postToolComment = async (
  toolId: string,
  authorName: string,
  content: string
): Promise<ToolComment | null> => {
  try {
    const { data, error } = await supabase
      .from('tool_comments')
      .insert({
        tool_id: toolId,
        author_name: authorName.trim() || 'Anonymous Builder',
        content: content.trim(),
      })
      .select('*')
      .single();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
};
