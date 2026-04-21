const fs = require('fs');
const path = require('path');
const { JSDOM } = require('/private/tmp/html-parser/node_modules/jsdom');

const basePath = '/Users/samuelsenigl/Desktop/web ubytovani';
const files = ['index.html', 'o-telci.html', 'tipy-na-vylety.html'];

const enDir = path.join(basePath, 'en');
if (!fs.existsSync(enDir)) {
    fs.mkdirSync(enDir, { recursive: true });
}

files.forEach(filename => {
    const filepath = path.join(basePath, filename);
    const html = fs.readFileSync(filepath, 'utf8');

    // Create a JSDOM instance for CZ
    const domCZ = new JSDOM(html);
    const docCZ = domCZ.window.document;

    // Create a JSDOM instance for EN
    const domEN = new JSDOM(html);
    const docEN = domEN.window.document;

    const processDoc = (doc, isEn) => {
        // 1. Language <html lang="...">
        doc.documentElement.setAttribute('lang', isEn ? 'en' : 'cs');

        // 2. Add OG tags
        const titleText = doc.querySelector('title') ? doc.querySelector('title').textContent : 'Ubytování Telč';
        const ogTitle = doc.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        ogTitle.setAttribute('content', titleText); // use page title

        const ogImage = doc.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        ogImage.setAttribute('content', isEn ? '../images/hero_room_custom.jpg' : 'images/hero_room_custom.jpg');

        const head = doc.querySelector('head');
        head.appendChild(ogTitle);
        head.appendChild(ogImage);

        // 3. Update Language Switcher
        // The original spans look like:
        // <span class="lang-btn active" data-lang="cs">CZ</span> |
        // <span class="lang-btn" data-lang="en">EN</span>
        doc.querySelectorAll('.lang-btn').forEach(btn => {
            const lang = btn.getAttribute('data-lang');
            const a = doc.createElement('a');
            a.className = btn.className;
            // maintain text
            a.textContent = btn.textContent;

            if (isEn) {
                if (lang === 'en') {
                    a.classList.add('active');
                    a.href = filename;
                    // e.g. /en/index.html -> href="index.html"
                } else {
                    a.classList.remove('active');
                    a.href = `../${filename}`;
                    // e.g. /en/index.html -> href="../index.html"
                }
            } else {
                if (lang === 'cs') {
                    a.classList.add('active');
                    a.href = filename;
                    // e.g. /index.html -> href="index.html"
                } else {
                    a.classList.remove('active');
                    a.href = `en/${filename}`;
                    // e.g. /index.html -> href="en/index.html"
                }
            }

            a.removeAttribute('data-lang');
            btn.replaceWith(a);
        });

        // 4. Update texts for EN
        if (isEn) {
            doc.querySelectorAll('[data-en]').forEach(el => {
                const enText = el.getAttribute('data-en');
                el.innerHTML = enText;
            });

            // 5. Fix relative paths for EN assets
            doc.querySelectorAll('link[href]').forEach(el => {
                const href = el.getAttribute('href');
                if (href && !href.startsWith('http') && !href.startsWith('//') && !href.startsWith('#')) {
                    el.setAttribute('href', '../' + href);
                }
            });
            doc.querySelectorAll('script[src]').forEach(el => {
                const src = el.getAttribute('src');
                if (src && !src.startsWith('http') && !src.startsWith('//')) {
                    el.setAttribute('src', '../' + src);
                }
            });
            doc.querySelectorAll('img[src]').forEach(el => {
                const src = el.getAttribute('src');
                if (src && !src.startsWith('http') && !src.startsWith('//') && !src.startsWith('data:')) {
                    el.setAttribute('src', '../' + src);
                }
            });

            // Fix navigation links to other pages if they are relative
            doc.querySelectorAll('a[href]').forEach(el => {
                const href = el.getAttribute('href');
                if (href && href.endsWith('.html') && !href.startsWith('http')) {
                    // stays relative, since both files are in the same /en folder!
                    // e.g. href="o-telci.html" is correct when both are inside /en.
                } else if (href && href.includes('.html#')) {
                    // index.html#u-seniglu stays relative
                } else if (href && href.startsWith('#')) {
                    // #cenik stays relative
                }
            });
        }

        // Clean up data-cs and data-en attributes in BOTH versions
        const csEls = Array.from(doc.querySelectorAll('[data-cs]'));
        csEls.forEach(el => el.removeAttribute('data-cs'));

        const enEls = Array.from(doc.querySelectorAll('[data-en]'));
        enEls.forEach(el => el.removeAttribute('data-en'));
    };

    processDoc(docCZ, false);
    processDoc(docEN, true);

    // Save
    fs.writeFileSync(filepath, domCZ.serialize());
    console.log(`Updated CZ: ${filepath}`);

    const enFilepath = path.join(enDir, filename);
    fs.writeFileSync(enFilepath, domEN.serialize());
    console.log(`Created EN: ${enFilepath}`);
});
