import { Router } from "express";

const memberRouter = Router();

memberRouter.get("/", (request, response) => {
  return response.json({ error: "Aoba" })
})

export default memberRouter;