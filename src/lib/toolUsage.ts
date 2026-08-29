import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const USAGE_STORAGE_KEY = 'bwb_tool_usage_counts';
const USAGE_EVENT_NAME = 'bwb_tool_usage_updated';

// In-memory cache for fast synchronous access
let cachedCounts: Record<string, number> = {};

try {
  const raw = localStorage.getItem(USAGE_STORAGE_KEY);
  if (raw) {
    cachedCounts = JSON.parse(raw);
  }
} catch {}

/**
 * Returns a map of tool ID to usage count
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
 * Fetches latest global tool usage stats from Supabase
 */
export const fetchGlobalToolUsageStats = async (): Promise<Record<string, number>> => {
  try {
    const { data, error } = await supabase
      .from('global_tool_stats')
      .select('tool_id, use_count');

    if (!error && data && data.length > 0) {
      const merged: Record<string, number> = { ...cachedCounts };
      for (const row of data) {
        if (row.tool_id) {
          merged[row.tool_id] = Math.max(merged[row.tool_id] || 0, Number(row.use_count) || 0);
        }
      }
      cachedCounts = merged;
      try {
        localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(merged));
      } catch {}
      window.dispatchEvent(new CustomEvent(USAGE_EVENT_NAME, { detail: merged }));
      return merged;
    }
  } catch (err) {
    console.debug('Global tool stats fetch skipped / offline:', err);
  }
  return cachedCounts;
};

/**
 * Increments usage count locally and syncs atomically with Supabase global database
 */
export const incrementToolUsage = async (toolId: string): Promise<number> => {
  if (!toolId) return 0;

  // 1. Immediate optimistic local update
  const newCount = (cachedCounts[toolId] || 0) + 1;
  cachedCounts[toolId] = newCount;

  try {
    localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(cachedCounts));
  } catch {}

  window.dispatchEvent(
    new CustomEvent(USAGE_EVENT_NAME, { detail: { toolId, count: newCount } })
  );

  // 2. Asynchronous background sync to Supabase
  try {
    // Try atomic RPC function first
    const { data: rpcTotal, error: rpcError } = await supabase.rpc(
      'increment_global_tool_usage',
      { target_tool_id: toolId }
    );

    if (!rpcError && typeof rpcTotal === 'number') {
      cachedCounts[toolId] = rpcTotal;
      try {
        localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(cachedCounts));
      } catch {}
      return rpcTotal;
    } else {
      // Fallback to table upsert if RPC not present
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
    console.debug('Supabase global tool usage sync skipped / offline:', err);
  }

  return newCount;
};

/**
 * React hook to reactively subscribe to live global tool usage counts
 */
export const useToolUsageCounts = (): Record<string, number> => {
  const [counts, setCounts] = useState<Record<string, number>>(() => getToolUsageCounts());

  useEffect(() => {
    // 1. Initial background fetch from Supabase
    fetchGlobalToolUsageStats().then((latest) => {
      setCounts({ ...latest });
    });

    // 2. Event listener for live updates
    const handleUpdate = () => {
      setCounts(getToolUsageCounts());
    };

    window.addEventListener(USAGE_EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(USAGE_EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return counts;
};
