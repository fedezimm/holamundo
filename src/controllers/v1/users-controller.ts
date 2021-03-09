
import { Request, Response } from 'express';
import Users from '../../db/schemas/user';
import bcrypt from 'bcrypt';
import { mongo } from 'mongoose';

const getUsers = async (req:Request, res:Response):Promise<void> => {
  const users = await Users.find().select({password: 0, __v: 0});
  res.send(users);
};

const getUserById = async (req:Request, res:Response):Promise<void> => {
  const { userId } = req.params;

  const user = await Users.findById(userId).select({password:0, __v:0});

  if(user){
    res.send(user);
  }else{
    res.status(404).send({});
  }
};


const createUser = async (req:Request, res:Response):Promise<void> =>{
  try{
    const {email, first_name, last_name, avatar, password} = req.body;
    const hash:string = await bcrypt.hash(password,15);
    const newUser = await Users.create({
      email,
      first_name,
      last_name,
      avatar,
      password:hash
    });
    res.send(newUser);
  }catch(e){
    if(e instanceof mongo.MongoError ){
      res
        .status(400)
        .send({
          code: e.code, 
          message: e.code ===11000? 'Duplicated value' : 'Error'
        });
      return;
    }
    res.status(500).send(e.message);
  }
};

export {
    getUsers,
    getUserById,
    createUser
}

