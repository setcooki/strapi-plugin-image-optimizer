"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const settings_service_1 = __importDefault(require("./settings-service"));
const image_optimizer_service_1 = __importDefault(require("./image-optimizer-service"));
exports.default = {
    settingsService: settings_service_1.default,
    imageOptimizerService: image_optimizer_service_1.default,
};
