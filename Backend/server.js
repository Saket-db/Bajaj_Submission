const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const isIntegerString = (s) => /^-?\d+$/.test(s);
const isAlphaString = (s) => /^[A-Za-z]+$/.test(s);

app.post('/bfhl', (req, res) => {
  const data = req.body?.data;

  if (!Array.isArray(data)) {
    return res.status(400).json({
      is_success: false,
      error: "'data' must be an array of strings"
    });
  }

  const user_id = 'john_doe_17091999';
  const email = 'john@xyz.com';
  const roll_number = 'ABCD123';

  const odd_numbers = [];
  const even_numbers = [];
  const alphabets = [];
  const special_characters = [];

  let sum = 0;
  const letterTokensInOrder = [];

  for (const item of data) {
    const s = String(item);

    if (isIntegerString(s)) {
      const n = parseInt(s, 10);
      if (Math.abs(n) % 2 === 0) {
        even_numbers.push(s);
      } else {
        odd_numbers.push(s);
      }
      sum += n;
    } else if (isAlphaString(s)) {
      alphabets.push(s.toUpperCase());
      letterTokensInOrder.push(s);
    } else {
      special_characters.push(s);
    }
  }

  const reversedLettersJoined = letterTokensInOrder.reverse().join('');
  let concat_string = '';
  for (let i = 0; i < reversedLettersJoined.length; i++) {
    const ch = reversedLettersJoined[i];
    if (/[A-Za-z]/.test(ch)) {
      concat_string += i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase();
    } else {
      concat_string += ch;
    }
  }

  return res.json({
    is_success: true,
    user_id,
    email,
    roll_number,
    odd_numbers,
    even_numbers,
    alphabets,
    special_characters,
    sum: String(sum),
    concat_string
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BFHL API listening on port ${PORT}`);
});
