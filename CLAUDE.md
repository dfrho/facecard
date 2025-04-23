# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Build: `npm run build`
- Dev: `npm run dev`
- Start: `npm run start`
- Lint: `npm run lint`

## Code Style
- TypeScript with strict mode enabled
- Single quotes for strings
- 2 space indentation
- 100 character line length
- Semicolons required
- ES5 trailing commas
- Arrow function parentheses avoided when possible

## Conventions
- Use functional React components with TypeScript
- No React import needed for JSX
- Use Next.js API routes for server functionality
- Console logging restricted (only warn/error allowed)
- Prefer async/await over Promise chains
- Use descriptive variable names and TypeScript interfaces
- Follow Next.js App Router conventions for routing