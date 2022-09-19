import express from "express";
import routes from "./routes/routes";

import './database'

const app = express();

app.use(express.json());
app.use(routes);

app.listen(3333, () => console.log("Server is on PORT 3333"));
