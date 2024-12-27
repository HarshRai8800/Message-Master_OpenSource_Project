import z from "zod"


const usernameValidation = z
.string()
.min(2,"username must be of 2 digits")
.max(20,"username must be under 20 digits")
.regex(/^[a-zA-Z0-9._-]{3,16}$/,"username invalid must not contain special chatracters"
)


export const signupSchema=z.object({
    username:usernameValidation,
    email:z.string().email({message:"email is not valid format"}).optional(),
    password:z.string().min(6,{message:"passowrd must be under 6 characters"}).optional()
})
