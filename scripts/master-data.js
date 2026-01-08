export const TOPICS_MASTER = {
    // A) Programming Languages
    "Java": [
        "Variables & Data Types", "Control Flow (If/Else, Loops)", "OOP Concepts (Inheritance, Polymorphism)",
        "Abstraction & Interfaces", "Collections Framework (List, Set, Map)", "Exception Handling (Try-Catch, Custom)",
        "Multithreading & Concurrency", "Java 8+ Features (Lambdas, Streams, Optional)", "JDBC & Database Connectivity",
        "JVM Architecture (Classloader, JVM Memory)", "Generics & Annotations", "File I/O & Serialization",
        "Memory Management & GC", "Spring/Hibernate Basics", "Unit Testing (JUnit, Mockito)"
    ],
    "Python": [
        "Basic Syntax & Data Types", "Lists, Tuples, Sets, Dictionaries", "Functions & Modules",
        "File Handling", "OOP in Python (Classes, Inheritance)", "Decorators & Generators",
        "Exception Handling", "List & Dictionary Comprehensions", "Virtual Environments & Pip",
        "Standard Library (OS, Sys, Itertools)", "Asyncio & Concurrency", "Context Managers (with)",
        "Testing (Pytest, Unittest)", "Regular Expressions (re)", "Logging & Debugging"
    ],
    "JavaScript": [
        "ES6+ Features (Arrow, Destructuring, Spread)", "DOM Manipulation & Events", "Promises & Async/Await",
        "Event Loop & Concurrency Model", "Closures & Scope Chain", "Prototypes & Prototypal Inheritance",
        "Fetch API & AJAX", "LocalStorage, SessionStorage, Cookies", "Modules (Import/Export)",
        "This Keyword & Binding", "Shadow DOM & Web Components", "Error Handling & Debugging",
        "Functional Programming basics", "JSON & Object Manipulation"
    ],
    "C++": [
        "Pointers & Smart Pointers", "STL (Vectors, Maps, Sets, Algorithms)", "Templates & Generic Programming",
        "Memory Management (Stack/Heap, New/Delete)", "Operator Overloading", "File I/O & Streams",
        "Classes & Multiple Inheritance", "Virtual Functions & Polymorphism", "Exception Handling",
        "C++11/14/17/20 Features", "Multithreading & Atomic", "Low-level Optimization"
    ],
    "C": [
        "Pointers & Memory Addresses", "Structs, Unions & Bit-fields", "Dynamic Memory Allocation (malloc, free)",
        "Preprocessors, Macros & Header Files", "Bitwise Operations", "String Manipulation",
        "File I/O (fopen, fread, fwrite)", "Function Pointers", "Command Line Arguments",
        "Data Structures in C (Stacks, Queues)", "Memory Layout of C Programs"
    ],
    "HTML": [
        "Semantic HTML5 Tags", "Forms & Advanced Input Types", "Form Validations (HTML5 & Regex)",
        "Canvas API & SVG", "Web Accessibility (Aria, Roles)", "Meta Tags & SEO Best Practices",
        "Web Components", "HTML Tables & Layouts", "Video & Audio Elements", "Iframe & Embeds"
    ],
    "CSS": [
        "Flexbox Deep Dive", "CSS Grid Layout", "Responsive Design (Media Queries)", "CSS Variables (Custom Properties)",
        "Animations & Keyframes", "Transitions & Transforms", "Pseudo-classes & Pseudo-elements",
        "Box Model (Padding, Margin, Border)", "CSS Architecture (BEM, SASS/LESS)", "Tailwind/Bootstrap utility concepts",
        "Z-index & Stacking Context", "Modern CSS (Clamp, Min, Max)", "Specificity & Inheritance"
    ],
    "TypeScript": [
        "Interfaces vs Type Aliases", "Enums & Literal Types", "Generics & Utility Types", "Decorators",
        "TS Config & Compiler Options", "Union & Intersection Types", "Discriminated Unions",
        "Type Guards & Narrowing", "Modules & Namespaces", "Ambient Declarations (.d.ts)",
        "TS with React/Node.js"
    ],
    "Go (Golang)": [
        "Goroutines & Channels", "Interfaces & Implicit Implementation", "Structs & Composition",
        "Error Handling (Errors as values)", "Pointers & Memory Management", "Slices & Arrays (internals)",
        "Maps & Iteration", "Standard Library (HTTP, JSON)", "Testing & Benchmarking",
        "Go Modules & Dependency Management", "Concurrency Patterns (Select, Sync)"
    ],
    "Rust": [
        "Ownership, Borrowing & Lifetimes", "Pattern Matching & Enums", "Traits & Generics", "Cargo & Crates",
        "Error Handling (Result & Option)", "Macros", "Unsafe Rust", "Smart Pointers (Box, Rc, Arc)",
        "Concurrency (Send, Sync traits)", "Iterators & Closures", "Zero-cost Abstractions"
    ],

    // B) Core CS Subjects
    "DSA": [
        "Time & Space Complexity (Big O)", "Arrays & Strings (Sliding Window, Two Pointers)", "Linked Lists (Singly, Doubly, Circular)",
        "Stacks & Queues (Deque, Priority Queue)", "Recursion & Backtracking (N-Queen, Sudoku)",
        "Trees & Binary Search Trees (AVL, Red-Black Trees)", "Graphs & Algorithms (BFS, DFS, Dijkstra, A*)",
        "Dynamic Programming (Knapsack, LCS, LIS)", "Sorting & Searching (Quick, Merge, Binary Search)",
        "Heaps & Hashing (HashMaps, Tries, Disjoint Set Union)", "Bit Manipulation", "Greedy Algorithms"
    ],
    "DBMS": [
        "Normalization (1NF to BCNF)", "ER Diagrams & Mapping", "SQL Queries (Joins, Subqueries, CTEs)",
        "Transactions & ACID Properties", "Indexing (B-Tree, B+ Tree)", "Query Optimization & Execution Plans",
        "NoSQL types (Document, Key-Value, Graph)", "Database Security & Access Control",
        "Storage Engine & Buffer Management", "Concurrency Control (Locking, MVCC)", "Distributed Databases"
    ],
    "Operating Systems": [
        "Process Scheduling (FCFS, RR, SRTF)", "Memory Management (Paging, Segmentation, TLB)", "Deadlocks (Prevention, Avoidance, Detection)",
        "Threads & Process Synchronization (Semaphores, Mutex)", "File Systems (NTFS, EXT4, FAT)", "Virtual Memory & Page Replacement",
        "I/O Management & Disk Scheduling", "Kernel Architecture (Monolithic, Microkernel)", "Inter-Process Communication (IPC)",
        "Security & Protection", "System Calls & Interrupts"
    ],
    "Computer Networks": [
        "OSI Model & TCP/IP Layer Breakdown", "HTTP/HTTPS, DNS & FTP Protocols", "IP Addressing, IPv4/IPv6 & Subnetting",
        "Routing Protocols (OSPF, BGP)", "Sockets, Port Numbers & Firewalls", "Network Security (SSL/TLS, SSH)",
        "Load Balancing & Proxies", "VPNs & Tunnels", "Wireless Networking & 5G basics", "CDNs & Caching"
    ],
    "Aptitude": [
        "Quantitative (Averages, Percentages, Profit/Loss)", "Time, Speed & Distance", "Time & Work",
        "Logical Reasoning (Syllogisms, Blood Relations)", "Data Interpretation (Graphs, Tables)",
        "Verbal Ability (Grammar, Comprehension)", "Probability & Combinatorics", "Number Systems"
    ],
    "Software Engineering": [
        "SDLC Models (Agile, Waterfall, Scrum)", "Software Testing (Unit, Integration, E2E, Regression)",
        "Design Patterns (Singleton, Factory, Observer)", "Clean Code & SOLID Principles",
        "Requirement Engineering", "Software Estimation & Planning", "System Maintenance & Documentation",
        "Code Reviews & Pair Programming"
    ],
    "OOP": [
        "Encapsulation & Data Hiding", "Abstraction via Interfaces/Abstract Classes", "Inheritance (Single, Multiple, Hierarchical)",
        "Polymorphism (Static vs Dynamic)", "SOLID & DRY Principles", "Composition vs Inheritance",
        "Coupling & Cohesion", "UML Diagrams basics"
    ],

    // C) Backend Frameworks & Tools
    "Spring Boot": [
        "Dependency Injection & IoC Container", "Spring MVC & REST Controllers", "Spring Data JPA & Hibernate",
        "Spring Security (OAuth2, JWT)", "Configuration & Profiles", "Spring Boot Actuators & Metrics",
        "Microservices Architecture concepts", "Exception Handling & Validation", "Unit & Integration Testing (JUnit 5)",
        "Spring Batch & Schedulers", "Integration with Messaging (RabbitMQ, Kafka)"
    ],
    "Node.js / Express": [
        "Event Emitter & Streams", "Middleware functions (Built-in, Custom)", "RESTful API Design & Best Practices",
        "NPM & Dependency Management", "JWT & Session Authentication", "Database integration (Mongoose, Sequelize)",
        "Error Handling in Express", "Scaling Node.js apps (Clusters, PM2)", "Socket.io for Real-time apps",
        "Testing (Jest, Supertest)", "Environment Configuration"
    ],
    "Django": [
        "Model-Template-View (MTV) Pattern", "Django ORM & Migrations", "Django Admin & Built-in Features",
        "Django REST Framework (DRF)", "Authentication & Authorization", "Forms & Validation",
        "URL Routing & Views", "Middleware & Signals", "Deployment (Gunicorn, Nginx)",
        "Celery & Task Queues"
    ],
    "Flask": [
        "Flask Application Factory Pattern", "Routing & View Functions", "Templates (Jinja2)",
        "SQLAlchemy & Blueprints", "Request/Response Cycle & Hooks", "Flask-Login & Flask-Security",
        "REST API Design with Flask", "Testing Flask apps", "Configuration Management"
    ],
    "FastAPI": [
        "Pydantic Models & Data Validation", "Asynchronous Programming (async/await)", "Auto-generated Docs (Swagger/Redoc)",
        "Dependency Injection System", "OAuth2 & Security Integration", "Path & Query Parameters",
        "Starlette & Uvicorn basics", "Testing with TestClient", "Background Tasks"
    ],
    ".NET Core": [
        "ASP.NET Core MVC & Web API", "Entity Framework Core (EF Core)", "LINQ & C# features",
        "Middleware & Request Pipeline", "Dependency Injection (Lifetime)", "Authentication & Identity Server",
        "Microservices with .NET", "Dockerizing .NET apps", "SignalR for Real-time"
    ],

    // D) Frontend Frameworks & UI
    "React": [
        "Hooks (useState, useEffect, useMemo, useCallback)", "State Management (Context API, Redux Toolkit, Zustand)",
        "Component Lifecycle & Reconciliation", "React Router (v6+)", "Virtual DOM & Render Performance",
        "Higher Order Components (HOC) & Render Props", "Custom Hooks", "Server Components & Suspense",
        "Testing (React Testing Library, Jest)", "CSS-in-JS (Styled Components, Emotion)"
    ],
    "Next.js": [
        "SSR, SSG & ISR Performance", "File-based Routing (App Router vs Pages Router)", "Server Actions & API Routes",
        "Middleware & Authentication (NextAuth)", "Image & Font Optimization", "SEO & Meta Management in Next.js",
        "Layouts & Nested Routing", "Incremental Static Regeneration", "Turbopack & Build process"
    ],
    "Angular": [
        "Modules, Components & Directives", "Services & Dependency Injection", "RxJS & Functional Reactive Programming",
        "Reactive Forms & Validations", "Angular Router & Guards", "State Management (NgRx)",
        "Change Detection Strategies", "Signal API (Modern Angular)", "Pipes & Custom Utilities",
        "Testing (Jasmine, Karma, Cypress)"
    ],
    "Vue.js": [
        "Composition API vs Options API", "State Management (Pinia / Vuex)", "Directives (v-if, v-for, etc.)",
        "Vue Router & Navigation Guards", "Props, Events & Provide/Inject", "Single File Components (.vue)",
        "Watchers & Computed Properties", "Server-Side Rendering (Nuxt.js basics)", "Vue 3 Script Setup"
    ],
    "Tailwind CSS": [
        "Utility-First Workflow", "Customizing Configuration (tailwind.config.js)", "Responsive Design with Prefixes",
        "State modifiers (Hover, Active, Focus, Dark Mode)", "Arbitrary Values & Custom Plugins",
        "Typography & Form plugins", "Preflight & Base Styles", "Performance (Purge/JIT)"
    ],
    "Bootstrap": [
        "Grid System Deep Dive", "Core Components (Modals, Carousels, Tabs)", "Utility Classes & Helpers",
        "Customizing with SASS", "Forms & Input Groups", "Accessibility in Bootstrap",
        "JavaScript Plugins & Hooks", "Version Migration (v4 to v5)"
    ],

    // E) Databases
    "MySQL": [
        "Advanced Joins & Nested Queries", "Stored Procedures, Triggers & Functions", "Indexing Strategies for Performance",
        "Views & Virtual Tables", "Transactions & Isolation Levels", "User Management & Privileges",
        "Backup & Recovery strategies", "JSON Data support", "Replica/Partitioning basics"
    ],
    "PostgreSQL": [
        "JSONB & Semi-structured data", "Window Functions & Common Table Expressions", "Full Text Search & GIN Indexes",
        "Materialized Views", "PostGIS for Geospatial data", "Custom Types & Operators",
        "Performance Tuning (EXPLAIN ANALYZE)", "Foreign Data Wrappers (FDW)"
    ],
    "MongoDB": [
        "BSON Format & Document Modeling", "Aggregation Framework (Pipelines)", "Indexing & Performance Patterns",
        "Mongoose ORM & Schema Design", "Replica Sets & Sharding", "Transactions in NoSQL",
        "GridFS for Large Files", "Security & RBAC"
    ],
    "Oracle SQL": [
        "PL/SQL Programming (Procedures, Packages)", "Cursors & Exception Handling", "LOBs & Large Object handling",
        "Materialized Views & Snapshots", "Partitioning & Compression", "Auditing & Security",
        "Optimizer Hints & Performance", "Data Guard basics"
    ],
    "Redis": [
        "Data Types (Strings, Hashes, Lists, Sets, Sorted Sets)", "Pub/Sub Messaging Patterns", "Caching Strategies (Cache-Aside, Write-Through)",
        "Persistence Options (RDB vs AOF)", "Redis Sentinel & Cluster for HA", "Lua Scripting in Redis",
        "Expiring keys & TTL", "Redis Streams"
    ],
    "SQLite": [
        "Embedded Engine internals", "Transactions & WAL Mode", "Schema Design & Migrations",
        "Full Text Search extension", "JSON1 extension", "Integration in Mobile/Desktop apps"
    ],

    // f) DevOps, Cloud & Infra
    "Docker": [
        "Dockerfile Best Practices", "Images, Layers & Caching", "Docker Compose for Multi-container apps",
        "Volumes & Persistent Storage", "Networking & Port Mapping", "Multi-stage Builds",
        "Registry & Image Management", "Security Scanning", "Docker Swarm basics"
    ],
    "Kubernetes": [
        "Pods, Deployments & ReplicaSets", "Services, Ingress & Load Balancers", "ConfigMaps & Secrets Management",
        "Helm Charts for Package management", "StatefulSets & Persistent Volumes", "Nodes & Cluster Architecture",
        "Custom Resource Definitions (CRDs)", "Logging & Monitoring (Prometheus)", "Autoscaling (HPA, VPA)"
    ],
    "AWS": [
        "EC2, S3 & IAM Roles", "Serverless with AWS Lambda & API Gateway", "Database services (RDS, DynamoDB, Aurora)",
        "VPC, Subnets & Security Groups", "CloudFormation & CDK for IaC", "Route53 & CloudFront",
        "SQS, SNS & EventBridge", "CloudWatch Monitoring"
    ],
    "Azure": [
        "Virtual Machines & Virtual Networks", "Azure Active Directory (Entra ID)", "App Service & Azure Functions",
        "Blob Storage & Cosmos DB", "ARM Templates & Bicep", "Azure DevOps Pipelines",
        "Key Vault for Secrets", "Logic Apps & Event Grid"
    ],
    "Google Cloud": [
        "Compute Engine & App Engine", "Google Kubernetes Engine (GKE)", "Cloud Functions & Cloud Run",
        "BigQuery & Cloud Storage", "VPC & Firewalls", "IAM & Service Accounts",
        "Pub/Sub for messaging", "Cloud Spanner basics"
    ],
    "Git & GitHub": [
        "Branching Strategies (GitFlow, Trunk-based)", "Merging, Rebasing & Cherry-picking", "Stashing & Conflict Resolution",
        "Pull Request Workflow & Code Review", "GitHub Actions for CI/CD", "Git Internal mechanics",
        "Hooks & Custom Integrations", "Submodules & Monorepos"
    ],
    "CI/CD (GitHub Actions, Jenkins)": [
        "Pipeline-as-Code (Declarative vs Scripted)", "Build, Test & Deploy Workflows", "Secrets & Environment Management",
        "Artifact management", "Self-hosted vs Managed runners", "Deployment Strategies (Blue-Green, Canary)",
        "Security in CI/CD pipeline", "Dockerizing build agents"
    ],

    // G) Data & AI
    "Machine Learning": [
        "Supervised Learning (Regression, Classification)", "Unsupervised Learning (Clustering, PCA)",
        "Model Selection & Hyperparameter Tuning", "Scikit-Learn library", "Bias-Variance Tradeoff",
        "Feature Engineering & Scaling", "Ensemble Methods (Random Forest, XGBoost)", "Model Evaluation (ROC, AUC, F1)"
    ],
    "Deep Learning": [
        "Neural Networks Architecture (MLP)", "Convolutional Neural Networks (CNNs)", "Recurrent Neural Networks (RNNs/LSTMs)",
        "Transformers & Attention Mechanism", "Frameworks (PyTorch, TensorFlow)", "Transfer Learning",
        "Optimization (Adam, SGD)", "GANs & Generative AI basics"
    ],
    "Data Analysis": [
        "Exploratory Data Analysis (EDA) process", "Statistical Analysis & Hypothesis Testing", "Data Cleaning & Transformation",
        "Probability Distributions", "Identifying Trends & Outliers", "Correlation vs Causation",
        "A/B Testing basics", "Excel for Analytics"
    ],
    "Pandas/Numpy": [
        "DataFrames, Series & Indexing", "Numpy Arrays & Vectorized Math", "Handling Missing Data (NaN)",
        "GroupBy & Aggregation", "Merging, Joining & Pivoting", "Time Series Analysis with Pandas",
        "Performance optimization with Numpy", "Reading/Writing CSV, Excel, SQL"
    ],
    "Power BI/Tableau": [
        "DAX & Power Query in Power BI", "Calculated Fields & LODs in Tableau", "Visual Storytelling Best Practices",
        "Connecting to Diverse Data Sources", "Interactive Dashboards & Filters", "Row-level Security",
        "Publishing & Automating Refreshes"
    ],
    "NLP": [
        "Text Preprocessing (Tokenization, Stopwords)", "TF-IDF & Word Embeddings (Word2Vec)", "Large Language Models (LLMs) & Prompting",
        "Named Entity Recognition (NER)", "Sentiment Analysis & Text Classification", "Seq2Seq & Attention",
        "HuggingFace library", "Summarization & Translation"
    ],
    "Data Engineering Basics": [
        "ETL vs ELT Pipelines", "Data Warehousing concepts (Snowflake, BigQuery)", "Apache Spark for Large scale processing",
        "Data Lake vs Data Warehouse", "Orchestration (Airflow, Prefect)", "Data Modeling (Star/Snowflake schema)",
        "Batch vs Stream processing (Kafka)"
    ],

    // H) Cybersecurity
    "Ethical Hacking Fundamentals": [
        "Vulnerability Assessment & Pen Testing (VAPT)", "Reconnaissance & OSINT", "Network Scanning & Enumeration (Nmap)",
        "Metasploit Framework usage", "Wireless Network Hacking basics", "Social Engineering techniques",
        "Password Cracking & Hashcat", "Incident Response basics"
    ],
    "Web Security Basics": [
        "OWASP Top 10 breakdown", "SQL Injection (SQLi) Prevention", "Cross-Site Scripting (XSS) Mitigation",
        "Cross-Site Request Forgery (CSRF)", "Content Security Policy (CSP)", "Secure Authentication & JWT",
        "HTTPS, HSTS & SSL/TLS certificates", "Input Validation & Sanitization"
    ],

    // I) Bonus Career Topics
    "System Design (Beginner level)": [
        "Load Balancing & Reverse Proxies", "Caching strategies (CDN, Redis)", "Database Sharding & Replication",
        "Scalability (Vertical vs Horizontal)", "Availability vs Consistency (CAP Theorem)", "Microservices vs Monolith",
        "Rate Limiting & Throttling", "DNS & Latency optimization"
    ],
    "Resume Review & ATS Tips": [
        "Keyword Optimization for ATS", "Quantifying impact with metrics", "Clean Formatting & Action Verbs",
        "Project Descriptions & Portfolio linking", "Customizing resume for Job roles", "Handling Education/Experience gaps"
    ],
    "Interview Question Practice": [
        "Behavioral (STAR method) Preparation", "Technical Coding Drills", "System Design mock scenarios",
        "Salary Negotiation tips", "Post-interview follow-up", "Handling stress & difficult questions"
    ],
    "Problem-Solving Tracker": [
        "LeetCode/HackerRank Progress Roadmap", "Identifying Patterns (Sliding Window, Backtracking)", "Time Management during Contests",
        "Reviewing Optimal Solutions", "Competitive Programming basics", "Building a Problem Bank"
    ],

    // Default subjects for backward compatibility
    "General": [
        "Resume Building", "Soft Skills", "Aptitude", "System Design Basics"
    ],
    "Frontend": [
        "HTML5 Semantic Tags", "CSS3 Flexbox & Grid", "Responsive Design", "JavaScript ES6+"
    ]
};
