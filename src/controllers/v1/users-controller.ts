/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import Users, { User } from '../../db/schemas/user';
import Products from '../../db/schemas/product';
import { sendError, validateId } from '../../utils/responseUtils';

const getUsers = async (req: Request, res: Response): Promise<void> => {
  const users = await Users.find().select({ password: 0, __v: 0 });
  res.send(users);
};

const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    validateId(userId);
    const user = await Users.findById(userId).select({ password: 0, __v: 0 });

    if (user) {
      res.send(user);
    } else {
      res.status(404).send({});
    }
  } catch (e) {
    sendError(res, e);
  }
};

const deleteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    validateId(userId);
    const user = await Users.findByIdAndDelete(userId);
    if (user) {
      await Products.deleteMany({ user: user._id });
      res.send('Usuario eliminado y así también todos sus productos');
    } else {
      res.status(404).send({});
    }
  } catch (e) {
    sendError(res, e);
  }
};

const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, first_name, last_name, avatar, password } = req.body;
    const hash: string = await bcrypt.hash(password, 15);
    const newUser = await Users.create({
      email,
      first_name,
      last_name,
      avatar,
      password: hash,
    });
    res.send(newUser);
  } catch (e) {
    sendError(res, e);
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user: User | null = await Users.findOne({ email });
    if (!user) {
      throw { code: 404, message: 'User not found' };
    }
    const isOK: boolean = await bcrypt.compare(password, user.password);
    if (!isOK) {
      throw { code: 401, message: 'Invalid Password' };
    }

    const expiresIn = 60 * 60
    
    const token:string = jwt.sign(
      {
        userId: user._id, 
        email:user.email
      }, 
      process.env.JWT_SECRET!,
      {
        expiresIn:expiresIn
      }
    );

    res.send({ token, expiresIn: expiresIn });
  } catch (e) {
    sendError(res, e);
  }
};

export { getUsers, getUserById, createUser, deleteById, login };
