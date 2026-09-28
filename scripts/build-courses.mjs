import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data/ipass-courses.js'), 'utf8'), context);
const data = context.window.IPASS_COURSES;
const template = fs.readFileSync(path.join(root, 'templates/course.html'), 'utf8');
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const icons = {
  3: ['diversity_3', 'home', 'backpack', 'sports_soccer', 'groups', 'pets'],
  4: ['diversity_3', 'schedule', 'menu_book', 'family_restroom', 'location_city', 'pets'],
  5: ['travel_explore', 'home', 'backpack', 'park', 'fitness_center', 'flight_takeoff'],
  6: ['backpack', 'holiday_village', 'castle', 'sports_soccer', 'location_city', 'eco'],
  7: ['sports_soccer', 'nutrition', 'groups', 'theater_comedy', 'luggage', 'travel_explore'],
  8: ['music_note', 'holiday_village', 'castle', 'checkroom', 'eco', 'rocket_launch'],
  9: ['location_city', 'fitness_center', 'castle', 'travel_explore', 'forum', 'rocket_launch']
};
const symbol = name => `<span class="material-symbols-rounded" aria-hidden="true">${name}</span>`;

for (const level of data.levels) {
  for (const course of level.courses) {
    const grade = course.grade;
    const split = course.slogan.indexOf('–');
    // Banner paths relative to the site root; small variants avoid oversized downloads.
    const banner = course.banner;
    const values = {
      title: escape(course.title), grade, description: escape(course.slogan + '. ' + course.fit),
      levelName: escape(level.name.toLowerCase()), target: escape(level.target),
      sloganLead: escape(split < 0 ? course.slogan : course.slogan.slice(0, split).trim()),
      sloganRest: escape(split < 0 ? '' : course.slogan.slice(split + 1).trim()), fit: escape(course.fit),
      banner: banner?.desktop
        ? `<picture class="lp-banner-picture">${banner.mobile ? `<source media="(max-width: 600px)" ${banner.mobileSmall ? `srcset="../../${escape(banner.mobileSmall)} 800w, ../../${escape(banner.mobile)} 1200w" sizes="100vw"` : `srcset="../../${escape(banner.mobile)}"`} width="1200" height="900">` : ''}<img class="lp-hero-banner" src="../../${escape(banner.desktop)}" ${banner.desktopSmall ? `srcset="../../${escape(banner.desktopSmall)} 1000w, ../../${escape(banner.desktop)} 1672w" sizes="(max-width: 860px) 100vw, 1000px"` : ''} width="1672" height="941" alt="${escape(banner.alt || '')}" fetchpriority="high" decoding="async"></picture>`
        : `<div class="lp-banner-placeholder" role="img" aria-label="Banner mẫu cho ${escape(course.title)}"><div class="lp-banner-placeholder__label"><span>BANNER MẪU</span><strong>${escape(course.title)}</strong><span>Hình ảnh sẽ được cập nhật</span></div></div>`,
      topics: course.topics.map((topic, i) => `      <li class="lp-topic"><span class="lp-topic-icon lp-tone-${i + 1}" aria-hidden="true">${symbol(icons[grade][i])}</span><span class="lp-topic-text">${escape(topic.text)}</span></li>`).join('\n'),
      benefits: course.benefits.map((text, i) => `      <li class="lp-benefit"><span class="lp-benefit-icon lp-benefit-icon--${i + 1}" aria-hidden="true">${symbol(['menu_book', 'forum', 'bar_chart', 'emoji_events'][i])}</span><span class="lp-benefit-text">${escape(text)}</span></li>`).join('\n'),
      siblings: `<nav class="lp-siblings lp-container" aria-label="Các chương trình iPASS"><p>Xem chương trình lớp khác</p><div>${data.levels.flatMap(l => l.courses).map(other => `<a href="../ipass-${other.grade}/"${other.grade === grade ? ' aria-current="page"' : ''}>${escape(other.title)}</a>`).join('')}</div></nav>`
    };
    const html = template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      if (!(key in values)) throw new Error(`Unknown template field: ${key}`);
      return values[key];
    });
    fs.writeFileSync(path.join(root, `chuong-trinh/ipass-${grade}/index.html`), html);
    console.log(`Built iPASS ${grade}`);
  }
}
