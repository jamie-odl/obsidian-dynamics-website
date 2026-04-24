# Media Implementation Guide

Date: 2026-04-24  
Owner: Obsidian Dynamics Product + Engineering

## Objective

Use dynamic visuals that improve understanding and trust without harming performance or accessibility.

## Recommended Approach

- Prefer product-authentic captures over generic stock footage.
- Use short silent clips (6-12s) that demonstrate real workflow states.
- Keep motion scoped to high-value sections only.

## Priority Capture List

1. Homepage portfolio overview transition (Atlas status + cross-domain signal shift).
2. RelayPoint propagation chain transition (origin node to affected nodes).
3. SkyGrid watch area alert timeline (detection to action state).
4. Strait-Signal queue stress comparison (normal vs elevated corridor).

## Technical Spec

- Formats: `webm` primary, `mp4` fallback.
- Resolution: 1280x720 or 1440x810.
- Target bitrate: 1.2-2.5 Mbps.
- Duration: 6-12 seconds loop-safe.
- Audio: none.
- Poster image required for every clip.

## Performance Rules

- Above-the-fold: max 1 autoplay clip, muted, inline.
- Below-the-fold: lazy load on intersection.
- Always include poster image and fixed aspect ratio container to prevent layout shift.
- Do not place autoplay video in more than 3 sections per page.

## Accessibility Rules

- Respect `prefers-reduced-motion`; show poster instead of autoplay.
- Provide concise text alternative for every clip.
- Ensure motion does not block readability (overlay contrast > WCAG AA for text areas).

## Governance

- Every clip must map to a real product behavior.
- No generic stock loops as primary section backgrounds.
- Review quarterly for outdated UI captures and replace stale assets.
