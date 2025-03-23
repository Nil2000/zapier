import { PrismaClient } from "@prisma/client";
import express from "express";

//hooks.zapier.com/hooks/catch/:userId/:zapId

const client = new PrismaClient();
const app = express();
app.use(express.json());
app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
  const { userId, zapId } = req.params;
  const body = req.body;

  //retain atomicity (0,1)
  await client.$transaction(async (tx) => {
    const run = await tx.zapRun.create({
      data: {
        zapId: zapId,
        metaData: body,
      },
    });

    await tx.zapRunOutbox.create({
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
