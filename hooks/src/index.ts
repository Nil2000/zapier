import express from "express";

//hooks.zapier.com/hooks/catch/:userId/:zapId

const app = express();

app.post("/hooks/catch/:userId/:zapId", (req, res) => {
  const { userId, zapId } = req.params;
  //store in db a new trigger
  // push into a queue (redis/kafka)
});

app.listen(3000, () => {
  console.log("The server has started!!!");
});
