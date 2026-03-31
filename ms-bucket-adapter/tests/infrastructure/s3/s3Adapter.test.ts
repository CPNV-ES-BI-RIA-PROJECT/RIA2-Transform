import { S3Controller } from "../../../src/presentation/controllers/S3Controller.js";
import { S3Adapter } from "../../../src/infrastructure/s3/S3Adapter.js";

describe("S3Controller", () => {
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

            const result = await controller.uploadObject({
                fileName,
                fileContent,
            });

            expect(adapterMock.uploadFile).toHaveBeenCalledWith(fileName, fileContent);

            expect(result).toEqual({
                key: fileName,
            });
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

            expect(result).toEqual({
                url: fakeUrl,
            });
        });
    });
});