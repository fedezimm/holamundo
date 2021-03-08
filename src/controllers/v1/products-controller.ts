import { Request, Response } from 'express';

import { products, Product } from '../../data/products';


const getProducts = (req:Request, res:Response):void => {
  const itemsPerPage:number = 6;
  const page:number = parseInt(req.query.page as string);
  const start:number = (page - 1) * itemsPerPage;
  const total:number = products.length;
  const end:number = page * itemsPerPage;
  res.send({
    page: page,
    per_page: itemsPerPage,
    total: total,
    total_pages: Math.ceil(total / itemsPerPage),
    data: products.slice(start, end > total ? total : end),
    support: {
      url: 'https://reqres.in/#support-heading',
      text:
        'To keep ReqRes free, contributions towards server costs are appreciated!',
    },
  });
};

const getProductById = (req:Request, res:Response):void=> {
  const { productId } = req.params;
  const index:number = products.findIndex((item) => item.id === parseInt(productId));
  if (index !== -1) {
    res.send({ data: products[index] });
  } else {
    res.status(404).send({});
  }
};

const createProduct = (req:Request, res:Response):void => {
  const { name, year, color, pantone_value }: Product = req.body;
  const newProduct:Product = {
    id: products.length + 1,
    name, //name: name
    year,
    color,
    pantone_value
  };
  products.push(newProduct);
  res.send(newProduct);
};

const updateProduct = (req:Request, res:Response):void => {
  const id:number = parseInt(req.params.productId);
  const { name, year, color, pantone_value }:Product = req.body;
  const index:number = products.findIndex((item) => item.id === id);
  if (index !== -1) {
    products[index] = {
      id,
      name,
      year,
      color,
      pantone_value
    };
    res.send({ data: products[index] });
  } else {
    res.status(404).send({});
  }
};

const partialUpdateProduct = (req:Request, res:Response):void => {
  const id:number = parseInt(req.params.productId);
  const { name, year, color, pantone_value }: Product = req.body;
  const index:number = products.findIndex((item) => item.id === id);
  if (index !== -1) {
    const product:Product = products[index];

    products[index] = {
      id: id,
      name: name || product.name,
      year: year || product.year,
      color: color || product.color,
      pantone_value: pantone_value || product.pantone_value,
    };
    res.send({ data: products[index] });
  } else {
    res.status(404).send({});
  }
};

const updateProductAndNotify = (req:Request, res:Response):void => {
  const id:number = parseInt(req.params.productId);
  const { client, data } = req.body;
  const { name, year, color, pantone_value }:Product = data;
  const index:number = products.findIndex((item) => item.id === id);
  if (index !== -1) {
    const product = products[index];

    products[index] = {
      id: id,
      name: name || product.name,
      year: year || product.year,
      color: color || product.color,
      pantone_value: pantone_value || product.pantone_value,
    };

    res.send({ data: products[index], message: `Email sent to ${client}` });
  } else {
    res.status(404).send({});
  }
};

const deleteProductById = (req:Request, res:Response):void => {
  const productId:number = parseInt(req.params.productId);
  const index:number = products.findIndex((item) => item.id === productId);

  if (index !== -1) {
    products.splice(index, 1);
    res.send({});
  } else {
    res.status(404).send({});
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

