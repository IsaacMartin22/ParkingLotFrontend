### Command Execution
- **Do NOT ask the user to run commands** unless it is strictly necessary (e.g., a required manual step that cannot be automated, or a destructive operation that requires explicit user confirmation).
- Prefer making code and file changes directly rather than instructing the user to run CLI commands.
- The only exception is if a new dependency needs to be added and the user needs to run npm install. In that case prompt the user