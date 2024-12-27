import z from "zod"


export const MessageSchema = z.object({
    content:z
    .string()
    .min(10,"content must be  min 10 characters")
    .max(500,"content must be under min 500 characters")
})