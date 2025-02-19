import express from "express";
import { trainModel, generateImage, GenerateImagesFromPack } from "common/types";
import { prismaClient } from "db";
import { s3,write,S3Client } from "bun";

const USER_ID = "123";

const PORT = process.env.PORT || 8080;
const app = express();
app.use(express.json());

app.post("/ai/training", async (req, res) => {

  const parsedBody = trainModel.safeParse(req.body);
  const images = req.body.images;

  if (!parsedBody.success) {
    res.status(411).json({
      message:"Input incorrect"
    })
    return 
  }
  const data = await prismaClient.model.create({
    data: {
      name: req.body.name,
      type: parsedBody.data.type,
      ethnicity: parsedBody.data.ethnicity,
      eyeColor: parsedBody.data.eyeColor,
      bald: parsedBody.data.bald,
      age: parsedBody.data.age,
      userId: USER_ID
    }
  })
  res.status(200).json({
    modelId: data.id
  })
})


app.post("/ai/generate", async (req, res) => {
  const parsedBody = generateImage.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(411).json({
      message: "Input incorrect"
    })
    return
  }

  const data = await prismaClient.outputImages.create({
    data: {
      prompt: parsedBody.data.prompt,
      userId: USER_ID,
      modelId: parsedBody.data.modelId,
      imageUrl: ""
    }
  })
  res.status(200).json({
    imageId: data.id
  })
})


app.post("/pack/generate", async(req, res) => {
  const parsedBody = GenerateImagesFromPack.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(411).json({
      message: "Input incorrect"
    })
    return
  }
  const prompts = await prismaClient.packPrompts.findMany({
    where: {
      packId: parsedBody.data.packId
    }
  })
  const images = await prismaClient.outputImages.createManyAndReturn({
    data: prompts.map((prompt) => ({
      prompt: prompt.prompt,
      userId: USER_ID,
      modelId: parsedBody.data.modelId,
      imageUrl: ""
    })),
  })
  res.status(200).json({
    imageIds: images.map((image) => image.id)
  })
})


app.get("/pack/bulk", async(req, res) => {


  const packs = await prismaClient.packs.findMany({})
  res.json({
    packs
  })

  
}) 


app.get("/image/bulk", async(req, res) => {
  const ids = req.query.images as string[];
  const limit = req.query.limit as string ?? "10";
  const offset = req.query.offset as string ?? "0"  ;


  const imagesData = await prismaClient.outputImages.findMany({
    where: {
      id: { in: ids },
      userId: USER_ID
    },
    skip: parseInt(offset),
    take: parseInt(limit)
  })
  res.json({
    images: imagesData
  })
})

app.post("/fal-ai/webhook/train", async(req, res) => {
  console.log(req.body);
  res.json({
    message: "Webhook received"
  })
})

app.post("/fal-ai/webhook/image", async(req, res) => {
  const requestId = req.body.request_id as string;
  await prismaClient.model.updateMany({
    where:{
      falAiRequestId: requestId
    },
    data: {
      trainingStatus: "Completed",
      tensorPath: req.body.tensor_path,
    }
  })


  res.json({
    message: "Webhook received"
  })
})

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});