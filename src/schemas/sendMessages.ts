import z from "zod"

export const sendMessages= z.object({

username:z.string(),
content:z.string().max(255)


})

