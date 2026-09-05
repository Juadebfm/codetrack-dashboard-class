# Memory

## Projects
| Name | What |
|---|---|
| **CDD-clone** | A React project designed to teach absolute beginners. |

## Preferences
- Keep React code beginner-friendly: favor clear names, small components, and straightforward control flow over clever abstractions.
- Maintain normal coding standards and security practices while keeping explanations accessible.
- Store all media and static assets in `public/`; reference them with root-relative paths such as `/hero.png`.
- The planned backend is Supabase. Use Supabase Auth for authentication and PostgreSQL public tables for application data; keep `sim-data/data.json` database-shaped so it can guide the future schema.
- Create and maintain `learning-notes.md` while building. Explain important React terms in plain language and include short, properly fenced Markdown code examples.
- Do not hallucinate, speculate, or guess. Before answering or making changes, check whether necessary context, information, or file access is missing; ask the user for clarification before proceeding when it is.
- Verify each material claim against the codebase, supplied documentation, or a current authoritative source. If a required fact is unavailable, say: "I do not know."
- Use correct React syntax and logical component flow.
- This project uses JavaScript, not TypeScript. Use the `prop-types` package to document and validate props for reusable React components.
- Treat PropTypes as development-time feedback, not as security validation for untrusted data.
- Dashboard rule: show “On track” when `daysLoggedThisMonth / daysElapsedThisMonth >= 0.6`. Calculate it from learning-log data; do not store it as a duplicate database field.
- Verify external facts using live, current-year authoritative sources before using them.
- Keep credentials and secrets confidential; never expose or save them in project notes or memory.
