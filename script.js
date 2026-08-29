/* ═══════════════════════════════════════════════════════
   FindMyGap — script.js
   Cross-Domain Skill Gap Scoring Engine & UI Controller
   Supports PDF, Image OCR, and Text Input
   250+ keyword dictionary · N-Gram NLP fallback · Stemming
   ═══════════════════════════════════════════════════════ */

// ──────────────────────────────────────────────────────
//  1. CATEGORIZED KEYWORD DICTIONARY (250+ keywords)
//     12 cross-domain categories
// ──────────────────────────────────────────────────────
const KEYWORD_DICT = {
    /* ── Finance & Accounting ── */
    finance_accounting: [
        'dcf', 'gaap', 'ifrs', 'financial modeling', 'financial analysis',
        'valuation', 'forecasting', 'budgeting', 'cash flow', 'cash flow analysis',
        'variance analysis', 'balance sheet', 'p&l', 'profit and loss',
        'reconciliation', 'capital budgeting', 'portfolio management',
        'risk management', 'risk assessment', 'internal audit', 'external audit',
        'cost accounting', 'revenue recognition', 'tax compliance', 'tax planning',
        'sox', 'sarbanes-oxley', 'due diligence', 'm&a', 'mergers and acquisitions',
        'financial reporting', 'financial statements', 'general ledger',
        'accounts payable', 'accounts receivable', 'fixed assets',
        'treasury management', 'working capital', 'credit analysis',
        'equity research', 'investment banking', 'private equity',
        'venture capital', 'hedge fund', 'asset management',
        'derivatives', 'options pricing', 'monte carlo simulation',
        'financial planning', 'fp&a', 'corporate finance',
        'audit', 'compliance', 'regulatory compliance',
        'anti-money laundering', 'aml', 'kyc', 'know your customer',
    ],
    // The above part has the list of skills for financial accounting 
    /* ── ERP & Enterprise Tools ── */
    erp_enterprise: [
        'sap', 'sap fico', 'sap mm', 'sap sd', 'sap hana', 'sap bw',
        'oracle erp', 'oracle financials', 'oracle hcm',
        'netsuite', 'workday', 'salesforce', 'sage', 'dynamics 365',
        'quickbooks', 'xero', 'freshbooks', 'tally',
        'peoplesoft', 'jd edwards', 'hyperion',
        'concur', 'coupa', 'ariba',
    ],

    /* ── Excel & Analytics Tools ── */
    excel_analytics: [
        'excel', 'advanced excel', 'vlookup', 'hlookup', 'index match',
        'pivot tables', 'pivot table', 'power query', 'power pivot',
        'vba', 'macros', 'excel macros', 'conditional formatting',
        'data validation', 'solver', 'goal seek',
        'bloomberg', 'bloomberg terminal', 'capital iq', 'factset',
        'morningstar', 'refinitiv', 'eikon',
        'google sheets', 'google workspace', 'microsoft office',
        'microsoft 365', 'word', 'powerpoint', 'outlook',
        'looker', 'metabase', 'qlik', 'qlikview', 'qliksense',
        'sisense', 'domo',
    ],

    /* ── Business & Operations ── */
    business_ops: [
        'product management', 'project management', 'program management',
        'agile', 'scrum', 'kanban', 'waterfall', 'prince2',
        'six sigma', 'lean', 'lean six sigma', 'kaizen',
        'kpi tracking', 'kpi', 'okr', 'okrs',
        'market research', 'competitive analysis', 'swot analysis',
        'vendor management', 'supplier management', 'procurement',
        'change management', 'stakeholder engagement',
        'supply chain', 'supply chain management', 'logistics',
        'inventory management', 'warehouse management',
        'process improvement', 'process optimization', 'bpm',
        'business process management', 'business analysis',
        'requirements gathering', 'business requirements',
        'business strategy', 'strategic planning', 'go-to-market',
        'operations management', 'capacity planning',
        'quality assurance', 'quality management', 'iso 9001',
        'contract management', 'contract negotiation',
        'pmp', 'certified scrum master', 'csm',
        'risk mitigation', 'business continuity',
    ],

    /* ── Marketing & Sales ── */
    marketing_sales: [
        'seo', 'sem', 'ppc', 'google ads', 'facebook ads', 'meta ads',
        'google analytics', 'ga4', 'adobe analytics',
        'hubspot', 'marketo', 'mailchimp', 'pardot',
        'social media marketing', 'content marketing', 'content strategy',
        'crm', 'lead generation', 'demand generation',
        'brand strategy', 'brand management', 'brand positioning',
        'email marketing', 'marketing automation',
        'copywriting', 'ux writing',
        'conversion rate optimization', 'cro',
        'affiliate marketing', 'influencer marketing',
        'digital marketing', 'growth marketing', 'performance marketing',
        'market segmentation', 'customer acquisition',
        'sales operations', 'sales enablement', 'salesforce crm',
        'b2b', 'b2c', 'saas', 'account management',
        'customer success', 'customer retention',
        'pipeline management', 'revenue operations',
    ],

    /* ── Frontend ── */
    frontend: [
        'react', 'vue', 'vue.js', 'angular', 'svelte', 'next.js', 'nextjs',
        'nuxt', 'gatsby', 'remix',
        'tailwind', 'tailwind css', 'tailwindcss', 'bootstrap',
        'material ui', 'chakra ui', 'ant design', 'shadcn',
        'css', 'sass', 'less', 'html', 'html5', 'css3',
        'webpack', 'vite', 'rollup', 'parcel', 'babel', 'esbuild', 'turbopack',
        'storybook', 'figma', 'responsive design', 'accessibility', 'a11y',
        'redux', 'zustand', 'mobx', 'rxjs', 'pinia',
        'framer motion', 'gsap', 'three.js',
        'web components', 'pwa', 'progressive web app',
    ],

    /* ── Backend & Languages ── */
    backend: [
        'node.js', 'nodejs', 'express', 'express.js', 'django', 'flask', 'fastapi',
        'spring boot', 'spring', 'java', 'python', 'ruby', 'go', 'golang', 'rust',
        'php', 'c#', 'c++', 'c', 'scala', 'elixir', 'haskell', 'perl',
        '.net', 'asp.net', '.net core', 'laravel', 'rails', 'ruby on rails',
        'nestjs', 'koa', 'hapi', 'gin', 'fiber', 'actix',
        'rest', 'restful', 'rest api', 'graphql', 'grpc', 'microservices',
        'websockets', 'socket.io', 'api gateway', 'api design',
        'typescript', 'javascript',
        'swift', 'kotlin', 'dart', 'flutter', 'react native',
        'objective-c', 'xamarin',
    ],

    /* ── Cloud & DevOps ── */
    cloud_devops: [
        'aws', 'azure', 'gcp', 'google cloud', 'ec2', 's3', 'lambda',
        'ecs', 'eks', 'fargate', 'cloudfront', 'route 53',
        'azure devops', 'azure functions', 'azure ad',
        'docker', 'kubernetes', 'k8s', 'helm', 'istio',
        'terraform', 'cloudformation', 'pulumi', 'cdk',
        'ansible', 'puppet', 'chef', 'saltstack',
        'jenkins', 'github actions', 'gitlab ci', 'circleci', 'travis ci',
        'argocd', 'gitops', 'spinnaker',
        'ci/cd', 'ci cd', 'continuous integration', 'continuous deployment',
        'linux', 'unix', 'bash', 'shell scripting',
        'nginx', 'apache', 'caddy', 'haproxy',
        'prometheus', 'grafana', 'datadog', 'new relic', 'splunk', 'sentry',
        'elk stack', 'elasticsearch', 'logstash', 'kibana',
        'observability', 'monitoring', 'logging', 'alerting',
        'infrastructure as code', 'iac',
        'site reliability engineering', 'sre', 'devops', 'devsecops',
        'load balancing', 'auto scaling', 'cdn',
    ],

    /* ── Data Science & AI ── */
    data_ai: [
        'machine learning', 'deep learning', 'neural networks',
        'tensorflow', 'pytorch', 'scikit-learn', 'keras',
        'pandas', 'numpy', 'scipy', 'matplotlib', 'seaborn',
        'nlp', 'natural language processing', 'computer vision',
        'llm', 'large language model', 'generative ai', 'gen ai',
        'openai', 'langchain', 'hugging face', 'transformers',
        'rag', 'retrieval augmented generation', 'fine-tuning',
        'prompt engineering', 'vector database',
        'data pipelines', 'etl', 'elt', 'data engineering',
        'sql', 'spark', 'pyspark', 'airflow', 'kafka', 'flink',
        'hadoop', 'hive', 'presto', 'dbt',
        'bigquery', 'redshift', 'snowflake', 'databricks', 'data lake',
        'power bi', 'tableau', 'data visualization', 'data storytelling',
        'jupyter', 'r', 'sas', 'spss', 'stata', 'matlab',
        'statistics', 'statistical analysis', 'hypothesis testing',
        'regression analysis', 'time series', 'forecasting models',
        'a/b testing', 'experimentation', 'feature engineering',
        'data mining', 'data warehousing', 'data governance',
        'data quality', 'data catalog', 'metadata management',
        'apache beam', 'nifi', 'talend', 'informatica',
    ],

    /* ── Databases ── */
    database: [
        'postgresql', 'postgres', 'mysql', 'mongodb', 'redis',
        'dynamodb', 'cassandra', 'firebase', 'firestore', 'supabase',
        'neo4j', 'sqlite', 'sql server', 'mariadb', 'couchdb',
        'oracle database', 'oracle db', 'aurora', 'cockroachdb',
        'memcached', 'couchbase', 'influxdb', 'timescaledb',
        'database design', 'database administration', 'dba',
        'stored procedures', 'query optimization',
    ],

    /* ── Testing & QA ── */
    testing: [
        'jest', 'mocha', 'cypress', 'playwright', 'selenium', 'pytest',
        'junit', 'rspec', 'testing library', 'vitest',
        'e2e testing', 'unit testing', 'integration testing',
        'tdd', 'bdd', 'code coverage', 'qa',
        'load testing', 'performance testing', 'jmeter', 'gatling',
        'api testing', 'postman testing', 'contract testing',
        'test automation', 'manual testing', 'regression testing',
        'appium', 'detox', 'xcuitest', 'espresso',
    ],

    /* ── Tools & Collaboration ── */
    tools: [
        'git', 'github', 'gitlab', 'bitbucket', 'svn',
        'jira', 'confluence', 'slack', 'notion', 'asana', 'trello',
        'monday.com', 'clickup', 'basecamp', 'linear',
        'postman', 'swagger', 'openapi', 'insomnia',
        'vs code', 'intellij', 'vim', 'neovim',
        'docker compose', 'vagrant',
        'miro', 'lucidchart', 'draw.io',
    ],

    /* ── Security ── */
    security: [
        'cybersecurity', 'information security', 'network security',
        'penetration testing', 'vulnerability assessment',
        'siem', 'soar', 'ids', 'ips', 'firewall',
        'oauth', 'oauth2', 'jwt', 'saml', 'sso', 'ldap',
        'rbac', 'iam', 'identity management',
        'ssl', 'tls', 'encryption', 'pki',
        'owasp', 'security audit', 'threat modeling',
        'gdpr', 'hipaa', 'pci dss', 'iso 27001',
        'soc 2', 'fedramp', 'nist',
        'zero trust', 'endpoint security',
        'incident response', 'disaster recovery',
    ],

    /* ── Soft Skills ── */
    soft_skills: [
        'leadership', 'communication', 'collaboration', 'teamwork',
        'mentoring', 'coaching', 'training',
        'problem-solving', 'problem solving', 'analytical thinking',
        'critical thinking', 'strategic thinking', 'creative thinking',
        'cross-functional', 'cross functional',
        'project management', 'stakeholder management',
        'code reviews', 'pair programming', 'technical writing',
        'time management', 'conflict resolution', 'negotiation',
        'presentation skills', 'public speaking',
        'decision making', 'decision-making',
        'adaptability', 'flexibility', 'resilience',
        'attention to detail', 'organizational skills',
        'emotional intelligence', 'empathy',
        'self-motivated', 'proactive', 'initiative',
        'interpersonal skills', 'relationship building',
        'customer-facing', 'client management',
    ],
};

const ALL_KEYWORDS = Object.values(KEYWORD_DICT).flat();

// ──────────────────────────────────────────────────────
//  2. PRETTIFIER MAP
// ──────────────────────────────────────────────────────
const PRETTY = {
    /* Finance & Accounting */
    'dcf': 'DCF', 'gaap': 'GAAP', 'ifrs': 'IFRS', 'p&l': 'P&L',
    'fp&a': 'FP&A', 'sox': 'SOX', 'm&a': 'M&A',
    'aml': 'AML', 'kyc': 'KYC', 'cfa': 'CFA', 'cpa': 'CPA',
    'sarbanes-oxley': 'Sarbanes-Oxley',

    /* ERP & Enterprise */
    'sap': 'SAP', 'sap fico': 'SAP FICO', 'sap mm': 'SAP MM',
    'sap sd': 'SAP SD', 'sap hana': 'SAP HANA', 'sap bw': 'SAP BW',
    'oracle erp': 'Oracle ERP', 'oracle financials': 'Oracle Financials',
    'oracle hcm': 'Oracle HCM', 'netsuite': 'NetSuite', 'workday': 'Workday',
    'salesforce': 'Salesforce', 'sage': 'Sage', 'dynamics 365': 'Dynamics 365',
    'quickbooks': 'QuickBooks', 'xero': 'Xero', 'freshbooks': 'FreshBooks',
    'tally': 'Tally', 'peoplesoft': 'PeopleSoft', 'jd edwards': 'JD Edwards',
    'hyperion': 'Hyperion', 'concur': 'Concur', 'coupa': 'Coupa', 'ariba': 'Ariba',

    /* Excel & Analytics */
    'excel': 'Excel', 'advanced excel': 'Advanced Excel',
    'vlookup': 'VLOOKUP', 'hlookup': 'HLOOKUP', 'index match': 'INDEX MATCH',
    'pivot tables': 'Pivot Tables', 'pivot table': 'Pivot Table',
    'power query': 'Power Query', 'power pivot': 'Power Pivot',
    'vba': 'VBA', 'macros': 'Macros', 'excel macros': 'Excel Macros',
    'bloomberg': 'Bloomberg', 'bloomberg terminal': 'Bloomberg Terminal',
    'capital iq': 'Capital IQ', 'factset': 'FactSet',
    'morningstar': 'Morningstar', 'refinitiv': 'Refinitiv', 'eikon': 'Eikon',
    'google sheets': 'Google Sheets', 'google workspace': 'Google Workspace',
    'microsoft office': 'Microsoft Office', 'microsoft 365': 'Microsoft 365',
    'looker': 'Looker', 'metabase': 'Metabase', 'qlik': 'Qlik',
    'qlikview': 'QlikView', 'qliksense': 'QlikSense', 'sisense': 'Sisense',
    'domo': 'Domo',

    /* Business & Operations */
    'kpi': 'KPI', 'okr': 'OKR', 'okrs': 'OKRs', 'bpm': 'BPM',
    'pmp': 'PMP', 'csm': 'CSM', 'iso 9001': 'ISO 9001',
    'prince2': 'PRINCE2', 'six sigma': 'Six Sigma',
    'lean six sigma': 'Lean Six Sigma',

    /* Marketing & Sales */
    'seo': 'SEO', 'sem': 'SEM', 'ppc': 'PPC',
    'ga4': 'GA4', 'google ads': 'Google Ads',
    'facebook ads': 'Facebook Ads', 'meta ads': 'Meta Ads',
    'google analytics': 'Google Analytics', 'adobe analytics': 'Adobe Analytics',
    'hubspot': 'HubSpot', 'marketo': 'Marketo', 'mailchimp': 'Mailchimp',
    'pardot': 'Pardot', 'crm': 'CRM', 'cro': 'CRO',
    'b2b': 'B2B', 'b2c': 'B2C', 'saas': 'SaaS',

    /* Frontend */
    'css': 'CSS', 'html': 'HTML', 'html5': 'HTML5', 'css3': 'CSS3',
    'sass': 'Sass', 'less': 'Less', 'a11y': 'A11y',
    'pwa': 'PWA', 'gsap': 'GSAP', 'three.js': 'Three.js',
    'shadcn': 'shadcn/ui', 'ant design': 'Ant Design',
    'redux': 'Redux', 'zustand': 'Zustand', 'mobx': 'MobX',
    'rxjs': 'RxJS', 'pinia': 'Pinia',
    'tailwind css': 'Tailwind CSS', 'tailwindcss': 'Tailwind CSS', 'tailwind': 'Tailwind CSS',
    'bootstrap': 'Bootstrap', 'material ui': 'Material UI', 'chakra ui': 'Chakra UI',
    'react': 'React', 'angular': 'Angular', 'vue': 'Vue', 'svelte': 'Svelte',
    'vue.js': 'Vue.js', 'next.js': 'Next.js', 'nextjs': 'Next.js',
    'gatsby': 'Gatsby', 'nuxt': 'Nuxt', 'remix': 'Remix',
    'storybook': 'Storybook', 'figma': 'Figma',
    'framer motion': 'Framer Motion',
    'webpack': 'Webpack', 'vite': 'Vite', 'babel': 'Babel',
    'rollup': 'Rollup', 'parcel': 'Parcel', 'esbuild': 'esbuild', 'turbopack': 'Turbopack',
    'responsive design': 'Responsive Design', 'accessibility': 'Accessibility',

    /* Backend & Languages */
    'node.js': 'Node.js', 'nodejs': 'Node.js', 'express.js': 'Express.js',
    'typescript': 'TypeScript', 'javascript': 'JavaScript',
    'python': 'Python', 'java': 'Java', 'ruby': 'Ruby',
    'go': 'Go', 'golang': 'Go', 'rust': 'Rust', 'php': 'PHP',
    'c#': 'C#', 'c++': 'C++', 'c': 'C', 'scala': 'Scala',
    'elixir': 'Elixir', 'haskell': 'Haskell', 'perl': 'Perl',
    'swift': 'Swift', 'kotlin': 'Kotlin', 'dart': 'Dart',
    '.net': '.NET', 'asp.net': 'ASP.NET', '.net core': '.NET Core',
    'spring boot': 'Spring Boot', 'spring': 'Spring',
    'django': 'Django', 'flask': 'Flask', 'fastapi': 'FastAPI',
    'nestjs': 'NestJS', 'koa': 'Koa', 'hapi': 'Hapi',
    'gin': 'Gin', 'fiber': 'Fiber', 'actix': 'Actix',
    'laravel': 'Laravel', 'rails': 'Rails', 'ruby on rails': 'Ruby on Rails',
    'flutter': 'Flutter', 'react native': 'React Native',
    'objective-c': 'Objective-C', 'xamarin': 'Xamarin',
    'rest': 'REST', 'restful': 'RESTful', 'rest api': 'REST API',
    'graphql': 'GraphQL', 'grpc': 'gRPC', 'microservices': 'Microservices',
    'websockets': 'WebSockets', 'socket.io': 'Socket.io',
    'api gateway': 'API Gateway', 'api design': 'API Design',

    /* Cloud & DevOps */
    'aws': 'AWS', 'gcp': 'GCP', 'ec2': 'EC2', 's3': 'S3',
    'ecs': 'ECS', 'eks': 'EKS', 'k8s': 'K8s',
    'cdk': 'CDK', 'ci/cd': 'CI/CD', 'ci cd': 'CI/CD',
    'docker': 'Docker', 'kubernetes': 'Kubernetes', 'helm': 'Helm', 'istio': 'Istio',
    'terraform': 'Terraform', 'cloudformation': 'CloudFormation', 'pulumi': 'Pulumi',
    'ansible': 'Ansible', 'puppet': 'Puppet', 'chef': 'Chef',
    'jenkins': 'Jenkins', 'github actions': 'GitHub Actions',
    'gitlab ci': 'GitLab CI', 'circleci': 'CircleCI', 'travis ci': 'Travis CI',
    'argocd': 'ArgoCD', 'gitops': 'GitOps', 'spinnaker': 'Spinnaker',
    'linux': 'Linux', 'unix': 'Unix', 'bash': 'Bash',
    'nginx': 'Nginx', 'apache': 'Apache', 'caddy': 'Caddy', 'haproxy': 'HAProxy',
    'prometheus': 'Prometheus', 'grafana': 'Grafana', 'datadog': 'Datadog',
    'new relic': 'New Relic', 'splunk': 'Splunk', 'sentry': 'Sentry',
    'elk stack': 'ELK Stack', 'elasticsearch': 'Elasticsearch',
    'logstash': 'Logstash', 'kibana': 'Kibana',
    'observability': 'Observability', 'monitoring': 'Monitoring',
    'logging': 'Logging', 'alerting': 'Alerting',
    'infrastructure as code': 'Infrastructure as Code', 'iac': 'IaC',
    'devops': 'DevOps', 'devsecops': 'DevSecOps', 'sre': 'SRE',
    'cdn': 'CDN', 'azure devops': 'Azure DevOps',

    /* Data Science & AI */
    'etl': 'ETL', 'elt': 'ELT', 'llm': 'LLM', 'nlp': 'NLP',
    'rag': 'RAG', 'dbt': 'dbt', 'sql': 'SQL',
    'pyspark': 'PySpark', 'sas': 'SAS', 'spss': 'SPSS',
    'stata': 'Stata', 'matlab': 'MATLAB',
    'pytorch': 'PyTorch', 'tensorflow': 'TensorFlow', 'keras': 'Keras',
    'scikit-learn': 'Scikit-learn',
    'pandas': 'Pandas', 'numpy': 'NumPy', 'scipy': 'SciPy',
    'matplotlib': 'Matplotlib', 'seaborn': 'Seaborn',
    'openai': 'OpenAI', 'langchain': 'LangChain', 'hugging face': 'Hugging Face',
    'spark': 'Spark', 'airflow': 'Airflow', 'kafka': 'Kafka',
    'flink': 'Flink', 'hadoop': 'Hadoop', 'hive': 'Hive',
    'presto': 'Presto', 'nifi': 'NiFi', 'talend': 'Talend',
    'informatica': 'Informatica',
    'bigquery': 'BigQuery', 'redshift': 'Redshift', 'snowflake': 'Snowflake',
    'databricks': 'Databricks',
    'power bi': 'Power BI', 'tableau': 'Tableau',
    'jupyter': 'Jupyter', 'r': 'R',
    'a/b testing': 'A/B Testing', 'feature engineering': 'Feature Engineering',
    'data visualization': 'Data Visualization', 'data pipelines': 'Data Pipelines',
    'machine learning': 'Machine Learning', 'deep learning': 'Deep Learning',
    'computer vision': 'Computer Vision',
    'gen ai': 'Gen AI', 'generative ai': 'Generative AI',
    'apache beam': 'Apache Beam',

    /* Databases */
    'postgresql': 'PostgreSQL', 'postgres': 'PostgreSQL',
    'mysql': 'MySQL', 'mongodb': 'MongoDB', 'redis': 'Redis',
    'dynamodb': 'DynamoDB', 'neo4j': 'Neo4j',
    'sqlite': 'SQLite', 'sql server': 'SQL Server',
    'mariadb': 'MariaDB', 'couchdb': 'CouchDB',
    'oracle database': 'Oracle Database', 'oracle db': 'Oracle DB',
    'aurora': 'Aurora', 'cockroachdb': 'CockroachDB',
    'memcached': 'Memcached', 'couchbase': 'Couchbase',
    'influxdb': 'InfluxDB', 'timescaledb': 'TimescaleDB',
    'firebase': 'Firebase', 'firestore': 'Firestore', 'supabase': 'Supabase',
    'cassandra': 'Cassandra', 'dba': 'DBA',

    /* Testing & QA */
    'tdd': 'TDD', 'bdd': 'BDD', 'qa': 'QA',
    'jest': 'Jest', 'mocha': 'Mocha', 'cypress': 'Cypress',
    'playwright': 'Playwright', 'pytest': 'PyTest', 'junit': 'JUnit',
    'vitest': 'Vitest', 'jmeter': 'JMeter', 'gatling': 'Gatling',
    'appium': 'Appium', 'detox': 'Detox', 'espresso': 'Espresso',
    'testing library': 'Testing Library', 'code coverage': 'Code Coverage',
    'e2e testing': 'E2E Testing', 'unit testing': 'Unit Testing',
    'integration testing': 'Integration Testing',

    /* Tools */
    'git': 'Git', 'github': 'GitHub', 'gitlab': 'GitLab',
    'bitbucket': 'Bitbucket', 'svn': 'SVN',
    'jira': 'Jira', 'confluence': 'Confluence',
    'postman': 'Postman', 'swagger': 'Swagger', 'openapi': 'OpenAPI',
    'insomnia': 'Insomnia',
    'vs code': 'VS Code', 'intellij': 'IntelliJ',
    'miro': 'Miro', 'lucidchart': 'Lucidchart',

    /* Security */
    'siem': 'SIEM', 'soar': 'SOAR', 'ids': 'IDS', 'ips': 'IPS',
    'oauth': 'OAuth', 'oauth2': 'OAuth 2.0', 'jwt': 'JWT',
    'saml': 'SAML', 'sso': 'SSO', 'ldap': 'LDAP',
    'rbac': 'RBAC', 'iam': 'IAM',
    'ssl': 'SSL', 'tls': 'TLS', 'pki': 'PKI',
    'owasp': 'OWASP', 'gdpr': 'GDPR', 'hipaa': 'HIPAA',
    'pci dss': 'PCI DSS', 'iso 27001': 'ISO 27001',
    'soc 2': 'SOC 2', 'fedramp': 'FedRAMP', 'nist': 'NIST',

    /* Soft Skills */
    'problem-solving': 'Problem-Solving', 'problem solving': 'Problem-Solving',
    'cross-functional': 'Cross-Functional', 'cross functional': 'Cross-Functional',
    'decision-making': 'Decision-Making', 'decision making': 'Decision-Making',
    'customer-facing': 'Customer-Facing',
    'pair programming': 'Pair Programming',
    'code reviews': 'Code Reviews', 'project management': 'Project Management',
    'stakeholder management': 'Stakeholder Management',
    'technical writing': 'Technical Writing',
    'time management': 'Time Management', 'strategic thinking': 'Strategic Thinking',
    'conflict resolution': 'Conflict Resolution',
    'presentation skills': 'Presentation Skills', 'public speaking': 'Public Speaking',
    'attention to detail': 'Attention to Detail',
    'emotional intelligence': 'Emotional Intelligence',
    'relationship building': 'Relationship Building',
    'interpersonal skills': 'Interpersonal Skills',
    'organizational skills': 'Organizational Skills',
};

function prettify(kw) {
    return PRETTY[kw] || kw.split(/[\s\-]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// ──────────────────────────────────────────────────────
//  3. STOP-WORDS (for N-gram fallback)
// ──────────────────────────────────────────────────────
const STOP_WORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
    'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
    'would', 'could', 'should', 'may', 'might', 'shall', 'can', 'must',
    'need', 'dare', 'ought', 'used', 'it', 'its', 'this', 'that', 'these',
    'those', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves',
    'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his',
    'himself', 'she', 'her', 'hers', 'herself', 'they', 'them', 'their',
    'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'whose',
    'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both',
    'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
    'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'about',
    'above', 'after', 'again', 'against', 'also', 'am', 'among', 'any',
    'because', 'before', 'below', 'between', 'during', 'even', 'first',
    'get', 'go', 'going', 'gone', 'got', 'here', 'if', 'into', 'let',
    'like', 'make', 'many', 'much', 'new', 'now', 'off', 'often', 'old',
    'once', 'one', 'out', 'over', 'per', 'put', 're', 'said', 'see',
    'since', 'still', 'take', 'tell', 'then', 'there', 'through', 'under',
    'until', 'up', 'upon', 'us', 'use', 'using', 'via', 'want', 'way',
    'well', 'while', 'work', 'working', 'year', 'years', 'yet',
    /* Common JD filler words */
    'experience', 'role', 'team', 'ability', 'strong', 'skills', 'skill',
    'knowledge', 'understanding', 'required', 'preferred', 'including',
    'responsible', 'responsibilities', 'requirements', 'qualifications',
    'excellent', 'proven', 'minimum', 'plus', 'equivalent', 'related',
    'position', 'company', 'organization', 'environment', 'across',
    'within', 'ensure', 'develop', 'support', 'provide', 'manage',
    'create', 'implement', 'maintain', 'design', 'build', 'deliver',
    'drive', 'lead', 'collaborate', 'coordinate', 'oversee',
    'looking', 'seeking', 'join', 'apply', 'candidate', 'ideal',
    'opportunities', 'opportunity', 'level', 'senior', 'junior',
    'mid', 'entry', 'full', 'time', 'part', 'based', 'location',
    'salary', 'benefits', 'health', 'dental', 'vision', 'insurance',
    'paid', 'vacation', 'remote', 'hybrid', 'onsite', 'office',
]);

// ──────────────────────────────────────────────────────
//  4. SIMPLE SUFFIX STEMMER
// ──────────────────────────────────────────────────────
function stem(word) {
    if (word.length <= 3) return word;
    return word
        .replace(/ies$/i, 'y')  //studies - study
        .replace(/ies$/i, 'y')
        .replace(/(ss)$/i, '$1')  // is ends with ss - no change
        .replace(/s$/i, '')   // skills become skill
        .replace(/ing$/i, '') //coding - cod
        .replace(/ment$/i, '') //development - develop
        .replace(/tion$/i, 't') // creation - creat
        .replace(/sion$/i, 's')
        .replace(/ness$/i, '')
        .replace(/able$/i, '')
        .replace(/ible$/i, '')
        .replace(/ful$/i, '')  // helpful - help

        .replace(/ous$/i, '')
        .replace(/ive$/i, '')
        .replace(/ly$/i, '')
        .replace(/ed$/i, '')
        .replace(/er$/i, '')
        .replace(/al$/i, '');
}

// ──────────────────────────────────────────────────────
//  5. TEXT HELPERS
// ──────────────────────────────────────────────────────
function normalize(text) {
    return text
        .toLowerCase() //syntax of replace : .replace(what_To_find, what_to_replace_With)
        .replace(/[\r\n]+/g, ' ') 
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/[^\w\s./#&+\-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * SHORT_KEYWORDS – keywords ≤ 2 chars that need exact standalone matching
 * to prevent false positives (e.g., "R" matching random words, "C" matching "company")
 */
const SHORT_KEYWORDS = new Set(
    ALL_KEYWORDS.filter(kw => kw.replace(/[^a-z0-9]/gi, '').length <= 2)
);

/**
 * AMBIGUOUS_KEYWORDS – keywords that can be substrings of other keywords.
 * "java" must not match "javascript", "go" must not match "going", etc.
 */
const AMBIGUOUS_MAP = {
    'java': /(?<![a-z])java(?!script)(?![a-z])/i,
    'go': /(?<![a-z])go(?:lang)?(?![a-z])/i,
    'r': /(?<![a-z])(?:\bR\b)(?![a-z])/,  // case-sensitive for R
    'c': /(?<![a-z+#])(?:\bC\b)(?![+#a-z])/,  // not C++, C#
    'c++': /\bc\+\+/i,
    'c#': /\bc#/i,
};

function extractKeywords(text) {
    const norm = normalize(text);
    const found = new Set();
    // Sort longest-first to avoid partial matches
    const sorted = [...ALL_KEYWORDS].sort((a, b) => b.length - a.length);

    for (const kw of sorted) {
        // Use special regex for ambiguous/short keywords
        if (AMBIGUOUS_MAP[kw]) {
            if (AMBIGUOUS_MAP[kw].test(norm)) found.add(kw);
            continue;
        }

        // For very short keywords, require strict word boundaries
        if (SHORT_KEYWORDS.has(kw)) {
            const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const re = new RegExp(`(?:^|\\s|[,;|•\\-/])${escaped}(?=\\s|[,;|•\\-/.]|$)`, 'i');
            if (re.test(norm)) found.add(kw);
            continue;
        }

        const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(`(?:^|[\\s,;|•\\-/])${escaped}(?=[\\s,;|•\\-/.]|$)`, 'i');
        if (re.test(norm)) found.add(kw);
    }
    return found;
}

/**
 * N-GRAM FALLBACK EXTRACTOR
 * Extracts high-frequency 1-word and 2-word domain phrases from text
 * that are NOT in the dictionary and NOT stop-words.
 * Returns a Set of dynamically-extracted keywords.
 */
function extractDynamicNGrams(text, existingKeywords) {
    const norm = normalize(text);
    const words = norm.split(/\s+/).filter(w => w.length > 1);
    const freq1 = new Map();
    const freq2 = new Map();

    // Count 1-grams
    for (const w of words) {
        const clean = w.replace(/[^a-z0-9+#.\-\/&]/gi, '');
        if (clean.length < 2 || STOP_WORDS.has(clean)) continue;
        freq1.set(clean, (freq1.get(clean) || 0) + 1);
    }

    // Count 2-grams
    for (let i = 0; i < words.length - 1; i++) {
        const w1 = words[i].replace(/[^a-z0-9+#.\-\/&]/gi, '');
        const w2 = words[i + 1].replace(/[^a-z0-9+#.\-\/&]/gi, '');
        if (w1.length < 2 || w2.length < 2) continue;
        if (STOP_WORDS.has(w1) || STOP_WORDS.has(w2)) continue;
        const bigram = `${w1} ${w2}`;
        freq2.set(bigram, (freq2.get(bigram) || 0) + 1);
    }

    const dynamic = new Set();
    const existingLower = new Set([...existingKeywords].map(k => k.toLowerCase()));

    // Add 2-grams that appear 2+ times and aren't already matched
    for (const [bigram, count] of freq2) {
        if (count >= 2 && !existingLower.has(bigram)) {
            // Check no single word in the bigram is already a matched keyword
            dynamic.add(bigram);
        }
    }

    // Add 1-grams that appear 3+ times and aren't already matched
    for (const [word, count] of freq1) {
        if (count >= 3 && !existingLower.has(word) && word.length >= 3) {
            dynamic.add(word);
        }
    }

    return dynamic;
}

/**
 * STEMMED MATCHING
 * For each keyword in jdSet that wasn't found in resumeSet,
 * check if a stemmed version exists in the resume.
 */
function stemMatch(jdKW, resumeKW, resumeText) {
    const norm = normalize(resumeText);
    const stemmedMatches = new Set();

    for (const kw of jdKW) {
        if (resumeKW.has(kw)) continue; // already matched
        const kwStem = stem(kw);
        if (kwStem.length < 3) continue;

        // Check if any form of the stemmed keyword appears in the resume
        const re = new RegExp(`(?:^|[\\s,;|•\\-/])${kwStem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[a-z]*(?=[\\s,;|•\\-/.]|$)`, 'i');
        if (re.test(norm)) {
            stemmedMatches.add(kw);
        }
    }
    return stemmedMatches;
}

function countOccurrences(text, kw) {
    const norm = normalize(text);
    if (AMBIGUOUS_MAP[kw]) {
        return (norm.match(new RegExp(AMBIGUOUS_MAP[kw].source, 'gi')) || []).length;
    }
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(?:^|[\\s,;|•\\-/])${escaped}(?=[\\s,;|•\\-/.]|$)`, 'gi');
    return (norm.match(re) || []).length;
}

// ──────────────────────────────────────────────────────
//  6. SCORING ENGINE
// ──────────────────────────────────────────────────────
function computeScore(resumeText, jdText) {
    // Step 1: Dictionary-based extraction
    const resumeKW = extractKeywords(resumeText);
    const jdKW = extractKeywords(jdText);

    // Step 2: Stemmed matching – catch near-misses
    const stemMatches = stemMatch(jdKW, resumeKW, resumeText);

    // Step 3: Dynamic n-gram extraction from JD
    const jdDynamic = extractDynamicNGrams(jdText, jdKW);
    const resumeDynamic = extractDynamicNGrams(resumeText, resumeKW);

    // Check which dynamic JD n-grams appear in resume
    const normResume = normalize(resumeText);
    const dynamicMatched = new Set();
    const dynamicMissing = new Set();

    for (const ngram of jdDynamic) {
        const escaped = ngram.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(`(?:^|[\\s,;|•\\-/])${escaped}(?=[\\s,;|•\\-/.]|$)`, 'i');
        if (re.test(normResume) || resumeDynamic.has(ngram)) {
            dynamicMatched.add(ngram);
        } else {
            // Try stemmed match for dynamic terms
            const ngramStem = stem(ngram);
            if (ngramStem.length >= 3) {
                const stemRe = new RegExp(`(?:^|[\\s,;|•\\-/])${ngramStem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[a-z]*(?=[\\s,;|•\\-/.]|$)`, 'i');
                if (stemRe.test(normResume)) {
                    dynamicMatched.add(ngram);
                } else {
                    dynamicMissing.add(ngram);
                }
            } else {
                dynamicMissing.add(ngram);
            }
        }
    }

    // Combine all results
    const matched = new Set([...jdKW].filter(k => resumeKW.has(k)));
    // Add stem matches to matched set
    for (const s of stemMatches) matched.add(s);
    const missing = new Set([...jdKW].filter(k => !matched.has(k)));

    // Total JD requirement pool = dictionary keywords + meaningful dynamic n-grams
    const totalDictKW = jdKW.size || 1;
    const totalDynamic = dynamicMatched.size + dynamicMissing.size;

    // Overall score weights dictionary matches more heavily
    const dictMatchPct = matched.size / totalDictKW;
    const dynamicMatchPct = totalDynamic > 0 ? dynamicMatched.size / totalDynamic : 0;

    // Weighted: 80% dictionary, 20% dynamic if dynamic exists
    let overallPct;
    if (totalDynamic > 0) {
        overallPct = Math.round((dictMatchPct * 0.8 + dynamicMatchPct * 0.2) * 100);
    } else {
        overallPct = Math.round(dictMatchPct * 100);
    }
    overallPct = Math.min(overallPct, 100);

    // Sub-metrics: Technical vs Soft
    const techCats = [
        'frontend', 'backend', 'cloud_devops', 'data_ai', 'database',
        'testing', 'tools', 'security', 'finance_accounting', 'erp_enterprise',
        'excel_analytics', 'business_ops', 'marketing_sales',
    ];
    const softCats = ['soft_skills'];

    const jdTech = [...jdKW].filter(k => techCats.some(c => KEYWORD_DICT[c]?.includes(k)));
    const jdSoft = [...jdKW].filter(k => softCats.some(c => KEYWORD_DICT[c]?.includes(k)));
    const matchTech = jdTech.filter(k => matched.has(k));
    const matchSoft = jdSoft.filter(k => matched.has(k));

    const techPct = jdTech.length ? Math.round((matchTech.length / jdTech.length) * 100) : 0;
    const softPct = jdSoft.length ? Math.round((matchSoft.length / jdSoft.length) * 100) : 0;

    // Keyword density score
    let densityScore = 0;
    if (matched.size > 0) {
        let totalRatio = 0;
        for (const kw of matched) {
            const inResume = countOccurrences(resumeText, kw);
            const inJD = countOccurrences(jdText, kw);
            totalRatio += Math.min(inResume / Math.max(inJD, 1), 3) / 3;
        }
        densityScore = Math.round((totalRatio / matched.size) * 100);
    }

    return {
        overallPct, techPct, softPct, densityScore,
        matched, missing, jdKW, resumeKW,
        dynamicMatched, dynamicMissing,
    };
}

// ──────────────────────────────────────────────────────
//  7. DOMAIN-AWARE TAILORING SUGGESTIONS
// ──────────────────────────────────────────────────────

/**
 * Detect the dominant domain of the missing keywords
 * to generate contextually appropriate bullets
 */
function detectDomain(keywords) {
    const scores = {};
    for (const [cat, list] of Object.entries(KEYWORD_DICT)) {
        scores[cat] = [...keywords].filter(k => list.includes(k)).length;
    }
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0 || sorted[0][1] === 0) return 'general';
    const topCat = sorted[0][0];

    if (['finance_accounting', 'erp_enterprise', 'excel_analytics'].includes(topCat)) return 'finance';
    if (['business_ops', 'marketing_sales'].includes(topCat)) return 'business';
    if (['frontend', 'backend', 'cloud_devops', 'database', 'testing', 'tools', 'security'].includes(topCat)) return 'tech';
    if (topCat === 'data_ai') return 'data';
    if (topCat === 'soft_skills') return 'soft';
    return 'general';
}

function generateTailoring(missing) {
    const arr = [...missing];
    if (arr.length === 0) return [
        'Your resume already covers all detected JD keywords — focus on quantifying impact with concrete metrics.',
        'Mirror the exact phrasing from the job description in your Summary and Experience sections for maximum relevance.',
        'Ensure your resume format uses standard section headers, avoids tables, images, and multi-column layouts for best compatibility.',
    ];

    const domain = detectDomain(missing);

    const templatesByDomain = {
        finance: [
            (kws) => `Analyzed and optimized ${kws[0] ? prettify(kws[0]) : 'financial'} processes${kws[1] ? ` using ${prettify(kws[1])}` : ''}, delivering a 28% improvement in forecast accuracy and reducing variance from budget by $2.4M annually.`,
            (kws) => `Led cross-functional ${kws[0] ? prettify(kws[0]) : 'financial reporting'} initiatives${kws[1] ? ` integrating ${prettify(kws[1])} workflows` : ''}, accelerating month-end close by 3 days and achieving 100% SOX compliance across 12 business units.`,
            (kws) => `Developed and maintained ${kws[0] ? prettify(kws[0]) : 'financial'} models${kws[1] ? ` leveraging ${prettify(kws[1])}` : ''}, supporting $150M+ in capital allocation decisions and improving portfolio returns by 18% year-over-year.`,
        ],
        business: [
            (kws) => `Drove ${kws[0] ? prettify(kws[0]) : 'operational'} excellence initiatives${kws[1] ? ` through ${prettify(kws[1])} implementation` : ''}, resulting in a 32% reduction in process cycle time and $1.8M in annual cost savings.`,
            (kws) => `Managed end-to-end ${kws[0] ? prettify(kws[0]) : 'project'} delivery${kws[1] ? ` utilizing ${prettify(kws[1])} methodologies` : ''}, coordinating 5 cross-functional teams and achieving 95% on-time milestone delivery across 8 concurrent workstreams.`,
            (kws) => `Spearheaded ${kws[0] ? prettify(kws[0]) : 'strategic'} transformation program${kws[1] ? ` incorporating ${prettify(kws[1])} frameworks` : ''}, increasing stakeholder satisfaction scores by 40% and reducing vendor costs by 22%.`,
        ],
        data: [
            (kws) => `Engineered ${kws[0] ? prettify(kws[0]) : 'data'}-driven analytics platform${kws[1] ? ` leveraging ${prettify(kws[1])}` : ''}, processing 50M+ records daily with 99.7% pipeline reliability and reducing time-to-insight from 48 hours to 15 minutes.`,
            (kws) => `Built and deployed ${kws[0] ? prettify(kws[0]) : 'machine learning'} models${kws[1] ? ` using ${prettify(kws[1])} stack` : ''}, improving prediction accuracy by 34% and directly generating $3.2M in incremental revenue through automated decisioning.`,
            (kws) => `Designed end-to-end ${kws[0] ? prettify(kws[0]) : 'data'} infrastructure${kws[1] ? ` with ${prettify(kws[1])} integration` : ''}, enabling real-time dashboards for 200+ business users and reducing data discrepancies by 92%.`,
        ],
        tech: [
            (kws) => `Spearheaded development of ${kws[0] ? prettify(kws[0]) : 'key'}-based solutions${kws[1] ? `, leveraging ${prettify(kws[1])} for enhanced system performance` : ''}, resulting in a 35% improvement in delivery velocity and 99.9% uptime SLA compliance.`,
            (kws) => `Led cross-functional initiatives implementing ${kws[0] ? prettify(kws[0]) : 'modern tooling'}${kws[1] ? ` and ${prettify(kws[1])}` : ''} best practices, reducing deployment cycles by 40% and improving team productivity across 3 product verticals.`,
            (kws) => `Architected and deployed production-grade ${kws[0] ? prettify(kws[0]) : 'cloud'} infrastructure${kws[1] ? ` with ${prettify(kws[1])} integration` : ''}, enabling real-time data processing for 50K+ concurrent users while maintaining sub-200ms response times.`,
        ],
        soft: [
            (kws) => `Demonstrated ${kws[0] ? prettify(kws[0]) : 'leadership'} capabilities${kws[1] ? ` and ${prettify(kws[1])}` : ''} by mentoring a team of 8 engineers, resulting in a 45% improvement in sprint velocity and zero attrition over 18 months.`,
            (kws) => `Applied ${kws[0] ? prettify(kws[0]) : 'cross-functional collaboration'}${kws[1] ? ` and ${prettify(kws[1])}` : ''} to align product, engineering, and design teams on quarterly roadmap, delivering 12 features ahead of schedule.`,
            (kws) => `Exercised ${kws[0] ? prettify(kws[0]) : 'strategic thinking'}${kws[1] ? ` combined with ${prettify(kws[1])}` : ''} to navigate organizational change affecting 3 departments, maintaining 98% team satisfaction scores throughout the transition.`,
        ],
        general: [
            (kws) => `Spearheaded ${kws[0] ? prettify(kws[0]) : 'key'} initiatives${kws[1] ? ` leveraging ${prettify(kws[1])}` : ''}, resulting in a 30% improvement in operational efficiency and measurable impact across core business metrics.`,
            (kws) => `Led implementation of ${kws[0] ? prettify(kws[0]) : 'strategic'} programs${kws[1] ? ` incorporating ${prettify(kws[1])}` : ''}, coordinating cross-functional teams and achieving all project milestones within budget and timeline constraints.`,
            (kws) => `Developed and optimized ${kws[0] ? prettify(kws[0]) : 'core'} processes${kws[1] ? ` with ${prettify(kws[1])} integration` : ''}, driving continuous improvement that reduced costs by 25% while increasing output quality metrics by 40%.`,
        ],
    };

    const templates = templatesByDomain[domain] || templatesByDomain.general;
    const suggestions = [];
    for (let i = 0; i < 3; i++) {
        const chunk = arr.slice(i * 2, i * 2 + 2);
        suggestions.push(templates[i](chunk.length ? chunk : arr.slice(0, 2)));
    }
    return suggestions;
}

// ──────────────────────────────────────────────────────
//  8. INSIGHTS
// ──────────────────────────────────────────────────────
function generateInsights(result) {
    const { overallPct, matched, missing } = result;
    const missingArr = [...missing];
    const insights = [];

    if (missingArr.length > 0) {
        const top5 = missingArr.slice(0, 5).map(prettify);
        insights.push({
            icon: 'fa-crosshairs',
            color: '#0d5c52',
            title: 'Bridge Critical Skill Gaps',
            body: `The JD requires <strong>${top5.join(', ')}</strong>${missingArr.length > 5 ? ` and ${missingArr.length - 5} more` : ''}. Add these terms verbatim into your Skills section and weave them into relevant experience bullets.`,
        });
    }

    if (overallPct < 80) {
        insights.push({
            icon: 'fa-chart-line',
            color: '#d97706',
            title: 'Quantify Impact with Metrics',
            body: `Resumes with measurable results rank significantly higher. Use numbers: "reduced latency by 45%", "managed $5M budget", "served 80K+ users", "achieved 94% accuracy".`,
        });
    } else {
        insights.push({
            icon: 'fa-bullseye',
            color: '#16a34a',
            title: 'Fine-Tune Your Summary Section',
            body: `Your keyword coverage is strong. Ensure your professional summary echoes the JD's top 3 priorities in the first two sentences for maximum relevance scoring.`,
        });
    }

    insights.push({
        icon: 'fa-file-shield',
        color: '#7c3aed',
        title: 'Format Compliance',
        body: `Use standard headers (Summary, Skills, Experience, Education). Avoid tables, multi-column layouts, images, and custom fonts. Save as .docx or clean .pdf.`,
    });

    return insights;
}

// ──────────────────────────────────────────────────────
//  9. STATUS
// ──────────────────────────────────────────────────────
function getStatus(pct) {
    if (pct >= 85) return { label: 'Strong Role Fit', cls: 'background:#dcfce7;color:#166534;border:1px solid #a7f3d0;', stroke: '#16a34a' };
    if (pct >= 65) return { label: 'Moderate Alignment', cls: 'background:#fef9c3;color:#854d0e;border:1px solid #fde68a;', stroke: '#ca8a04' };
    if (pct >= 45) return { label: 'Needs Improvement', cls: 'background:#ffedd5;color:#9a3412;border:1px solid #fed7aa;', stroke: '#ea580c' };
    return { label: 'Critical Skill Gap', cls: 'background:#ffe4e6;color:#9f1239;border:1px solid #fecdd3;', stroke: '#e11d48' };
}

// ──────────────────────────────────────────────────────
//  10. DOM CACHE
// ──────────────────────────────────────────────────────
const $ = (s) => document.querySelector(s);
let DOM = {};

function cacheDom() {
    DOM = {
        resumeArea: $('#resumeArea'),
        jdArea: $('#jdArea'),
        resumeWords: $('#resumeWords'),
        resumeChars: $('#resumeChars'),
        jdWords: $('#jdWords'),
        jdChars: $('#jdChars'),
        analyzeBtn: $('#analyzeBtn'),
        validationMsg: $('#validationMsg'),
        results: $('#results'),
        gaugeBar: $('#gaugeBar'),
        scoreValue: $('#scoreValue'),
        statusBadge: $('#statusBadge'),
        scoreSummary: $('#scoreSummary'),
        metaMatched: $('#metaMatched'),
        metaMissing: $('#metaMissing'),
        metaTotal: $('#metaTotal'),
        techBar: $('#techBar'),
        techPct: $('#techPct'),
        softBar: $('#softBar'),
        softPct: $('#softPct'),
        densBar: $('#densBar'),
        densPct: $('#densPct'),
        matchedPills: $('#matchedPills'),
        missingPills: $('#missingPills'),
        matchedEmpty: $('#matchedEmpty'),
        missingEmpty: $('#missingEmpty'),
        insightsWrap: $('#insightsWrap'),
        tailoringWrap: $('#tailoringWrap'),
        startAuditBtn: $('#startAuditBtn'),
        // Dropzones
        resumeDropzone: $('#resumeDropzone'),
        jdDropzone: $('#jdDropzone'),
        resumeFileInput: $('#resumeFileInput'),
        jdFileInput: $('#jdFileInput'),
        resumeOcrStatus: $('#resumeOcrStatus'),
        jdOcrStatus: $('#jdOcrStatus'),
    };
}

// ──────────────────────────────────────────────────────
//  11. UI HELPERS
// ──────────────────────────────────────────────────────
function updateCounter(area, wordsEl, charsEl) {
    const text = area.value.trim();
    wordsEl.textContent = text ? text.split(/\s+/).length : 0;
    charsEl.textContent = text.length.toLocaleString();
}

function animateCounter(el, from, to, duration) {
    const start = performance.now();
    (function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(from + (to - from) * ease) + '%';
        if (t < 1) requestAnimationFrame(tick);
    })(performance.now());
}

function animateBar(el, pct) {
    requestAnimationFrame(() => { el.style.width = pct + '%'; });
}

function renderPills(container, kwSet, type, emptyEl, isDynamic = false) {
    container.innerHTML = '';
    if (kwSet.size === 0) { emptyEl.classList.remove('hidden'); return; }
    emptyEl.classList.add('hidden');
    [...kwSet].sort((a, b) => a.localeCompare(b)).forEach((kw, i) => {
        const span = document.createElement('span');
        const icon = type === 'matched'
            ? '<i class="fa-solid fa-circle-check"></i> '
            : '<i class="fa-solid fa-triangle-exclamation"></i> ';
        span.innerHTML = icon + prettify(kw);
        span.className = `pill pill-${type}${isDynamic ? ' pill-dynamic' : ''}`;
        span.style.animationDelay = `${i * 0.03}s`;
        container.appendChild(span);
    });
}

function renderInsights(insights) {
    DOM.insightsWrap.innerHTML = '';
    insights.forEach((ins, i) => {
        const div = document.createElement('div');
        div.className = 'insight-card animate-fade-up';
        div.style.animationDelay = `${.3 + i * .1}s`;
        div.style.opacity = '0';
        div.innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:.75rem;">
        <i class="fa-solid ${ins.icon}" style="color:${ins.color};margin-top:3px;font-size:.85rem;flex-shrink:0;"></i>
        <div>
          <p style="font-weight:700;font-size:.82rem;color:#0f172a;margin-bottom:.3rem;">${ins.title}</p>
          <p style="font-size:.78rem;color:#64748b;line-height:1.7;">${ins.body}</p>
        </div>
      </div>`;
        DOM.insightsWrap.appendChild(div);
    });
}

function renderTailoring(suggestions) {
    DOM.tailoringWrap.innerHTML = '';
    suggestions.forEach((text, i) => {
        const div = document.createElement('div');
        div.className = 'insight-card animate-fade-up';
        div.style.animationDelay = `${.45 + i * .1}s`;
        div.style.opacity = '0';
        const safeText = text.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        div.innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:.75rem;justify-content:space-between;">
        <p style="font-size:.78rem;color:#334155;line-height:1.75;flex:1;">
          <span style="color:#0d5c52;font-weight:800;margin-right:.4rem;">•</span>${text}
        </p>
        <button class="copy-btn" onclick="copyText(this, '${safeText}')">
          <i class="fa-regular fa-copy"></i> Copy
        </button>
      </div>`;
        DOM.tailoringWrap.appendChild(div);
    });
}

// ──────────────────────────────────────────────────────
//  12. MAIN SCAN
// ──────────────────────────────────────────────────────
function runScan() {
    const resumeText = DOM.resumeArea.value.trim();
    const jdText = DOM.jdArea.value.trim();

    if (!resumeText || !jdText) {
        DOM.validationMsg.classList.remove('hidden');
        DOM.results.classList.add('hidden');
        setTimeout(() => DOM.validationMsg.classList.add('hidden'), 3500);
        return;
    }
    DOM.validationMsg.classList.add('hidden');

    const result = computeScore(resumeText, jdText);
    const status = getStatus(result.overallPct);

    DOM.results.classList.remove('hidden');
    DOM.results.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Gauge
    const circ = 2 * Math.PI * 70;
    const offset = circ - (result.overallPct / 100) * circ;
    DOM.gaugeBar.style.stroke = status.stroke;
    DOM.gaugeBar.style.strokeDashoffset = '440';
    requestAnimationFrame(() => {
        DOM.gaugeBar.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(.4,0,.2,1)';
        DOM.gaugeBar.style.strokeDashoffset = String(offset);
    });
    animateCounter(DOM.scoreValue, 0, result.overallPct, 1300);

    // Status
    DOM.statusBadge.textContent = status.label;
    DOM.statusBadge.setAttribute('style', status.cls + 'display:inline-flex;align-items:center;gap:.4rem;padding:.4rem 1rem;border-radius:9999px;font-size:.72rem;font-weight:700;letter-spacing:.02em;text-transform:uppercase;');

    // Summary
    const pct = result.overallPct;
    DOM.scoreSummary.textContent =
        pct >= 85 ? `Excellent alignment! Your resume strongly matches this role's requirements. Fine-tune the few remaining gaps.` :
            pct >= 65 ? `Solid foundation at ${pct}%. Bridge the missing keywords below to push into the green zone and boost your chances.` :
                pct >= 45 ? `Moderate overlap at ${pct}%. Several critical skills are absent — addressing these will significantly improve your role fit.` :
                    `Only ${pct}% match detected. This resume has significant skill gaps for this role. Substantial tailoring is needed before applying.`;

    // Counts — include dynamic
    const totalMatched = result.matched.size + result.dynamicMatched.size;
    const totalMissing = result.missing.size + result.dynamicMissing.size;
    const totalJD = result.jdKW.size + result.dynamicMatched.size + result.dynamicMissing.size;
    DOM.metaMatched.textContent = totalMatched;
    DOM.metaMissing.textContent = totalMissing;
    DOM.metaTotal.textContent = totalJD;

    // Sub-metrics
    animateBar(DOM.techBar, result.techPct);
    DOM.techPct.textContent = result.techPct + '%';
    animateBar(DOM.softBar, result.softPct);
    DOM.softPct.textContent = result.softPct + '%';
    animateBar(DOM.densBar, result.densityScore);
    DOM.densPct.textContent = result.densityScore + '%';

    // Pills — dictionary keywords
    renderPills(DOM.matchedPills, result.matched, 'matched', DOM.matchedEmpty);
    renderPills(DOM.missingPills, result.missing, 'missing', DOM.missingEmpty);

    // Append dynamic pills with visual distinction
    if (result.dynamicMatched.size > 0) {
        DOM.matchedEmpty.classList.add('hidden');
        [...result.dynamicMatched].sort((a, b) => a.localeCompare(b)).forEach((kw, i) => {
            const span = document.createElement('span');
            span.innerHTML = '<i class="fa-solid fa-circle-check"></i> ' + prettify(kw);
            span.className = 'pill pill-matched pill-dynamic';
            span.style.animationDelay = `${(result.matched.size + i) * 0.03}s`;
            DOM.matchedPills.appendChild(span);
        });
    }

    if (result.dynamicMissing.size > 0) {
        DOM.missingEmpty.classList.add('hidden');
        [...result.dynamicMissing].sort((a, b) => a.localeCompare(b)).forEach((kw, i) => {
            const span = document.createElement('span');
            span.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> ' + prettify(kw);
            span.className = 'pill pill-missing pill-dynamic';
            span.style.animationDelay = `${(result.missing.size + i) * 0.03}s`;
            DOM.missingPills.appendChild(span);
        });
    }

    // Insights & Tailoring
    renderInsights(generateInsights(result));
    renderTailoring(generateTailoring(result.missing));
}

// ──────────────────────────────────────────────────────
//  13. CLIPBOARD
// ──────────────────────────────────────────────────────
window.copyText = function (btn, text) {
    navigator.clipboard.writeText(text).then(() => {
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
            btn.classList.remove('copied');
        }, 2000);
    });
};

// ──────────────────────────────────────────────────────
//  14. FILE PROCESSING (PDF, IMAGE OCR, TEXT)
// ──────────────────────────────────────────────────────

/**
 * Parse a PDF file client-side using PDF.js and return extracted text
 */
async function parsePDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    // Set the worker source for PDF.js
    if (typeof pdfjsLib !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
    }
    return fullText.trim();
}

/**
 * OCR an image file using Tesseract.js and return extracted text
 */
async function ocrImage(file, statusEl) {
    statusEl.classList.remove('hidden');
    statusEl.querySelector('span').textContent = 'Extracting text from image via OCR...';

    try {
        const result = await Tesseract.recognize(file, 'eng', {
            logger: (m) => {
                if (m.status === 'recognizing text' && m.progress) {
                    const pct = Math.round(m.progress * 100);
                    statusEl.querySelector('span').textContent = `OCR in progress... ${pct}%`;
                }
            }
        });
        statusEl.classList.add('hidden');
        return result.data.text.trim();
    } catch (err) {
        statusEl.querySelector('span').textContent = 'OCR failed — please try a clearer image.';
        setTimeout(() => statusEl.classList.add('hidden'), 3000);
        return '';
    }
}

/**
 * Read a text file and return its contents
 */
async function readTextFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
    });
}

/**
 * Process a dropped/selected file for a given target panel
 */
async function processFile(file, targetArea, statusEl) {
    const name = file.name.toLowerCase();
    const type = file.type;

    if (name.endsWith('.pdf') || type === 'application/pdf') {
        try {
            statusEl.classList.remove('hidden');
            statusEl.querySelector('span').textContent = 'Parsing PDF...';
            const text = await parsePDF(file);
            targetArea.value = text;
            statusEl.classList.add('hidden');
        } catch (err) {
            statusEl.querySelector('span').textContent = 'PDF parsing failed — please paste text manually.';
            setTimeout(() => statusEl.classList.add('hidden'), 3000);
        }
    } else if (name.endsWith('.txt') || type === 'text/plain') {
        const text = await readTextFile(file);
        targetArea.value = text;
    } else if (/\.(png|jpg|jpeg|webp|bmp|gif)$/.test(name) || type.startsWith('image/')) {
        const text = await ocrImage(file, statusEl);
        if (text) targetArea.value = text;
    }

    // Update counters
    const wordsEl = targetArea.id === 'resumeArea' ? DOM.resumeWords : DOM.jdWords;
    const charsEl = targetArea.id === 'resumeArea' ? DOM.resumeChars : DOM.jdChars;
    updateCounter(targetArea, wordsEl, charsEl);
}

// ──────────────────────────────────────────────────────
//  15. INPUT MODE TABS
// ──────────────────────────────────────────────────────
function setupInputTabs() {
    document.querySelectorAll('.input-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.target; // 'resume' or 'jd'
            const mode = tab.dataset.mode;     // 'text', 'pdf', 'image'

            // Toggle active state on tabs for this panel
            document.querySelectorAll(`.input-tab[data-target="${target}"]`).forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const dropzoneId = target === 'resume' ? 'resumeDropzone' : 'jdDropzone';
            const dropzone = document.getElementById(dropzoneId);
            const textarea = target === 'resume' ? DOM.resumeArea : DOM.jdArea;
            const fileInput = target === 'resume' ? DOM.resumeFileInput : DOM.jdFileInput;

            if (mode === 'text') {
                dropzone.classList.add('hidden');
                textarea.classList.remove('hidden');
            } else {
                dropzone.classList.remove('hidden');
                textarea.classList.remove('hidden');

                // Update dropzone format info and file input accept
                const formatsEl = dropzone.querySelector('.dropzone-formats');
                if (mode === 'pdf') {
                    formatsEl.textContent = 'Accepts: .pdf';
                    fileInput.setAttribute('accept', '.pdf,application/pdf');
                } else if (mode === 'image') {
                    formatsEl.textContent = 'Accepts: .png, .jpg, .jpeg';
                    fileInput.setAttribute('accept', '.png,.jpg,.jpeg,.webp,.bmp,image/*');
                }
            }
        });
    });
}

// ──────────────────────────────────────────────────────
//  16. DRAG-AND-DROP
// ──────────────────────────────────────────────────────
function setupDropzones() {
    const zones = [
        { dropzone: DOM.resumeDropzone, input: DOM.resumeFileInput, area: DOM.resumeArea, status: DOM.resumeOcrStatus },
        { dropzone: DOM.jdDropzone, input: DOM.jdFileInput, area: DOM.jdArea, status: DOM.jdOcrStatus },
    ];

    zones.forEach(({ dropzone, input, area, status }) => {
        if (!dropzone || !input) return;

        // Drag events
        ['dragenter', 'dragover'].forEach(evt => {
            dropzone.addEventListener(evt, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(evt => {
            dropzone.addEventListener(evt, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.remove('drag-over');
            });
        });

        dropzone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                processFile(files[0], area, status);
            }
        });

        // File input change
        input.addEventListener('change', () => {
            if (input.files.length > 0) {
                processFile(input.files[0], area, status);
            }
        });
    });
}

// ──────────────────────────────────────────────────────
//  17. SCROLL HELPER
// ──────────────────────────────────────────────────────
function scrollToWorkspace() {
    document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ──────────────────────────────────────────────────────
//  18. INIT
// ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    cacheDom();

    DOM.resumeArea.addEventListener('input', () => updateCounter(DOM.resumeArea, DOM.resumeWords, DOM.resumeChars));
    DOM.jdArea.addEventListener('input', () => updateCounter(DOM.jdArea, DOM.jdWords, DOM.jdChars));

    DOM.analyzeBtn.addEventListener('click', runScan);
    DOM.startAuditBtn?.addEventListener('click', scrollToWorkspace);

    // Setup input mode tabs and dropzones
    setupInputTabs();
    setupDropzones();
});