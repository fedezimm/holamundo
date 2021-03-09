import { Request, Response } from 'express';
import Products from '../../db/schemas/product';


const getProducts = async (req:Request, res:Response): Promise<void> => {
  const products = await Products.find();
  res.send(products);
};

const getProductById = async(req:Request, res:Response):Promise<void> => {
  const { productId } = req.params;
  const product = await Products.findById(productId);
  res.send(product); 
};

const createProduct = async (req:Request, res:Response):Promise<void> => {
  const { name, year, price, description, user } = req.body;
  const product = await Products.create({
    name,
    year,
    price,
    description,
    user
  });
  res.send(product);
};

const updateProduct = async (req:Request, res:Response):Promise<void> => {
  const id:string = req.params.productId;
  const { name, year, price, description, user } = req.body;
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
};

const partialUpdateProduct = async(req:Request, res:Response):Promise<void> => {
  const id:string = req.params.productId;
  const { name, year, price, description, user } = req.body;
  const productToUpdate = await Products.findById(id);

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
};

// const updateProductAndNotify = (req:Request, res:Response):void => {
//   const id:number = parseInt(req.params.productId);
//   const { client, data } = req.body;
//   const { name, year, color, pantone_value }:Product = data;
//   const index:number = products.findIndex((item) => item.id === id);
//   if (index !== -1) {
//     const product = products[index];

//     products[index] = {
//       id: id,
//       name: name || product.name,
//       year: year || product.year,
//       color: color || product.color,
//       pantone_value: pantone_value || product.pantone_value,
//     };

//     res.send({ data: products[index], message: `Email sent to ${client}` });
//   } else {
//     res.status(404).send({});
//   }
// };

// const deleteProductById = (req:Request, res:Response):void => {
//   const productId:number = parseInt(req.params.productId);
//   const index:number = products.findIndex((item) => item.id === productId);

//   if (index !== -1) {
//     products.splice(index, 1);
//     res.send({});
//   } else {
//     res.status(404).send({});
//   }
// };

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  partialUpdateProduct,
  //updateProductAndNotify,
  //deleteProductById
};

