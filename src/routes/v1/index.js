const usersController = require('../../controllers/v1/users-controller');
const productsController = require('../../controllers/v1/products-controller');


const createRoutesV1 = (app) => {
    app.get('/api/v1/users',usersController.getUsers);
    app.get('/api/v1/users/:userId',usersController.getUserById);
    app.get('/api/v1/products',productsController.getProducts);
    app.get('/api/v1/products/:productId',productsController.getProductById);
};

module.exports = createRoutesV1;