"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yup_1 = require("yup");
const sharp_1 = require("sharp");
const imageFormats = [
    "avif",
    "dz",
    "fits",
    "gif",
    "heif",
    "input",
    "jpeg",
    "jpg",
    "jp2",
    "jxl",
    "magick",
    "openslide",
    "pdf",
    "png",
    "ppm",
    "raw",
    "svg",
    "tiff",
    "tif",
    "v",
    "webp",
];
const formatTypes = ["original", ...imageFormats];
const positions = [
    "top",
    "right top",
    "right",
    "right bottom",
    "bottom",
    "left bottom",
    "left",
    "left top",
    "center",
    "entropy",
    "attention",
];
const configSchema = (0, yup_1.object)({
    additionalResolutions: (0, yup_1.array)().of((0, yup_1.number)().positive()),
    exclude: (0, yup_1.array)().of((0, yup_1.mixed)().oneOf(imageFormats)),
    formats: (0, yup_1.array)().of((0, yup_1.mixed)().oneOf(formatTypes)),
    include: (0, yup_1.array)().of((0, yup_1.mixed)().oneOf(imageFormats)),
    sizes: (0, yup_1.array)().of((0, yup_1.object)({
        name: (0, yup_1.string)(),
        width: (0, yup_1.number)().positive(),
        height: (0, yup_1.number)().positive(),
        fit: (0, yup_1.mixed)().oneOf(Object.values(sharp_1.fit)),
        position: (0, yup_1.mixed)().oneOf(positions),
        withoutEnlargement: (0, yup_1.boolean)(),
    })),
    quality: (0, yup_1.number)().min(0).max(100),
});
exports.default = configSchema;
