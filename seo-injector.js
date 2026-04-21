const fs = require('fs');
const path = require('path');
const { JSDOM } = require('/private/tmp/html-parser/node_modules/jsdom');

const basePath = '/Users/samuelsenigl/Desktop/web ubytovani';
const domain = 'https://www.ubytovani-telc.cz';

const pages = [
    { file: 'index.html', path: '', enPath: 'en/' },
    { file: 'o-telci.html', path: 'o-telci.html', enPath: 'en/o-telci.html' },
    { file: 'tipy-na-vylety.html', path: 'tipy-na-vylety.html', enPath: 'en/tipy-na-vylety.html' }
];

const structuredDataTemplate = `
{
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "name": "Ubytování Telč | U Šeniglů & U kamenné zídky",
  "image": "${domain}/images/hero_room_custom.jpg",
  "description": "Klidné a exkluzivní ubytování v historickém centru Telče i v její klidnější části.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Náměstí Zachariáše z Hradce 11",
    "addressLocality": "Telč",
    "postalCode": "588 56",
    "addressCountry": "CZ"
  },
  "telephone": "+420775219362",
  "url": "${domain}",
  "priceRange": "600-1400 CZK"
}`;

const processFile = (filepath, isEn, pageInfo) => {
    if (!fs.existsSync(filepath)) return;
    const html = fs.readFileSync(filepath, 'utf8');
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    const head = doc.querySelector('head');

    // Remove existing canonical/hreflang to avoid duplicates if script runs multiple times
    doc.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang], meta[property^="og:"]').forEach(el => {
        // preserve the ones user manually added? We will dynamically recreate them all perfectly.
        el.remove();
    });

    const currentUrl = isEn ? `${domain}/${pageInfo.enPath}` : `${domain}/${pageInfo.path}`;
    const czUrl = `${domain}/${pageInfo.path}`;
    const enUrl = `${domain}/${pageInfo.enPath}`;

    // 1. Canonical tag
    const canonical = doc.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', currentUrl);
    head.appendChild(canonical);

    // 2. Hreflang tags
    const hrefLangCs = doc.createElement('link');
    hrefLangCs.setAttribute('rel', 'alternate');
    hrefLangCs.setAttribute('hreflang', 'cs');
    hrefLangCs.setAttribute('href', czUrl);
    head.appendChild(hrefLangCs);

    const hrefLangEn = doc.createElement('link');
    hrefLangEn.setAttribute('rel', 'alternate');
    hrefLangEn.setAttribute('hreflang', 'en');
    hrefLangEn.setAttribute('href', enUrl);
    head.appendChild(hrefLangEn);

    const hrefLangDef = doc.createElement('link');
    hrefLangDef.setAttribute('rel', 'alternate');
    hrefLangDef.setAttribute('hreflang', 'x-default');
    hrefLangDef.setAttribute('href', czUrl);
    head.appendChild(hrefLangDef);

    // 3. Open Graph Tags
    const titleText = doc.querySelector('title') ? doc.querySelector('title').textContent : 'Ubytování Telč';
    const descText = doc.querySelector('meta[name="description"]') ? doc.querySelector('meta[name="description"]').getAttribute('content') : '';

    const ogTags = [
        { property: 'og:title', content: titleText },
        { property: 'og:description', content: descText },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: currentUrl },
        { property: 'og:image', content: isEn ? `${domain}/images/hero_room_custom.jpg` : `${domain}/images/hero_room_custom.jpg` }
    ];

    ogTags.forEach(tag => {
        const meta = doc.createElement('meta');
        meta.setAttribute('property', tag.property);
        meta.setAttribute('content', tag.content);
        head.appendChild(meta);
    });

    // 4. Structured Data (JSON-LD) only on index
    if (pageInfo.file === 'index.html') {
        // remove existing schema if any
        doc.querySelectorAll('script[type="application/ld+json"]').forEach(el => el.remove());

        const script = doc.createElement('script');
        script.setAttribute('type', 'application/ld+json');

        let schemaContent = structuredDataTemplate;
        if (isEn) {
            schemaContent = schemaContent.replace('"Klidné a exkluzivní ubytování v historickém centru Telče i v její klidnější části."', '"Peaceful and exclusive accommodation in the historic center of Telč and its quieter outskirts."');
            schemaContent = schemaContent.replace('"Ubytování Telč | U Šeniglů & U kamenné zídky"', '"Telč Accommodation | U Šeniglů & U kamenné zídky"');
        }

        script.textContent = schemaContent;
        head.appendChild(script);
    }

    fs.writeFileSync(filepath, dom.serialize());
    console.log(`Updated SEO tags for: ${filepath}`);
};

pages.forEach(page => {
    const czPath = path.join(basePath, page.file);
    const enPath = path.join(basePath, 'en', page.file);

    processFile(czPath, false, page);
    processFile(enPath, true, page);
});
