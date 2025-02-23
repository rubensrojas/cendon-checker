import express from 'express';
import { getRecentMatches } from './controllers/MatchesController';

require('dotenv').config();

const app = express();
const port = 8000;

app.use(express.json());

app.post('/recent-matches', async (req, res) => {
  getRecentMatches(req, res);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

