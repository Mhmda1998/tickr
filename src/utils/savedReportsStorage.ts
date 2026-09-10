import { ReportData } from '../App';

export interface SavedReport {
  id: string;
  ticker: string;
  timestamp: number;
  model: string;
  data: ReportData;
  durationSecs?: number;
  toolRuns?: number;
  tokenCount?: number;
  documentCount?: number;
}

const STORAGE_KEY = 'tickr_saved_reports_v1';

export const INITIAL_SAVED_REPORTS: SavedReport[] = [
  {
    id: 'sample-nvda-1',
    ticker: 'NVDA',
    timestamp: Date.now() - 1000 * 60 * 45,
    model: 'Perseus (SEC Multi-Filing Agent)',
    durationSecs: 38,
    toolRuns: 6,
    tokenCount: 84200,
    documentCount: 4,
    data: {
      verdict: {
        summary: "NVIDIA displays extraordinary computational dominance driven by accelerated Data Center compute and expanding Blackwell platform architectures. Strong enterprise AI demand offsets supply chain packaging dependencies.",
        conviction_score: 88,
        key_takeaways: [
          "Data Center revenue continues explosive trajectory with record hyperscale and sovereign cloud commitments.",
          "Blackwell architecture transition on schedule with full production ramp and sustained margin profile.",
          "Board authorization of additional $60.0B share repurchase demonstrates strong free cash flow resilience."
        ]
      },
      deep_insights: [
        {
          category: "Market Expansion",
          title: "Sovereign AI & Enterprise ACIE Acceleration",
          description: "Transition to two primary reporting platforms (Data Center and Edge Computing) with ACIE sub-segment addressing national AI factory initiatives across Japan, Europe, and GCC countries.",
          impact_score: 9
        },
        {
          category: "Supply Chain",
          title: "Advanced Packaging & Fab Capacity Dependencies",
          description: "Reliance on key manufacturing partners for advanced CoWoS packaging remains primary gating factor for near-term delivery schedules.",
          impact_score: 7
        },
        {
          category: "Capital Allocation",
          title: "Substantial Shareholder Yield via Buybacks",
          description: "Returned $24.3B to shareholders in first half of fiscal year while retaining robust liquidity reserves.",
          impact_score: 8
        }
      ]
    }
  }
];

export function loadSavedReports(): SavedReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAVED_REPORTS));
      return INITIAL_SAVED_REPORTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_SAVED_REPORTS;
  } catch (e) {
    console.warn('Failed to load saved reports from localStorage:', e);
    return INITIAL_SAVED_REPORTS;
  }
}

export function saveSavedReports(reports: SavedReport[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch (e) {
    console.warn('Failed to save reports to localStorage:', e);
  }
}

export function addSavedReport(
  newReport: Omit<SavedReport, 'id' | 'timestamp'> & { id?: string; timestamp?: number }
): SavedReport[] {
  const current = loadSavedReports();
  const ticker = newReport.ticker.toUpperCase().trim();
  
  const existingFiltered = current.filter(
    (r) => !(r.ticker.toUpperCase() === ticker && Date.now() - r.timestamp < 1000 * 60 * 5)
  );

  const completeReport: SavedReport = {
    id: newReport.id || `report-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    ticker,
    timestamp: newReport.timestamp || Date.now(),
    model: newReport.model,
    data: newReport.data,
    durationSecs: newReport.durationSecs || 0,
    toolRuns: newReport.toolRuns || 0,
    tokenCount: newReport.tokenCount || 0,
    documentCount: newReport.documentCount || newReport.data.findings?.length || 0,
  };

  const updated = [completeReport, ...existingFiltered];
  saveSavedReports(updated);
  return updated;
}

export function deleteSavedReport(id: string): SavedReport[] {
  const current = loadSavedReports();
  const updated = current.filter((r) => r.id !== id);
  saveSavedReports(updated);
  return updated;
}

export function clearAllSavedReports(): SavedReport[] {
  saveSavedReports([]);
  return [];
}

export type WatchlistAlertTag = 'High Priority' | 'Earnings' | '10-K Filing' | 'Valuation' | 'General';

export interface WatchlistItem {
  ticker: string;
  name: string;
  sector: string;
  notes?: string;
  pinnedAt: number;
  alertTag?: WatchlistAlertTag;
}

export const KNOWN_TICKERS: Record<string, { name: string; sector: string }> = {
  NVDA: { name: 'NVIDIA Corporation', sector: 'Semiconductors & AI Hardware' },
  AAPL: { name: 'Apple Inc.', sector: 'Consumer Technology' },
  MSFT: { name: 'Microsoft Corporation', sector: 'Cloud Infrastructure & Enterprise' },
  GOOGL: { name: 'Alphabet Inc.', sector: 'Search & Cloud Services' },
  GOOG: { name: 'Alphabet Inc.', sector: 'Search & Cloud Services' },
  AMZN: { name: 'Amazon.com Inc.', sector: 'E-Commerce & AWS Cloud' },
  META: { name: 'Meta Platforms Inc.', sector: 'Social Media & VR Hardware' },
  TSLA: { name: 'Tesla Inc.', sector: 'Electric Vehicles & Clean Energy' },
  AMD: { name: 'Advanced Micro Devices', sector: 'Semiconductors & Accelerators' },
  AVGO: { name: 'Broadcom Inc.', sector: 'Semiconductor Solutions & Networking' },
  ORCL: { name: 'Oracle Corporation', sector: 'Enterprise Cloud & Database' },
  CRM: { name: 'Salesforce Inc.', sector: 'Enterprise CRM Software' },
  INTC: { name: 'Intel Corporation', sector: 'Semiconductor Manufacturing & Foundry' },
  QCOM: { name: 'Qualcomm Inc.', sector: 'Wireless Telecom & Snapdragon Silicon' },
  NFLX: { name: 'Netflix Inc.', sector: 'Streaming Media & Entertainment' },
  PLTR: { name: 'Palantir Technologies', sector: 'Data Analytics & AI Platforms' },
  UBER: { name: 'Uber Technologies Inc.', sector: 'Mobility & Delivery Platforms' },
  COIN: { name: 'Coinbase Global', sector: 'Digital Asset Infrastructure' },
  SNOW: { name: 'Snowflake Inc.', sector: 'Data Cloud Warehousing' },
};

const WATCHLIST_STORAGE_KEY = 'tickr_watchlist_v1';

export const INITIAL_WATCHLIST: WatchlistItem[] = [
  {
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Semiconductors & AI Hardware',
    notes: 'Monitoring Blackwell B200 packaging yields, hyperscaler capital expenditure, and sovereign AI commitments.',
    pinnedAt: Date.now() - 1000 * 60 * 60 * 3,
    alertTag: 'High Priority',
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'Cloud Infrastructure & Enterprise',
    notes: 'Tracking commercial cloud bookings growth and Copilot seat expansion ahead of next quarterly 10-Q disclosure.',
    pinnedAt: Date.now() - 1000 * 60 * 60 * 24,
    alertTag: '10-K Filing',
  },
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Consumer Technology',
    notes: 'Monitoring Apple Intelligence device cycle velocity and Services segment gross margin expansion.',
    pinnedAt: Date.now() - 1000 * 60 * 60 * 48,
    alertTag: 'Earnings',
  },
];

export function getTickerMeta(ticker: string): { name: string; sector: string } {
  const upper = ticker.toUpperCase().trim();
  if (KNOWN_TICKERS[upper]) {
    return KNOWN_TICKERS[upper];
  }
  return {
    name: `${upper} Corporation`,
    sector: 'Equity / Public Company',
  };
}

export function loadWatchlist(): WatchlistItem[] {
  try {
    const raw = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(INITIAL_WATCHLIST));
      return INITIAL_WATCHLIST;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_WATCHLIST;
  } catch (e) {
    console.warn('Failed to load watchlist from localStorage:', e);
    return INITIAL_WATCHLIST;
  }
}

export function saveWatchlist(items: WatchlistItem[]): void {
  try {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('Failed to save watchlist to localStorage:', e);
  }
}

export function addWatchlistItem(
  ticker: string,
  notes?: string,
  alertTag: WatchlistAlertTag = 'General'
): WatchlistItem[] {
  const upper = ticker.toUpperCase().trim();
  if (!upper) return loadWatchlist();

  const current = loadWatchlist();
  const existing = current.find((item) => item.ticker === upper);
  const meta = getTickerMeta(upper);

  if (existing) {
    const updated = [
      {
        ...existing,
        notes: notes !== undefined ? notes : existing.notes,
        alertTag: alertTag || existing.alertTag,
        pinnedAt: Date.now(),
      },
      ...current.filter((item) => item.ticker !== upper),
    ];
    saveWatchlist(updated);
    return updated;
  }

  const newItem: WatchlistItem = {
    ticker: upper,
    name: meta.name,
    sector: meta.sector,
    notes: notes || `Monitoring ${upper} SEC filings and quarterly disclosures.`,
    pinnedAt: Date.now(),
    alertTag,
  };

  const updated = [newItem, ...current];
  saveWatchlist(updated);
  return updated;
}

export function removeWatchlistItem(ticker: string): WatchlistItem[] {
  const upper = ticker.toUpperCase().trim();
  const current = loadWatchlist();
  const updated = current.filter((item) => item.ticker !== upper);
  saveWatchlist(updated);
  return updated;
}

export function updateWatchlistItem(
  ticker: string,
  updates: Partial<Pick<WatchlistItem, 'notes' | 'alertTag'>>
): WatchlistItem[] {
  const upper = ticker.toUpperCase().trim();
  const current = loadWatchlist();
  const updated = current.map((item) => {
    if (item.ticker === upper) {
      return { ...item, ...updates };
    }
    return item;
  });
  saveWatchlist(updated);
  return updated;
}

export function isTickerWatchlisted(ticker: string, watchlist: WatchlistItem[]): boolean {
  const upper = ticker.toUpperCase().trim();
  return watchlist.some((item) => item.ticker === upper);
}
