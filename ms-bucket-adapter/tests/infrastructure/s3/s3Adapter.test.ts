// tests/infrastructure/s3/S3Adapter.test.ts

import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";
import fs from "fs";

import { S3Adapter } from "../../../src/infrastructure/s3/S3Adapter.js";

// --- MOCKS ---
jest.mock("@aws-sdk/client-s3");
jest.mock("@aws-sdk/s3-request-presigner");
jest.mock("fs");

describe("S3Adapter", () => {
    let s3ClientMock: jest.Mocked<S3Client>;
    let adapter: S3Adapter;

    const bucketName = "test-bucket";

    beforeEach(() => {
        jest.clearAllMocks();

        // ✅ inject env variable
        process.env.S3_BUCKET = bucketName;
        process.env.S3_PRESIGNED_EXPIRES_IN = "3600";

        const sendMock = jest.fn();

        s3ClientMock = {
            send: sendMock,
        } as unknown as jest.Mocked<S3Client>;

        adapter = new S3Adapter(s3ClientMock);
    });

    // ---------------------------
    // Upload file
    // ---------------------------
    describe("uploadFile", () => {
        it("should upload a local file to S3 with provided key", async () => {
            const localPath = "/tmp/file.json";
            const key = "my/custom/path/file.json";

            const fakeStream = new Readable();
            (fs.createReadStream as jest.Mock).mockReturnValue(fakeStream);

            (s3ClientMock.send as jest.Mock).mockResolvedValue({});

            await adapter.uploadFile(localPath, key);

            expect(s3ClientMock.send).toHaveBeenCalledTimes(1);

            const command = s3ClientMock.send.mock.calls[0][0] as PutObjectCommand;

            expect(command).toBeInstanceOf(PutObjectCommand);

            expect((command as any).input).toMatchObject({
                Bucket: bucketName,
                Key: key,
                Body: fakeStream,
            });
        });
    });

    // ---------------------------
    // Presigned URL
    // ---------------------------
    describe("generatePresignedUrl", () => {
        it("should return a presigned URL", async () => {
            const key = "my/custom/path/file.json";
            const fakeUrl = "https://signed-url";

            (getSignedUrl as jest.Mock).mockResolvedValue(fakeUrl);

            const result = await adapter.generatePresignedUrl(key);

            expect(getSignedUrl).toHaveBeenCalledTimes(1);

            const command = (getSignedUrl as jest.Mock).mock.calls[0][1] as GetObjectCommand;

            expect(command).toBeInstanceOf(GetObjectCommand);

            expect((command as any).input).toMatchObject({
                Bucket: bucketName,
                Key: key,
            });

            expect(result).toBe(fakeUrl);
        });
    });
});