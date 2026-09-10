import React from 'react';
import { 
  Activity, ShieldAlert, FileText, CheckCircle2, Clock, ArrowRight, 
  Bookmark, Sparkles, TrendingUp, BarChart3, Lock 
} from 'lucide-react';
import { SavedReport, WatchlistItem } from './utils/savedReportsStorage';
import { TranslationStrings, Language } from './utils/translations';

interface LandingViewProps {
  recentReports?: SavedReport[];
  watchlist?: WatchlistItem[];
  onSelectReport?: (report: SavedReport) => void;
  onSelectWatchlistTicker?: (ticker: string) => void;
  onOpenSidebar?: (tab?: 'watchlist' | 'history') => void;
  t: TranslationStrings;
  lang: Language;
}

export function LandingView({ 
  recentReports = [], 
  watchlist = [],
  onSelectReport, 
  onSelectWatchlistTicker,
  onOpenSidebar,
  t,
  lang,
}: LandingViewProps) {
  const isRtl = lang === 'ar';

  return (
    <div className="absolute inset-0 flex items-center justify-center p-6 md:p-8 overflow-y-auto no-scrollbar">
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent blur-3xl opacity-60" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 w-[500px] h-[300px] bg-gradient-to-t from-indigo-500/10 via-amber-500/5 to-transparent blur-3xl opacity-50" />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center py-8">
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900/90 border border-emerald-500/30 text-xs font-mono text-emerald-400 mb-6 shadow-sm backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold tracking-wide">SEC EDGAR AI TERMINAL</span>
          <span className="text-stone-500">•</span>
          <span className="text-stone-300">{t.liveAgentsStatus}</span>
        </div>

        <div className="text-center mb-8 max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4 font-serif leading-tight">
            {isRtl ? (
              <>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-stone-100 to-stone-300">
                  {t.appName}
                </span>
                ، المحلل الذكي{' '}
                <span className="italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  لإفصاحات وتقارير الأسواق المالية
                </span>
              </>
            ) : (
              <>
                Tickr, your intelligent{' '}
                <span className="italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  financial document
                </span>{' '}
                analyzer
              </>
            )}
          </h1>
          <p className="text-base md:text-lg text-stone-300 max-w-2xl mx-auto font-sans leading-relaxed">
            {t.subTagline}
          </p>

          <div className="mt-8 flex flex-col items-center gap-3">
            {watchlist.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <div className="flex items-center gap-1.5 text-xs text-amber-300 font-mono font-medium">
                  <Bookmark className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{t.pinnedWatchlist}</span>
                </div>
                {watchlist.slice(0, 5).map((item) => (
                  <button
                    key={item.ticker}
                    onClick={() => {
                      if (onSelectWatchlistTicker) {
                        onSelectWatchlistTicker(item.ticker);
                      } else if (onOpenSidebar) {
                        onOpenSidebar('watchlist');
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-900/90 hover:bg-stone-800 border border-amber-500/30 hover:border-amber-400/80 text-stone-200 transition-all cursor-pointer shadow-sm group active:scale-95"
                    title={`Monitor ${item.ticker}: ${item.notes || item.name}`}
                  >
                    <span className="font-mono font-bold text-xs tracking-wider text-white group-hover:text-amber-300 transition-colors">
                      {item.ticker}
                    </span>
                    {item.alertTag && item.alertTag !== 'General' && (
                      <span className="text-[10px] font-mono text-amber-300 px-1 rounded bg-amber-950/70 border border-amber-800/40">
                        {item.alertTag}
                      </span>
                    )}
                  </button>
                ))}

                {onOpenSidebar && (
                  <button
                    onClick={() => onOpenSidebar('watchlist')}
                    className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-200 font-mono transition-colors py-1 px-2 cursor-pointer"
                  >
                    <span>{t.viewAll} ({watchlist.length})</span>
                    <ArrowRight className={`w-3 h-3 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
            )}

            {recentReports.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <div className="flex items-center gap-1.5 text-xs text-stone-400 font-mono font-medium">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>{t.recentResearch}</span>
                </div>
                {recentReports.slice(0, 4).map((report) => (
                  <button
                    key={report.id}
                    onClick={() => onSelectReport && onSelectReport(report)}
                    className="flex items-center gap-2 px-3 py-1 rounded-lg bg-stone-900/90 hover:bg-stone-800 border border-stone-700 hover:border-emerald-500/60 text-stone-200 transition-all cursor-pointer shadow-sm group active:scale-95"
                    title={`Revisit ${report.ticker.toUpperCase()}`}
                  >
                    <span className="font-mono font-bold text-xs tracking-wider text-white group-hover:text-emerald-300 transition-colors">
                      {report.ticker.toUpperCase()}
                    </span>
                    {report.data?.verdict?.conviction_score !== undefined && (
                      <span className="text-[11px] font-mono text-emerald-400 font-semibold px-1 rounded bg-emerald-950/60 border border-emerald-800/40">
                        {report.data.verdict.conviction_score}%
                      </span>
                    )}
                  </button>
                ))}

                {onOpenSidebar && recentReports.length > 0 && (
                  <button
                    onClick={() => onOpenSidebar('history')}
                    className="flex items-center gap-1 text-xs text-stone
                    className="flex items-center gap-1 text-xs text-stone-400 hover:text-white font-mono transition-colors py-1 px-2 cursor-pointer"
                  >
                    <span>{t.viewAll} ({recentReports.length})</span>
                    <ArrowRight className={`w-3 h-3 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          
          <div className="relative overflow-hidden bg-stone-900/70 backdrop-blur-xl border border-stone-800 hover:border-cyan-500/40 rounded-2xl p-6 shadow-xl flex flex-col transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />
            
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-white tracking-wide">
                {isRtl ? 'تغطية شاملة لملفات هيئة الأوراق المالية (SEC)' : 'Comprehensive SEC Document Coverage'}
              </h3>
              <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex items-center gap-3 p-2 rounded-xl bg-stone-950/40 border border-stone-800/60">
                <div className="w-8 h-8 rounded-lg bg-blue-950/70 border border-blue-800/60 flex items-center justify-center text-blue-400 shrink-0">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white font-mono">Form 10-K & 10-Q</div>
                  <div className="text-xs text-stone-400">
                    {isRtl ? 'التقارير السنوية والبيانات المالية الربع سنوية' : 'Audited Annual Financials & Quarterly Updates'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-xl bg-stone-950/40 border border-stone-800/60">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/70 border border-emerald-800/60 flex items-center justify-center text-emerald-400 shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white font-mono">Form 8-K</div>
                  <div className="text-xs text-stone-400">
                    {isRtl ? 'الأحداث الجوهرية والصفقات وتغييرات الإدارة' : 'Material Unscheduled Corporate Events & Mergers'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-xl bg-stone-950/40 border border-stone-800/60">
                <div className="w-8 h-8 rounded-lg bg-amber-950/70 border border-amber-800/60 flex items-center justify-center text-amber-400 shrink-0">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white font-mono">Forms 3, 4, 5 & 13F</div>
                  <div className="text-xs text-stone-400">
                    {isRtl ? 'حركات كبار التنفيذيين وتداولات صناديق التحوط' : 'Insider Trading, Exec Ownership & Institutional Stakes'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden bg-stone-900/70 backdrop-blur-xl border border-stone-800 hover:border-emerald-500/40 rounded-2xl p-6 shadow-xl flex flex-col transition-all duration-300 group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />

            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-white tracking-wide">
                {isRtl ? 'رؤى تحليلية مستخرجة مباشرة من المصدر' : 'Institutional Synthesis Direct from Source'}
              </h3>
              <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            
            <div className="flex-1 flex flex-col gap-3 justify-center">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-950/40 border border-stone-800/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="text-xs text-stone-200 font-medium">
                  {isRtl ? 'تحديد المخاطر الجوهرية غير الواضحة في عناوين الأخبار' : 'Uncover hidden risk factors often masked in headlines'}
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-950/40 border border-stone-800/60">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <div className="text-xs text-stone-200 font-medium">
                  {isRtl ? 'استخلاص تعليقات الإدارة (MD&A) وتوقعات هوامش الربح' : 'Extract management discussion & forward-looking guidance'}
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-950/40 border border-stone-800/60">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="text-xs text-stone-200 font-medium">
                  {isRtl ? 'توليد تقرير شامل قابل للتصدير كـ PDF وبحث لحظي' : 'Generate structured consensus reports with 1-click PDF export'}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
