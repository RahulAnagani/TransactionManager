import mongoose from "mongoose";
let cached=global.mongoose;
const uri=process.env.URI as string;
if(!uri){
    throw new Error("Please provide the uri :)")
}
if(!cached){
    cached=global.mongoose={conn:null,promise:null}
}
export async function ConnectDb(){
    if(cached.conn)return cached.conn;
    if(!cached.promise){
        cached.promise=mongoose.connect(uri,{bufferCommands:false});
    }
    cached.conn=cached.promise;
    return cached.conn;
}