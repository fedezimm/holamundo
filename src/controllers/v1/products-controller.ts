import { Request, Response } from 'express';
import Products from '../../db/schemas/product';
import {Types} from 'mongoose';
import {sendError , validateId} from '../../utils/responseUtils';


const getProducts = async (req:Request, res:Response): Promise<void> => {
  const products = await Products.find().populate({
    path:'user',
    select:{
      password:0,
      __v:0
    }
  }).select({__v:0});
  res.send(products);
};

const getProductById = async(req:Request, res:Response):Promise<void> => {
  try{
    const { productId } = req.params;
    
    validateId(productId);
    const product = await Products.findById(productId).populate({
      path:'user',
      select:{
        password:0,
        __v:0
      }
    }).select({__v:0});
    res.send(product); 

  }catch(e){
    sendError(res, e);
  }
};

const createProduct = async (req:Request, res:Response):Promise<void> => {
  try{
    const { name, year, price, description, user } = req.body;
    validateId(user);
    const product = await Products.create({
      name,
      year,
      price,
      description,
      user
    });
    res.send(product);
  }catch(e){
    sendError(res, e);
  }
};

const updateProduct = async (req:Request, res:Response):Promise<void> => {
  try{
    const id:string = req.params.productId;
    validateId(id);
    const { name, year, price, description, user } = req.body;
    if(user){
      validateId(user);
    }
    const updatedProduct = await Products.findByIdAndUpdate(id,{
      name,
      year,
      price,
      description,
      user
    });

    if (updatedProduct) {
      res.send({data: 'OK'});
    } else {
      res.status(404).send({});
    }
  }catch(e){
    sendError(res, e);
  }
};

const partialUpdateProduct = async(req:Request, res:Response):Promise<void> => {
  try{
    const id:string = req.params.productId;
    validateId(id);
    const { name, year, price, description, user } = req.body;
    if(user){
      validateId(user);
    }
    const productToUpdate = await Products.findById(id).select({__v:0});

    if (productToUpdate) {
      productToUpdate.name = name||productToUpdate.name;
      productToUpdate.year = year||productToUpdate.year;
      productToUpdate.price = price||productToUpdate.price;
      productToUpdate.description = description||productToUpdate.description;
      productToUpdate.user = user||productToUpdate.user;

      await productToUpdate.save();
      
      res.send({ data: productToUpdate });
    } else {
      res.status(404).send({});
    }
  }catch(e){
    sendError(res, e);
  }
};

const updateProductAndNotify = async(
  req:Request, 
  res:Response
  ):Promise<void> => {
  try{
    const id:string = req.params.productId;
    validateId(id);
    const { client, data } = req.body;
    const { name, year, price, description, user } = data;
    if(user){
      validateId(user);
    }
    
    const product = await Products.findById(id)
    
    if (product) {

      product.name = name || product.name;
      product.year = year || product.year;
      product.price = price || product.price;
      product.description = description || product.description;
      product.user = user || product.user;

      await product.save();

      res.send({ data: product, message: `Email sent to ${client}` });
    } else {
      res.status(404).send({});
    }
  }catch(e){
    sendError(res, e)
  }
};

const deleteProductById = async (req:Request, res:Response):Promise<void> => {
  try{
    const productId:string = req.params.productId;
    validateId(productId);

    const deleted = await Products.deleteOne({_id: Types.ObjectId(productId)});
    console.log("deleted",deleted);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (deleted.deletedCount! > 0){
      res.send({});
    }else{
      res.status(404).send({})
    }
  }catch(e){
    sendError(res, e);
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  partialUpdateProduct,
  updateProductAndNotify,
  deleteProductById
};

