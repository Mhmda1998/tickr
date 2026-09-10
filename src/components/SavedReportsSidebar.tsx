import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, Search, Clock, Trash2, ArrowUpRight, FileText,
  Pin, Bookmark, BookmarkCheck, Plus, Edit3, Check, Play,
  TrendingUp, Calendar, AlertCircle, Eye, ChevronRight, Sparkles,
  Download, FileSpreadsheet
} from 'lucide-react';
import { 
  SavedReport, 
  WatchlistItem, 
  WatchlistAlertTag,
  isTickerWatchlisted,
  KNOWN_TICKERS
} from '../utils/savedReportsStorage';
import { TranslationStrings, Language } from '../utils/translations';

interface SavedReportsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  reports: SavedReport[];
  watchlist: WatchlistItem[];
  onSelectReport: (report: SavedReport) => void;
  onDeleteReport: (id: string) => void;
  onClearAll: () => void;
  onAddToWatchlist: (ticker: string, notes?: string, alertTag?: WatchlistAlertTag) => void;
  onRemoveFromWatchlist: (ticker: string) => void;
  onUpdateWatchlistNote: (ticker: string, notes: string) => void;
  onAnalyzeTicker: (ticker: string) => void;
  currentActiveTicker?: string | null;
  initialTab?: 'watchlist' | 'history';
  lang?: Language;
  t: TranslationStrings;
}

const POPULAR_SUGGESTIONS = ['TSLA', 'GOOGL', 'AMZN', 'META', 'AMD', 'PLTR', 'AVGO', 'COIN'];

export function SavedReportsSidebar({
  isOpen,
  onClose,
  reports,
  watchlist,
  onSelectReport,
  onDeleteReport,
  onClearAll,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  onUpdateWatchlistNote,
  onAnalyzeTicker,
  currentActiveTicker,
  initialTab = 'watchlist',
  lang = 'ar',
  t,
}: SavedReportsSidebarProps) {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'history'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  const [newTickerInput, setNewTickerInput] = useState('');
  const [newTickerNote, setNewTickerNote] = useState('');
  const [newTickerTag, setNewTickerTag] = useState<WatchlistAlertTag>('General');
  const [showAddForm, setShowAddForm] = useState(false);

  const [editingTicker, setEditingTicker] = useState<string | null>(null);
  const [editNoteText, setEditNoteText] = useState('');

  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [csvExportSuccess, setCsvExportSuccess] = useState(false);

  const isRtl = lang === 'ar';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setConfirmClear(false);
      setShowAddForm(false);
      setEditingTicker(null);
    }
  }, [isOpen]);

  const filteredReports = useMemo(() => {
    if (!searchQuery.trim()) return reports;
    const q = searchQuery.toLowerCase().trim();
    return reports.filter((r) => {
      return (
        r.ticker.toLowerCase().includes(q) ||
        r.model?.toLowerCase().includes(q) ||
        r.data?.verdict?.summary?.toLowerCase().includes(q)
      );
    });
  }, [reports, searchQuery]);

  const filteredWatchlist = useMemo(() => {
    if (!searchQuery.trim()) return watchlist;
    const q = searchQuery.toLowerCase().trim();
    return watchlist.filter((w) => {
      return (
        w.ticker.toLowerCase().includes(q) ||
        w.name?.toLowerCase().includes(q) ||
        w.sector?.toLowerCase().includes(q) ||
        w.notes?.toLowerCase().includes(q) ||
        w.alertTag?.toLowerCase().includes(q)
      );
    });
  }, [watchlist, searchQuery]);

  const formatRelativeTime = (timestamp: number) => {
    const diffSec = Math.floor((Date.now() - timestamp) / 1000);
    if (diffSec < 60) return isRtl ? 'الآن' : 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return isRtl ? `منذ ${diffMin} د` : `${diffMin}m ago`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return isRtl ? `منذ ${diffHour} س` : `${diffHour}h ago`;
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay === 1) return isRtl ? 'أمس' : 'Yesterday';
    if (diffDay < 7) return isRtl ? `منذ ${diffDay} أيام` : `${diffDay}d ago`;
    return new Date(timestamp).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getScoreBadgeClass = (score: number = 0) => {
    if (score >= 80) return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-sm';
    if (score >= 60) return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50';
    if (score >= 40) return 'bg-amber-950/80 text-amber-300 border-amber-500/50';
    return 'bg-rose-950/80 text-rose-300 border-rose-500/50';
  };

  const getAlertTagBadge = (tag?: WatchlistAlertTag) => {
    switch (tag) {
      case 'High Priority':
        return 'bg-rose-950/90 text-rose-300 border-rose-700/60';
      case 'Earnings':
        return 'bg-amber-950/90 text-amber-300 border-amber-600/60';
      case '10-K Filing':
        return 'bg-blue-950/90 text-blue-300 border-blue-600/60';
      case 'Valuation':
        return 'bg-purple-950/90 text-purple-300 border-purple-600/60';
      default:
        return 'bg-stone-800 text-stone-300 border-stone-700';
    }
  };

  const translateTag = (tag?: WatchlistAlertTag) => {
    if (!tag) return isRtl ? 'عام' : 'General';
    if (!isRtl) return tag;
    switch (tag) {
      case 'High Priority': return 'أولوية قصوى';
      case 'Earnings': return 'أرباح فصلية';
      case '10-K Filing': return 'إفصاح 10-K';
      case 'Valuation': return 'تقييم مالي';
      default: return 'عام';
    }
  };

  const handleAddTickerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sym = newTickerInput.trim().toUpperCase();
    if (!sym) return;
    onAddToWatchlist(sym, newTickerNote.trim() || undefined, newTickerTag);
    setNewTickerInput('');
    setNewTickerNote('');
    setNewTickerTag('General');
    setShowAddForm(false);
  };

  const handleStartEditNote = (item: WatchlistItem) => {
    setEditingTicker(item.ticker);
    setEditNoteText(item.notes || '');
  };

  const handleSaveNote = (ticker: string) => {
    onUpdateWatchlistNote(ticker, editNoteText.trim());
    setEditingTicker(null);
  };

  const handleExportWatchlistCsv = () => {
    if (watchlist.length === 0) return;
    setIsExportingCsv(true);

    try {
      const headers = [
        'Ticker',
        'Company Name',
        'Sector',
        'Alert Category',
        'Status',
        'Conviction Score',
        'Date Added',
        'Monitoring Notes'
      ];

      const escapeCsv = (val: string | number | undefined | null) => {
        if (val === undefined || val === null) return '""';
        const str = String(val).replace(/"/g, '""');
        return `"${str}"`;
      };

      const rows = watchlist.map((item) => {
        const matchedReport = reports.find(
          (r) => r.ticker.toUpperCase() === item.ticker.toUpperCase()
        );
        const hasReport = !!matchedReport;
        const conviction = matchedReport?.data?.verdict?.conviction_score;
        const status = hasReport ? 'Report Synthesized' : 'Unanalyzed';
        const convictionFormatted = conviction !== undefined ? `${conviction}%` : 'N/A';
        const addedDate = item.pinnedAt ? new Date(item.pinnedAt).toISOString().split('T')[0] : '';

        return [
          escapeCsv(item.ticker),
          escapeCsv(item.name || ''),
          escapeCsv(item.sector || ''),
          escapeCsv(item.alertTag || 'General'),
          escapeCsv(status),
          escapeCsv(convictionFormatted),
          escapeCsv(addedDate),
          escapeCsv(item.notes || '')
        ].join(',');
      });

      const csvString = [headers.join(','), ...rows].join('\r\n');

      const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const today = new Date().toISOString().slice(0, 10);
      link.setAttribute('href', url);
      link.setAttribute('download', `Tickr_Watchlist_${today}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setCsvExportSuccess(true);
      setTimeout(() => setCsvExportSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to export CSV:', err);
    } finally {
      setIsExportingCsv(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        aria-hidden="true"
      />

      <aside 
        id="saved-reports-sidebar"
        dir={isRtl ? 'rtl' : 'ltr'}
        className={`fixed inset-y-0 z-50 w-full max-w-sm sm:max-w-md bg-stone-900/98 backdrop-blur-2xl shadow-2xl flex flex-col transition-all duration-300 ease-out text-stone-100 ${
          isRtl ? 'right-0 border-l border-stone-800' : 'left-0 border-r border-stone-800'
        }`}
        aria-label="Research & Watchlist Sidebar"
      >
        <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-900/95 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-stone-800 to-stone-950 border border-stone-700 flex items-center justify-center shadow-inner">
              {activeTab === 'watchlist' ? (
                <Bookmark className="w-4 h-4 fill-amber-400 text-amber-400" />
              ) : (
                <Clock className="w-4 h-4 text-emerald-400" />
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                {t.portfolioHub}
              </h2>
              <p className="text-xs text-stone-400 font-mono">{t.portfolioSub}</p>
            </div>
          </div>

          <button
            id="close-sidebar-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            title={`${t.close} (Esc)`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 border-b border-stone-800 bg-stone-900/80 flex gap-2">
          <button
            id="tab-watchlist-btn"
            onClick={() => setActiveTab('watchlist')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold font-mono flex items-center justify-center gap-2 transition-all cursor-pointer border ${
              activeTab === 'watchlist'
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50 border-transparent'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${activeTab === 'watchlist' ? 'text-amber-400 fill-amber-400/40' : 'text-stone-500'}`} />
            <span>{t.watchlistTab}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
              activeTab === 'watchlist' ? 'bg-amber-500/20 text-amber-300' : 'bg-stone-800 text-stone-400'
            }`}>
              {watchlist.length}
            </span>
          </button>

          <button
            id="tab-history-btn"
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold font-mono flex items-center justify-center gap-2 transition-all cursor-pointer border ${
              activeTab === 'history'
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50 border-transparent'
            }`}
          >
            <Clock className={`w-3.5 h-3.5 ${activeTab === 'history' ? 'text-emerald-400' : 'text-stone-500'}`} />
            <span>{t.historyTab}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
              activeTab === 'history' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-stone-800 text-stone-400'
            }`}>
              {reports.length}
            </span>
          </button>
        </div>

        <div className="p-3 border-b border-stone-800/80 bg-stone-900/50">
          <div className="relative flex items-center">
            <Search className={`w-4 h-4 text-stone-400 absolute pointer-events-none ${isRtl ? 'right-3' : 'left-3'}`} />
            <input
              id="sidebar-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === 'watchlist' ? t.searchWatchlistPlaceholder : t.searchPlaceholder}
              className={`w-full py-2 bg-stone-800/90 border border-stone-700 rounded-xl text-sm text-stone-100 placeholder-stone-500 font-mono uppercase focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all ${
                isRtl ? 'pr-9 pl-8' : 'pl-9 pr-8'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute p-1 text-stone-400 hover:text-stone-200 cursor-pointer ${isRtl ? 'left-2.5' : 'right-2.5'}`}
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {activeTab === 'watchlist' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
            {!showAddForm ? (
              <div className="bg-gradient-to-r from-stone-800/60 to-stone-900/60 p-3.5 rounded-2xl border border-stone-800 hover:border-amber-500/30 transition-colors space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs text-stone-300">
                    <span className="font-semibold text-white block">
                      {isRtl ? 'تثبيت ومراقبة الأسهم المفضلة' : 'Pin Tickers for Quick Monitoring'}
                    </span>
                    <p className="text-[11px] text-stone-400">
                      {isRtl ? 'متابعة الشركات وتصدير القوائم للتحليل المحلي' : 'Track symbols and export lists for local spreadsheet tracking'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-stone-800/70">
                  <button
                    id="add-watchlist-trigger-btn"
                    onClick={() => setShowAddForm(true)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-stone-950 font-bold rounded-xl text-xs transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>{t.pinSymbol}</span>
                  </button>

                  <button
                    id="export-watchlist-csv-btn"
                    onClick={handleExportWatchlistCsv}
                    disabled={watchlist.length === 0 || isExportingCsv}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold font-mono border transition-all cursor-pointer active:scale-95 shadow-sm shrink-0 ${
                      csvExportSuccess
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60'
                        : watchlist.length === 0
                        ? 'bg-stone-800/40 text-stone-600 border-stone-800/80 cursor-not-allowed'
                        : 'bg-stone-800/90 hover:bg-stone-700 text-stone-200 hover:text-white border-stone-700 hover:border-amber-500/50'
                    }`}
                    title={
                      watchlist.length === 0 
                        ? (isRtl ? 'أضف رموزاً لتصدير قائمة المراقبة' : 'Add symbols to enable CSV export') 
                        : (isRtl ? 'تصدير قائمة المراقبة كملف CSV' : 'Export current watchlist as CSV')
                    }
                  >
                    {csvExportSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">{t.csvExported}</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5 text-amber-400" />
                        <span>{t.exportCsv}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <form 
                onSubmit={handleAddTickerSubmit}
                className="p-4 bg-stone-800/95 border border-amber-500/40 rounded-2xl space-y-3 shadow-lg animate-in fade-in duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-300 font-mono flex items-center gap-1.5">
                    <Pin className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    {t.pinAction}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-stone-400 hover:text-stone-200 p-0.5 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">
                      {isRtl ? 'رمز السهم' : 'Ticker Symbol'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newTickerInput}
                      onChange={(e) => setNewTickerInput(e.target.value.toUpperCase())}
                      placeholder="e.g. TSLA"
                      className="w-full px-2.5 py-1.5 bg-stone-900 border border-stone-700 rounded-lg text-xs font-mono font-bold text-white uppercase focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">
                      {t.alertCategory}
                    </label>
                    <select
                      value={newTickerTag}
                      onChange={(e) => setNewTickerTag(e.target.value as WatchlistAlertTag)}
                      className="w-full px-2.5 py-1.5 bg-stone-900 border border-stone-700 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                    >
                      <option value="General">{isRtl ? 'عام' : 'General'}</option>
                      <option value="High Priority">{isRtl ? 'أولوية قصوى' : 'High Priority'}</option>
                      <option value="Earnings">{isRtl ? 'أرباح فصلية' : 'Earnings'}</option>
                      <option value="10-K Filing">{isRtl ? 'إفصاح 10-K' : '10-K Filing'}</option>
                      <option value="Valuation">{isRtl ? 'تقييم مالي' : 'Valuation'}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-stone-400 mb-1">
                    {t.monitoringNote}
                  </label>
                  <input
                    type="text"
                    value={newTickerNote}
                    onChange={(e) => setNewTickerNote(e.target.value)}
                    placeholder={t.notesPlaceholder}
                    className="w-full px-2.5 py-1.5 bg-stone-900 border border-stone-700 rounded-lg text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 text-xs text-stone-400 hover:text-stone-200 cursor-pointer"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-lg text-xs shadow-sm cursor-pointer"
                  >
                    {t.save}
                  </button>
                </div>
              </form>
            )}

            {watchlist.length < 5 && (
              <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-800">
                <span className="text-[11px] font-mono text-stone-400 block mb-2">
                  {t.quickPinSuggestions}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_SUGGESTIONS.map((sym) => {
                    const isAlreadyWatchlisted = isTickerWatchlisted(sym, watchlist);
                    return (
                      <button
                        key={sym}
                        disabled={isAlreadyWatchlisted}
                        onClick={() => onAddToWatchlist(sym, `Monitoring ${sym} SEC disclosures.`, 'General')}
                        className={`text-xs font-mono font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                          isAlreadyWatchlisted
                            ? 'bg-stone-800/40 text-stone-600 border-stone-800 cursor-default'
                            : 'bg-stone-800 text-stone-300 border-stone-700 hover:border-amber-400/80 hover:text-amber-300 active:scale-95'
                        }`}
                      >
                        +{sym}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {filteredWatchlist.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <Bookmark className="w-10 h-10 text-amber-500/40 mb-3 stroke-[1.5]" />
                <p className="text-sm font-semibold text-stone-300 mb-1">
                  {searchQuery ? (isRtl ? `لا توجد نتائج لـ "${searchQuery}"` : `No watchlist matches for "${searchQuery}"`) : (isRtl ? 'قائمة المراقبة فارغة حالياً' : 'Your watchlist is empty')}
                </p>
                <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                  {isRtl ? 'قم بتثبيت الأسهم لمراقبة التطورات والإفصاحات دون الحاجة لتشغيل تقرير ثقيل.' : 'Pin symbols above to monitor tickers and keep your key equities organized.'}
                </p>
              </div>
            ) : (
              filteredWatchlist.map((item) => {
                const isCurrentActive = currentActiveTicker?.toUpperCase() === item.ticker.toUpperCase();
                const matchedSavedReport = reports.find(
                  (r) => r.ticker.toUpperCase() === item.ticker.toUpperCase()
                );
                const hasReport = !!matchedSavedReport;
                const isEditingThisNote = editingTicker === item.ticker;

                return (
                  <div
                    key={item.ticker}
                    id={`watchlist-item-${item.ticker.toLowerCase()}`}
                    className={`p-4 rounded-2xl border transition-all text-start relative group ${
                      isCurrentActive
                        ? 'bg-stone-800/90 border-amber-500/60 ring-1 ring-amber-500/40 shadow-lg'
                        : 'bg-stone-800/60 hover:bg-stone-800 border-stone-800 hover:border-stone-700 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold font-mono tracking-wider text-white">
                            {item.ticker}
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${getAlertTagBadge(item.alertTag)}`}>
                            {translateTag(item.alertTag)}
                          </span>
                          {isCurrentActive && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-400 text-stone-950 font-mono">
                              {isRtl ? 'النشط' : 'Active'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-400 font-medium truncate max-w-[240px]">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-stone-500 font-mono">
                          {item.sector}
                        </p>
                      </div>

                      <button
                        onClick={() => onRemoveFromWatchlist(item.ticker)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-stone-700/60 transition-colors cursor-pointer"
                        title={t.unpinAction}
                      >
                        <Pin className="w-3.5 h-3.5 fill-amber-400 text-amber-400 hover:fill-none hover:text-rose-400" />
                      </button>
                    </div>

                    <div className="my-2.5 p-2.5 rounded-xl bg-stone-900/70 border border-stone-800">
                      {isEditingThisNote ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editNoteText}
                            onChange={(e) => setEditNoteText(e.target.value)}
                            placeholder={t.notesPlaceholder}
                            className="w-full px-2 py-1 bg-stone-950 border border-stone-700 rounded text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                            autoFocus
                          />
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingTicker(null)}
                              className="px-2 py-0.5 text-[11px] text-stone-400 hover:text-stone-200 cursor-pointer"
                            >
                              {t.cancel}
                            </button>
                            <button
                              onClick={() => handleSaveNote(item.ticker)}
                              className="px-2.5 py-0.5 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3 h-3" />
                              <span>{t.save}</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs text-stone-300 leading-relaxed italic font-sans line-clamp-2">
                            "{item.notes || (isRtl ? 'مراقبة الإفصاحات وتطورات الشركة' : 'Monitoring SEC filings and corporate developments.')}"
                          </p>
                          <button
                            onClick={() => handleStartEditNote(item)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-amber-300 transition-opacity cursor-pointer shrink-0"
                            title="Edit monitoring note"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-700/50 text-xs">
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        {hasReport ? (
                          <div className="flex items-center gap-1.5 text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                            <span>{t.reportReady} ({matchedSavedReport.data?.verdict?.conviction_score || 0}%)</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-stone-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-stone-600 inline-block" />
                            <span>{t.unanalyzed}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {hasReport ? (
                          <button
                            onClick={() => onSelectReport(matchedSavedReport)}
                            className="px-2.5 py-1 rounded-lg bg-stone-700/80 hover:bg-stone-600 text-stone-200 hover:text-white font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer"
                            title={t.viewReport}
                          >
                            <Eye className="w-3 h-3" />
                            <span>{t.viewReport}</span>
                          </button>
                        ) : null}

                        <button
                          onClick={() => {
                            onAnalyzeTicker(item.ticker);
                            onClose();
                          }}
                          className="px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-stone-950 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
                          title={`Launch SEC synthesis for ${item.ticker}`}
                        >
                          <Play className="w-3 h-3 fill-stone-950" />
                          <span>{hasReport ? t.reAnalyze : t.analyzeBtn.split(' ')[0]}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
            {filteredReports.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <FileText className="w-10 h-10 text-stone-600 mb-3 stroke-[1.5]" />
                {searchQuery ? (
                  <>
                    <p className="text-sm font-semibold text-stone-300 mb-1">
                      {isRtl ? `لا توجد نتائج لـ "${searchQuery}"` : `No results for "${searchQuery}"`}
                    </p>
                    <p className="text-xs text-stone-500">
                      {isRtl ? 'جرب البحث برمز سهم آخر.' : 'Try searching for another ticker symbol.'}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-stone-300 mb-1">
                      {isRtl ? 'لا توجد تقارير بحثية محفوظة حتى الآن' : 'No research reports saved yet'}
                    </p>
                    <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                      {isRtl ? 'قم بإجراء تحليل مالي لأي سهم لأرشفة النتائج وتوصيات الذكاء الاصطناعي هنا تلقائياً.' : 'Run an analysis on any stock ticker to automatically archive your synthesized findings here.'}
                    </p>
                  </>
                )}
              </div>
            ) : (
              filteredReports.map((report) => {
                const isActive = currentActiveTicker?.toUpperCase() === report.ticker.toUpperCase();
                const conviction = report.data?.verdict?.conviction_score;
                const summary = report.data?.verdict?.summary || (isRtl ? 'تم إكمال استخراج وفحص إفصاحات SEC بنجاح.' : 'Comprehensive SEC filing synthesis completed.');
                const isPinned = isTickerWatchlisted(report.ticker, watchlist);

                return (
                  <div
                    key={report.id}
                    id={`saved-report-item-${report.ticker.toLowerCase()}`}
                    onClick={() => onSelectReport(report)}
                    className={`group relative p-4 rounded-2xl border transition-all cursor-pointer text-start ${
                      isActive
                        ? 'bg-stone-800 border-emerald-500/50 ring-1 ring-emerald-500/40 shadow-lg'
                        : 'bg-stone-800/60 hover:bg-stone-800 border-stone-800 hover:border-stone-700 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold font-mono tracking-wider text-white">
                          {report.ticker.toUpperCase()}
                        </span>
                        {isActive && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-400 text-stone-950">
                            {isRtl ? 'النشط' : 'Active'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {conviction !== undefined && (
                          <span
                            className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md border ${getScoreBadgeClass(
                              conviction
                            )}`}
                            title={`${t.convictionScore}: ${conviction}%`}
                          >
                            {conviction}%
                          </span>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isPinned) {
                              onRemoveFromWatchlist(report.ticker);
                            } else {
                              onAddToWatchlist(report.ticker, `Saved from analysis report with ${conviction}% conviction.`, 'General');
                            }
                          }}
                          className="p-1 rounded-lg hover:bg-stone-700 text-stone-400 hover:text-amber-400 transition-all cursor-pointer"
                          title={isPinned ? t.unpinAction : t.pinAction}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isPinned ? 'fill-amber-400 text-amber-400' : 'text-stone-400'}`} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteReport(report.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-stone-700 text-stone-400 hover:text-rose-400 transition-all cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-stone-300 leading-relaxed line-clamp-2 mb-3 font-normal">
                      {summary}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono border-t border-stone-700/50 pt-2 mt-1">
                      <div className="flex items-center gap-2">
                        <span>{report.documentCount || report.data?.findings?.length || 0} {t.filingsSynthesized}</span>
                        <span>•</span>
                        <span>{formatRelativeTime(report.timestamp)}</span>
                      </div>

                      <div className="flex items-center gap-1 text-emerald-400 group-hover:text-emerald-300 transition-colors font-medium text-xs font-sans">
                        <span>{isRtl ? 'عرض التقرير' : 'Revisit'}</span>
                        <ArrowUpRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-[-90deg]' : ''}`} />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        <div className="p-4 border-t border-stone-800 bg-stone-900/95 flex items-center justify-between text-xs">
          {activeTab === 'watchlist' ? (
            <>
              <span className="text-stone-400 font-mono text-[11px]">
                {watchlist.length} {isRtl ? 'أسهم تحت المراقبة' : 'monitored tickers'}
              </span>
              
              <div className="flex items-center gap-3 font-mono">
                {watchlist.length > 0 && (
                  <button
                    id="footer-export-watchlist-csv-btn"
                    onClick={handleExportWatchlistCsv}
                    disabled={isExportingCsv}
                    className="flex items-center gap-1.5 text-stone-400 hover:text-amber-300 transition-colors cursor-pointer text-xs font-medium"
                    title={isRtl ? 'تصدير قائمة المراقبة كملف CSV' : 'Export monitored tickers as CSV'}
                  >
                    {csvExportSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">{t.csvExported}</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5 text-amber-400" />
                        <span>{t.exportCsv}</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => setShowAddForm(true)}
                  className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.pinSymbol}</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <span className="text-stone-400 font-mono text-[11px]">
                {reports.length} {isRtl ? 'تقارير محفوظة' : 'stored reports'}
              </span>

              {reports.length > 0 && (
                confirmClear ? (
                  <div className="flex items-center gap-2">
                    <span className="text-rose-400 font-medium text-xs">{t.wipeConfirm}</span>
                    <button
                      onClick={() => {
                        onClearAll();
                        setConfirmClear(false);
                      }}
                      className="px-2 py-1 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded font-medium transition-colors cursor-pointer"
                    >
                      {t.wipeYes}
                    </button>
                    <button
                      onClick={() => setConfirmClear(false)}
                      className="px-2 py-1 text-stone-400 hover:text-stone-200 cursor-pointer"
                    >
                      {t.wipeCancel}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmClear(true)}
                    className="text-stone-500 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer font-mono"
                    title={t.clearHistory}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t.clearHistory}</span>
                  </button>
                )
              )}
            </>
          )}
        </div>
      </aside>
    </>
  );
}
