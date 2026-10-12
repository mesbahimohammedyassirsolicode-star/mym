export interface Service {
  id: string;
  title: string;
  description: string;
}

export interface ServiceCategory {
  id: string;
  slug: string;
  title: string;
  description: string;
  capabilities: string[];
  useCases: string[];
}