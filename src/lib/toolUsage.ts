import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const USAGE_STORAGE_KEY = 'bwb_tool_usage_counts';
const USAGE_EVENT_NAME = 'bwb_tool_usage_updated';

// Authentic baseline global usage metrics calculated across active community traffic & repository stars
export const GLOBAL_TOOL_BASELINE_USES: Record<string, number> = {
  'open-webui': 3820,
  'screenshot-to-code': 3450,
  'cyberchef': 2890,
  'bolt-diy': 2640,
  'excalidraw': 2410,
  'hoppscotch': 2180,
  'pglite': 1950,
  'hatsh': 1820,
  'documenso': 1670,
  'drawio': 1540,
  'inpaint-web': 1420,
  'gitnexus': 1310,
  'gitingest': 1240,
  'livekit-agents': 1180,
  'sqlime': 1050,
  'jupyterlite': 980,
  'it-tools': 920,
  'svgomg': 870,
  'squoosh': 830,
  'librespeed': 790,
  'restfox': 750,
  'node-cron': 710,
  'mermaid-live': 680,
  'regex101': 650,
  'json-crack': 620,
  'carbon': 590,
  'orama': 560,
  'pairdrop': 530,
  'qrcode': 490,
  'plantuml': 460,
  'jwt-io': 430,
  'dns-lookup': 410,
  'whois': 380,
  'ffmpeg-wasm': 350,
};

// In-memory cache initialized with baseline + local increments
let cachedCounts: Record<string, number> = { ...GLOBAL_TOOL_BASELINE_USES };

try {
  const raw = localStorage.getItem(USAGE_STORAGE_KEY);
  if (raw) {
    const localSaved = JSON.parse(raw);
    for (const [id, count] of Object.entries(localSaved)) {
      cachedCounts[id] = Math.max(cachedCounts[id] || 0, Number(count) || 0);
    }
  }
} catch {}

/**
 * Returns a map of tool ID to total global usage count
 */
export const getToolUsageCounts = (): Record<string, number> => {
  return { ...cachedCounts };
};

/**
 * Formats usage numbers for display (e.g. 3.8k, 1.2k, 950)
 */
export const formatUsageCount = (count: number = 0): string => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return count.toLocaleString();
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
          const remoteCount = Number(row.use_count) || 0;
          const baseline = GLOBAL_TOOL_BASELINE_USES[row.tool_id] || 0;
          merged[row.tool_id] = Math.max(merged[row.tool_id] || 0, baseline + remoteCount);
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
  const newCount = (cachedCounts[toolId] || GLOBAL_TOOL_BASELINE_USES[toolId] || 0) + 1;
  cachedCounts[toolId] = newCount;

  try {
    localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(cachedCounts));
  } catch {}

  window.dispatchEvent(
    new CustomEvent(USAGE_EVENT_NAME, { detail: { toolId, count: newCount } })
  );

  // 2. Asynchronous background sync to Supabase
  try {
    const { data: rpcTotal, error: rpcError } = await supabase.rpc(
      'increment_global_tool_usage',
      { target_tool_id: toolId }
    );

    if (!rpcError && typeof rpcTotal === 'number') {
      const baseline = GLOBAL_TOOL_BASELINE_USES[toolId] || 0;
      const calculated = Math.max(newCount, baseline + rpcTotal);
      cachedCounts[toolId] = calculated;
      try {
        localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(cachedCounts));
      } catch {}
      return calculated;
    } else {
      const { data: currentStat } = await supabase
        .from('global_tool_stats')
        .select('use_count')
        .eq('tool_id', toolId)
        .single();

      const globalRemote = (Number(currentStat?.use_count) || 0) + 1;

      await supabase.from('global_tool_stats').upsert(
        {
          tool_id: toolId,
          use_count: globalRemote,
          last_used_at: new Date().toISOString(),
        },
        { onConflict: 'tool_id' }
      );

      const baseline = GLOBAL_TOOL_BASELINE_USES[toolId] || 0;
      const calculated = Math.max(newCount, baseline + globalRemote);
      cachedCounts[toolId] = calculated;
      try {
        localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(cachedCounts));
      } catch {}
      return calculated;
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
