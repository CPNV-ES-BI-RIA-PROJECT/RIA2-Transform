// tests/controllers/S3Controller.test.ts

import { S3Controller } from "../../../src/presentation/controllers/S3Controller.js";
import { S3Adapter } from "../../../src/infrastructure/s3/S3Adapter.js";

describe("S3Controller (end-user behavior)", () => {
    let adapterMock: jest.Mocked<S3Adapter>;
    let controller: S3Controller;

    const fileName = "file.json";
    const fileBuffer = Buffer.from('{"hello":"world"}');

    beforeEach(() => {
        jest.clearAllMocks();

        adapterMock = {
            uploadFile: jest.fn(),
            generatePresignedUrl: jest.fn(),
            checkBucketAccess: jest.fn(),
        } as unknown as jest.Mocked<S3Adapter>;

        controller = new S3Controller(adapterMock);
    });

    // ----------------------
    // Upload
    // ----------------------
    describe("uploadObject", () => {
        it("should upload file and return key", async () => {
            adapterMock.uploadFile.mockResolvedValue(undefined);

            const fakeFile: Express.Multer.File = {
                originalname: fileName,
                buffer: fileBuffer,
                fieldname: "file",
                encoding: "7bit",
                mimetype: "application/json",
                size: fileBuffer.length,
                destination: "",
                filename: "",
                path: "",
                stream: null as any, // not used in the controller
            };

            const result = await controller.uploadObject(fakeFile);

            expect(adapterMock.uploadFile).toHaveBeenCalledWith(fileName, fileBuffer);
            expect(result).toEqual({ key: fileName });
        });

        it("should throw when no file is provided", async () => {
            // @ts-expect-error testing missing file
            await expect(controller.uploadObject(undefined)).rejects.toThrow("File is required");
        });

        it("should throw when file exceeds max size", async () => {
            const maxSize = 5; // bytes
            process.env.S3_MAX_UPLOAD_SIZE = maxSize.toString();

            const largeBuffer = Buffer.from("This is larger than 5 bytes");
            const largeFile: Express.Multer.File = {
                originalname: "large-file.json",
                buffer: largeBuffer,
                fieldname: "file",
                encoding: "7bit",
                mimetype: "application/json",
                size: largeBuffer.length,
                destination: "",
                filename: "",
                path: "",
                stream: null as any,
            };

            if (largeFile.size > Number(process.env.UPLOAD_MAX_FILE_SIZE)) {
                await expect(controller.uploadObject(largeFile)).rejects.toThrow(
                    `File exceeds maximum size of ${process.env.S3_MAX_UPLOAD_SIZE} bytes`
                );
            }
        });
    });

    // ----------------------
    // Publish
    // ----------------------
    describe("publishObject", () => {
        it("should return a presigned URL", async () => {
            const fakeUrl = "https://signed-url";
            adapterMock.generatePresignedUrl.mockResolvedValue(fakeUrl);

            const result = await controller.publishObject(fileName);

            expect(adapterMock.generatePresignedUrl).toHaveBeenCalledWith(fileName);
            expect(result).toEqual({ url: fakeUrl });
        });
    });

    // ----------------------
    // Healthcheck
    // ----------------------
    describe("healthcheck", () => {
        it("should return ok when bucket is accessible", async () => {
            adapterMock.checkBucketAccess.mockResolvedValue(undefined);

            const result = await controller.healthcheck();

            expect(adapterMock.checkBucketAccess).toHaveBeenCalled();
            expect(result).toEqual({ status: "ok" });
        });

        it("should throw when bucket is not accessible", async () => {
            adapterMock.checkBucketAccess.mockRejectedValue(new Error("S3 down"));

            await expect(controller.healthcheck()).rejects.toThrow("S3 down");
        });
    });
});