"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobController_1 = require("../controllers/jobController");
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = express_1.default.Router();
router.post('/post-job', auth_1.default, jobController_1.createJob);
exports.default = router;
