// tests/controllers/S3Controller.test.ts
import { S3Controller } from "../../../src/presentation/controllers/S3Controller.js";
import { S3Adapter } from "../../../src/infrastructure/s3/S3Adapter.js";
import { UploadObjectRequestDto } from "../../../src/presentation/dtos/ObjectDtos.js";

describe("S3Controller (end-user behavior)", () => {
    let adapterMock: jest.Mocked<S3Adapter>;
    let controller: S3Controller;

    const fileName = "file.json";
    const fileContent = '{"hello":"world"}';

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

            const requestBody: UploadObjectRequestDto = {
                fileName,
                content: fileContent,
            };

            const result = await controller.uploadObject(requestBody);

            expect(adapterMock.uploadFile).toHaveBeenCalledWith(fileName, Buffer.from(fileContent, "utf-8"));
            expect(result).toEqual({ key: fileName });
        });

        it("should throw when fileName is missing", async () => {
            await expect(
                controller.uploadObject({ fileName: "", content: fileContent })
            ).rejects.toThrow("fileName and content are required");
        });

        it("should throw when content is missing", async () => {
            await expect(
                controller.uploadObject({ fileName, content: "" })
            ).rejects.toThrow("fileName and content are required");
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