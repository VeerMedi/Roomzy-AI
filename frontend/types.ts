export enum AppState {
  LANDING,
  INPUT,
  QUIZ,
  PROCESSING,
  RESULTS
}

export enum UserMode {
  RENT = 'Rent',
  OWN = 'Own'
}

export interface RoomData {
  image: string | null; // Base64
  floorPlan: string | null; // Base64
  city: string;
  budget: string;
  style: string;
  mode: UserMode;
  orientation: string; // For Vastu (e.g., "North-East")
}

export interface ProductItem {
  name: string;
  description: string;
  retailPrice: number;
  retailLink: string;
  carpenterPrice: number;
  carpenterNotes: string; // e.g., "Plywood + Laminate + 3 Days Labor"
}

export interface VastuIssue {
  item: string;
  issue: string;
  fix: string;
  severity: 'low' | 'medium' | 'high';
}

export interface VastuReport {
  score: number; // 1-10
  summary: string;
  issues: VastuIssue[];
}

export interface DesignResult {
  generatedImage: string; // Base64 or URL
  vastu: VastuReport;
  products: ProductItem[];
  totalRetail: number;
  totalCarpenter: number;
  isFallback?: boolean; // New flag for error handling
}