import { LandingView } from './LandingView';
import React, { useState, useRef, useEffect } from 'react';
import { PulsatingDotsBackground } from './components/PulsatingDots';
import { Search, Loader2, Clock, Bookmark, Globe, ChevronDown, Sparkles } from 'lucide-react';
import ReportTemplate from "./ReportTemplate";
import { AgentTimeline, TimelineEvent } from './components/AgentTimeline';
import { SavedReportsSidebar } from './components/SavedReportsSidebar';
import { 
  SavedReport, 
  loadSavedReports, 
  addSavedReport, 
  deleteSavedReport, 
  clearAllSavedReports,
  WatchlistItem,
  WatchlistAlertTag,
  loadWatchlist,
  addWatchlistItem,
  removeWatchlistItem,
  updateWatchlistItem,
  isTickerWatchlisted,
} from './utils/savedReportsStorage';
import { 
  Language, 
  loadStoredLanguage, 
  saveStoredLanguage, 
  TRANSLATIONS, 
  AVAILABLE_LANGUAGES 
} from './utils/translations';

export interface DocumentFinding {
  documentType?: string;
  document_type?: string;
  keyInsights?: string[];
  key_insights?: string[];
  date?: string;
  sourceUrl?: string;
  source_url?: string;
}

export interface DeepInsight {
  category: string;
  title: string;
  description: string;
  impact_score: number;
}

export interface ReportData {
  verdict?: {
    summary: string;
    conviction_score: number;
    key_takeaways: string[];
  };
  deep_insights?: DeepInsight[];
  findings?: DocumentFinding[];
  financial_charts?: {
    stock_price_4m: { date: string; price: number }[];
    financial_performance_4q: { quarter: string; revenue?: number; net_income?: number; distributions?: number }[];
  };
}

const ENABLE_JSON_DOWNLOAD = false;

export default function App() {
  const [ticker, setTicker] = useState('');
  const [instruction, setInstruction] = useState('');
  
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const eventIdRef = useRef(0);
  const [tokenCount, setTokenCount] = useState<number>(0);
  const [toolRuns, setToolRuns] = useState<number>(0);
  const [durationSecs, setDurationSecs] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  const [runningPerseus, setRunningPerseus] = useState(false);
  const [errorPerseus, setErrorPerseus] = useState<string | null>(null);
  const [reportDataPerseus, setReportDataPerseus] = useState<ReportData | null>(null);
  const [eventsPerseus, setEventsPerseus] = useState<TimelineEvent[]>([]);
  const abortRefPerseus = useRef<AbortController | null>(null);
  const eventIdRefPerseus = useRef(0);
  const [tokenCountPerseus, setTokenCountPerseus] = useState<number>(0);
  const [toolRunsPerseus, setToolRunsPerseus] = useState<number>(0);
  const [durationSecsPerseus, setDurationSecsPerseus] = useState<number>(0);
  const [startTimePerseus, setStartTimePerseus] = useState<number | null>(null);

  const [isReportOpen, setIsReportOpen] = useState<'flash'|'perseus'|false>(false);
  const [savedReports, setSavedReports] = useState<SavedReport[]>(() => loadSavedReports());
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => loadWatchlist());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarInitialTab, setSidebarInitialTab] = useState<'watchlist' | 'history'>('watchlist');

  const [lang, setLang] = useState<Language>(() => loadStoredLanguage());
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[lang];
  const isRtl = lang === 'ar';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    saveStoredLanguage(newLang);
    setIsLangDropdownOpen(false);
  };

  const handleSelectSavedReport = (saved: SavedReport) => {
    setTicker(saved.ticker);
    setReportData(saved.data);
    setDurationSecs(saved.durationSecs || 0);
    setToolRuns(saved.toolRuns || 0);
    setTokenCount(saved.tokenCount || 0);
    setIsReportOpen('flash');
    setIsSidebarOpen(false);
  };

  const handleDeleteSavedReport = (id: string) => {
    const updated = deleteSavedReport(id);
    setSavedReports(updated);
  };

  const handleClearAllReports = () => {
    const updated = clearAllSavedReports();
    setSavedReports(updated);
  };

  const handleAddToWatchlist = (sym: string, notes?: string, tag?: WatchlistAlertTag) => {
    const updated = addWatchlistItem(sym, notes, tag);
    setWatchlist(updated);
  };

  const handleRemoveFromWatchlist = (sym: string) => {
    const updated = removeWatchlistItem(sym);
    setWatchlist(updated);
  };

  const handleUpdateWatchlistNote = (sym: string, notes: string) => {
    const updated = updateWatchlistItem(sym, { notes });
    setWatchlist(updated);
  };

  const handleToggleWatchlist = (sym: string) => {
    if (isTickerWatchlisted(sym, watchlist)) {
      handleRemoveFromWatchlist(sym);
    } else {
      handleAddToWatchlist(sym, `Saved from SEC analysis report.`, 'General');
    }
  };

  const openSidebarWithTab = (tab: 'watchlist' | 'history') => {
    setSidebarInitialTab(tab);
    setIsSidebarOpen(true);
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (running && startTime) {
      interval = setInterval(() => {
        setDurationSecs(Math.round((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [running, startTime]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (runningPerseus && startTimePerseus) {
      interval = setInterval(() => {
        setDurationSecsPerseus(Math.round((Date.now() - startTimePerseus) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [runningPerseus, startTimePerseus]);

  const stopAgent = () => {
    if (abortRef.current) abortRef.current.abort();
    if (abortRefPerseus.current) abortRefPerseus.current.abort();
    setRunning(false);
    setRunningPerseus(false);
  };

  const createPushEvent = (setEvts: any, idRef: any) => (kind: TimelineEvent['kind'], label: string, detail?: string, toolName?: string, callId?: string) => {
    const now = Date.now();
    setEvts((prev: any) => {
      const newEvents = [...prev];
      if (newEvents.length > 0) {
        const lastIndex = newEvents.length - 1;
        if (!newEvents[lastIndex].endTime) {
          newEvents[lastIndex] = { ...newEvents[lastIndex], endTime: now };
        }
      }
      newEvents.push({ id: idRef.current++, kind, label, detail, toolName, startTime: now, callId });
      return newEvents;
    });
  };
  
  const pushEvent = createPushEvent(setEvents, eventIdRef);
  const pushEventPerseus = createPushEvent(setEventsPerseus, eventIdRefPerseus);

  const parseFinalText = (text: string) => {
    if (!text) return null;
    try {
      let foundData = null;
      const matches = [...text.matchAll(/```(?:json)?\s*([\s\S]*?)\s*```/g)];
      for (let i = matches.length - 1; i >= 0; i--) {
        try {
          const parsed = JSON.parse(matches[i][1]);
          if (parsed && (parsed.verdict || parsed.findings || parsed.deep_insights)) {
            foundData = parsed;
            break;
          }
        } catch (e) {}
      }
      
      if (!foundData) {
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace > firstBrace) {
          try {
            const possibleJson = text.slice(firstBrace, lastBrace + 1);
            const parsed = JSON.parse(possibleJson);
            if (parsed && (parsed.verdict || parsed.findings || parsed.deep_insights)) {
              foundData = parsed;
            }
          } catch (e) {
            const match = text.match(/\{\s*"verdict"[\s\S]*?\}\s*\}/);
            if (match) {
              try {
                const parsed = JSON.parse(match[0]);
                if (parsed && parsed.verdict) {
                  foundData = parsed;
                }
              } catch(e2) {}
            }
          }
        }
      }
      return foundData;
    } catch (e) {
      return null;
    }
  };

  const startStream = async (
    model: string,
    setRun: any,
    setErr: any,
    setRep: any,
    setEvts: any,
    pushEvt: any,
    setTok: any,
    setTRuns: any,
    setDur: any,
    setStart: any,
    aRef: any,
    eIdRef: any,
    overrideTicker?: string
  ) => {
    const activeTicker = (overrideTicker || ticker).trim();
    if (!activeTicker) return;

    setRun(true);
    setErr(null);
    setRep(null);
    setEvts([]);
    setTok(0);
    setTRuns(0);
    setDur(0);
    setStart(Date.now());
    eIdRef.current = 0;

    const controller = new AbortController();
    aRef.current = controller;
    const startTimestamp = Date.now();
    let currentToolRuns = 0;

    try {
      const resp = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker: activeTicker,
          instruction: instruction.trim() || undefined,
          origin: window.location.origin,
          model: model
        }),
        signal: controller.signal,
      });

      if (!resp.ok || !resp.body) {
        throw new Error(`Server responded ${resp.status}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulatedText = '';

      while (true) {
        if (controller.signal.aborted) break;

        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') continue;
            try {
              const evt = JSON.parse(dataStr);
              if (evt.type === 'text' && evt.text) {
                accumulatedText += evt.text;
              } else if (evt.type === 'tool_call') {
                currentToolRuns += 1;
                setTRuns(currentToolRuns);
                let label = "Searching for documents...";
                if (evt.name === "google_search") {
                  label = `Searching web: ${evt.arguments?.query || ''}`;
                } else if (evt.name) {
                  label = `Using tool: ${evt.name}`;
                }
                pushEvt('tool_call', label, JSON.stringify(evt.arguments, null, 2), evt.name, evt.callId);
              } else if (evt.type === 'tool_result') {
                pushEvt('tool_result', `Analysis retrieved`, evt.result, undefined, evt.callId);
              } else if (evt.type === 'thinking') {
                pushEvt('thinking', `Analyzing...`, evt.text);
              } else if (evt.type === 'complete') {
                if (evt.interaction) {
                  const interaction = evt.interaction;
                  const usage = interaction.usage || interaction.usage_metadata || (interaction.metadata && interaction.metadata.usage) || null;
                  if (usage) {
                    const tokens = usage.total_token_count || usage.totalTokenCount || usage.total_tokens || 0;
                    if (tokens > 0) {
                      setTok(tokens);
                    }
                  }
                }
              } else if (evt.type === 'final_stats') {
                if (evt.tokens > 0) setTok(evt.tokens);
                if (evt.duration > 0) setDur(Math.round(evt.duration));
                if (ENABLE_JSON_DOWNLOAD && evt.jsonlLogUrl) {
                  fetch(evt.jsonlLogUrl)
                    .then(res => res.blob())
                    .then(blob => {
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = evt.jsonlLogUrl.split('/').pop() || 'run_log.jsonl';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      window.URL.revokeObjectURL(url);
                    })
                    .catch(err => console.error('Failed to download log:', err));
                }
              }
            } catch { }
          }
        }
        
        if (accumulatedText) {
          const foundData = parseFinalText(accumulatedText);
          if (foundData) setRep(foundData);
        }
      }
      
      if (buffer) {
        try {
          const lines = buffer.split('\n\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6);
              if (dataStr === '[DONE]') continue;
              const evt = JSON.parse(dataStr);
              if (evt.type === 'text' && evt.text) {
                accumulatedText += evt.text;
              }
            }
          }
        } catch(e) {}
      }
      
      if (accumulatedText) {
        const finalData = parseFinalText(accumulatedText);
        if (finalData) {
          setRep(finalData);
          const duration = Math.round((Date.now() - startTimestamp) / 1000);
          const updated = addSavedReport({
            ticker: activeTicker.toUpperCase() || 'RESEARCH',
            model: model === 'perseus' ? 'Perseus (SEC Agent)' : 'Gemini 3.5 Flash',
            data: finalData,
            durationSecs: duration,
            toolRuns: currentToolRuns,
            documentCount: finalData.findings?.length || 0,
          });
          setSavedReports(updated);
        }
      }
      
      setDur(Math.round((Date.now() - startTimestamp) / 1000));
      setRun(false);
      
    } catch (e: any) {
      if (e.name === 'AbortError') {
        console.log('Aborted');
      } else {
        setErr(e.message || 'Unknown error');
      }
      setDur(Math.round((Date.now() - startTimestamp) / 1000));
      setRun(false);
    }
  };

  const runAnalysis = (overrideTicker?: string) => {
    const sym = (overrideTicker || ticker).trim();
    if (!sym || running || runningPerseus) return;
    setTicker(sym);
    setIsReportOpen(false);
    setIsSidebarOpen(false);
    
    startStream('gemini-3.5-flash', setRunning, setError, setReportData, setEvents, pushEvent, setTokenCount, setToolRuns, setDurationSecs, setStartTime, abortRef, eventIdRef, sym);
    startStream('perseus', setRunningPerseus, setErrorPerseus, setReportDataPerseus, setEventsPerseus, pushEventPerseus, setTokenCountPerseus, setToolRunsPerseus, setDurationSecsPerseus, setStartTimePerseus, abortRefPerseus, eventIdRefPerseus, sym);
  };

  if (isReportOpen === 'flash' && reportData) {
    return (
      <div className="w-full h-screen relative" dir={isRtl ? 'rtl' : 'ltr'}>
        <ReportTemplate 
          data={reportData} 
          ticker={ticker} 
          onClose={() => setIsReportOpen(false)}
          durationSecs={durationSecs}
          toolRuns={toolRuns}
          tokenCount={tokenCount}
          documentCount={reportData.findings?.length || 0}
          onOpenSidebar={() => openSidebarWithTab('watchlist')}
          savedReportsCount={savedReports.length}
          isWatchlisted={isTickerWatchlisted(ticker, watchlist)}
          onToggleWatchlist={() => handleToggleWatchlist(ticker)}
          lang={lang}
          t={t}
        />
        <SavedReportsSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          reports={savedReports}
          watchlist={watchlist}
          onSelectReport={handleSelectSavedReport}
          onDeleteReport={handleDeleteSavedReport}
          onClearAll={handleClearAllReports}
          onAddToWatchlist={handleAddToWatchlist}
          onRemoveFromWatchlist={handleRemoveFromWatchlist}
          onUpdateWatchlistNote={handleUpdateWatchlistNote}
          onAnalyzeTicker={(sym) => runAnalysis(sym)}
          currentActiveTicker={ticker}
          initialTab={sidebarInitialTab}
          lang={lang}
          t={t}
        />
      </div>
    );
  }
  
  if (isReportOpen === 'perseus' && reportDataPerseus) {
    return (
      <div className="w-full h-screen relative" dir={isRtl ? 'rtl' : 'ltr'}>
        <ReportTemplate 
          data={reportDataPerseus} 
          ticker={ticker} 
          onClose={() => setIsReportOpen(false)}
          durationSecs={durationSecsPerseus}
          toolRuns={toolRunsPerseus}
          tokenCount={tokenCountPerseus}
          documentCount={reportDataPerseus.findings?.length || 0}
          onOpenSidebar={() => openSidebarWithTab('watchlist')}
          savedReportsCount={savedReports.length}
          isWatchlisted={isTickerWatchlisted(ticker, watchlist)}
          onToggleWatchlist={() => handleToggleWatchlist(ticker)}
          lang={lang}
          t={t}
        />
        <SavedReportsSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          reports={savedReports}
          watchlist={watchlist}
          onSelectReport={handleSelectSavedReport}
          onDeleteReport={handleDeleteSavedReport}
          onClearAll={handleClearAllReports}
          onAddToWatchlist={handleAddToWatchlist}
          onRemoveFromWatchlist={handleRemoveFromWatchlist}
          onUpdateWatchlistNote={handleUpdateWatchlistNote}
          onAnalyzeTicker={(sym) => runAnalysis(sym)}
          currentActiveTicker={ticker}
          initialTab={sidebarInitialTab}
          lang={lang}
          t={t}
        />
      </div>
    );
  }

  const currentLangObj = AVAILABLE_LANGUAGES.find((l) => l.code === lang) || AVAILABLE_LANGUAGES[0];

  return (
    <div 
      className="relative h-screen bg-stone-900 overflow-hidden font-sans text-stone-100 flex flex-col"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <PulsatingDotsBackground />
      
      <header className="relative z-20 flex items-center justify-between px-6 py-3.5 border-b border-white/10 bg-black/30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-xl tracking-wider uppercase text-white bg-gradient-to-r from-white via-stone-200 to-stone-400 bg-clip-text text-transparent">
              Tickr
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold tracking-wider">
              SEC AI
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative" ref={langDropdownRef}>
            <button
              id="language-switcher-btn"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800/90 hover:bg-stone-700 text-stone-200 hover:text-white border border-stone-700 transition-all text-xs font-mono font-medium cursor-pointer shadow-sm active:scale-95"
              title="Change application language / تغيير لغة التطبيق"
            >
              <span className="text-sm">{currentLangObj.flag}</span>
              <span className="font-sans font-semibold">{currentLangObj.label}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangDropdownOpen && (
              <div 
                className={`absolute top-full mt-2 w-44 bg-stone-900/98 backdrop-blur-xl border border-stone-700 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 ${
                  isRtl ? 'left-0' : 'right-0'
                }`}
              >
                <div className="px-2 py-1 text-[10px] uppercase font-mono text-stone-400 border-b border-stone-800 mb-1">
                  {isRtl ? 'اختر اللغة' : 'Select Language'}
                </div>
                {AVAILABLE_LANGUAGES.map((l) => {
                  const isSelected = l.code === lang;
                  return (
                    <button
                      key={l.code}
                      onClick={() => handleLanguageChange(l.code)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        isSelected 
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold' 
                          : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{l.flag}</span>
                        <span className="font-sans">{l.label}</span>
                      </div>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            id="open-watchlist-sidebar-btn"
            onClick={() => openSidebarWithTab('watchlist')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800/90 hover:bg-stone-700 text-stone-200 hover:text-white border border-stone-700 hover:border-amber-500/50 transition-all text-xs font-mono font-medium cursor-pointer shadow-sm active:scale-[0.98]"
            title="Open Watchlist"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            <span>{t.watchlistTab}</span>
            {watchlist.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-mono font-bold">
                {watchlist.length}
              </span>
            )}
          </button>

          <button
            id="open-history-sidebar-btn"
            onClick={() => openSidebarWithTab('history')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800/90 hover:bg-stone-700 text-stone-200 hover:text-white border border-stone-700 hover:border-emerald-500/50 transition-all text-xs font-mono font-medium cursor-pointer shadow-sm active:scale-[0.98]"
            title="Open recent research reports"
          >
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{t.historyTab}</span>
            <span className="sm:hidden">{t.historyTab.split(' ')[0]}</span>
            {savedReports.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-mono font-bold">
                {savedReports.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col pt-8 min-h-0">
        {!running && !runningPerseus && !reportData && !reportDataPerseus && events.length === 0 && eventsPerseus.length === 0 ? (
          <LandingView 
            recentReports={savedReports}
            watchlist={watchlist}
            onSelectReport={handleSelectSavedReport}
            onSelectWatchlistTicker={(sym) => {
              setTicker(sym);
              openSidebarWithTab('watchlist');
            }}
            onOpenSidebar={(tab) => openSidebarWithTab(tab || 'watchlist')}
            t={t}
            lang={lang}
          />
        ) : (
          <div className="flex-1 flex flex-row overflow-hidden pb-32 gap-4 px-4 min-h-0 w-full max-w-4xl mx-auto">
            <div className="flex-1 flex flex-col bg-stone-900/50 rounded-xl border border-stone-800 overflow-hidden min-h-0">
              <div className="p-3 bg-stone-800/80 border-b border-stone-700 font-bold text-stone-200 text-sm flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img src="https://www.gstatic.com/lamda/images/gemini_sparkle_aurora_33f86dc0c0257da337c63.svg" alt="Gemini Sparkle" className="w-5 h-5" />
                  <span>Gemini Managed Agents</span>
                </div>
                {runningPerseus && <Loader2 className="w-4 h-4 animate-spin text-stone-400" />}
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <AgentTimeline 
                  events={eventsPerseus} 
                  running={runningPerseus} 
                  hasReport={!!reportDataPerseus && isReportOpen !== 'perseus'}
                  onViewReport={() => setIsReportOpen('perseus')}
                  metrics={reportDataPerseus ? { durationSecs: durationSecsPerseus, tokenCount: tokenCountPerseus, documentCount: reportDataPerseus.findings?.length || 0 } : undefined}
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-auto px-6 pb-8 pt-4 bg-gradient-to-t from-stone-900 via-stone-900 to-transparent w-full fixed bottom-0 z-20">
          <div className="max-w-4xl mx-auto w-full">
            {error && (
              <div className="mb-4 bg-rose-500/10 border border-rose-500/50 text-rose-200 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="bg-stone-800/95 backdrop-blur-xl border border-stone-700/90 hover:border-emerald-500/50 rounded-2xl shadow-2xl p-2 w-full flex items-center gap-2 relative z-30 transition-all focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/20">
              <div className="px-3 py-2 flex items-center gap-2.5 text-stone-400 w-full flex-1">
                <Search className="w-5 h-5 shrink-0 text-emerald-400" />
                <input 
                  type="text" 
                  value={ticker} 
                  onChange={(e) => setTicker(e.target.value)} 
                  placeholder={t.inputTickerPlaceholder} 
                  disabled={running} 
                  className="bg-transparent border-none outline-none w-full text-white font-mono uppercase placeholder-stone-500 text-sm tracking-wide" 
                  onKeyDown={(e) => e.key === 'Enter' && runAnalysis()} 
                />
              </div>
              <button 
                onClick={() => runAnalysis()} 
                disabled={!ticker.trim() || running || runningPerseus} 
                className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-stone-950 hover:brightness-110 disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed px-6 py-2.5 rounded-xl font-bold transition-all shrink-0 tracking-wide text-sm shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
              >
                {running || runningPerseus ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                    <span>{t.analyzingBtn}</span>
                  </span>
                ) : (
                  <span>{t.analyzeBtn}</span>
                )}
              </button>
            </div>
            
            <div className="text-center mt-3">
              <span className="text-xs text-stone-400 font-mono tracking-wide">
                {isRtl 
                  ? 'الذكاء الاصطناعي قد يخطئ، لا تعتمد عليه كنصيحة مالية أو استثمارية مباشرة.'
                  : lang === 'es'
                  ? 'Gemini puede cometer errores; no confíe en él para asesoramiento financiero.'
                  : lang === 'fr'
                  ? 'Gemini peut faire des erreurs, ne vous y fiez pas pour des conseils financiers.'
                  : 'Gemini can make mistakes, do not rely on it for financial advice.'}
              </span>
            </div>
          </div>
        </div>
      </main>

      <SavedReportsSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        reports={savedReports}
        watchlist={watchlist}
        onSelectReport={handleSelectSavedReport}
        onDeleteReport={handleDeleteSavedReport}
        onClearAll={handleClearAllReports}
        onAddToWatchlist={handleAddToWatchlist}
        onRemoveFromWatchlist={handleRemoveFromWatchlist}
        onUpdateWatchlistNote={handleUpdateWatchlistNote}
        onAnalyzeTicker={(sym) => runAnalysis(sym)}
        currentActiveTicker={ticker}
        initialTab={sidebarInitialTab}
        lang={lang}
        t={t}
      />
    </div>
  );
}
