import express from "express";

const app = express();

app.listen(8001, () => {
  console.log("server is running at port 8001");
});
