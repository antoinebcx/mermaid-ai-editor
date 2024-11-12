import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/diagrams', (req, res) => {
  const { diagram } = req.body;
  // here we could save to a database
  res.json({ success: true });
});

app.get('/api/diagrams', (req, res) => {
  // here we could fetch from a database
  res.json({ diagrams: [] });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});