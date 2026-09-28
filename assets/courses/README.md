# Banner iPASS 3–9

Seven final banners generated with the built-in Image Gen tool from the corresponding user-supplied iPASS flyers. Files: `ipass-3-banner.png` through `ipass-9-banner.png`. Native size: 1672 × 941 pixels (approximately 16:9). Mobile uses a right-focused 4:3 CSS crop of the same image.

The final banner for grade 3 was also used as the composition reference for grades 4–9. Each grade uses the student and wardrobe from its own flyer. Typography is rendered separately in HTML.

## Shared final prompt

Use case: ads-marketing. Create a polished landscape 16:9 website hero banner, ideally 1920x1080. The attached flyer is a visual reference for the student, wardrobe, cheerful sunlit school campus, sky blue palette and small colorful education props. Recompose it as a clean photographic hero, NOT a flyer. Preserve the reference student's recognizable appearance, age, clothing and gesture. Student waist-up on the RIGHT, head centered around x=76%, eyes y=32%, entire head and gesture inside canvas with generous margins. Student and props occupy rightmost 45%. LEFT 50% must be very light pale blue/white sky with subtle soft clouds and very faint campus blur, unobstructed negative space for HTML title. Beautiful bright blue sky, softly blurred modern white-and-blue school, greenery, natural daylight. Small stack of colorful blank books and cheerful yellow star near bottom right, restrained and premium, photoreal person with playful polished education-ad accents. REMOVE ALL flyer typography, logos, text, numbers, labels, handwritten marks, information panels, buttons and watermarks, including text on book covers and buildings. No readable text anywhere. One single wide hero image, no collage. Avoid oversized foreground hands, cropped faces or heads, extra fingers, clutter. This image must work with desktop text overlay on left and right-focused 4:3 mobile crop.

## Per-image instructions

- Grade 3: young girl with bangs, white school shirt and pink backpack, holding a plain cream book and giving a friendly thumbs-up, as in supplied flyer.
- Grades 4–9, one call per grade: This is iPASS {grade}. Image 1 is the source flyer: use its student and wardrobe. Image 2 is the approved banner composition and style to match exactly; replace its girl with the student from image 1. WIDE LANDSCAPE 16:9 mandatory, not portrait. NO TEXT.

Only final landscape assets are used by the website. No GitHub deployment was performed.

## Web optimization

The site now loads WebP (quality 82), not the source PNGs. Each grade has desktop variants at 1000px and 1672px wide, plus mobile 4:3 variants at 800px and 1200px wide. Mobile crops preserve the previous right-focused framing. The picture/srcset/sizes markup selects one suitable image based on viewport and pixel density. Hero images retain fetchpriority=high, explicit dimensions and async decoding.

Source PNG: 1.68–1.80 MB/image. Full desktop WebP: 79–98 KB; 1000px desktop: 43–53 KB. Mobile WebP: 41–49 KB at 800px, 66–82 KB at 1200px (decimal units).

Regenerate with `node scripts/optimize-banners.cjs` (requires sharp), then `node scripts/build-courses.mjs`. Keep original PNGs for future edits. Browser checks confirmed one WebP banner request per page at desktop DPR 1/2 and mobile DPR 2/3; no source PNG request. No deployment performed.
