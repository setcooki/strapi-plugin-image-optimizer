"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const services_1 = __importDefault(require("./services"));
exports.default = {
    config: config_1.default,
    services: services_1.default,
};
