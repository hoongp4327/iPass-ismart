# iPASS project instructions

- Work locally and keep the localhost preview available for review.
- Do not push, publish, or deploy to GitHub unless the user explicitly requests it. Editing, testing, or completing a template is not deployment authorization.
- Program detail pages iPASS 3–9 follow the supplied iLEAD 1 template. Keep existing iPASS course content in `data/ipass-courses.js`.
- Edit `templates/course.html` and `css/course-template.css`; regenerate the seven static pages with `node scripts/build-courses.mjs`.
- The user requested seven banners based on their iPASS flyers. Generated banners are stored in `assets/courses/` and linked through course data. Keep future artwork changes scoped to the user's request.
