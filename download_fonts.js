const https = require('https');
const fs = require('fs');
const path = require('path');

const FONTS = [
  { name: 'Playfair Display', url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap' },
  { name: 'Montserrat', url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400&display=swap' }
];

const downloadFont = (url, name) => {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        let i = 0;
        let css = data;
        const matches = [...data.matchAll(/url\(([^)]+)\)/g)];
        let count = matches.length;
        if (count === 0) resolve(css);
        
        matches.forEach(match => {
          const fontUrl = match[1];
          const filename = `${name.replace(' ', '_')}_${i++}.woff2`;
          const filepath = path.join(__dirname, 'fonts', filename);
          
          https.get(fontUrl, (fontRes) => {
            const stream = fs.createWriteStream(filepath);
            fontRes.pipe(stream);
            stream.on('finish', () => {
              css = css.replace(fontUrl, `../fonts/${filename}`);
              count--;
              if (count === 0) resolve(css);
            });
          });
        });
      });
    });
  });
};

(async () => {
  let finalCss = '';
  for (const font of FONTS) {
    const css = await downloadFont(font.url, font.name);
    finalCss += css + '\n';
  }
  fs.writeFileSync(path.join(__dirname, 'css', 'fonts.css'), finalCss);
  console.log('Fonts downloaded!');
})();
