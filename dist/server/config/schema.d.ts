declare const configSchema: import("yup").ObjectSchema<{
    additionalResolutions: number[];
    exclude: {}[];
    formats: {}[];
    include: {}[];
    sizes: {
        name?: string;
        width?: number;
        height?: number;
        fit?: {};
        position?: {};
        withoutEnlargement?: boolean;
    }[];
    quality: number;
}, import("yup").AnyObject, {
    additionalResolutions: "";
    exclude: "";
    formats: "";
    include: "";
    sizes: "";
    quality: undefined;
}, "">;
export default configSchema;
