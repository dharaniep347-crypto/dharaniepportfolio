# Skill logos and faster row playback
- [ ] Add official decorative skill logos across public skill listings without other design changes.
- [ ] Remove dots, move pause/play to row titles, and use one-second advances with 500ms scrolling.
- [ ] Verify logos, exclusive row movement and pause rules at 360px and 1440px.

# Requested CGPA, intro and row behaviour
- [x] Update confirmed CGPAs, current ring, semester chart and degree progress only within the B.Tech CGPA display.
- [x] Check existing five certificate images and report metadata and QR/ID warnings without duplicates; Employability date and NEXORA year await confirmation.
- [x] Fit intro title/subtitle at 320, 360, 390, 430, 768 and 1440px, preserving glow and visible Skip intro.
- [x] Auto-advance only the 60%-visible row nearest viewport centre, preserving pause controls and rules.
- [x] Verify 52 tests, exclusive Skills/Certificates movement, first-card re-entry, dialog pause and 360px CGPA layout without overflow or runtime errors.

# Education and certificates
- [x] Add locally editable education timeline, missing-result-safe CGPA chart and five uploaded certificates with category filters and accessible preview/download dialogs.
- [x] Add navigation/footer links and both sections for every viewer profile while preserving existing Journey rows.
- [x] Verify 37 tests and both sections at 360px, 768px and 1440px; filters, full certificate image, focus trap, Esc and JPEG download work without overflow or runtime errors.

# GitHub Pages deployment
- [x] Configure isolated static build, Bun workflow and repository paths while preserving the portfolio.
- [x] Verify 29 tests, resolved Pages config, portrait/resume packaging, and existing public/About/admin sign-in screens; document GitHub settings and static-host limitations.
- [ ] Run the Pages build/deployment on GitHub — blocked until repository variables and Pages settings are supplied by the owner; the full Pages build and signed-in admin flow are not verified here.

# Content update
- [x] Update the four projects in database and fallback content.
- [x] Show skill details and project category filters without changing the existing visual style.
- [x] Verify project details, filters, search and mobile overflow.

# About dialog
- [x] Separate portrait layout from the project banner, with an always-visible close button and internal scrolling.
- [x] Verify face visibility, text separation and scroll locking at 360px, 768px and 1440px.

# Circular portrait and links
- [x] Apply shared circular portrait framing and compact About layout.
- [x] Normalize public contact URLs and make every external link open safely in a new tab.
- [x] Verify photos, dialog bounds, scrolling and social-link tabs at 360px, 768px and 1440px.

# Black and red theme
- [x] Replace the global palette and all component/3D colours without changing layout, content or animation.
- [x] Check public pages and dialogs at 360px, 768px and 1440px; inspect intro, search, skills and admin sign-in colours.
- [ ] Verify signed-in admin tab colours visually — blocked because no admin account exists yet; shared theme and chart colours are updated.

# Midnight navy backgrounds
- [x] Update background tokens, page/hero fades, muted text, borders, scrollbar and browser bar without changing layout or animation.
- [x] Check public sections, intro/profile screens, dialogs and footer at 360px and 1440px; navy text contrast is at least 7.7:1 for muted text. Existing muted copy on the red contact card remains below 4.5:1 because red accents and text colours must stay unchanged.

# Global navy/red blend
- [x] Apply one fixed background behind all screens and translucent surface/navigation tokens; preserve layout, text, accents and animations.
- [x] Scroll every section at 360px, 768px and 1440px and check blended background continuity and text contrast; muted text over sampled red glow areas is at least 8.43:1. Existing red-button contrast exception remains unchanged.

# Midnight plum aurora
- [x] Apply plum background, grain, reduced-motion-safe drift, surface states and magenta scene rim light.
- [x] Verify whole page, intro/profile screens and About/project/contact dialogs at 360px and 1440px: no horizontal overflow or runtime errors, reduced motion disables drift, muted contrast at least 7.24:1 on conservative glow sample and 10.11:1 on dialogs; 17 regression tests pass. Preserved red-accent contrast exception remains unchanged.