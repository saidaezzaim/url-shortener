const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

// Route test
app.get('/', (req, res) => {
  res.send('Timestamp Microservice API');
});

// API endpoint
app.get('/api/:date?', (req, res) => {
  let dateString = req.params.date;

  if (!dateString) {
    const now = new Date();
    return res.json({
      unix: now.getTime(),
      utc: now.toUTCString()
    });
  }

  
  if (/^\d+$/.test(dateString)) {
    dateString = parseInt(dateString);
  }

  const date = new Date(dateString);

  if (date.toString() === "Invalid Date") {
    return res.json({ error: "Invalid Date" });
  }

  return res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
});

// 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
