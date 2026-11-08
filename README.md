# stackrank-review-bench
A tiny notes API (Express + SQLite) used as a fixed fixture for StackRank's AI code review test.

## Endpoints
- `GET /notes?page=N` list (20 per page)
- `GET /notes/search?q=` search titles
- `GET /notes/:id/export` download as Markdown
