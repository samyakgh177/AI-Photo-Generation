import { z } from "zod";
export const trainModel = z.object({
    name: z.string(),
    type: z.enum(["Man", "Woman", "Other"]),
    age: z.number(),
    ethnicity: z.enum(["White", "Black", "Asian_American", "Middle_Eastern", "Native_American", "Pacific_Islander", "East_Asian", "Indian", "Other"]),
    eyeColor: z.enum(["Brown", "Blue", "Green", "Hazel", "Gray", "Other"]),
    bald: z.boolean(),
    image:z.array(z.string())
})

export const generateImage = z.object({
    prompt: z.string(),
    modelId:z.string()
})

export const GenerateImagesFromPack = z.object({
    prompt: z.string(),
    packId: z.string(),
    modelId: z.string()
})
