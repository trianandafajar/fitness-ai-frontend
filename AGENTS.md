<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:code-minimalism-rules -->

# Keep changes minimal and to the point

Write only the code required to complete the requested task.

Rules:

* Do not add unrelated features, abstractions, helpers, utilities, comments, tests, files, dependencies, or refactors unless they are required.
* Do not rewrite working code without a clear reason.
* Do not change formatting or structure outside the affected area.
* Prefer the smallest correct change over a broader or more "clean" redesign.
* Reuse existing patterns and utilities before creating new ones.
* Do not add fallback logic, compatibility layers, or defensive code for hypothetical cases unless the task requires it.
* Do not introduce new dependencies when the task can be solved with the existing stack.
* Keep implementations direct and easy to review.
* When fixing a bug, fix the root cause with the smallest practical patch.
* When requirements are clear, implement them directly without adding speculative improvements.

<!-- END:code-minimalism-rules -->

<!-- BEGIN:verification-rules -->

# Use lightweight verification

When checking or validating changes, use the simplest relevant method.

Rules:

* Do not run a full production build unless explicitly requested or strictly necessary.
* Prefer targeted checks such as type checking, linting a specific file, running a focused test, or manually inspecting the affected code.
* Do not use expensive or broad validation commands when a smaller check is sufficient.
* Only run commands related to the changed area.
* Avoid rebuilding the entire application for small fixes.
* If no lightweight automated check exists, review the affected code directly instead of introducing unnecessary tooling.

<!-- END:verification-rules -->
