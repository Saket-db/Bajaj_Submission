import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());
app.use(express.json());

// >>> Add these two lines to resolve the /public path in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// >>> Serve /public as static files
app.use(express.static(path.join(__dirname, '..', 'public')));

const PORT = process.env.PORT || 3000;

// Customize identity
const USER_ID = 'john_doe_17091999';
const EMAIL = 'john@xyz.com';
const ROLL = 'ABCD123';

const isIntegerString = (s) => /^-?\d+$/.test(s);
const isAlphabeticString = (s) => /^[A-Za-z]+$/.test(s);
const toAlternatingCaps = (chars) =>
  chars.map((ch, idx) => (idx % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase())).join('');

app.post('/bfhl', (req, res) => {
  try {
    const payload = req.body;
    if (!payload || !Array.isArray(payload.data)) {
      return res.status(400).json({
        is_success: false,
        error: 'Invalid body: expected { "data": [ ... ] }'
      });
    }

    const input = payload.data.map(String);

    const odd_numbers = [];
    const even_numbers = [];
    const alphabets = [];
    const alphaCharsInOrder = [];
    const special_characters = [];
    let sum = 0;

    for (const token of input) {
      if (isIntegerString(token)) {
        const n = parseInt(token, 10);
        (n % 2 === 0 ? even_numbers : odd_numbers).push(token);
        sum += n;
      } else if (isAlphabeticString(token)) {
        for (const ch of token) {
          alphabets.push(ch.toUpperCase());
          alphaCharsInOrder.push(ch);
        }
      } else {
        special_characters.push(token);
      }
    }

    const concat_string = toAlternatingCaps(alphaCharsInOrder.reverse());

    return res.json({
      is_success: true,
      user_id: USER_ID,
      email: EMAIL,
      roll_number: ROLL,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: String(sum),
      concat_string
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ is_success: false, error: 'Internal server error' });
  }
});

// Optional: serve the UI on "/"
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
