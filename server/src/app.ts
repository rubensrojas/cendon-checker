import express from 'express';
import { getRecentMatches } from './controllers/MatchesController';
import cors from 'cors';

require('dotenv').config();

const app = express();
const port = 8000;

app.use(cors());  // Enable CORS for all origins
app.use(express.json());

app.post('/api/recent-matches', async (req, res) => {
  getRecentMatches(req, res);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

