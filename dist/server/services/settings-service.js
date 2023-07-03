"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pluginId_1 = __importDefault(require("../utils/pluginId"));
class SettingsService {
    static get settings() {
        return strapi.config.get(`plugin.${pluginId_1.default}`);
    }
}
exports.default = SettingsService;
