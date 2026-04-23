# Obsidian Dynamics Image Policy

## Purpose
Maintain a premium, consistent visual language across all Obsidian Dynamics pages while preventing visual overload and performance regressions.

## Approved Sources
- Primary: licensed stock sources (Unsplash, Pexels, Adobe Stock, Shutterstock) with commercial-safe usage terms.
- Preferred long-term: self-hosted image assets under `img/story/`.
- Do not embed third-party hotlinked image URLs in production pages.

## Placement Rules
- Maximum image strips per page: **1** on standard pages, **2** on flagship pages (`index`, `platform`, `atlas`) only when each strip has distinct purpose.
- Keep strips near top-third of page for context setting.
- Avoid adding images inside every section; preserve text-first flow for core conversion blocks.

## Visual Tone
- Style target: operational, strategic, and enterprise-grade.
- Subject matter: logistics infrastructure, ports, aircraft operations, control rooms, risk-analysis environments.
- Avoid generic lifestyle imagery, cartoon visuals, or abstract visuals with no operational context.

## Technical Standards
- Formats: prefer `webp`; use `avif` where available and tested.
- Required responsive setup: `srcset` + `sizes`.
- Baseline variants per story image:
  - `-640.webp`
  - `-1280.webp`
- File naming convention:
  - `img/story/<page>-<topic>-<width>.webp`
  - Example: `img/story/platform-maritime-1280.webp`

## Accessibility
- Every image requires descriptive `alt` text tied to business context.
- Decorative images should use empty alt text only when truly non-informational.
- Text overlays must meet contrast expectations against backgrounds.

## Governance Checklist (PR/Review)
- [ ] No external hotlinked image URLs.
- [ ] `srcset`/`sizes` present for each story image.
- [ ] Page image count follows placement rules.
- [ ] Imagery aligns with enterprise operational context.
- [ ] Alt text is meaningful and concise.
