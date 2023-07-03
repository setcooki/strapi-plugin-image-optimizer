declare const _default: {
    config: {
        default: {};
        validator(config: import("./models").Config): Promise<void>;
    };
    services: {
        settingsService: typeof import("./services/settings-service").default;
        imageOptimizerService: () => any;
    };
};
export default _default;
