import z from "zod"


export const verifySchema = z.object({
    code:z.string().length(4,"verification code must be of 4 digit")
})