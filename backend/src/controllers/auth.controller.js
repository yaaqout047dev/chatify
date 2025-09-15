import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const {fullName,email,password} = req.body;
  try{
    if(!fullName || !email || !password){
      return res.status(400).json({message: "All fields are required"});
    }
    if(password.length < 6){
      return res.status(400).json({message: "Password must be at least 6 characters"});
    }
    // check if emails valid : regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if(!emailRegex.test(email)){
      return res.status(400).json({message: "Invalid email"});
    }

    const user = await User.findOne({email});
    if(user){
      return res.status(400).json({message: "Email already exists"});
    }

    const salt  = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if(newUser){
      const savedUser = await newUser.save();
      generateToken(savedUser._id, res);

      res.status(201).json({_id: newUser._id, fullName: newUser.fullName, email: newUser.email,profilePic: newUser.profilePic});
    }else{
      return res.status(400).json({message: "Invalid user data"});
    }

  }catch(error){
    console.log("Error in signup controller: ", error);
    res.status(500).json({message: "Internal server error"});
  }
};