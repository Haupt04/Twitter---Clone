import User from "../models/user.model.js"
import jwt from 'jsonwebtoken';


// Decodes the token of the user 

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token){
        return res.status(401).json({ error: "Unauthorized: No Token Provided"})
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (!decoded){
        return res.status(401).json({error: "Unauthorized: Invalid Token"})
    }

    // removes the password field and add it to req.user
    const user = await User.findById(decoded.userId).select("-password")

    if (!user){
        return res.status(404).json({ error: "User not found"})
    }

    req.user = user;
    next();

  } catch (error) {
    console.log("Error in protectedRoute Middleware", error.message)
    return res.status(500).json({error: "Protected Route Error"})
  }
}

