import app from "./app";

const port = Number(process.env.PORT || 3333);
const host = "0.0.0.0";

app.listen(port, host, () => {
  console.log(`Server is on PORT ${port}`);
});
