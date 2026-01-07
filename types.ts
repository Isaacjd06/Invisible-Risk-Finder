
export type RiskLevel = 'Low' | 'Moderate' | 'High';
export type Detectability = 'Easy' | 'Moderate' | 'Hidden';

export interface RiskFinding {
  id: string;
  title: string;
  score: number;
  likelihood: RiskLevel;
  impact: RiskLevel;
  detectability: Detectability;
  whatCanGoWrong: string;
  whyItMatters: string;
  howItFailsSilently: string;
  earlySignal: string;
  timeTrigger?: string;
}

export interface WorkMap {
  events: string[];
  timelines: string[];
  decisions: string[];
  dependencies: string[];
  ownership: string[];
}

export interface SuggestedTool {
  name: string;
  url: string;
  bestFor: string;
  whyFits: string[];
  tag: string;
}

export interface ScanReport {
  id: string;
  name: string;
  timestamp: string;
  overallProfile: RiskLevel;
  timeWindowsDetected: string[];
  originalInput: string;
  workMap: WorkMap;
  suggestedTools: SuggestedTool[];
  stabilizingActions?: string[];
  sections: {
    [key: string]: RiskFinding[];
  };
}

export type AppView = 'input' | 'loading' | 'report' | 'history';
