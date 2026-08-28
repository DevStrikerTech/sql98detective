Based on an analysis of the repository name sql98detective and the developer profile of DevStrikerTech, this project is an interactive SQL-based mystery game. It is likely inspired by "The SQL Murder Mystery," designed to teach SQL querying skills (like JOIN, WHERE, and subqueries) through a narrative detective story, potentially set in 1998 (suggested by the "98" in the title).
Project Analysis
Purpose: An educational tool or portfolio piece that challenges users to solve a crime by investigating a database.
Likely Components: A SQLite/SQL database file containing "police reports," "witnesses," "interviews," and "drivers_licenses," along with a README.md that serves as the starting point for the investigation.
Target Audience: SQL beginners, students, or recruiters looking to evaluate a candidate's data manipulation skills.
Strengths: Gamified learning is highly engaging and provides a clear "win state" for the learner.
Suggested Improvement to README.md
Suggestion: Add a Mermaid.js Entity-Relationship Diagram (ERD)
While the mystery prompt provides the story, users often get stuck because they cannot "see" the database structure. Adding a visual schema diagram directly in the README.md using GitHub's native Mermaid.js support is a small change with a high impact on usability.
Why this is useful:
Reduces Friction: Users won't have to run PRAGMA table_info() or DESCRIBE commands for every table just to find foreign keys.
Improves Learning: It teaches users how to visualize relationships before writing complex JOIN statements.
Professionalism: It makes the repository look like a production-ready data project.

## Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DevStrikerTech/sql98detective.git
   cd sql98detective
   ```[[1](https://www.google.com/url?sa=E&q=https%3A%2F%2Fgithub.com%2FDevStrikerTech%2Fsql98detective)]

2. **Install dependencies:**
   ```bash
   npm install
   ```[[1](https://www.google.com/url?sa=E&q=https%3A%2F%2Fgithub.com%2FDevStrikerTech%2Fsql98detective)]

3. **Start the development server:**
   ```bash
   npm run dev
   ```[[1](https://www.google.com/url?sa=E&q=https%3A%2F%2Fgithub.com%2FDevStrikerTech%2Fsql98detective)]

### Useful checks:

```bash
npm run lint
npm run build
