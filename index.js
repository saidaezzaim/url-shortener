const express = require('express');
const cors = require('cors');
const dns = require('dns');
const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let urlDatabase = {};
let urlCounter = 1;

function isValidUrl(inputUrl) {
  try {
    const parsedUrl = new URL(inputUrl);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

function verifyDomain(hostname, callback) {
  dns.lookup(hostname, (err, address) => {
    if (err) {
      callback(false);
    } else {
      callback(true);
    }
  });
}

app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  if (!isValidUrl(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  const parsedUrl = new URL(originalUrl);
  const hostname = parsedUrl.hostname;

  verifyDomain(hostname, (isValid) => {
    if (!isValid) {
      return res.json({ error: 'invalid url' });
    }

    // Check for existing URL
    for (let short in urlDatabase) {
      if (urlDatabase[short] === originalUrl) {
        return res.json({
          original_url: originalUrl,
          short_url: Number(short)
        });
      }
    }

    const shortUrl = urlCounter++;
    urlDatabase[shortUrl] = originalUrl;

    res.json({
      original_url: originalUrl,
      short_url: shortUrl
    });
  });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = parseInt(req.params.short_url);

  const originalUrl = urlDatabase[shortUrl];
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});

app.get('/', (req, res) => {
  res.json({
    message: 'URL Shortener Microservice',
    
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
