import express from 'express';
import cors from 'cors';
import { config } from './config';
import diagramRoutes from './routes/diagram.routes';
import chatRoutes from './routes/chat.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(cors({
  origin: config.cors.origin
}));
app.use(express.json());

app.use('/api/diagrams', diagramRoutes);
app.use('/api/chat', chatRoutes);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
});