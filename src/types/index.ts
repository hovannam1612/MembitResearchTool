// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface SearchResult {
  id?: string;
  title?: string;
  content?: string;
  [key: string]: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ClusterSearchResult {
  clusters?: Array<{
    name: string;
    description?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items?: any[];
    [key: string]: any;
  }>;
  [key: string]: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ClusterInfoResult {
  name?: string;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  posts?: any[];
  [key: string]: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface PostSearchResult {
  posts?: Array<{
    title?: string;
    content?: string;
    author?: string;
    timestamp?: string;
    [key: string]: any;
  }>;
  [key: string]: any;
}
