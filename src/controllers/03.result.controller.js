import config,{prisma} from "../config/config.js";
import * as hist from "../services/04.history.service.js";
import jwt from "jsonwebtoken";
//x interview chat history.
export async function seeChatHistory(req,res){
    try{
    const {interviewId} = req.params;
    const intId = Number(interviewId)
    const userId = req.user.id
    const response = await hist.checkout(userId,intId);

    return res.json({
        response
    })
}
    catch(err){
        res.json({meddage:"something went wrong"});
    }
    
}


//x interview history of x user...

export async function seeInterview(req,res){

    try{
    const access = req.headers.authorization;
    let token = null;

    const userId = req.user.id
    const uId = Number(userId);
    const response = await hist.checkout2(uId,false);  //getting uncomplete interviews
    const response2 = await hist.checkout2(uId,true); //getting complete interviews


    return res.json({
        response,
        response2
    })
    }
    catch(err){
        res.json("something wend wrong!");
    }
};


