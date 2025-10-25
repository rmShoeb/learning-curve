export interface DocMetadata {
  title: string;
  description?: string;
  path: string;
  route: string;
  category: string;
  order?: number;
  tags?: string[];
  lastUpdated?: string;
  authors?: string[];
}

export interface DocCategory {
  name: string;
  displayName: string;
  icon?: string;
  order: number;
  children: DocMetadata[];
}

export interface NavigationItem {
  label: string;
  route?: string;
  icon?: string;
  children?: NavigationItem[];
  expanded?: boolean;
}
