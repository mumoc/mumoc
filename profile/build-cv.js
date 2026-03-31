const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, LevelFormat,
  HeadingLevel, ExternalHyperlink
} = require('docx');
const fs = require('fs');

// ── Colors & helpers ──────────────────────────────────────────────────────────
const DARK    = "1A1A1A";
const MED     = "444444";
const LIGHT   = "666666";
const ACCENT  = "2B5C8A";
const RULE    = "DDDDDD";
const WHITE   = "FFFFFF";

const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function rule() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: RULE, space: 1 } },
    spacing: { before: 80, after: 120 },
    children: []
  });
}

function sectionHeading(text) {
  return new Paragraph({
    spacing: { before: 280, after: 60 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 4 } },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 22,
        color: ACCENT,
        font: "Arial",
        characterSpacing: 40
      })
    ]
  });
}

function jobHeader(title, company, period) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [6500, 2860],
    borders: {
      top: noBorder, bottom: noBorder, left: noBorder, right: noBorder,
      insideH: noBorder, insideV: noBorder
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: noBorders,
            width: { size: 6500, type: WidthType.DXA },
            margins: { top: 0, bottom: 0, left: 0, right: 0 },
            children: [
              new Paragraph({
                spacing: { before: 200, after: 0 },
                children: [
                  new TextRun({ text: title, bold: true, size: 24, color: DARK, font: "Arial" })
                ]
              }),
              new Paragraph({
                spacing: { before: 20, after: 60 },
                children: [
                  new TextRun({ text: company, size: 21, color: ACCENT, font: "Arial", bold: true })
                ]
              })
            ]
          }),
          new TableCell({
            borders: noBorders,
            width: { size: 2860, type: WidthType.DXA },
            margins: { top: 0, bottom: 0, left: 0, right: 0 },
            verticalAlign: "center",
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 200, after: 0 },
                children: [
                  new TextRun({ text: period, size: 19, color: LIGHT, font: "Arial", italics: true })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
}

function bullet(text, subtext) {
  const children = [
    new TextRun({ text, size: 20, color: MED, font: "Arial" })
  ];
  if (subtext) {
    children.push(new TextRun({ text: "  " + subtext, size: 19, color: LIGHT, font: "Arial", italics: true }));
  }
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 40, after: 40 },
    children
  });
}

function bodyText(text) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 20, color: MED, font: "Arial" })]
  });
}

function label(text) {
  return new TextRun({ text, bold: true, size: 20, color: DARK, font: "Arial" });
}

function value(text) {
  return new TextRun({ text, size: 20, color: MED, font: "Arial" });
}

function competencyRow(cat, skills) {
  return new TableRow({
    children: [
      new TableCell({
        borders: noBorders,
        width: { size: 2400, type: WidthType.DXA },
        shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 160, right: 120 },
        children: [
          new Paragraph({
            children: [new TextRun({ text: cat, bold: true, size: 19, color: ACCENT, font: "Arial" })]
          })
        ]
      }),
      new TableCell({
        borders: noBorders,
        width: { size: 6960, type: WidthType.DXA },
        shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 80 },
        children: [
          new Paragraph({
            children: [new TextRun({ text: skills, size: 19, color: MED, font: "Arial" })]
          })
        ]
      })
    ]
  });
}

// ── Document ──────────────────────────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0,
          format: LevelFormat.BULLET,
          text: "•",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 440, hanging: 280 } } }
        }]
      }
    ]
  },
  styles: {
    default: {
      document: { run: { font: "Arial", size: 20, color: MED } }
    }
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1260, bottom: 1080, left: 1260 }
      }
    },
    children: [

      // ── NAME & TITLE ──────────────────────────────────────────────────────
      new Paragraph({
        spacing: { before: 0, after: 40 },
        children: [
          new TextRun({ text: "MUMOC", bold: true, size: 52, color: DARK, font: "Arial", characterSpacing: 60 })
        ]
      }),
      new Paragraph({
        spacing: { before: 0, after: 20 },
        children: [
          new TextRun({ text: "Carlos Alberto Muñiz Moreno", size: 24, color: LIGHT, font: "Arial", italics: true })
        ]
      }),
      new Paragraph({
        spacing: { before: 0, after: 20 },
        children: [
          new TextRun({ text: "Team Architect  ·  Senior Software Engineer", bold: true, size: 26, color: ACCENT, font: "Arial" })
        ]
      }),

      // ── CONTACT ──────────────────────────────────────────────────────────
      new Paragraph({
        spacing: { before: 60, after: 0 },
        children: [
          value("Colima, Mexico  ·  "),
          new TextRun({ text: "mumo.crls@gmail.com", size: 20, color: ACCENT, font: "Arial" }),
          value("  ·  github.com/mumoc  ·  linkedin.com/in/mumoc")
        ]
      }),

      rule(),

      // ── PROFILE ──────────────────────────────────────────────────────────
      sectionHeading("Profile"),

      bodyText(
        "Team Architect and full-stack engineer with 15+ years working across every layer of software organizations — " +
        "engineering, design, QA, product, operations, eCommerce, and people management. I have held roles from " +
        "Software Engineer to COO, moving between them intentionally to understand how organizations function as systems."
      ),
      bodyText(
        "I build the conditions where teams can build anything. My work focuses on restoring connection and movement " +
        "in systems where delivery has stalled — uncovering hidden blockers, clarifying agreements, and creating " +
        "environments where people feel safe contributing. When those human conditions exist, delivery improves naturally."
      ),
      bodyText(
        "I am a Connector: I absorb ambiguity across teams, translate unclear business needs into actionable technical " +
        "paths, and bridge people, processes, and tools that were operating in isolation. Even when my title is " +
        "Senior Software Engineer, I naturally operate beyond role boundaries — because that is how I work, not what " +
        "the role requires."
      ),

      rule(),

      // ── CORE COMPETENCIES ─────────────────────────────────────────────────
      sectionHeading("Core Competencies"),

      new Paragraph({ spacing: { before: 100, after: 80 }, children: [] }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2400, 6960],
        borders: {
          top: noBorder, bottom: noBorder, left: noBorder, right: noBorder,
          insideH: noBorder, insideV: noBorder
        },
        rows: [
          competencyRow("Backend & APIs", "Ruby on Rails, API Design, PostgreSQL, Performance Optimization"),
          competencyRow("Full-Stack", "React (Web), Flutter (Mobile), JavaScript, Hotwire, Stimulus"),
          competencyRow("Infrastructure", "AWS, Docker, CI/CD, TDD, Observability & Logging"),
          competencyRow("AI & Workflows", "Claude / Codex Integration, Agentic Workflows, MCP, Prompt Engineering"),
          competencyRow("Team Systems", "Care to Deliver Framework, Career Path Design, OKRs / KPIs, Talent Review"),
          competencyRow("People & Culture", "Top Grading (custom), Performance & Potential Matrix, Radical Candor, Succession Planning"),
          competencyRow("Methodologies", "Agile, Lean, Design Thinking, Scrum, eCommerce Platforms"),
        ]
      }),

      new Paragraph({ spacing: { before: 80, after: 0 }, children: [] }),

      rule(),

      // ── EXPERIENCE ────────────────────────────────────────────────────────
      sectionHeading("Experience"),

      // Dealerware
      jobHeader("Senior Software Engineer", "Dealerware  ·  Colima, Mexico", "Mar 2023 – Present"),
      bodyText(
        "Full-stack engineer across backend (Ruby/Rails API), frontend (React), and mobile (Flutter) in an " +
        "automotive dealer software platform. Focused on data infrastructure, cross-team coordination, and " +
        "building reliable systems that enable downstream teams to move faster."
      ),
      new Paragraph({ spacing: { before: 60, after: 20 }, children: [label("Key Accomplishments:")] }),
      bullet("Architected Auth0 integration and user management layer with bulk sync and real-time provisioning, reducing manual identity toil and improving consistency across environments."),
      bullet("Led Databricks data infrastructure design with weekly true-up jobs for inventory and user data, enabling analytics teams to ship reports with confidence."),
      bullet("Modernized vehicle ingestion pipeline migrating Volvo inventory to standardized parking lot flow, reducing fragmentation and improving long-term maintainability."),
      bullet("Bridged engineering and non-technical stakeholders, establishing single sources of truth and reducing communication noise across teams."),
      bullet("Operate as Team Architect within SE title: unblocking teams, refining product scope, coordinating cross-team dependencies, reviewing PRs, and mentoring — because that is how I work."),

      // Zoolatech
      jobHeader("Lead Software Engineer", "Zoolatech  ·  Colima, Mexico", "Mar 2022 – Mar 2023"),
      bodyText("Led development efforts for two teams while managing client relationships and driving design, build, and maintenance of new features. Increased client satisfaction and enabled growth of a second development team."),
      bullet("Managed technical delivery across multiple concurrent projects and established engineering practices to reduce misalignment."),
      bullet("Built and mentored development team, enabling team growth and client expansion."),

      // Learning Manager
      jobHeader("Learning Manager", "MagmaLabs  ·  Colima, Mexico", "Nov 2021 – Feb 2022"),
      bodyText(
        "Returned to MagmaLabs as Learning Manager, deliberately formalizing people expertise " +
        "on a trajectory toward Chief Learning Officer (CLO)."
      ),
      bullet("Designed and implemented Individual Development Plans (IDPs), talent review cycles, and performance management processes."),
      bullet("Created a custom Top Grading hiring methodology — simplified, values-aligned, and calibrated to team averages rather than abstract ideals. Used across multiple hiring cycles."),
      bullet("Developed content strategy for career development including training resources, evaluations, and succession planning frameworks."),

      // MagmaLabs Sr SE
      jobHeader("Senior Software Engineer", "MagmaLabs  ·  Colima, Mexico", "Feb 2020 – Nov 2021"),
      bodyText("Delivered features across multiple Ruby on Rails projects while advising leadership on engineering practices, mentoring strategies, and organizational structure."),
      bullet("Tech: Ruby on Rails, Solidus, Stimulus, Hotwire, SASS, JavaScript."),
      bullet("Mentored engineers, designers, product managers, and QA across technologies and methodologies."),
      bullet("Founded Product Development and R&D initiatives to improve cross-functional execution."),

      // TangoSource
      jobHeader("Senior Software Engineer", "TangoSource  ·  Colima, Mexico", "Dec 2019 – Feb 2020"),
      bullet("Implemented engineering career paths, training plans, and evaluation processes."),
      bullet("Acted as Technical Lead, Engineer Advisor, and Product Owner across different projects."),
      bullet("Assisted leadership with culture improvements and onboarding processes."),

      // Sawyer Effect
      jobHeader("Technical Leader", "Sawyer Effect / United Virtualities  ·  Colima, Mexico", "Jul 2019 – Nov 2019"),
      bodyText("Led two major Salesforce Commerce Cloud (SFCC) projects for Godiva: legacy site support and new site migration."),
      bullet("Legacy: SFCC Site Genesis, Demandware Script, SASS, JavaScript."),
      bullet("New architecture: SFCC Storefront, Node/Express, RequireJS, SASS, JavaScript."),
      bullet("Mentored next generation of SFCC developers and created training structures."),

      // COO
      jobHeader("Chief Operations Officer", "MagmaLabs  ·  Colima, Mexico", "May 2018 – Jul 2019"),
      bodyText(
        "Managed all operational units: UX/Design, Product Management, eCommerce, Engineering, and Operational Excellence. " +
        "Drove strategic planning, quality management, and cross-functional career path integration."
      ),
      new Paragraph({ spacing: { before: 60, after: 20 }, children: [label("Results:")] }),
      bullet("NPS: negative → 99 with 100% client response rate."),
      bullet("eNPS: 10 → 95 in 6 months across the organization."),
      bullet("Implemented full OKR / KPI framework with goal cascading from company → units → teams → individuals."),
      bullet("Applied custom Top Grading methodology and Performance & Potential Matrix at full organizational scale."),
      bullet("Deployed Quality Management System and Operational Excellence frameworks across all business units."),

      // VP Eng
      jobHeader("Vice President of Engineering", "MagmaLabs  ·  Colima, Mexico", "Feb 2018 – May 2018"),
      bullet("Standardized technical processes across all engineering teams."),
      bullet("Led partnerships and client acquisition for new business development."),
      bullet("Improved engineering and product management career path frameworks."),

      // VP eComm
      jobHeader("Vice President of eCommerce", "MagmaLabs  ·  Colima, Mexico", "Aug 2016 – Feb 2018"),
      bodyText("Managed eCommerce business unit. Integrated eCommerce expertise into Engineering career paths. Led cross-functional collaboration across Business, Design, Finance, and Engineering."),
      bullet("Platforms: HTC, Magento, Shopify, Salesforce Commerce Cloud, Solidus, Spree."),
      bullet("Coordinated multi-functional teams across business, design, engineering, and finance."),

      // Crowd / Magma
      jobHeader("Software Engineer → Principal Consultant", "Crowd Interactive / MagmaLabs  ·  Colima, Mexico", "Aug 2010 – Aug 2016"),
      bodyText(
        "Six years of progressive growth across six internal levels — several of which did not exist until proposed and " +
        "designed: Apprentice → Jr → Mid → Sr → Sr Consultant → Sr Consultant L2 → Principal Consultant " +
        "(≈ Director-level IC, above Staff). Always active on 3+ concurrent projects. Grew from individual contributor " +
        "to organization-wide influence across technical, people, and cultural dimensions."
      ),
      new Paragraph({ spacing: { before: 60, after: 20 }, children: [label("Systems Built:")] }),
      bullet("Founded MagmaHackers Initiative (later BrightCoders) — technical excellence community that outlived his tenure."),
      bullet("Designed Engineering Career Paths from scratch for the entire organization."),
      bullet("Built 1-on-1 processes, performance metrics, coaching structures, and first version of custom Top Grading."),
      bullet("Introduced Radical Candor as cultural framework; trained the organization across Agile, Lean, Design Thinking, product methodologies, UX/CX, and QA."),
      new Paragraph({ spacing: { before: 60, after: 20 }, children: [label("Technical breadth:")] }),
      bullet("Backend: Ruby on Rails, architecture, performance optimization."),
      bullet("Frontend: Backbone.js → React → Angular (evolved with the industry)."),
      bullet("Also worked across: product, design/UX/CX, QA, project management, account management."),

      rule(),

      // ── FRAMEWORKS & METHODS ──────────────────────────────────────────────
      sectionHeading("Frameworks & Methods"),

      new Paragraph({
        spacing: { before: 120, after: 60 },
        children: [
          new TextRun({ text: "Care to Deliver", bold: true, size: 22, color: DARK, font: "Arial" })
        ]
      }),
      bodyText(
        "A framework for restoring movement and trust in teams. Most organizations try to deliver first and care later. " +
        "Care to Deliver reverses that: Care → Trust → Teamwork → Delivery. When teams share openly and care about each " +
        "other, trust grows and collaboration becomes natural. Delivery follows."
      ),

      new Paragraph({
        spacing: { before: 120, after: 60 },
        children: [
          new TextRun({ text: "Custom Top Grading", bold: true, size: 22, color: DARK, font: "Arial" })
        ]
      }),
      bodyText(
        "A 6-step hiring and promotion methodology adapted from the original 12-step Top Grading framework — " +
        "dramatically simplified for real organizational use. Key innovation: a scoring rubric where 5 = your team's " +
        "current average (not the world's), so hiring decisions always aim to improve the team standard. Includes " +
        "calibrated behavioral criteria across technical skills, work style, personal drive, and cultural fit."
      ),

      new Paragraph({
        spacing: { before: 120, after: 60 },
        children: [
          new TextRun({ text: "Performance & Potential Matrix", bold: true, size: 22, color: DARK, font: "Arial" })
        ]
      }),
      bodyText(
        "A 9-box talent review tool that converts subjective performance impressions into objective, values-aligned " +
        "assessments. Evaluates across four trait dimensions — Mastery, Impact, Growth & Recognition, and Performance " +
        "— each with precise behavioral definitions. Designed to be used by any leader without external facilitation."
      ),

      rule(),

      // ── PROFESSIONAL PHILOSOPHY ───────────────────────────────────────────
      sectionHeading("Professional Philosophy"),

      bodyText(
        "I believe the strongest teams are built on empathy, compassion, sharing, and trust. " +
        "Performance theater — measuring activity instead of value — destroys teams quietly. " +
        "The most dangerous organizational failure is mistaking motion for direction."
      ),
      bodyText(
        "On AI: I treat it as a cognitive collaborator, not a tool. AI is most valuable when integrated at the team " +
        "level — onboarded with the same progressive trust you would extend to any new teammate. " +
        "Access expands as trust grows. Judgment and accountability cannot be automated."
      ),
      bodyText(
        "I am looking for a fertile field for sowing — a company early enough in its growth that I can help build " +
        "the right cultural foundations before wrong habits take root. I have seen what becomes possible when teams " +
        "are built with care, and I know what it costs when they are not."
      ),

      rule(),

      // ── EDUCATION & LANGUAGES ─────────────────────────────────────────────
      sectionHeading("Education & Languages"),

      new Paragraph({
        spacing: { before: 120, after: 40 },
        children: [
          new TextRun({ text: "B.Sc. Computer Systems Engineering", bold: true, size: 21, color: DARK, font: "Arial" }),
          new TextRun({ text: "  ·  Instituto Tecnológico de Jiquilpan, Michoacán  ·  2008", size: 20, color: LIGHT, font: "Arial" })
        ]
      }),
      new Paragraph({
        spacing: { before: 60, after: 0 },
        children: [
          new TextRun({ text: "Languages: ", bold: true, size: 20, color: DARK, font: "Arial" }),
          new TextRun({ text: "Spanish (Native)  ·  English (Fluent)", size: 20, color: MED, font: "Arial" })
        ]
      }),

      new Paragraph({ spacing: { before: 120, after: 0 }, children: [] }),

    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('mumoc-cv.docx', buffer);
  console.log('CV written successfully.');
});
