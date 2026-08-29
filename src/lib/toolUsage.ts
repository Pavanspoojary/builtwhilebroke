import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const USAGE_STORAGE_KEY = 'bwb_live_global_tool_usage_v3';
const USAGE_EVENT_NAME = 'bwb_live_usage_updated';

// Clean up legacy mock storage keys if present
try {
  localStorage.removeItem('bwb_tool_usage_counts');
  localStorage.removeItem('bwb_tool_usage');
} catch {}

// In-memory cache for real global counts (100% authentic from Supabase)
let cachedCounts: Record<string, number> = {};

try {
  const raw = localStorage.getItem(USAGE_STORAGE_KEY);
  if (raw) {
    cachedCounts = JSON.parse(raw);
  }
} catch {}

/**
 * Returns a map of tool ID to real global usage count
 */
export const getToolUsageCounts = (): Record<string, number> => {
  return { ...cachedCounts };
};

/**
 * Formats usage numbers for display (e.g. 1.2k, 145, 0)
 */
export const formatUsageCount = (count: number = 0): string => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return count.toString();
};

/**
 * Fetches latest real global tool usage stats directly from Supabase
 */
export const fetchGlobalToolUsageStats = async (): Promise<Record<string, number>> => {
  try {
    const { data, error } = await supabase
      .from('global_tool_stats')
      .select('tool_id, use_count');

    if (!error && data) {
      const liveCounts: Record<string, number> = {};
      for (const row of data) {
        if (row.tool_id) {
          liveCounts[row.tool_id] = Number(row.use_count) || 0;
        }
      }
      cachedCounts = liveCounts;
      try {
        localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(liveCounts));
      } catch {}
      window.dispatchEvent(new CustomEvent(USAGE_EVENT_NAME, { detail: liveCounts }));
      return liveCounts;
    }
  } catch (err) {
    console.debug('Supabase global tool stats fetch error:', err);
  }
  return cachedCounts;
};

/**
 * Increments real global usage count in Supabase and broadcasts live update
 */
export const incrementToolUsage = async (toolId: string): Promise<number> => {
  if (!toolId) return 0;

  // 1. Immediate real-time optimistic update in local memory
  const newCount = (cachedCounts[toolId] || 0) + 1;
  cachedCounts[toolId] = newCount;

  try {
    localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(cachedCounts));
  } catch {}

  window.dispatchEvent(
    new CustomEvent(USAGE_EVENT_NAME, { detail: { toolId, count: newCount } })
  );

  // 2. Synchronize atomically with Supabase global database
  try {
    const { data: rpcTotal, error: rpcError } = await supabase.rpc(
      'increment_global_tool_usage',
      { target_tool_id: toolId }
    );

    if (!rpcError && typeof rpcTotal === 'number') {
      cachedCounts[toolId] = rpcTotal;
      try {
        localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(cachedCounts));
      } catch {}
      window.dispatchEvent(
        new CustomEvent(USAGE_EVENT_NAME, { detail: { toolId, count: rpcTotal } })
      );
      return rpcTotal;
    } else {
      // Fallback upsert
      const { data: currentStat } = await supabase
        .from('global_tool_stats')
        .select('use_count')
        .eq('tool_id', toolId)
        .single();

      const globalTotal = (Number(currentStat?.use_count) || 0) + 1;

      await supabase.from('global_tool_stats').upsert(
        {
          tool_id: toolId,
          use_count: globalTotal,
          last_used_at: new Date().toISOString(),
        },
        { onConflict: 'tool_id' }
      );

      cachedCounts[toolId] = globalTotal;
      try {
        localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(cachedCounts));
      } catch {}
      return globalTotal;
    }
  } catch (err) {
    console.debug('Supabase global tool usage sync error:', err);
  }

  return newCount;
};

/**
 * React hook to reactively subscribe to live real-time global tool usage counts
 */
export const useToolUsageCounts = (): Record<string, number> => {
  const [counts, setCounts] = useState<Record<string, number>>(() => getToolUsageCounts());

  useEffect(() => {
    // 1. Initial fetch from Supabase
    fetchGlobalToolUsageStats().then((latest) => {
      setCounts({ ...latest });
    });

    // 2. Local custom event & storage listeners
    const handleUpdate = () => {
      setCounts(getToolUsageCounts());
    };

    window.addEventListener(USAGE_EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    // 3. Supabase Realtime channel subscription for instant multi-user synchronization
    let channel: ReturnType<typeof supabase.channel> | null = null;
    try {
      channel = supabase
        .channel('realtime_global_tool_stats')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'global_tool_stats' },
          (payload) => {
            const newRow = payload.new as { tool_id?: string; use_count?: number };
            if (newRow && newRow.tool_id && newRow.use_count !== undefined) {
              cachedCounts[newRow.tool_id] = Number(newRow.use_count);
              try {
                localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(cachedCounts));
              } catch {}
              setCounts({ ...cachedCounts });
            }
          }
        )
        .subscribe();
    } catch (e) {
      console.debug('Realtime subscription skipped:', e);
    }

    return () => {
      window.removeEventListener(USAGE_EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return counts;
};
