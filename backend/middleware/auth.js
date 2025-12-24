import jwt from 'jsonwebtoken';
import User from '../models/userModels.js';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function authMiddleware(req,res,next)
{
   const authHeader = req.headers.authorization;
   if(!authHeader || !authHeader.startsWith('Bearer '))
   {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token is missing'
      });
   }

   const token = authHeader.split(' ')[1];
   // verify 
   try {
      const payload = jwt.verify(token,JWT_SECRET);
      const user = await User.findById(payload.id).select('_id');

      if(!user){
         return res.status(401).json({
         success: false,
         message: 'User not found'
        });
      }

      //req.user = user;
      req.user = { id: user._id.toString() };
      next();
   } catch (error) {
      console.error('JWT Verification failed ',error);
       return res.status(401).json({
         success: false,
         message: 'Token invaild or expired'
        });
   }
}
