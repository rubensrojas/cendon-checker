import express from 'express';
import cors from 'cors';
import { getRecentMatches, refreshMatches } from './controllers/MatchesController';
import { getStatistics } from './controllers/StatisticsController';

require('dotenv').config();

const app = express();
const port = 8000;

app.use(cors());  // Enable CORS for all origins
app.use(express.json());

app.post('/api/matches/recent', async (req, res) => {
  getRecentMatches(req, res);
});

app.post('/api/matches/refresh', async (req, res) => {
  refreshMatches(req, res);
});

app.post('/api/statistics/overview', async (req, res) => {
  getStatistics(req, res);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

