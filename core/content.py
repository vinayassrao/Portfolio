"""All portfolio copy lives here so it can be edited without touching templates."""

PROFILE = {
    "name": "Vinaya S Rao",
    "short": "Vinaya",
    "headline": "Backend, data & infrastructure engineer who also builds games.",
    "pitch": (
        "I build the systems people never see but always feel: backend services, data "
        "pipelines and cloud infrastructure, for products, platforms and games."
    ),
    "email": "vinayassrao@gmail.com",
    "location": "Mangalore, Karnataka, India",
    "availability": (
        "Open to backend, data engineering, DevOps/SRE and game-industry roles, "
        "remote or international."
    ),
    # Links shown in the footer and on the contact page (icon: a pixel logo in img/icons/<icon>.png).
    "links": [
        {"label": "GitHub", "url": "https://github.com/vinayassrao", "icon": "github"},
        {"label": "LinkedIn", "url": "https://www.linkedin.com/in/vinayasrao/", "icon": "linkedin"},
    ],
}

# The icons orbiting him on the home page (img/hobbies/<key>.png, from Vinaya's art).
HOBBIES = [
    {"key": "code", "label": "Coding", "color": "#39e6c8"},
    {"key": "writing", "label": "Writing", "color": "#e8e0ff"},
    {"key": "art", "label": "Drawing & painting", "color": "#ffb347"},
    {"key": "anime", "label": "Anime", "color": "#ff7a2a"},
    {"key": "badminton", "label": "Badminton", "color": "#f5e6a0"},
]

NAV = [
    {"key": "home", "label": "Home", "chapter": "00", "sprite": "door",
     "blurb": "Back to the start."},
    {"key": "about", "label": "About", "chapter": "01", "sprite": "hero",
     "blurb": "Who I am, how I work and where I'm going."},
    {"key": "projects", "label": "Projects", "chapter": "02", "sprite": "chest",
     "blurb": "Luxmora, a crypto lakehouse, custom NER and more."},
    {"key": "experience", "label": "Experience", "chapter": "03", "sprite": "scroll",
     "blurb": "Four years of IBM delivery for Bell Canada and Pearson."},
    {"key": "skills", "label": "Skills", "chapter": "04", "sprite": "shard",
     "blurb": "The full inventory: languages, pipelines, cloud."},
    {"key": "contact", "label": "Contact", "chapter": "05", "sprite": "letter",
     "blurb": "Studios, teams, collaborators: say hello."},
]

ROLES = ["Backend Engineer", "Data Engineer", "SRE / DevOps", "Game Systems Builder"]

STATS = [
    {"value": 4, "suffix": "+", "label": "Years shipping at IBM"},
    {"value": 4, "suffix": "", "label": "Games on one shared backend"},
    {"value": 6, "suffix": "", "label": "Years of competitive C++"},
    {"value": 2, "suffix": "", "label": "Enterprise clients served"},
]

STACK_MARQUEE = [
    "Python", "Django", "DRF", "Phaser", "Unity", "TypeScript", "React", "C++",
    "Kafka", "ksqlDB", "Airflow", "dbt", "PostgreSQL", "Redis", "Docker",
    "Terraform", "Terragrunt", "AWS", "GitHub Actions", "Grafana", "Java", "spaCy",
]

BIO = {
    "lead": "I build the systems people never see but always feel, from enterprise data platforms to game backends.",
    "paragraphs": [
        "I'm Vinaya, a generalist engineer who learns fast. My strongest work is in DevOps, "
        "SRE, backend development and data engineering, and I'm happy wherever those skills "
        "move the needle: product teams, platform and data teams, and games.",
        "Over 4+ years at IBM with enterprise clients like Bell Canada and Pearson, I've built "
        "Python and Java services, streaming and batch data pipelines with Kafka, Airflow and "
        "dbt, and Terraform and Terragrunt infrastructure on AWS with CI/CD. I write things down "
        "before I build them, so my work ships with clear scope, tests and runbooks, and it "
        "holds up across distributed, remote teams.",
        "Games are where my curiosity runs furthest, and building them sharpens everything "
        "else I make. Luxmora, my "
        "four-game browser anthology, runs on one shared player account, a Django API and a "
        "Kafka telemetry pipeline: live-service thinking at indie scale. I build in Unity and "
        "Phaser, I've solved algorithmic problems in C++ for six years, and I'm growing toward "
        "systems-level C++.",
        "Away from the keyboard I paint, write Kannada poetry, and I'm writing a book about how "
        "people think. It turns out that's most of what design is.",
    ],
    "closer": "Open to backend, data, DevOps/SRE and game roles, remote or international.",
}

CHARACTER_SHEET = {
    "rows": [
        ("Class", "Generalist Engineer"),
        ("Level", "4+ years"),
        ("Guild", "IBM"),
        ("Home", "Mangalore, India"),
        ("Quest", "Great teams, solid systems"),
    ],
    # Tweak these to taste: they drive the animated bars.
    "attributes": [
        {"name": "Backend & APIs", "value": 90},
        {"name": "Data pipelines", "value": 90},
        {"name": "DevOps & IaC", "value": 80},
        {"name": "Algorithms (C++)", "value": 85},
        {"name": "Game dev", "value": 62, "note": "leveling up"},
    ],
}

WHERE_I_FIT = [
    {
        "title": "Tech teams",
        "sprite": "scroll",
        "body": "Backend services in Python and Java, streaming and batch data platforms, "
                "Terraform on AWS, CI/CD with security gates, SRE and observability. "
                "Documented, tested and handed over cleanly.",
    },
    {
        "title": "Game studios",
        "sprite": "hero",
        "body": "Online services, player accounts and save systems, telemetry and analytics "
                "pipelines, build and deploy infrastructure. The backbone that keeps a live "
                "game running.",
    },
    {
        "title": "Animation",
        "sprite": "chest",
        "body": "Python automation, pipeline tooling and the infrastructure under render and "
                "asset workflows, from someone who also animates and paints, and cares how the picture looks.",
    },
]

SIDE_QUESTS = [
    {"title": "Painting", "body": "Colour, light and composition, the same instincts I bring to how a screen feels."},
    {"title": "Kannada poetry", "body": "Writing in my mother tongue: rhythm, economy, and saying a lot with very little."},
    {"title": "A book in progress", "body": "About how people think: attention, motivation, and why we make the choices we do."},
]

PROJECTS = [
    {
        "slug": "luxmora",
        "name": "Luxmora Anthology",
        "kind": "Full-stack game portal & data platform",
        "status": "Featured",
        "stack": ["Django", "DRF", "React", "TypeScript", "Phaser", "PostgreSQL", "Kafka", "ksqlDB", "dbt", "Docker"],
        "summary": "A four-game browser anthology on one shared backend and one player account.",
        "points": [
            "Architected a full-stack platform hosting four browser games on a single shared backend and "
            "player account, with a thin bridge contract decoupling each Phaser/TypeScript game from the "
            "Django REST API.",
            "Built a server-authoritative REST API with Django REST Framework and PostgreSQL: JWT auth "
            "(access token in memory, refresh token in an httpOnly cookie) and a versioned per-player "
            "save-state schema.",
            "Designed a modular service layout (accounts, profiles, worlds, games, scores, saves) and a "
            "relational model driving leaderboards, player progress and data-driven lore pages.",
            "Engineered a streaming telemetry pipeline: gameplay events through Kafka and ksqlDB for "
            "real-time aggregates, dbt for dimensional modeling, all behind automated data-quality gates.",
            "Containerized the stack with Docker Compose; GitHub Actions CI for linting and tests.",
        ],
        "url": "",
    },
    {
        "slug": "lakehouse",
        "name": "Crypto Market Data Lakehouse",
        "kind": "Hybrid streaming + batch data platform",
        "status": "Operating",
        "stack": ["Python", "Kafka", "Airflow", "dbt", "PostgreSQL", "Docker", "Streamlit", "GitHub Actions"],
        "summary": "Live trades and daily candles, reconciled against each other and gated on quality.",
        "points": [
            "Designed, built and operate a hybrid pipeline end to end: live trades from the Coinbase "
            "WebSocket API through Kafka, daily candles via REST orchestrated by Airflow, both landing "
            "raw in PostgreSQL.",
            "Modeled an analytics layer in dbt (staging views, dimensional marts) including a "
            "reconciliation table that compares self-streamed aggregates with official exchange "
            "candles and flags divergence.",
            "Automated data-quality gates fail the pipeline on bad data; resilient WebSocket "
            "reconnection and batched commits in the consumer.",
            "Docker Compose for the full stack, CI linting on every push, and documented architecture, "
            "tradeoffs and a full runbook.",
        ],
        "url": "",
    },
    {
        "slug": "roomner",
        "name": "RoomNER",
        "kind": "Custom NER for floor-plan text",
        "status": "Complete",
        "stack": ["Python", "spaCy", "pandas", "NetworkX", "Matplotlib"],
        "summary": "Turns natural-language house-plan descriptions into room-adjacency graphs.",
        "points": [
            "Trained a custom spaCy NER model from scratch on five labels (room, quantity, direction, "
            "dimension, connection).",
            "Built the pipeline end to end: annotated JSON spans to spaCy training format, a CLI with "
            "configurable iterations and model paths, run over 50 unseen floor-plan descriptions.",
            "Regex post-processing resolves connection entities into room-pair edge lists, exported "
            "per plan as CSV.",
            "Visualizes each plan's room adjacency as an undirected graph with NetworkX and Matplotlib; "
            "documented setup, pinned dependencies and known limitations.",
        ],
        "url": "",
    },
    {
        "slug": "pdf-rotate",
        "name": "PDF Rotate API",
        "kind": "REST microservice",
        "status": "Complete",
        "stack": ["Python", "Flask", "REST"],
        "summary": "A small, modular Flask API for manipulating PDF pages.",
        "points": [
            "Python and Flask REST API with CRUD endpoints to manipulate PDF pages, using Flask routing "
            "to keep each operation modular.",
        ],
        "url": "",
    },
]

EXPERIENCE = [
    {
        "company": "IBM",
        "role": "SRE & DevOps Engineer",
        "client": "Pearson",
        "dates": "Aug 2026 – Present",
        "current": True,
        "points": [
            "Part of the IBM delivery team deploying an AI security platform (IBM Guardium AI) into the "
            "client's AWS environment, working from architecture and high-level design documents in a "
            "Linux and GitHub workflow.",
            "Co-developed a modular infrastructure-as-code structure: reusable Terraform modules in "
            "per-service repositories, composed by a Terragrunt deployment repository.",
            "Used it to provision and deploy Amazon RDS and Amazon ECS in the client's non-production "
            "environment.",
            "Building CI/CD pipelines for the Terragrunt repositories, with shared policy and security "
            "scanning checks common across repos.",
            "Coordinating with architects, AWS design contacts and teammates across IBM and the client.",
        ],
    },
    {
        "company": "IBM",
        "role": "Application Developer",
        "client": "Bell Canada",
        "dates": "Jul 2022 – Aug 2026",
        "current": False,
        "points": [
            "Key team member on data management solutions covering master data for device, IoT and "
            "pricing.",
            "Built data engineering solutions in Python and Java; designed and optimized transformation "
            "pipelines for data quality, consistency and reliability at enterprise scale.",
            "Troubleshot and resolved defects in data processing workflows, reducing defect rates and "
            "improving system stability.",
            "Monitored workflows and servers with Grafana to catch issues earlier.",
            "Automated log management with a daily cron shell script and added daily disk-usage email "
            "reports.",
            "Refactored unstructured legacy components and introduced structured coding practices.",
        ],
    },
]

COMPETITIVE = {
    "title": "Competitive Programming",
    "dates": "2020 – Present",
    "where": "C++ and Python · LeetCode, CodeChef, GeeksforGeeks",
    "body": "Six years of algorithmic problem solving under strict time and memory limits: data "
            "structures, graph algorithms, dynamic programming and complexity analysis, applied to "
            "optimizing real pipeline code.",
}

EDUCATION = [
    {"school": "PESIT South Campus", "what": "B.E. in Computer Science", "dates": "2016 – 2020"},
    {"school": "SVS PU-College", "what": "12th · 92.5%", "dates": "2014 – 2016"},
    {"school": "BRMPC Public School", "what": "10th · 8.4 / 10", "dates": "2013 – 2014"},
]

CERTIFICATIONS = [
    {"name": "PCEP-30-02 Certified Entry-Level Python Programmer", "by": "Python Institute", "date": "May 2026"},
    {"name": "Data Science with Generative AI", "by": "PW Skills", "date": "Jul 2024"},
    {"name": "AWS Certified Cloud Practitioner", "by": "AWS", "date": "Sep 2023"},
    {"name": "Data Structures", "by": "UC San Diego (Coursera)", "date": "Dec 2021"},
    {"name": "Convolutional Neural Networks", "by": "Deeplearning.ai", "date": "Nov 2021"},
    {"name": "Google IT Automation with Python", "by": "Google (Coursera)", "date": ""},
]

SKILLS = [
    {"name": "Languages", "sprite": "scroll", "items": ["Python", "TypeScript", "Java", "C++", "SQL", "Shell"]},
    {"name": "Backend & APIs", "sprite": "chest", "items": ["Django", "Django REST Framework", "Flask", "REST design", "WebSockets", "JWT auth"]},
    {"name": "Game & Frontend", "sprite": "hero", "items": ["Phaser", "Unity", "React", "TypeScript"]},
    {"name": "Data Pipelines", "sprite": "shard", "items": ["Kafka", "ksqlDB", "Airflow", "dbt", "Data ingestion", "Data-quality gates"]},
    {"name": "Databases", "sprite": "chest", "items": ["PostgreSQL", "Redis", "Relational modeling"]},
    {"name": "DevOps & Cloud", "sprite": "relic", "items": ["Docker", "Docker Compose", "GitHub Actions", "Terraform", "Terragrunt", "AWS RDS", "AWS ECS", "Grafana", "Git"]},
    {"name": "NLP & Analysis", "sprite": "letter", "items": ["spaCy", "NER", "pandas", "NetworkX", "Matplotlib"]},
    {"name": "Fundamentals", "sprite": "shard", "items": ["Data structures", "Algorithms", "Dynamic programming", "Graph algorithms", "Complexity analysis"]},
]

NEXT_UNLOCKS = [
    {"name": "Systems-level C++", "value": 45, "note": "Engines, memory, performance"},
    {"name": "Unity production", "value": 55, "note": "Shipping beyond prototypes"},
    {"name": "Game backend at scale", "value": 70, "note": "Matchmaking, live-ops, telemetry"},
]
