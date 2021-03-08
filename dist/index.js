"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const v1_1 = __importDefault(require("./routes/v1"));
const port = 5000;
const app = express_1.default();
app.use(body_parser_1.urlencoded({ extended: false }));
app.use(body_parser_1.json());
v1_1.default(app);
app.use((req, res) => {
    res.status(404).send('Not Found');
});
app.listen(port, () => {
    console.log('running on ', port, ' port');
});
