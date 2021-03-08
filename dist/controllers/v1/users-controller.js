"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getUsers = void 0;
const users_1 = require("../../data/users");
const getUsers = (req, res) => {
    res.send({
        page: 2,
        per_page: 6,
        total: 12,
        total_pages: 2,
        data: users_1.users,
        support: {
            url: 'https://reqres.in/#support-heading',
            text: 'To keep ReqRes free, contributions towards server costs are appreciated!',
        },
    });
};
exports.getUsers = getUsers;
const getUserById = (req, res) => {
    const { userId } = req.params;
    const index = users_1.users.findIndex((item) => item.id === parseInt(userId));
    if (index !== -1) {
        res.send({ data: users_1.users[index] });
    }
    else {
        res.status(404).send({});
    }
};
exports.getUserById = getUserById;
