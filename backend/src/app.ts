import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import taskRoutes from './routes/taskRoutes';

const app = express();

// Use CORS middleware to allow all origins
app.use(cors());

app.use(bodyParser.json());
app.use('/api', taskRoutes);

export default app;
