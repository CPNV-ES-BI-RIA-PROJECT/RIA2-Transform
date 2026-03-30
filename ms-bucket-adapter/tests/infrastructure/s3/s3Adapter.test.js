// tests/infrastructure/s3/S3Adapter.test.ts
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";
import fs from "fs";
import { S3Adapter } from "../../../src/infrastructure/s3/S3Adapter";
// --- MOCKS ---
jest.mock("@aws-sdk/client-s3");
jest.mock("@aws-sdk/s3-request-presigner");
jest.mock("fs");
describe("S3Adapter", () => {
    let s3ClientMock;
    let adapter;
    const bucketName = "test-bucket";
    beforeEach(() => {
        jest.clearAllMocks();
        const sendMock = jest.fn();
        s3ClientMock = {
            send: sendMock,
        };
        adapter = new S3Adapter(s3ClientMock);
    });
    // ---------------------------
    // Upload file
    // ---------------------------
    describe("uploadFile", () => {
        it("should upload a local file to S3 with provided key", async () => {
            const localPath = "/tmp/file.json";
            const remotePath = "s3://test-bucket/my/custom/path/file.json";
            const fakeStream = new Readable();
            fs.createReadStream.mockReturnValue(fakeStream);
            s3ClientMock.send.mockImplementation(async () => ({}));
            await adapter.uploadFile(localPath, remotePath);
            expect(s3ClientMock.send).toHaveBeenCalledTimes(1);
            expect(s3ClientMock.send.mock.calls[0][0]).toBeInstanceOf(PutObjectCommand);
        });
    });
    // ---------------------------
    // Presigned URL
    // ---------------------------
    describe("generatePresignedUrl", () => {
        it("should return a presigned URL", async () => {
            const remotePath = "s3://test-bucket/my/custom/path/file.json";
            const fakeUrl = "https://signed-url";
            // spy on GetObjectCommand constructor
            const getObjectSpy = jest.spyOn(require("@aws-sdk/client-s3"), "GetObjectCommand");
            // mock getSignedUrl to return the fake URL
            getSignedUrl.mockResolvedValue(fakeUrl);
            const result = await adapter.generatePresignedUrl(remotePath);
            // assert the command was created with correct params
            expect(getObjectSpy).toHaveBeenCalledWith(expect.objectContaining({
                Bucket: "test-bucket",
                Key: "my/custom/path/file.json",
            }));
            // assert the returned URL is correct
            expect(result).toBe(fakeUrl);
        });
    });
});
