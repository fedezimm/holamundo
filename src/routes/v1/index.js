const usersController = require('../../controllers/v1/users-controller')

const createRoutesV1 = (app) => {
    app.get('/api/v1/users',usersController.getUsers);
    app.get('/api/v1/users/:userId',usersController.getUserById);
};

module.exports = createRoutesV1;