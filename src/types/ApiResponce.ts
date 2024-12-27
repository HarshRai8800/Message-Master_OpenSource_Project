  import { Messages } from "@/models/User"

  export default interface ApiResponce
  {
success:boolean,
message:string,
isAccesptingMessages?:boolean,
messages?:Array<Messages>,
updatedUser:{
  isAcceptingMessage:string
}

}