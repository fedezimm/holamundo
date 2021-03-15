import { Request, Response } from 'express';
import Products from '../../db/schemas/product';
import {sendError , validateId} from '../../utils/responseUtils';


const getProducts = async (req:Request, res:Response): Promise<void> => {
  const products = await Products.find({
    user:req.session.userId
  }).populate({
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
    const product = await Products.findOne({
      _id: productId,
      user:req.session.userId
    }).populate({
      path:'user',
      select:{
        password:0,
        __v:0
      }
    }).select({__v:0});
    if(product){
      res.send(product);
    }else{
      res.status(401).send('You are not authorized to see this product')
    } 

  }catch(e){
    sendError(res, e);
  }
};

const createProduct = async (req:Request, res:Response):Promise<void> => {
  try{
    const {userId} =req.session;
    const { name, year, price, description } = req.body;
    validateId(userId);
    const product = await Products.create({
      name,
      year,
      price,
      description,
      user: userId
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
    const { name, year, price, description} = req.body;
    
    const updatedProduct = await Products.findOneAndUpdate(
      {
        _id:id,
        user:req.session.userId
      },
      {
        name,
        year,
        price,
        description,
        user:req.session.userId
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
    const { name, year, price, description} = req.body;
    const productToUpdate = await Products.findOne({
      _id: id,
      user:req.session.userId
    }).select({__v:0});

    if (productToUpdate) {
      productToUpdate.name = name||productToUpdate.name;
      productToUpdate.year = year||productToUpdate.year;
      productToUpdate.price = price||productToUpdate.price;
      productToUpdate.description = description||productToUpdate.description;

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
    const { name, year, price, description} = data;
    
    const product = await Products.findOne({id:id, user:req.session.userId})
    
    if (product) {

      product.name = name || product.name;
      product.year = year || product.year;
      product.price = price || product.price;
      product.description = description || product.description;

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

    const deleted = await Products.deleteOne({
      _id: productId, 
      user:req.session.userId
    });
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

