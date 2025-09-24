import aj from '../lib/arcjet.js';
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req, res, next) => {
  try{
    const decision = await aj.protect(req)
    if(decision.isDenied()){
      if(decision.reason.isRateLimit()){
        return res.status(429).send({message:'Rate limit exceeded. Please try again later.'});
      }
    else if(decision.reason.isBot()){
      return res.status(403).send({message:'Bot detected. Access denied.'});
    }else{
      return res.status(403).send({message:'Access denied by security policy.'});
    }
    }
    // check for spoofed bots 
    if(decision.results.some(inSpoofedBot)){
      return res.status(403).json({
        error: 'Spoofed bot detected. Access denied.',
        message: 'Malicious activity detected.'
      })
    } 
    next();
  }catch(error){
    console.log('Arcjet Protection Error: ', error);
    next();
  }
}