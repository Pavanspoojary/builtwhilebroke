export type CategoryId =
  | 'all'
  | 'dev'
  | 'diagrams'
  | 'security'
  | 'media';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;
  count?: number;
}

export type LicenseType =
  | 'MIT'
  | 'Apache-2.0'
  | 'GPL-3.0'
  | 'LGPL-3.0'
  | 'AGPL-3.0'
  | 'BSD-2-Clause'
  | 'BSD-3-Clause';

export type CommercialStatus =
  | 'Permitted'
  | 'Permitted (Copyleft)';

export interface ToolItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: CategoryId;
  license: LicenseType;
  commercialStatus: CommercialStatus;
  commercialNotes: string;
  githubUrl: string;
  liveUrl: string;
  embedUrl: string;
  isEmbeddable: boolean;
  stars: string;
  tags: string[];
  features: string[];
  techStack: string[];
  author: string;
  offlineCapable: boolean;
  icon: string;
  primaryColor?: string;
}
