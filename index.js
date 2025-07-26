const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

// Route test
app.get('/', (req, res) => {
  res.send('Request Header Parser Microservice');
});

// API 
app.get('/api/whoami', (req, res) => {
  const ipaddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
  const language = req.headers['accept-language'];
  const software = req.headers['user-agent'];

  res.json({
    ipaddress: ipaddress,
    language: language,
    software: software
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
