import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { PORT, JWT_SECRET } from './Keys/keys.js';
import { verifyToken } from './middleware/Index.js';
import routes from './routes/routes.js';

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Usar rutas
app.use('/', routes);

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));