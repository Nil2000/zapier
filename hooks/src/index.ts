import { PrismaClient } from "@prisma/client";
import express from "express";

//hooks.zapier.com/hooks/catch/:userId/:zapId

const app = express();
const client = new PrismaClient();
app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
  const { userId, zapId } = req.params;
  const body = req.body;

  await client.$transaction(async (tx) => {
    const run = await client.zapRun.create({
      data: {
        zapId: zapId,
        metaData: body,
      },
    });

    await client.zapRunOutbox.create({
      data: {
        zapRunId: run.id,
      },
    });
  });
  //store in db a new trigger
  // push into a queue (redis/kafka)
  res.status(201).json({
    message: "Webhook received successfully",
  });
});

app.listen(3000);
