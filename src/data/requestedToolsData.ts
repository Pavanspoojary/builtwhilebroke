export type RequestedToolStatus = 'under-review' | 'planned' | 'in-dev' | 'shipped';

export interface RequestedToolItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: 'dev' | 'diagrams' | 'security' | 'media';
  status: RequestedToolStatus;
  upvotes: number;
  githubUrl?: string;
  techStack: string[];
  requestedDate: string;
}

// Initial empty state — all requests are populated from real user submissions via Supabase
export const REQUESTED_TOOLS: RequestedToolItem[] = [];
