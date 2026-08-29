import { useState, useEffect } from 'react';

const USAGE_STORAGE_KEY = 'bwb_tool_usage_counts';
const USAGE_EVENT_NAME = 'bwb_tool_usage_updated';

/**
 * Returns a map of tool ID to usage count from localStorage
 */
export const getToolUsageCounts = (): Record<string, number> => {
  try {
    const raw = localStorage.getItem(USAGE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

/**
 * Increments the usage count for a tool and broadcasts the update
 */
export const incrementToolUsage = (toolId: string): number => {
  if (!toolId) return 0;
  try {
    const counts = getToolUsageCounts();
    const newCount = (counts[toolId] || 0) + 1;
    counts[toolId] = newCount;
    localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(counts));
    window.dispatchEvent(new CustomEvent(USAGE_EVENT_NAME, { detail: { toolId, count: newCount } }));
    return newCount;
  } catch {
    return 1;
  }
};

/**
 * React hook to reactively subscribe to live tool usage counts
 */
export const useToolUsageCounts = (): Record<string, number> => {
  const [counts, setCounts] = useState<Record<string, number>>(() => getToolUsageCounts());

  useEffect(() => {
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
