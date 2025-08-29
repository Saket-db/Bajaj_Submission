export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const payload = req.body;
  if (!payload || !Array.isArray(payload.data)) {
    res.status(400).json({
      is_success: false,
      error: 'Invalid body: expected { "data": [ ... ] }'
    });
    return;
  }

  const USER_ID = 'john_doe_17091999';
  const EMAIL = 'john@xyz.com';
  const ROLL = 'ABCD123';

  const isIntegerString = (s) => /^-?\d+$/.test(s);
  const isAlphabeticString = (s) => /^[A-Za-z]+$/.test(s);
  const toAlternatingCaps = (chars) =>
    chars.map((ch, idx) => (idx % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase())).join('');

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

  res.status(200).json({
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
}
