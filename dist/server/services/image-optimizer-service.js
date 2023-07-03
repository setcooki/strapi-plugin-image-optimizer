"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const sharp_1 = __importDefault(require("sharp"));
const file_1 = require("@strapi/utils/lib/file");
const image_manipulation_1 = __importDefault(require("@strapi/plugin-upload/server/services/image-manipulation"));
const settings_service_1 = __importDefault(require("./settings-service"));
const defaultFormats = ["original", "webp", "avif"];
const defaultInclude = ["jpeg", "jpg", "png"];
const defaultQuality = 80;
async function optimizeImage(file) {
    // Get config
    const { exclude = [], formats = defaultFormats, include = defaultInclude, sizes, additionalResolutions, quality = defaultQuality, } = settings_service_1.default.settings;
    const sourceFileType = file.ext.replace(".", "");
    if (exclude.includes(sourceFileType.toLowerCase()) ||
        !include.includes(sourceFileType.toLowerCase())) {
        return Promise.all([]);
    }
    const imageFormatPromises = [];
    formats.forEach((format) => {
        sizes.forEach((size) => {
            imageFormatPromises.push(generateImage(file, format, size, quality));
            if (additionalResolutions) {
                additionalResolutions.forEach((resizeFactor) => {
                    imageFormatPromises.push(generateImage(file, format, size, quality, resizeFactor));
                });
            }
        });
    });
    return Promise.all(imageFormatPromises);
}
async function generateImage(sourceFile, format, size, quality, resizeFactor = 1) {
    const resizeFactorPart = resizeFactor === 1 ? "" : `_${resizeFactor}x`;
    const sizeName = `${size.name}${resizeFactorPart}`;
    const formatPart = format === "original" ? "" : `_${format}`;
    return {
        key: `${sizeName}${formatPart}`,
        file: await resizeFileTo(sourceFile, sizeName, format, size, quality, resizeFactor),
    };
}
async function resizeFileTo(sourceFile, sizeName, format, size, quality, resizeFactor) {
    let sharpInstance = (0, sharp_1.default)();
    if (format !== "original") {
        sharpInstance = sharpInstance.toFormat(format);
    }
    sharpInstance = sharpAddFormatSettings(sharpInstance, { quality });
    sharpInstance = sharpAddResizeSettings(sharpInstance, size, resizeFactor, sourceFile);
    const imageHash = `${sizeName}_${sourceFile.hash}`;
    const filePath = (0, path_1.join)(sourceFile.tmpWorkingDirectory, imageHash);
    const newImageStream = sourceFile.getStream().pipe(sharpInstance);
    await writeStreamToFile(newImageStream, filePath);
    const metadata = await getMetadata((0, fs_1.createReadStream)(filePath));
    return {
        name: getFileName(sourceFile, sizeName),
        hash: imageHash,
        ext: getFileExtension(sourceFile, format),
        mime: getFileMimeType(sourceFile, format),
        path: sourceFile.path,
        width: metadata.width,
        height: metadata.height,
        size: metadata.size && (0, file_1.bytesToKbytes)(metadata.size),
        getStream: () => (0, fs_1.createReadStream)(filePath),
    };
}
function sharpAddFormatSettings(sharpInstance, { quality }) {
    // TODO: Add jxl when it's no longer experimental
    return sharpInstance
        .jpeg({ quality, progressive: true, force: false })
        .png({
        compressionLevel: Math.floor(((quality !== null && quality !== void 0 ? quality : 100) / 100) * 9),
        progressive: true,
        force: false,
    })
        .webp({ quality, force: false })
        .avif({ quality, force: false })
        .heif({ quality, force: false })
        .tiff({ quality, force: false });
}
function sharpAddResizeSettings(sharpInstance, size, factor, sourceFile) {
    const originalSize = !size.width && !size.height;
    const { width, height } = originalSize
        ? { width: sourceFile.width, height: sourceFile.height }
        : { width: size.width, height: size.height };
    return sharpInstance.resize({
        width: width ? width * factor : undefined,
        height: height ? height * factor : undefined,
        fit: size.fit,
        // Position "center" cannot be set since it's the default (see: https://sharp.pixelplumbing.com/api-resize#resize).
        position: size.position === "center" ? undefined : size.position,
        withoutEnlargement: size.withoutEnlargement,
    });
}
async function writeStreamToFile(sharpsStream, path) {
    return new Promise((resolve, reject) => {
        const writeStream = (0, fs_1.createWriteStream)(path);
        // Reject promise if there is an error with the provided stream
        sharpsStream.on("error", reject);
        sharpsStream.pipe(writeStream);
        writeStream.on("close", resolve);
        writeStream.on("error", reject);
    });
}
async function getMetadata(readStream) {
    return new Promise((resolve, reject) => {
        const sharpInstance = (0, sharp_1.default)();
        sharpInstance.metadata().then(resolve).catch(reject);
        readStream.pipe(sharpInstance);
    });
}
function getFileName(sourceFile, sizeName) {
    const fileNameWithoutExtension = sourceFile.name.replace(/\.[^\/.]+$/, "");
    return `${fileNameWithoutExtension}_${sizeName}`;
}
function getFileExtension(sourceFile, format) {
    return format === "original" ? sourceFile.ext : `.${format}`;
}
function getFileMimeType(sourceFile, format) {
    return format === "original" ? sourceFile.mime : `image/${format}`;
}
exports.default = () => ({
    ...(0, image_manipulation_1.default)(),
    generateResponsiveFormats: optimizeImage,
});
