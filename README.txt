Moods.ai MVP v2 (Netlify-ready)
================================

What’s new in v2
----------------
- The site now hydrates **blotter**, **theses**, and **evidence** from `/data/feed.json`.
- You can update all investment explanations (passed filters, analyst consensus, trade construction) via JSON.

Files
-----
- index.html  → main site with JSON hydration + Netlify waitlist form
- thanks.html → post-submit page
- privacy.html→ short privacy notice
- data/feed.json → your daily ideas feed (edit this file to update contents)

Deploy (drag & drop)
--------------------
1) Create a free Netlify account: https://app.netlify.com/signup
2) Go to https://app.netlify.com/drop
3) Drag this entire folder or a ZIP of it
4) Netlify gives you a live URL instantly
5) Check **Forms** in the Netlify dashboard to see signups

Daily updates
-------------
- Replace data/feed.json with your new blotter/theses/evidence
- The page fetches `/data/feed.json?ts=Date.now()` to bust cache
