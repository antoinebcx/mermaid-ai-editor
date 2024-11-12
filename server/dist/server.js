"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post('/api/diagrams', (req, res) => {
    const { diagram } = req.body;
    res.json({ success: true });
});
app.get('/api/diagrams', (req, res) => {
    res.json({ diagrams: [] });
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
