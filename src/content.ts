/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SINGLE SOURCE OF TRUTH FOR EVERY FACT ON THE SITE
 * ─────────────────────────────────────────────────────────────────────────────
 *  Sources: Sneha Kumaran's LinkedIn profile (as supplied in the project brief) and
 *  her public GitHub profile github.com/snehaakumaran (repository links, their own
 *  descriptions, and the Tableau Public link listed on that profile).
 *  Rules:
 *   • Nothing is invented — no metrics, accuracies, outcomes, dates or URLs.
 *   • Where the profile gives only a project title, the site shows only what the
 *     title itself states. Richer notes can be added here later.
 *   • Optional fields (email, Tableau, GitHub) stay empty until verified and are
 *     simply not rendered while empty.
 */

export const profile = {
  name: 'Sneha Kumaran',
  first: 'Sneha',
  last: 'Kumaran',
  role: 'Data Analyst',
  headline: 'Data Analyst at Clearpath Global | Data Analytics | Machine Learning and AI',
  statement: 'Turning Data Into Decisions.',
  focus: ['Data Analytics', 'Business Intelligence', 'Tableau', 'Data Visualization', 'Machine Learning'],
  // City-level location is on LinkedIn (Aldie, Virginia); the site shows the state.
  location: 'Virginia, United States',
  current: { role: 'Data Analyst', org: 'Clearpath Global', since: 'June 2024' },
  summary:
    'Data Analyst at Clearpath Global, working across advanced dashboarding, automation, web scraping and supply-chain analytics — extracting, transforming and loading data, and turning it into business insights.',
};

export const links = {
  linkedin: 'https://www.linkedin.com/in/snehakumaran/',
  // Leave empty until verified; empty values are not rendered.
  email: '',
  tableau: 'https://public.tableau.com/app/profile/sneha.kumaran',
  github: 'https://github.com/snehaakumaran',
};

/* ── THE DATA PROFILE ───────────────────────────────────────────────────────── */
export const profileNodes = [
  { id: 'analytics', label: 'Data Analytics', note: 'Analysis that turns raw data into answers.' },
  { id: 'viz', label: 'Data Visualization', note: 'Dashboards and visuals that make data readable.' },
  { id: 'ml', label: 'Machine Learning', note: 'Classification, regression and clustering models.' },
  { id: 'sql', label: 'SQL', note: 'Querying and shaping relational data.' },
  { id: 'python', label: 'Python', note: 'Analysis, automation and modelling.' },
  { id: 'tableau', label: 'Tableau', note: 'Interactive dashboards and visual analysis.' },
  { id: 'powerbi', label: 'Power BI', note: 'Business intelligence reporting.' },
];

export const profileThemes = ['Advanced dashboarding', 'Automation', 'Web scraping', 'Supply-chain analytics', 'Extract · Transform · Load', 'Business insights'];

/* ── EXPERIENCE PIPELINE ────────────────────────────────────────────────────── */
export const pipelineStages = [
  { id: 'source', label: 'Data source' },
  { id: 'extract', label: 'Extract' },
  { id: 'transform', label: 'Transform' },
  { id: 'analyze', label: 'Analyze' },
  { id: 'visualize', label: 'Visualize' },
  { id: 'insight', label: 'Business insight' },
] as const;
export type StageId = (typeof pipelineStages)[number]['id'];

export type Role = {
  role: string;
  org: string;
  period: string;
  current?: boolean;
  /** Work described on the profile, mapped to the pipeline stage it belongs to. */
  work: { stage: StageId; text: string }[];
};

export const experience: Role[] = [
  {
    role: 'Data Analyst',
    org: 'Clearpath Global',
    period: 'June 2024 — Present',
    current: true,
    work: [
      { stage: 'source', text: 'Web scraping' },
      { stage: 'extract', text: 'Data extraction' },
      { stage: 'transform', text: 'Transformation, loading & automation' },
      { stage: 'analyze', text: 'Supply-chain analytics' },
      { stage: 'visualize', text: 'Advanced dashboarding' },
      { stage: 'insight', text: 'Business insights' },
    ],
  },
  {
    role: 'Graduate Research And Teaching Assistant',
    org: 'George Mason University',
    period: 'Aug 2023 — Dec 2023',
    work: [],
  },
];

/* ── PROJECTS — exact names from the profile ────────────────────────────────── */
export type ProjectKind = 'bi' | 'ml' | 'db';
export const kindLabel: Record<ProjectKind, string> = {
  bi: 'Business intelligence',
  ml: 'Machine learning',
  db: 'Database design',
};

export type Project = {
  id: string;
  kind: ProjectKind;
  title: string;
  /** Short label for the universe node. */
  node: string;
  short: string;
  /** Only what the profile states. Kept short on purpose. */
  overview: string;
  /** What the title says the work does — used by the ML flow visual. */
  task?: string;
  tech: string[];
  links?: { label: string; href: string }[];
  /** id of the matching published Tableau Public visualization, if any. */
  viz?: string;
};

const repo = (name: string) => `https://github.com/snehaakumaran/${name}`;

export const projects: Project[] = [
  {
    id: 'mypaper',
    node: 'MyPaper A/R',
    kind: 'bi',
    title: 'MyPaper Accounts Receivable Dashboard',
    short: 'Accounts receivable dashboard',
    overview:
      'An accounts receivable dashboard for MyPaper: amount paid, largest amount paid and average days overdue, amount paid per month, disputed invoices and an invoice-level detail table, filterable by customer.',
    tech: ['Tableau', 'Dashboard'],
    viz: 'mypaper-ar',
  },
  {
    id: 'discountmart',
    node: 'Discount Mart Sales',
    kind: 'bi',
    title: 'Discount Mart Sales Analytics Dashboard',
    short: 'Sales analytics dashboard',
    overview:
      'A sales-analytics dashboard for Discount Mart: sales, profit and quantity for a chosen order year, monthly sales against the average, sales by category, quantity sold and a sales map by state.',
    tech: ['Tableau', 'Dashboard', 'Sales analytics'],
    viz: 'discountmart',
  },
  {
    id: 'hr',
    node: 'HR Analytics',
    kind: 'bi',
    title: 'HR Analytics Dashboard',
    short: 'HR analytics dashboard',
    overview:
      'A human-resources dashboard covering employee count, attrition rate, average job satisfaction and average monthly income, broken down by age group, income band and years at the company.',
    tech: ['Tableau', 'Dashboard', 'HR analytics'],
    viz: 'hr-analytics',
  },
  {
    id: 'breast-cancer',
    node: 'Breast Cancer',
    kind: 'ml',
    title: 'Breast Cancer Prediction using Classification Techniques',
    short: 'Classification',
    overview: 'Predicting breast cancer using classification techniques.',
    task: 'Classification',
    tech: ['Classification', 'Jupyter Notebook'],
    links: [{ label: 'Repository', href: repo('BreastCancerPrediction_CDS490') }],
  },
  {
    id: 'heart-failure',
    node: 'Heart Failure',
    kind: 'ml',
    title: 'Heart Failure Prediction using Regression/Classification Techniques',
    short: 'Regression / classification',
    overview: 'Predicting heart failure using regression and classification techniques.',
    task: 'Regression / Classification',
    tech: ['Regression', 'Classification', 'Jupyter Notebook', 'R'],
    links: [
      { label: 'Python repository', href: repo('HeartFailurePrediction_AIT580') },
      { label: 'R repository', href: repo('HeartFailure_R_CDS403') },
    ],
  },
  {
    id: 'airbnb',
    node: 'Airbnb Pricing',
    kind: 'ml',
    title: 'Influential Factors Determining the Price of an Airbnb Listing',
    short: 'Price factors',
    overview: 'Analysing which factors influence the price of an Airbnb listing.',
    task: 'Price factors',
    tech: ['Price prediction', 'Jupyter Notebook'],
    links: [{ label: 'Repository', href: repo('AirbnbPrediction_AIT582') }],
  },
  {
    id: 'dc-homes',
    node: 'D.C. Home Prices',
    kind: 'ml',
    title: 'Predicting Home Prices in Washington D.C. Real Estate Market: A Machine Learning Approach',
    short: 'Price prediction',
    overview:
      'A team project that built a system to predict home prices in the Washington D.C. market, creating models with multiple machine-learning algorithms.',
    task: 'Price prediction',
    tech: ['Machine learning', 'Multiple algorithms', 'Team project'],
    links: [{ label: 'Repository', href: repo('DC_RealEstateMarket_HomePrediction_AIT614') }],
  },
  {
    id: 'tweets',
    node: 'Offensive Tweets',
    kind: 'ml',
    title: 'Offensive Language Tweet Recognition',
    short: 'Text recognition',
    overview:
      'An NLP model that identifies offensive language in a set of annotated tweets (SemEval 2020, Sub-task C), classifying them into the groups GRP, IND and OTH.',
    task: 'NLP · Linear SVM',
    tech: ['Natural Language Processing', 'Linear SVM', 'Jupyter Notebook'],
    links: [{ label: 'Repository', href: repo('SemEval2020_SubTaskC_AIT526') }],
  },
  {
    id: 'ticketing',
    node: 'Ticketing System',
    kind: 'db',
    title: 'Ticketing Reservation System',
    short: 'Database system',
    overview: 'A ticketing reservation system, designed as a relational database.',
    tech: ['Oracle SQL', 'Lucidchart', 'Data Analysis'],
  },
];

/* ── TABLEAU PUBLIC — every published workbook on her profile ──────────────────
 *  Source: https://public.tableau.com/app/profile/sneha.kumaran/vizzes (7 workbooks,
 *  read from the profile's own workbook listing). Titles and view paths are exact.
 *  The workbooks carry no written descriptions, so each `summary` only names what
 *  is visible on the dashboard itself — its KPI labels, charts and filters.
 *  `size` is the dashboard's fixed size in Tableau; the viewer scales it to fit.
 */
export type VizCategory = 'Sales' | 'Finance' | 'HR' | 'Operations';

export type Viz = {
  id: string;
  title: string;
  /** Tableau Public workbook + sheet path, e.g. "HRAnalytics_16333208033200/Dashboard1". */
  path: string;
  category: VizCategory;
  /** A short label for what the dashboard is about. */
  domain: string;
  summary: string;
  /** What the dashboard is built from — elements visible on it. */
  features: string[];
  size: [number, number];
  featured?: boolean;
  /** false when Tableau's own preview image is empty (see note). */
  preview?: boolean;
  note?: string;
};

export const tableauProfile = 'https://public.tableau.com/app/profile/sneha.kumaran/vizzes';

export const vizzes: Viz[] = [
  {
    id: 'hr-analytics',
    title: 'HR Analytics',
    path: 'HRAnalytics_16333208033200/Dashboard1',
    category: 'HR',
    domain: 'Human resources · workforce analytics',
    summary:
      'Employee count, attrition rate, average job satisfaction and average monthly income, with attrition broken down by age group, income band and years at the company.',
    features: ['KPI summary', 'Histograms', 'Deviation from average', 'Attrition split'],
    size: [1300, 927],
    featured: true,
  },
  {
    id: 'mypaper-ar',
    title: 'MyPaper Accounts Receivable Dashboard',
    path: 'MyPaperAccountsReceivableDashboard_16414445732630/AccountsReceivableDashboard',
    category: 'Finance',
    domain: 'Finance · accounts receivable',
    summary:
      'Amount paid, largest amount paid and average days overdue, the amount paid per month, disputed invoices, and an invoice-level detail table — all filterable by customer.',
    features: ['KPI summary', 'Monthly trend', 'Detail table', 'Customer filter'],
    size: [1100, 677],
    featured: true,
  },
  {
    id: 'superstore-agents',
    title: 'SuperStore Sales Agent Analytics',
    path: 'SuperStoreSalesAgentAnalytics_16536118484980/Dashboard1',
    category: 'Sales',
    domain: 'Sales · agent performance',
    summary:
      'Sales and growth for a chosen date range, with sales by month, by sales agent, by category and sub-category, and the top five products.',
    features: ['KPI summary', 'Date-range filter', 'Ranked bars', 'Top-N products'],
    size: [1300, 927],
    featured: true,
  },
  {
    id: 'discountmart',
    title: 'DiscountMart',
    path: 'DiscountMart_16332455705760/Dashboard1',
    category: 'Sales',
    domain: 'Sales · retail analytics',
    summary:
      'Discount Mart sales analytics: sales, profit and quantity for a chosen order year, monthly sales against the average, sales by category, quantity sold and a sales map by state.',
    features: ['KPI summary', 'Year filter', 'Reference line', 'Map'],
    size: [1300, 927],
  },
  {
    id: 'northwind-shipping',
    title: 'Northwind - Shipping Analytics',
    path: 'Northwind-ShippingAnalytics_16541130063770/NorthWindDashboard',
    category: 'Operations',
    domain: 'Operations · shipping and logistics',
    summary:
      'Total orders, orders not shipped and the share not shipped for a chosen order month, with orders by product category, daily shipped and unshipped trends, and unshipped orders by country.',
    features: ['KPI summary', 'Month filter', 'Stacked bars', 'Map'],
    size: [1300, 927],
  },
  {
    id: 'tesla-stock',
    title: 'Tesla - Stock Price',
    path: 'Tesla-StockPrice_16541978245300/TeslaDashboard',
    category: 'Finance',
    domain: 'Finance · stock market',
    summary:
      'Daily close price, volume traded, daily high and low, and the percentage change between open and close, with highest and lowest price, driven by a date filter.',
    features: ['Time series', 'Relative-date filter', 'KPI summary'],
    size: [1300, 927],
    preview: false,
    note: 'The Date filter is relative to today, so it opens empty. Choose Years → Last 8 years in the filter to see the price history.',
  },
  {
    id: 'ait580-demo',
    title: 'AIT 580 - Demo',
    path: 'AIT580-Demo/Dashboard1',
    category: 'Sales',
    domain: 'Sales · profit by geography',
    summary:
      'Profit ratio by U.S. state on a map, filterable by region and profit-ratio range, above sales over time split by whether orders were profitable.',
    features: ['Filled map', 'Region filter', 'Range slider', 'Area chart'],
    size: [1000, 827],
  },
];

export const vizCategories: VizCategory[] = ['Sales', 'Finance', 'HR', 'Operations'];

const TP = 'https://public.tableau.com';
/** Live, interactive view for the iframe. */
export const vizEmbedUrl = (v: Viz) =>
  `${TP}/views/${v.path}?:embed=y&:showVizHome=no&:display_count=n&:tabs=n&:toolbar=bottom&:language=en-US&:origin=viz_share_link`;
/** The visualization's page on Tableau Public. */
export const vizPageUrl = (v: Viz) => `${TP}/app/profile/sneha.kumaran/viz/${v.path}`;
/** Tableau's own static preview image for the view. */
export const vizImageUrl = (v: Viz) => {
  const [wb, sheet] = v.path.split('/');
  return `${TP}/static/images/${wb.slice(0, 2)}/${wb}/${sheet}/1.png`;
};

/* ── DATA STACK — no proficiency levels ─────────────────────────────────────── */
export type StackGroup = { id: string; label: string; note: string; items: { name: string; note: string }[] };

export const stack: StackGroup[] = [
  {
    id: 'analytics',
    label: 'Data analytics',
    note: 'Querying, cleaning and analysing data.',
    items: [
      { name: 'SQL', note: 'Querying and shaping relational data.' },
      { name: 'Python', note: 'General-purpose analysis and automation.' },
      { name: 'R', note: 'Statistical computing and analysis.' },
      { name: 'Data Analysis', note: 'Turning raw data into findings.' },
    ],
  },
  {
    id: 'bi',
    label: 'BI & visualization',
    note: 'Dashboards and visual storytelling.',
    items: [
      { name: 'Tableau', note: 'Interactive dashboards and visual analysis.' },
      { name: 'Microsoft Power BI', note: 'Business intelligence reporting.' },
      { name: 'Data Visualization', note: 'Charts that make patterns obvious.' },
    ],
  },
  {
    id: 'ml',
    label: 'Machine learning',
    note: 'Supervised, unsupervised and language models.',
    items: [
      { name: 'Random Forest', note: 'Ensemble of decision trees.' },
      { name: 'Logistic Regression', note: 'Probabilistic classification.' },
      { name: 'Decision Tree', note: 'Rule-based splits on features.' },
      { name: 'K-Nearest Neighbors', note: 'Classification by nearest examples.' },
      { name: 'Naive Bayes', note: 'Probabilistic classifier.' },
      { name: 'Linear Regression', note: 'Modelling continuous outcomes.' },
      { name: 'K-Means Clustering', note: 'Grouping similar records.' },
      { name: 'Natural Language Processing', note: 'Working with text data.' },
    ],
  },
  {
    id: 'db',
    label: 'Database & data',
    note: 'Storing, moving and modelling data.',
    items: [
      { name: 'Oracle SQL', note: 'Relational database querying.' },
      { name: 'SQLite', note: 'Lightweight relational database.' },
      { name: 'ETL', note: 'Extract, transform and load pipelines.' },
      { name: 'Data Modeling', note: 'Structuring data into entities and relationships.' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    note: 'Where the work happens.',
    items: [
      { name: 'Jupyter Notebook', note: 'Interactive analysis notebooks.' },
      { name: 'Google Colab', note: 'Cloud-hosted notebooks.' },
      { name: 'Lucidchart', note: 'Diagrams and data models.' },
      { name: 'Microsoft PowerPoint', note: 'Presenting findings.' },
    ],
  },
];

/* ── ACADEMIC FOUNDATION ────────────────────────────────────────────────────── */
export const education = [
  {
    school: 'George Mason University',
    degree: 'Master of Science',
    field: 'Applied Information Technology',
    concentration: 'Data Analytics and Intelligence Methods',
    period: 'Aug 2022 — May 2024',
    start: 2022.6,
    end: 2024.4,
  },
  {
    school: 'George Mason University',
    degree: 'Bachelor of Science',
    field: 'Computational and Data Science',
    period: 'Aug 2018 — May 2022',
    start: 2018.6,
    end: 2022.4,
  },
];

export const deansList = [
  { term: 'Fall 2020', at: 2020.8 },
  { term: 'Spring 2021', at: 2021.3 },
  { term: 'Spring 2022', at: 2022.3 },
];

/* ── CERTIFICATIONS — only what the profile documents ───────────────────────── */
// Issuer / year are kept as data but not displayed (not documented for every entry).
export const certifications: { name: string; issuer?: string; year?: string }[] = [
  { name: 'Microsoft Dynamics 365 (CRM) & Power Platform Training', issuer: 'Udemy', year: '2024' },
  { name: 'The Complete Prompt Engineering for AI Bootcamp', issuer: 'Udemy', year: '2023' },
  { name: 'SQL Masterclass: SQL for Data Analytics', issuer: 'Udemy' },
  { name: 'The Complete Introduction to Data Analytics with Tableau', issuer: 'Udemy' },
  { name: 'Microsoft PowerPoint (Office 2016)', issuer: 'Microsoft' },
  { name: 'Microsoft Word (Office 2016)', issuer: 'Microsoft' },
  { name: 'CTECS Workplace Readiness Skills Assessment' },
];
