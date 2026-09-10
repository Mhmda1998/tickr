export type Language = 'en' | 'ar' | 'es' | 'fr';

export interface TranslationStrings {
  appName: string;
  tagline: string;
  subTagline: string;
  inputTickerPlaceholder: string;
  inputInstructionPlaceholder: string;
  analyzeBtn: string;
  analyzingBtn: string;
  watchlistTab: string;
  historyTab: string;
  portfolioHub: string;
  portfolioSub: string;
  searchPlaceholder: string;
  searchWatchlistPlaceholder: string;
  pinSymbol: string;
  pinned: string;
  pinAction: string;
  unpinAction: string;
  quickPinSuggestions: string;
  pinnedWatchlist: string;
  recentResearch: string;
  viewAll: string;
  viewReport: string;
  reAnalyze: string;
  unanalyzed: string;
  reportReady: string;
  filingsSynthesized: string;
  convictionScore: string;
  financialMetrics: string;
  keyRisks: string;
  growthDrivers: string;
  close: string;
  clearHistory: string;
  wipeConfirm: string;
  wipeYes: string;
  wipeCancel: string;
  notesPlaceholder: string;
  monitoringNote: string;
  save: string;
  cancel: string;
  alertCategory: string;
  downloadPdf: string;
  generatingPdf: string;
  pdfDownloaded: string;
  exportCsv: string;
  csvExported: string;
  backToSearch: string;
  highPriority: string;
  earnings: string;
  filing10K: string;
  valuation: string;
  general: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  liveAgentsStatus: string;
  timeElapsed: string;
  tokensStreamed: string;
  toolsInvoked: string;
}

export const TRANSLATIONS: Record<Language, TranslationStrings> = {
  en: {
    appName: 'Tickr',
    tagline: 'Tickr, your intelligent financial document analyzer',
    subTagline: 'Automatically finds and synthesizes recent SEC filings and public disclosures.',
    inputTickerPlaceholder: 'TICKER (e.g. NVDA, AAPL, MSFT)',
    inputInstructionPlaceholder: 'Add specific focus (e.g. analyze data center revenue, margin expansion, or debt schedule)...',
    analyzeBtn: 'Run Deep SEC Analysis',
    analyzingBtn: 'Synthesizing SEC Disclosures...',
    watchlistTab: 'Watchlist',
    historyTab: 'Recent Research',
    portfolioHub: 'Financial Intelligence Hub',
    portfolioSub: 'Watchlist Monitoring & SEC Synthesis Archive',
    searchPlaceholder: 'Search ticker or filings...',
    searchWatchlistPlaceholder: 'Search pinned symbols & notes...',
    pinSymbol: 'Pin Symbol',
    pinned: 'Pinned',
    pinAction: 'Pin to Watchlist',
    unpinAction: 'Unpin from Watchlist',
    quickPinSuggestions: 'Quick-Pin Suggestions:',
    pinnedWatchlist: 'Pinned Watchlist:',
    recentResearch: 'Recent Research:',
    viewAll: 'View all',
    viewReport: 'View Report',
    reAnalyze: 'Re-Analyze',
    unanalyzed: 'Unanalyzed',
    reportReady: 'Report ready',
    filingsSynthesized: 'filings synthesized',
    convictionScore: 'Conviction Score',
    financialMetrics: 'Financial Performance Metrics',
    keyRisks: 'Identified Risk Factors',
    growthDrivers: 'Catalysts & Growth Drivers',
    close: 'Close',
    clearHistory: 'Clear history',
    wipeConfirm: 'Wipe all stored reports?',
    wipeYes: 'Yes, clear',
    wipeCancel: 'Cancel',
    notesPlaceholder: 'Add monitoring notes or thesis...',
    monitoringNote: 'Monitoring Note',
    save: 'Save',
    cancel: 'Cancel',
    alertCategory: 'Alert Category',
    downloadPdf: 'Download PDF',
    generatingPdf: 'Generating PDF...',
    pdfDownloaded: 'PDF Downloaded',
    exportCsv: 'Export CSV',
    csvExported: 'CSV Exported!',
    backToSearch: 'Back to Search',
    highPriority: 'High Priority',
    earnings: 'Earnings',
    filing10K: '10-K Filing',
    valuation: 'Valuation',
    general: 'General',
    feature1Title: 'Live SEC EDGAR Retrieval',
    feature1Desc: 'Direct integration with 10-K, 10-Q, and 8-K filings with zero hallucinations.',
    feature2Title: 'Multi-Perspective AI Consensus',
    feature2Desc: 'Twin agent synthesis cross-evaluating risk disclosures against revenue trajectories.',
    feature3Title: 'Institutional Visuals & Charts',
    feature3Desc: 'Automatic extraction of quarterly segment breakdowns, margins, and free cash flows.',
    liveAgentsStatus: 'Autonomous SEC Analyst Agents Active',
    timeElapsed: 'Duration',
    tokensStreamed: 'Tokens Streamed',
    toolsInvoked: 'Tool Operations',
  },
  ar: {
    appName: 'تيكر (Tickr)',
    tagline: 'تيكر، المحلل الذكي لإفصاحات وتقارير الأسواق المالية',
    subTagline: 'يستخرج ويحلل تلقائياً أحدث إفصاحات وتقارير هيئة الأوراق المالية (SEC Filings) للشركات المدرجة.',
    inputTickerPlaceholder: 'رمز السهم (مثل: NVDA، AAPL، MSFT)',
    inputInstructionPlaceholder: 'أضف تركيزاً خاصاً (مثل: تحليل إيرادات مراكز البيانات، هوامش الربح، أو جدول الديون)...',
    analyzeBtn: 'بدء التحليل المالي المعمق',
    analyzingBtn: 'جارٍ استخراج وتلخيص إفصاحات SEC...',
    watchlistTab: 'قائمة المراقبة',
    historyTab: 'سجل الأبحاث',
    portfolioHub: 'مركز الذكاء المالي والمراقبة',
    portfolioSub: 'قائمة المتابعة اللحظية وأرشيف التحليلات المالية',
    searchPlaceholder: 'ابحث بالرمز أو الإفصاحات...',
    searchWatchlistPlaceholder: 'ابحث في الأسهم المثبتة والملاحظات...',
    pinSymbol: 'تثبيت السهم',
    pinned: 'مثبت للمراقبة',
    pinAction: 'تثبيت في قائمة المراقبة',
    unpinAction: 'إلغاء التثبيت من المراقبة',
    quickPinSuggestions: 'اقتراحات سريعة للمراقبة:',
    pinnedWatchlist: 'قائمة المراقبة المثبتة:',
    recentResearch: 'أحدث الأبحاث المالية:',
    viewAll: 'عرض الكل',
    viewReport: 'عرض التقرير',
    reAnalyze: 'إعادة التحليل',
    unanalyzed: 'قيد الانتظار',
    reportReady: 'التقرير جاهز',
    filingsSynthesized: 'إفصاحات تم فحصها',
    convictionScore: 'مؤشر الثقة الاستثمارية',
    financialMetrics: 'مؤشرات الأداء المالي',
    keyRisks: 'عوامل المخاطر المحتملة',
    growthDrivers: 'محفزات النمو والأرباح',
    close: 'إغلاق',
    clearHistory: 'مسح السجل',
    wipeConfirm: 'هل تريد مسح جميع التقارير المحفوظة؟',
    wipeYes: 'نعم، امسح',
    wipeCancel: 'إلغاء',
    notesPlaceholder: 'أضف ملاحظاتك أو أهداف السعر هنا...',
    monitoringNote: 'ملاحظة المراقبة',
    save: 'حفظ',
    cancel: 'إلغاء',
    alertCategory: 'فئة التنبيه',
    downloadPdf: 'تنزيل كملف PDF',
    generatingPdf: 'جارٍ تجهيز ملف PDF...',
    pdfDownloaded: 'تم تنزيل الـ PDF',
    exportCsv: 'تصدير كملف CSV',
    csvExported: 'تم تصدير CSV بنجاح!',
    backToSearch: 'العودة للبحث',
    highPriority: 'أولوية قصوى',
    earnings: 'الأرباح الفصلية',
    filing10K: 'تقرير 10-K السنوي',
    valuation: 'التقييم المالي',
    general: 'عام',
    feature1Title: 'استرجاع مباشر من SEC EDGAR',
    feature1Desc: 'ربط مباشر بملفات 10-K و 10-Q و 8-K الرسمية دون افتراضات خاطئة.',
    feature2Title: 'توافق تحليلي ذكي متعدد الوكلاء',
    feature2Desc: 'مقارنة تقاطعية للمخاطر المفصح عنها مع مسارات نمو الإيرادات الفعلية.',
    feature3Title: 'رسوم بيانية ومؤشرات مالية احترافية',
    feature3Desc: 'استخراج تلقائي لتفاصيل القطاعات، هوامش التشغيل والتدفقات النقدية الحرة.',
    liveAgentsStatus: 'وكلاء التحليل المالي الذاتي يعملون الآن',
    timeElapsed: 'الوقت المنقضي',
    tokensStreamed: 'الرموز المعالجة',
    toolsInvoked: 'أدوات الفحص المنفذة',
  },
  es: {
    appName: 'Tickr',
    tagline: 'Tickr, su analizador inteligente de documentos financieros',
    subTagline: 'Encuentra y sintetiza automáticamente presentaciones e informes recientes de la SEC.',
    inputTickerPlaceholder: 'SÍMBOLO (ej. NVDA, AAPL, MSFT)',
    inputInstructionPlaceholder: 'Agregue un enfoque específico (ej. ingresos de centros de datos, márgenes)...',
    analyzeBtn: 'Iniciar Análisis Profundo de la SEC',
    analyzingBtn: 'Sintetizando divulgaciones de la SEC...',
    watchlistTab: 'Lista de Seguimiento',
    historyTab: 'Investigación Reciente',
    portfolioHub: 'Centro de Inteligencia Financiera',
    portfolioSub: 'Monitoreo de Vigilancia y Archivo SEC',
    searchPlaceholder: 'Buscar símbolo o documentos...',
    searchWatchlistPlaceholder: 'Buscar en símbolos vigilados y notas...',
    pinSymbol: 'Fijar Símbolo',
    pinned: 'Fijado',
    pinAction: 'Fijar en Seguimiento',
    unpinAction: 'Quitar de Seguimiento',
    quickPinSuggestions: 'Sugerencias rápidas:',
    pinnedWatchlist: 'Lista Fijada:',
    recentResearch: 'Investigaciones Recientes:',
    viewAll: 'Ver todos',
    viewReport: 'Ver Informe',
    reAnalyze: 'Reanalizar',
    unanalyzed: 'Sin analizar',
    reportReady: 'Informe listo',
    filingsSynthesized: 'documentos sintetizados',
    convictionScore: 'Puntuación de Convicción',
    financialMetrics: 'Métricas de Rendimiento Financiero',
    keyRisks: 'Factores de Riesgo',
    growthDrivers: 'Catalizadores y Motores de Crecimiento',
    close: 'Cerrar',
    clearHistory: 'Borrar historial',
    wipeConfirm: '¿Borrar todos los informes guardados?',
    wipeYes: 'Sí, borrar',
    wipeCancel: 'Cancelar',
    notesPlaceholder: 'Agregar notas de monitoreo o tesis...',
    monitoringNote: 'Nota de Seguimiento',
    save: 'Guardar',
    cancel: 'Cancelar',
    alertCategory: 'Categoría de Alerta',
    downloadPdf: 'Descargar PDF',
    generatingPdf: 'Generando PDF...',
    pdfDownloaded: 'PDF Descargado',
    exportCsv: 'Exportar CSV',
    csvExported: '¡CSV Exportado!',
    backToSearch: 'Volver a Buscar',
    highPriority: 'Alta Prioridad',
    earnings: 'Resultados',
    filing10K: 'Informe 10-K',
    valuation: 'Valoración',
    general: 'General',
    feature1Title: 'Recuperación Directa de SEC EDGAR',
    feature1Desc: 'Integración directa con informes 10-K, 10-Q y 8-K oficiales sin alucinaciones.',
    feature2Title: 'Consenso de IA Multiperspectiva',
    feature2Desc: 'Síntesis de agentes emparejados que contrastan riesgos con ingresos.',
    feature3Title: 'Gráficos Financieros Institucionales',
    feature3Desc: 'Extracción automática de desgloses de ingresos por segmentos y flujos libres de caja.',
    liveAgentsStatus: 'Agentes de Análisis SEC Autónomos Activos',
    timeElapsed: 'Duración',
    tokensStreamed: 'Tokens Procesados',
    toolsInvoked: 'Operaciones de Herramientas',
  },
  fr: {
    appName: 'Tickr',
    tagline: 'Tickr, votre analyste intelligent de documents financiers',
    subTagline: 'Trouve et synthétise automatiquement les dépôts récents auprès de la SEC.',
    inputTickerPlaceholder: 'SYMBOLE (ex. NVDA, AAPL, MSFT)',
    inputInstructionPlaceholder: 'Ajouter un focus particulier (ex. revenus des centres de données)...',
    analyzeBtn: 'Lancer l\'Analyse Approfondie SEC',
    analyzingBtn: 'Synthèse des dépôts SEC en cours...',
    watchlistTab: 'Liste de Suivi',
    historyTab: 'Recherches Récentes',
    portfolioHub: 'Pôle d\'Intelligence Financière',
    portfolioSub: 'Surveillance et Archives des Synthèses SEC',
    searchPlaceholder: 'Rechercher un symbole ou dépôt...',
    searchWatchlistPlaceholder: 'Rechercher parmi les symboles suivis...',
    pinSymbol: 'Épingler le Symbole',
    pinned: 'Épinglé',
    pinAction: 'Épingler à la Liste',
    unpinAction: 'Retirer de la Liste',
    quickPinSuggestions: 'Suggestions rapides :',
    pinnedWatchlist: 'Liste Épinglée :',
    recentResearch: 'Recherches Récentes :',
    viewAll: 'Voir tout',
    viewReport: 'Consulter le Rapport',
    reAnalyze: 'Réanalyser',
    unanalyzed: 'Non analysé',
    reportReady: 'Rapport prêt',
    filingsSynthesized: 'documents analysés',
    convictionScore: 'Score de Conviction',
    financialMetrics: 'Indicateurs de Performance Financière',
    keyRisks: 'Facteurs de Risque Identifiés',
    growthDrivers: 'Catalyseurs de Croissance',
    close: 'Fermer',
    clearHistory: 'Effacer l\'historique',
    wipeConfirm: 'Supprimer tous les rapports enregistrés ?',
    wipeYes: 'Oui, effacer',
    wipeCancel: 'Annuler',
    notesPlaceholder: 'Ajouter une note de suivi ou thèse...',
    monitoringNote: 'Note de Suivi',
    save: 'Enregistrer',
    cancel: 'Annuler',
    alertCategory: 'Catégorie d\'Alerte',
    downloadPdf: 'Télécharger en PDF',
    generatingPdf: 'Génération du PDF...',
    pdfDownloaded: 'PDF Téléchargé',
    exportCsv: 'Exporter en CSV',
    csvExported: 'CSV Exporté !',
    backToSearch: 'Retour à la recherche',
    highPriority: 'Haute Priorité',
    earnings: 'Résultats',
    filing10K: 'Dépôt 10-K',
    valuation: 'Valorisation',
    general: 'Général',
    feature1Title: 'Extraction Directe SEC EDGAR',
    feature1Desc: 'Accès direct aux rapports 10-K, 10-Q et 8-K sans approximations.',
    feature2Title: 'Consensus Multi-Agents IA',
    feature2Desc: 'Analyse croisée des facteurs de risque face aux flux de revenus réels.',
    feature3Title: 'Graphiques et Métriques Institutionnels',
    feature3Desc: 'Ventilation automatique des segments d\'activité et flux de trésorerie.',
    liveAgentsStatus: 'Agents d\'Analyse Financière Actifs',
    timeElapsed: 'Durée',
    tokensStreamed: 'Tokens Traités',
    toolsInvoked: 'Opérations d\'Outils',
  },
};

export const AVAILABLE_LANGUAGES: { code: Language; label: string; flag: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'ar', label: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'en', label: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'es', label: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', label: 'Français', flag: '🇫🇷', dir: 'ltr' },
];

const LANG_STORAGE_KEY = 'tickr_selected_lang_v1';

export function loadStoredLanguage(): Language {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY) as Language;
    if (saved && TRANSLATIONS[saved]) {
      return saved;
    }
  } catch (e) {
  }
  return 'ar';
}

export function saveStoredLanguage(lang: Language): void {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch (e) {
  }
}
