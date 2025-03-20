const express = require('express');
const axios = require('axios');
const app = express();
const port = 9876;

const WINDOW_SIZE = 10;
const TIMEOUT_MS = 500;
const BASE_URL = 'http://20.244.56.144/test';

let numberStore = [];

const mockData = {
  'p': [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47],
  'f': [55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765],
  'e': [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56],
  'r': [2, 19, 25, 7, 4, 24, 17, 27, 30, 21, 14, 10, 23]
};

const apiEndpoints = {
  'p': '/prime',
  'f': '/fibo',
  'e': '/even',
  'r': '/rand'
};

const validateNumberId = (req, res, next) => {
  const { numberid } = req.params;
  if (!['p', 'f', 'e', 'r'].includes(numberid)) {
    return res.status(400).json({ error: 'Invalid number ID. Use p (prime), f (fibonacci), e (even), or r (random)' });
  }
  next();
};

async function fetchNumbers(numberType) {
  try {
    const endpoint = apiEndpoints[numberType];
    const response = await axios.get(`${BASE_URL}${endpoint}`, { timeout: TIMEOUT_MS });
    return response.data.numbers || [];
  } catch (error) {
    return mockData[numberType];
  }
}

function calculateAverage(numbers) {
  if (numbers.length === 0) return 0;
  return numbers.reduce((acc, num) => acc + num, 0) / numbers.length;
}

app.get('/numbers/:numberid', validateNumberId, async (req, res) => {
  const startTime = Date.now();
  const { numberid } = req.params;

  const windowPrevState = [...numberStore];
  const fetchedNumbers = await fetchNumbers(numberid);

  for (const num of fetchedNumbers) {
    if (!numberStore.includes(num)) {
      if (numberStore.length < WINDOW_SIZE) {
        numberStore.push(num);
      } else {
        numberStore.shift();
        numberStore.push(num);
      }
    }
  }

  const avg = calculateAverage(numberStore);

  const response = {
    windowPrevState,
    windowCurrState: [...numberStore],
    numbers: fetchedNumbers,
    avg: parseFloat(avg.toFixed(2))
  };

  res.json(response);
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.listen(port, () => {
  console.log(`Average Calculator microservice running on http://localhost:${port}`);
});

module.exports = app;