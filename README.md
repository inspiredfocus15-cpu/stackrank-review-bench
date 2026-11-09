# stackrank-review-bench
A tiny notes API (Express + SQLite) used as a fixed fixture for StackRank's AI code review test.

## Endpoints
- `GET /notes?page=N` list (20 per page)
- `GET /notes/search?q=` search titles
- `GET /notes/:id/export` download as Markdown
- `PUT /notes/:id/tags` set tags (array of strings)
- `GET /notes/by-tag?tag=&limit=` notes with a tag
- `POST /notes/:id/share` create a public read-only link (`{ days }`, 1-30, default 7)
- `GET /shares` your share links; `DELETE /shares/:token` revoke one
- `GET /s/:token` public page for a shared note (rate limited)
