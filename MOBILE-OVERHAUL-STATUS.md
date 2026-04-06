# justinadong.com Mobile Overhaul — Status

**Last updated:** 2026-03-28
**Target device:** Samsung Galaxy S23, Chrome (390px viewport)
**Deploy:** git push to jdong08/jdong08 → Vercel auto-deploy
**File:** `index.html` (single file, ~1600 lines, inline CSS + JS)

---

## Completed (all committed + pushed)

| Phase | Commit | What |
|-------|--------|------|
| 1 | 347e87e | CSS foundation: dvh units, safe area insets, tap highlight killed, viewport-fit=cover, input font 16px (no auto-zoom) |
| 2 | 71f5dfb | Responsive layout: panel min(292px,85vw), lightbox 35vh portrait / row on landscape, modal min(270px,80vw), resize debounced 250ms |
| 3 | fd1c468 | Touch targets: 44px minimum on all buttons/tags/dock/lock/heart, :active opacity feedback, prefers-reduced-motion, hint wraps |
| 4 | 00ac324 | Touch fix: removed fragile pointerdown/pointerup background handler, added touchend fallback on each node with double-fire guard, mobile zoom [0.4,4] |
| 5 | 44eb910 | Typography: mobile panel desc line-height 1.8, panel name 1.5rem, node labels 11px, dock text sizes up |
| 6 | 37262cf | Performance: mobile alphaDecay 0.06, fitAll 600ms, panToNodeMobile 350ms |

---

## Jay's Testing Feedback (2026-03-28)

"Some improvements but mostly still buggy."

Specific issues not yet identified — Jay needs to report what's still broken:
- [ ] Does tapping a node open the panel? (Phase 4 fix)
- [ ] Does tapping background close the panel?
- [ ] Does dragging work without opening panels?
- [ ] Does pinch-zoom work?
- [ ] Does panning work? (was broken by pointer-events:all, reverted in d07252d)
- [ ] Any new issues introduced?

---

## Prior Bugs Fixed Before This Overhaul

| Commit | What |
|--------|------|
| 3276643 | svg.on('click') — added e.target === svg.node() check so bubbled node clicks don't close panel |
| d07252d | Reverted pointer-events:all on node `<g>` — broke panning |

---

## Architecture Notes

- **D3 v7** force-directed graph with drag, zoom, click
- **D3 drag .clickDistance(10)** — finger wobble <10px fires synthetic click, >10px = real drag
- **Node tap detection (Phase 4):** D3's synthetic click is primary path. Touchend fallback catches Android cases where synthetic click doesn't fire. `_clickFired` flag prevents double-fire.
- **Background tap-to-close:** `svg.on('click', (e) => { if (e.target === svg.node()) closePanel(); })` — only fires on direct background tap, not bubbled node events
- **Panel:** Desktop = right sidebar (292px); Mobile (<600px) = bottom sheet (42dvh) with drag handle
- **Lightbox:** For output/doc nodes. Portrait mobile = stacked column; landscape = side-by-side row
- **touch-action: none** on SVG lets D3 zoom/pan control all touch events
- **touch-action: manipulation** on buttons prevents double-tap zoom

---

## Next Steps When Resuming

1. **Get specific bug reports from Jay** — what exactly is still broken on S23?
2. **Test with Playwright** at 390px viewport to see current state
3. Fix reported issues
4. Final S23 test by Jay

---

## Also Pending (from earlier in this session)

- **Build inspiration synthesis agent** — PRD at `Tessa/queued-builds/PRD_inspiration-synthesis.md`, Jay explicitly requested
- **Tax audit → Cosimo extension** — Jay asked if tax audit can be built into Cosimo rather than standalone
