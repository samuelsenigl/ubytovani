const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const basePath = __dirname;
const domain = 'https://www.ubytovani-telc.cz';

const pages = [
    { file: 'index.html', path: '', enPath: 'en/' },
    { file: 'o-telci.html', path: 'o-telci.html', enPath: 'en/o-telci.html' },
    { file: 'tipy-na-vylety.html', path: 'tipy-na-vylety.html', enPath: 'en/tipy-na-vylety.html' }
];

const structuredDataTemplateCs = `[
  {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "name": "Ubytování U Šeniglů",
    "image": "${domain}/images/hero_room_custom.webp",
    "description": "Klidné a exkluzivní ubytování v historickém domě přímo v centru Telče.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Náměstí Zachariáše z Hradce 11",
      "addressLocality": "Telč",
      "postalCode": "588 56",
      "addressCountry": "CZ"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 49.18430280724311,
      "longitude": 15.453190352053971
    },
    "telephone": "+420775219362",
    "url": "${domain}/#u-seniglu",
    "sameAs": "https://maps.app.goo.gl/hWVy6Y9HqUEdNpVV8",
    "priceRange": "600-1400 CZK",
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Wi-Fi zdarma",
        "value": "True"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Kuchyňka",
        "value": "True"
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "name": "Ubytování U kamenné zídky",
    "image": "${domain}/images/ukamennezidky/ukamennezidky_dum.webp",
    "description": "Novější penzion v okrajové, klidné části města se zahradou stvořený pro tichý odpočinek.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "28. října 648",
      "addressLocality": "Telč",
      "postalCode": "588 56",
      "addressCountry": "CZ"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 49.17950652410399,
      "longitude": 15.445225740044041
    },
    "telephone": "+420775219362",
    "url": "${domain}/#u-kamenne-zidky",
    "sameAs": "https://maps.app.goo.gl/2LqkcbQNacHyXwdC8",
    "priceRange": "600-1400 CZK",
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Wi-Fi zdarma",
        "value": "True"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Kuchyňka",
        "value": "True"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Zahrada k dispozici",
        "value": "True"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Parkování u domu",
        "value": "True"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Domácí mazlíčci povoleni",
        "value": "True"
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Kdy je možný příjezd a odjezd?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Příjezd (check-in) je standardně po 14:00, odjezd (check-out) do 10:00. Ostatní časy po individuální dohodě."
        }
      },
      {
        "@type": "Question",
        "name": "Jsou povoleni domácí mazlíčci?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ano, domácí mazlíčci jsou povoleni za příplatek 100 Kč / noc."
        }
      },
      {
        "@type": "Question",
        "name": "Jak je to s nočním klidem a večírky?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Noční klid je vyžadován od 21:00 do 8:00. Ubytování není určeno pro večírky či rozlučky se svobodou."
        }
      },
      {
        "@type": "Question",
        "name": "Jak je to s parkováním v centru?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Lze přijet na náměstí, ubytovat se a pak přeparkovat na jedno z parkovišť, které je pár minut chůze od náměstí. V letní sezóně je někdy potřeba se při vjezdu na náměstí prokázat ubytovacím poukazem."
        }
      },
      {
        "@type": "Question",
        "name": "Poskytujete snídaně?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "K dispozici je kuchyňka pro přípravu snídaně. Nebo na náměstí vám můžeme doporučit například Bistro Café Friends (2min chůze) nebo Café Telč (3min chůze)."
        }
      }
    ]
  }
]`;

const structuredDataTemplateEn = `[
  {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "name": "Accommodation U Šeniglů",
    "image": "${domain}/images/hero_room_custom.webp",
    "description": "Peaceful and exclusive accommodation in a historic house right in the center of Telč.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Náměstí Zachariáše z Hradce 11",
      "addressLocality": "Telč",
      "postalCode": "588 56",
      "addressCountry": "CZ"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 49.18430280724311,
      "longitude": 15.453190352053971
    },
    "telephone": "+420775219362",
    "url": "${domain}/en/#u-seniglu",
    "sameAs": "https://maps.app.goo.gl/hWVy6Y9HqUEdNpVV8",
    "priceRange": "600-1400 CZK",
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Free Wi-Fi",
        "value": "True"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Kitchen",
        "value": "True"
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "name": "Accommodation U kamenné zídky",
    "image": "${domain}/images/ukamennezidky/ukamennezidky_dum.webp",
    "description": "A newer guesthouse in a quiet, marginal part of the town with a garden, created for quiet relaxation.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "28. října 648",
      "addressLocality": "Telč",
      "postalCode": "588 56",
      "addressCountry": "CZ"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 49.17950652410399,
      "longitude": 15.445225740044041
    },
    "telephone": "+420775219362",
    "url": "${domain}/en/#u-kamenne-zidky",
    "sameAs": "https://maps.app.goo.gl/tu77Zuettk6RPc3V9",
    "priceRange": "600-1400 CZK",
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Free Wi-Fi",
        "value": "True"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Kitchen",
        "value": "True"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Garden",
        "value": "True"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Parking at the house",
        "value": "True"
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Pets allowed",
        "value": "True"
      }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "When is check-in and check-out?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Standard check-in is after 14:00, check-out until 10:00. Other times by individual agreement."
        }
      },
      {
        "@type": "Question",
        "name": "Are pets allowed?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, pets are allowed for an additional fee of 100 CZK / night."
        }
      },
      {
        "@type": "Question",
        "name": "What about night quiet time and parties?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Night quiet time is required from 21:00 to 8:00. The accommodation is not suitable for parties or bachelor(ette) events."
        }
      },
      {
        "@type": "Question",
        "name": "What about parking in the center?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can drive to the square, check in, and then re-park at one of the parking lots a few minutes' walk from the square (some are paid, some are free). In the summer season, you may sometimes need to show your accommodation voucher when entering the square."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide breakfast?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A kitchen is available for preparing your own breakfast. Or on the square we can recommend, for example, Bistro Café Friends (2 min walk) or Café Telč (3 min walk)."
        }
      }
    ]
  }
]`;

const processFile = (filepath, isEn, pageInfo) => {
    if (!fs.existsSync(filepath)) return;
    const html = fs.readFileSync(filepath, 'utf8');
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    const head = doc.querySelector('head');

    // Remove existing canonical/hreflang to avoid duplicates if script runs multiple times
    doc.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang], meta[property^="og:"]').forEach(el => {
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
        { property: 'og:image', content: `${domain}/images/social.png` }
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

        const schemaContent = isEn ? structuredDataTemplateEn : structuredDataTemplateCs;

        script.textContent = schemaContent;
        head.appendChild(script);
    }

    // Output clean html without jsdom artifacts
    fs.writeFileSync(filepath, dom.serialize());
    console.log(`Updated SEO tags for: ${filepath}`);
};

pages.forEach(page => {
    const czPath = path.join(basePath, page.file);
    const enPath = path.join(basePath, 'en', page.file);

    processFile(czPath, false, page);
    processFile(enPath, true, page);
});
