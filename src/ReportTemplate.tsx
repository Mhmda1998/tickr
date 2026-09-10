import React, { useState, useRef } from 'react';
import { 
  X, FileText, CheckCircle2, ChevronRight, Calendar,
  Download, Loader2, AlertCircle, Printer, Clock, Bookmark, Globe
} from 'lucide-react';
import { ReportData } from './App';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { jsPDF } from 'jspdf';
import { toCanvas } from 'html-to-image';
import { TranslationStrings, Language } from './utils/translations';

interface Props {
  data: ReportData;
  ticker: string;
  onClose: () => void;
  durationSecs?: number;
  toolRuns?: number;
  tokenCount?: number;
  documentCount?: number;
  onOpenSidebar?: () => void;
  savedReportsCount?: number;
  isWatchlisted?: boolean;
  onToggleWatchlist?: () => void;
  lang?: Language;
  t?: TranslationStrings;
}

const AnalysisCard = ({ title, subtext, children, className = "" }: any) => (
  <div data-pdf-block="true" className={`bg-white rounded p-6 border border-stone-200 flex flex-col ${className}`}>
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
    </div>
    {subtext && (
      <div className="text-stone-700 text-[15px] mb-6">
        {subtext}
      </div>
    )}
    <div className="flex-1 w-full flex flex-col">
      {children}
    </div>
  </div>
);

function generateVectorPdf(
  data: ReportData,
  ticker: string,
  stats: { durationSecs: number; toolRuns: number; tokenCount: number; documentCount: number }
) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = 22;

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - 22) {
      doc.addPage('a4', 'portrait');
      cursorY = 22;
      doc.setFillColor(246, 244, 240);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
    }
  };

  doc.setFillColor(246, 244, 240);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(28, 25, 23);
  doc.text(`${ticker.toUpperCase()} FINANCIAL ANALYSIS`, margin, cursorY);
  cursorY += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(120, 113, 108);
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.text(`Autonomous SEC Filing Synthesis • Generated ${dateStr}`, margin, cursorY);
  cursorY += 12;

  checkPageBreak(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(28, 25, 23);
  doc.text('EXECUTIVE SUMMARY', margin, cursorY);
  cursorY += 6;

  if (data.verdict?.summary) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(41, 37, 36);
    const summaryLines = doc.splitTextToSize(`"${data.verdict.summary}"`, contentWidth - 10);
    const boxHeight = summaryLines.length * 5.2 + 8;
    checkPageBreak(boxHeight);
    
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(229, 229, 228);
    doc.roundedRect(margin, cursorY, contentWidth, boxHeight, 2, 2, 'FD');
    doc.text(summaryLines, margin + 5, cursorY + 6);
    cursorY += boxHeight + 8;
  }

  if (data.verdict?.key_takeaways) {
    checkPageBreak(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(120, 113, 108);
    doc.text('KEY TAKEAWAYS', margin, cursorY);
    cursorY += 6;

    const takeaways = Array.isArray(data.verdict.key_takeaways)
      ? data.verdict.key_takeaways
      : [String(data.verdict.key_takeaways)];

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(41, 37, 36);
    takeaways.forEach((t) => {
      const lines = doc.splitTextToSize(`•  ${t}`, contentWidth - 4);
      checkPageBreak(lines.length * 4.8);
      doc.text(lines, margin + 2, cursorY);
      cursorY += lines.length * 4.8 + 2;
    });
    cursorY += 6;
  }

  if (data.verdict?.conviction_score !== undefined) {
    checkPageBreak(24);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(229, 229, 228);
    doc.roundedRect(margin, cursorY, contentWidth, 20, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(120, 113, 108);
    doc.text('CONVICTION SCORE', margin + 6, cursorY + 7);
    
    doc.setFontSize(15);
    doc.setTextColor(11, 90, 75);
    doc.text(`${data.verdict.conviction_score} / 100`, margin + 6, cursorY + 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(120, 113, 108);
    const tokenDisplay = stats.tokenCount > 0 ? `${(stats.tokenCount / 1000).toFixed(1)}k` : '-';
    doc.text(
      `Docs Analyzed: ${stats.documentCount}   |   Execution Time: ${stats.durationSecs}s   |   Tool Runs: ${stats.toolRuns}   |   Tokens: ${tokenDisplay}`,
      margin + 60,
      cursorY + 12
    );
    cursorY += 28;
  }

  if (data.deep_insights && data.deep_insights.length > 0) {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(28, 25, 23);
    doc.text('DEEP INSIGHTS', margin, cursorY);
    cursorY += 8;

    data.deep_insights.forEach((insight) => {
      checkPageBreak(26);
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(229, 229, 228);
      
      const descLines = doc.splitTextToSize(insight.description, contentWidth - 10);
      const cardHeight = descLines.length * 4.6 + 18;
      checkPageBreak(cardHeight);

      doc.roundedRect(margin, cursorY, contentWidth, cardHeight, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(120, 113, 108);
      doc.text(`${insight.category.toUpperCase()} • IMPACT SCORE: ${insight.impact_score}/10`, margin + 5, cursorY + 6);

      doc.setFontSize(10.5);
      doc.setTextColor(28, 25, 23);
      doc.text(insight.title, margin + 5, cursorY + 12);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(68, 64, 60);
      doc.text(descLines, margin + 5, cursorY + 17);

      cursorY += cardHeight + 6;
    });
    cursorY += 4;
  }

  if (data.findings && data.findings.length > 0) {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(28, 25, 23);
    doc.text('DOCUMENT FINDINGS', margin, cursorY);
    cursorY += 8;

    data.findings.forEach((finding) => {
      checkPageBreak(28);
      const docType = finding.documentType || finding.document_type || 'SEC Regulatory Document';
      const date = finding.date ? ` • ${finding.date}` : '';

      const insights = Array.isArray(finding.keyInsights || finding.key_insights)
        ? (finding.keyInsights || finding.key_insights)!
        : (finding.keyInsights || finding.key_insights)
        ? [String(finding.keyInsights || finding.key_insights)]
        : [];

      let totalInsightsHeight = 0;
      const formattedInsights = insights.map((ins) => {
        const lines = doc.splitTextToSize(`•  ${ins}`, contentWidth - 12);
        totalInsightsHeight += lines.length * 4.5 + 2;
        return lines;
      });

      const cardHeight = Math.max(22, totalInsightsHeight + 14);
      checkPageBreak(cardHeight);

      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(229, 229, 228);
      doc.roundedRect(margin, cursorY, contentWidth, cardHeight, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(28, 25, 23);
      doc.text(`${docType}${date}`, margin + 5, cursorY + 7);

      let insightCursorY = cursorY + 12;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(68, 64, 60);

      formattedInsights.forEach((lines) => {
        doc.text(lines, margin + 5, insightCursorY);
        insightCursorY += lines.length * 4.5 + 2;
      });

      cursorY += cardHeight + 6;
    });
  }

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 113, 108);
    doc.text(
      `${ticker.toUpperCase()} Financial Analysis • Page ${i} of ${totalPages} • Generated ${dateStr}`,
      pageWidth / 2,
      291,
      { align: 'center' }
    );
  }

  const cleanTicker = (ticker || 'ANALYSIS').toUpperCase().replace(/[^A-Z0-9]/g, '');
  doc.save(`${cleanTicker}_Financial_Analysis_${new Date().toISOString().slice(0, 10)}.pdf`);
}

export default function ReportTemplate({ 
  data, 
  ticker, 
  onClose, 
  durationSecs = 0, 
  toolRuns = 0, 
  tokenCount = 0, 
  documentCount = 0,
  onOpenSidebar,
  savedReportsCount,
  isWatchlisted = false,
  onToggleWatchlist,
  lang = 'ar',
  t,
}: Props) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const reportContentRef = useRef<HTMLDivElement>(null);
  const isRtl = lang === 'ar';

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-[#0b5a4b]';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const findings = data.findings || [];

  const handleDownloadPdf = async () => {
    if (isGeneratingPdf || !reportContentRef.current) return;
    setIsGeneratingPdf(true);
    setExportError(null);

    await new Promise((resolve) => setTimeout(resolve, 80));

    try {
      const reportEl = reportContentRef.current;
      const dateString = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      let canvas: HTMLCanvasElement;
      try {
        canvas = await toCanvas(reportEl, {
          quality: 0.95,
          pixelRatio: 2,
          backgroundColor: '#F6F4F0',
          skipFonts: true,
          style: {
            maxHeight: 'none',
            height: 'auto',
            overflow: 'visible',
          },
          filter: (node) => {
            if (node instanceof HTMLElement && node.getAttribute('data-pdf-ignore') === 'true') {
              return false;
            }
            return true;
          }
        });
      } catch (firstErr) {
        console.warn('High-res canvas capture failed, retrying at 1x resolution...', firstErr);
        canvas = await toCanvas(reportEl, {
          quality: 0.9,
          pixelRatio: 1,
          backgroundColor: '#F6F4F0',
          skipFonts: true,
          filter: (node) => {
            if (node instanceof HTMLElement && node.getAttribute('data-pdf-ignore') === 'true') {
              return false;
            }
            return true;
          }
        });
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pdfWidth = 210;
      const pdfHeight = 297;
      const pageCanvasHeight = (canvas.width * pdfHeight) / pdfWidth;

      const scale = canvas.width / reportEl.offsetWidth;
      const reportRect = reportEl.getBoundingClientRect();
      const blocks = Array.from(reportEl.querySelectorAll('[data-pdf-block]'));

      const boundaries = blocks.map((el) => {
        const r = el.getBoundingClientRect();
        return {
          top: (r.top - reportRect.top) * scale,
          bottom: (r.bottom - reportRect.top) * scale,
        };
      }).sort((a, b) => a.top - b.top);

      const breakPoints: number[] = [0];
      let currentY = 0;

      while (currentY < canvas.height) {
        const nextMaxY = currentY + pageCanvasHeight;
        if (nextMaxY >= canvas.height) {
          breakPoints.push(canvas.height);
          break;
        }

        const minAcceptableY = currentY + pageCanvasHeight * 0.60;
        let bestBreak = nextMaxY;
        let foundBoundary = false;

        for (const b of boundaries) {
          if (b.bottom >= minAcceptableY && b.bottom <= nextMaxY - 12 * scale) {
            if (b.bottom > bestBreak || !foundBoundary) {
              bestBreak = b.bottom + 6 * scale;
              foundBoundary = true;
            }
          }
          if (b.top >= minAcceptableY && b.top <= nextMaxY - 12 * scale) {
            if (b.top > bestBreak || !foundBoundary) {
              bestBreak = b.top - 6 * scale;
              foundBoundary = true;
            }
          }
        }

        currentY = Math.min(canvas.height, bestBreak);
        breakPoints.push(currentY);
      }

      const totalPages = breakPoints.length - 1;

      for (let i = 0; i < totalPages; i++) {
        if (i > 0) {
          pdf.addPage('a4', 'portrait');
        }

        const startY = Math.max(0, Math.floor(breakPoints[i]));
        const endY = Math.min(canvas.height, Math.ceil(breakPoints[i + 1]));
        const sliceHeight = endY - startY;

        if (sliceHeight <= 0) continue;

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeight;
        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#F6F4F0';
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(
            canvas,
            0, startY, canvas.width, sliceHeight,
            0, 0, canvas.width, sliceHeight
          );
        }

        const imgData = pageCanvas.toDataURL('image/jpeg', 0.95);
        const sliceHeightInMm = (sliceHeight * pdfWidth) / canvas.width;

        pdf.setFillColor(246, 244, 240);
        pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, sliceHeightInMm, undefined, 'FAST');

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(120, 113, 108);
        pdf.text(
          `${ticker.toUpperCase()} Financial Analysis • Page ${i + 1} of ${totalPages} • Generated ${dateString}`,
          pdfWidth / 2,
          291,
          { align: 'center' }
        );
      }

      const cleanTicker = (ticker || 'ANALYSIS').toUpperCase().replace(/[^A-Z0-9]/g, '');
      const fileName = `${cleanTicker}_Financial_Analysis_${new Date().toISOString().slice(0, 10)}.pdf`;
      pdf.save(fileName);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err: any) {
      console.warn('Canvas PDF export failed, deploying vector PDF generator...', err);
      try {
        generateVectorPdf(data, ticker, { durationSecs, toolRuns, tokenCount, documentCount });
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      } catch (fallbackErr: any) {
        console.error('Vector PDF fallback also failed:', fallbackErr);
        setExportError('Unable to generate PDF. Please try again.');
      }
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-full bg-[#F6F4F0] text-stone-900 font-sans w-full flex flex-col h-full overflow-y-auto">
      <style>{`
        @media print {
          [data-pdf-ignore="true"] {
            display: none !important;
          }
          body {
            background-color: #F6F4F0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          [data-pdf-block] {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      <div 
        data-pdf-ignore="true"
        className="w-full border-b border-stone-200 px-6 sm:px-10 py-3.5 flex items-center justify-between sticky top-0 z-50 bg-[#F6F4F0]/95 backdrop-blur-md"
      >
        <div className="font-display uppercase font-bold text-stone-900 text-lg tracking-wider flex items-center gap-2">
          <span>{ticker} Document Analysis</span>
        </div>

        <div className="flex items-center gap-2.5">
          {exportError && (
            <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-md px-2.5 py-1 flex items-center gap-1.5 animate-in fade-in">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{exportError}</span>
            </div>
          )}

          {onOpenSidebar && (
            <button
              id="report-recent-history-btn"
              onClick={onOpenSidebar}
              className="flex items-center gap-1.5 px-3 py-2 bg-stone-900 hover:bg-stone-800 active:scale-[0.98] text-stone-100 rounded-lg text-sm font-medium transition-all border border-stone-700 shadow-xs cursor-pointer"
              title={t?.portfolioHub || "Portfolio Hub"}
            >
              <Clock className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">{t?.watchlistTab || "Hub"}</span>
              {savedReportsCount !== undefined && savedReportsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-stone-800 text-stone-300 text-xs font-mono font-semibold border border-stone-700">
                  {savedReportsCount}
                </span>
              )}
            </button>
          )}

          {onToggleWatchlist && (
            <button
              id="report-watchlist-toggle-btn"
              onClick={onToggleWatchlist}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all border shadow-xs cursor-pointer active:scale-[0.98] ${
                isWatchlisted
                  ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-stone-900 hover:bg-stone-800 text-stone-200 border-stone-700'
              }`}
              title={isWatchlisted ? (t?.unpinAction || "Pinned to Watchlist") : (t?.pinAction || "Pin this symbol to Watchlist")}
            >
              <Bookmark className={`w-4 h-4 ${isWatchlisted ? 'fill-amber-400 text-amber-400' : 'text-stone-400'}`} />
              <span className="hidden sm:inline">{isWatchlisted ? (t?.pinned || 'Pinned') : (t?.pinSymbol || 'Pin Symbol')}</span>
            </button>
          )}

          <button
            id="download-pdf-btn"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 active:scale-[0.98] text-stone-950 font-bold rounded-lg text-sm transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            title={t?.downloadPdf || "Download report as PDF"}
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-stone-900" />
                <span>{t?.generatingPdf || 'Generating PDF...'}</span>
              </>
            ) : downloadSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-stone-950" />
                <span>{t?.pdfDownloaded || 'Downloaded!'}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{t?.downloadPdf || 'Download as PDF'}</span>
              </>
            )}
          </button>

          <button 
            id="close-report-btn"
            onClick={onClose}
            className="text-stone-400 hover:text-white hover:bg-stone-800 transition-colors flex items-center justify-center p-2 rounded-lg cursor-pointer"
            title={t?.close || "Close report"}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div 
        ref={reportContentRef}
        className="flex-1 py-8 px-6 sm:px-10 w-full max-w-[1200px] mx-auto flex flex-col gap-6"
      >
        <div data-pdf-block="true" className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-stone-300 pb-4 mb-2 gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-stone-500 font-bold mb-1">
              Institutional Research & Filing Synthesis
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-stone-900 tracking-tight uppercase">
              {ticker} Financial Analysis Report
            </h1>
          </div>
          <div className="flex flex-col sm:items-end text-xs text-stone-500 font-mono">
            <div className="flex items-center gap-1.5 font-medium text-stone-700">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="text-stone-400 mt-0.5">Autonomous Agentic Verification</div>
          </div>
        </div>
        
        <div className="flex flex-col gap-6">
          <AnalysisCard title="Executive Summary" className="w-full">
            <div className="bg-stone-50 p-5 rounded-xl border border-stone-100 mb-6 text-stone-800 leading-relaxed font-medium text-lg w-full">
              "{data.verdict?.summary || 'No summary available.'}"
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-10 gap-8 w-full mt-2">
              <div className="md:col-span-7 flex flex-col">
                {data.verdict?.key_takeaways && (Array.isArray(data.verdict.key_takeaways) ? data.verdict.key_takeaways.length > 0 : true) && (
                  <div className="w-full text-left flex-1">
                     <div className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-4 border-b border-stone-100 pb-2">Key Takeaways</div>
                     <div className="space-y-3">
                       {Array.isArray(data.verdict.key_takeaways) ? data.verdict.key_takeaways.map((takeaway, i) => (
                          <div key={i} className="flex gap-3 text-base">
                             <CheckCircle2 className="w-5 h-5 text-[#0b5a4b] shrink-0 mt-0.5" />
                             <div className="text-stone-700 leading-relaxed">{takeaway}</div>
                          </div>
                       )) : (
                          <div key="single" className="flex gap-3 text-base">
                             <CheckCircle2 className="w-5 h-5 text-[#0b5a4b] shrink-0 mt-0.5" />
                             <div className="text-stone-700 leading-relaxed">{String(data.verdict.key_takeaways)}</div>
                          </div>
                       )}
                     </div>
                  </div>
                )}
              </div>
              
              <div className="md:col-span-3 flex flex-col h-full text-center md:border-l md:border-stone-100 md:pl-8">
                 <h4 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-1">Conviction Score</h4>
                 <p className="text-xs text-stone-400 mb-4">Based on analyzed filings</p>
                 <div className={`text-6xl font-display font-bold mb-1 flex-1 flex items-center justify-center ${data.verdict ? scoreColor(data.verdict.conviction_score) : 'text-stone-400'}`}>
                    {data.verdict?.conviction_score || '-'}
                 </div>
                 
                 <div className="text-xs text-stone-500 uppercase tracking-widest font-bold mb-6">out of 100</div>
                 <div className="grid grid-cols-4 gap-1 border-t border-stone-100 pt-4 mt-auto w-full">
                   <div className="flex flex-col items-center">
                     <div className="text-[10px] text-stone-500 uppercase font-bold tracking-wider mb-1">Docs</div>
                     <div className="text-sm font-mono text-stone-800">{documentCount}</div>
                   </div>
                   <div className="flex flex-col items-center border-l border-stone-100">
                     <div className="text-[10px] text-stone-500 uppercase font-bold tracking-wider mb-1">Time</div>
                     <div className="text-sm font-mono text-stone-800">{durationSecs}s</div>
                   </div>
                   <div className="flex flex-col items-center border-l border-stone-100">
                     <div className="text-[10px] text-stone-500 uppercase font-bold tracking-wider mb-1">Runs</div>
                     <div className="text-sm font-mono text-stone-800">{toolRuns}</div>
                   </div>
                   <div className="flex flex-col items-center border-l border-stone-100">
                     <div className="text-[10px] text-stone-500 uppercase font-bold tracking-wider mb-1">Tokens</div>
                     <div className="text-sm font-mono text-stone-800">
                        {tokenCount > 0 ? (tokenCount / 1000).toFixed(1) + 'k' : '-'}
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          </AnalysisCard>
        </div>

        {data.financial_charts && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <AnalysisCard title="Stock Price" subtext="This chart shows the closing price for the past four months on the last trading date.">
              <div className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.financial_charts.stock_price_4m ? [...data.financial_charts.stock_price_4m] : []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e4" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#78716c' }} dy={10} />
                    <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#78716c' }} dx={-10} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e5e4', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => [`$${value}`, 'Price']}
                    />
                    <Line type="linear" dataKey="price" stroke="#0b5a4b" strokeWidth={2} dot={{ r: 4, fill: '#0b5a4b', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </AnalysisCard>
            
            <AnalysisCard 
              title="Financial Performance"
              subtext={data.financial_charts.financial_performance_4q && data.financial_charts.financial_performance_4q.length > 0 && data.financial_charts.financial_performance_4q[0].distributions !== undefined ? "This chart shows the quarterly distributions (dividends/yield per share) for the past four completed quarters." : "This chart shows the revenue and net income for the past four completed quarters."}
            >
              <div className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.financial_charts.financial_performance_4q ? [...data.financial_charts.financial_performance_4q] : []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e4" />
                    <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#78716c' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#78716c' }} dx={-10} tickFormatter={(value) => data.financial_charts?.financial_performance_4q?.[0]?.distributions !== undefined ? `$${value}` : `${value}B`} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e5e4', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number, name: string) => name === 'Distributions' ? [`$${value}`, name] : [`$${value}B`, name]}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                    {data.financial_charts.financial_performance_4q && data.financial_charts.financial_performance_4q.length > 0 && data.financial_charts.financial_performance_4q[0].distributions !== undefined ? (
                      <Bar dataKey="distributions" name="Distributions" fill="#10b981" radius={[4, 4, 0, 0]} barSize={48} />
                    ) : (
                      <>
                        <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                        <Bar dataKey="net_income" name="Net Income" fill="#1e3a8a" radius={[4, 4, 0, 0]} barSize={32} />
                      </>
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </AnalysisCard>
          </div>
        )}

        {data.deep_insights && data.deep_insights.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-display font-bold text-stone-900 uppercase tracking-wider mb-6">Deep Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.deep_insights.slice(0, 3).map((insight, index) => (
                <div key={index} data-pdf-block="true" className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col">
                   <div className="flex items-start justify-between mb-4 border-b border-stone-100 pb-4">
                     <div className="flex items-center gap-3">
                       <div>
                         <div className="text-xs text-stone-500 font-bold uppercase tracking-wider">{insight.category}</div>
                         <h4 className="font-bold text-stone-900 text-lg mt-0.5 leading-tight">{insight.title}</h4>
                       </div>
                     </div>
                   </div>
                   <div className="text-stone-700 leading-relaxed text-[15px] flex-1">{insight.description}</div>
                   <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                     <span className="text-xs text-stone-500 font-bold uppercase tracking-wider">Impact Score</span>
                     <span className={`text-sm font-mono font-bold px-2 py-0.5 rounded ${insight.impact_score >= 8 ? 'bg-red-50 text-red-700' : insight.impact_score >= 5 ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'}`}>{insight.impact_score}/10</span>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
           <h2 className="text-2xl font-display font-bold text-stone-900 uppercase tracking-wider mb-6">Document Findings</h2>
           
           {findings.length === 0 ? (
             <div data-pdf-block="true" className="text-stone-500 italic p-8 bg-white rounded border border-stone-200 text-center">
               No specific document findings returned.
             </div>
           ) : (
             <div className="flex flex-col gap-6">
               {findings.map((finding, index) => (
                 <div key={index} data-pdf-block="true" className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col">
                   <div className="flex items-start justify-between mb-4 border-b border-stone-100 pb-4">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded bg-stone-100 text-stone-600 flex items-center justify-center">
                         <FileText className="w-5 h-5" />
                       </div>
                       <div>
                         <h4 className="font-bold text-stone-900 text-lg">{finding.documentType || finding.document_type || "Document"}</h4>
                         {finding.date && (
                           <div className="text-xs text-stone-500 font-mono flex items-center gap-1 mt-1">
                             <Calendar className="w-3 h-3" /> {finding.date}
                           </div>
                         )}
                       </div>
                     </div>
                     {(finding.sourceUrl || finding.source_url) && (
                       <a 
                         href={finding.sourceUrl || finding.source_url} 
                         target="_blank" 
                         rel="noreferrer" 
                         className="flex items-center gap-1 px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-mono font-medium transition-colors border border-stone-200" 
                         title="View Source Filing"
                       >
                         <FileText className="w-3.5 h-3.5 text-red-600" />
                         <span>Filing</span>
                         <ChevronRight className="w-3 h-3 text-stone-400" />
                       </a>
                     )}
                   </div>
                   
                   <ul className="space-y-3 mt-2 flex-1">
                     {Array.isArray(finding.keyInsights || finding.key_insights) ? (finding.keyInsights || finding.key_insights)?.map((insight, i) => (
                       <li key={i} className="flex gap-2 text-sm text-stone-700 leading-relaxed">
                         <ChevronRight className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                         <span>{insight}</span>
                       </li>
                     )) : (finding.keyInsights || finding.key_insights) ? (
                       <li key="single" className="flex gap-2 text-sm text-stone-700 leading-relaxed">
                         <ChevronRight className="w-4 h-4 text-stone-400 mt-0.5 shrink-0" />
                         <span>{String(finding.keyInsights || finding.key_insights)}</span>
                       </li>
                     ) : null}
                   </ul>
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
