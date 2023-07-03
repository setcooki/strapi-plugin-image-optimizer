import { Config } from "../models/config";
declare class SettingsService {
    static get settings(): Config;
}
export default SettingsService;
