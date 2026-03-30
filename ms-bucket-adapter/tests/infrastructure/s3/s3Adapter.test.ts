// tests/infrastructure/s3/S3Adapter.test.ts

import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";
import fs from "fs";

import { S3Adapter } from "../../../src/infrastructure/s3/S3Adapter";

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

        s3ClientMock = {
            send: jest.fn(),
        } as any;

        adapter = new S3Adapter(s3ClientMock, bucketName);
    });

    // ---------------------------
    // Upload file
    // ---------------------------
    describe("uploadFile", () => {
        it("should upload a local file to S3", async () => {
            const localPath = "/tmp/file.json";
            const key = "objects/file.json";

            // mock fs stream
            const fakeStream = new Readable();
            (fs.createReadStream as jest.Mock).mockReturnValue(fakeStream);

            // mock S3 response
            s3ClientMock.send.mockResolvedValue({});

            await adapter.uploadFile(localPath, key);

            expect(fs.createReadStream).toHaveBeenCalledWith(localPath);

            expect(s3ClientMock.send).toHaveBeenCalledWith(
                expect.any(PutObjectCommand)
            );

            const command = (s3ClientMock.send as jest.Mock).mock.calls[0][0];

            expect(command.input).toMatchObject({
                Bucket: bucketName,
                Key: key,
                Body: fakeStream,
                ContentType: "application/json",
            });
        });

        it("should throw if upload fails", async () => {
            s3ClientMock.send.mockRejectedValue(new Error("S3 error"));

            await expect(
                adapter.uploadFile("/tmp/file.json", "file.json")
            ).rejects.toThrow("S3 error");
        });
    });

    // ---------------------------
    // Presigned URL
    // ---------------------------
    describe("generatePresignedUrl", () => {
        it("should return a presigned URL", async () => {
            const key = "objects/file.json";
            const fakeUrl = "https://signed-url";

            (getSignedUrl as jest.Mock).mockResolvedValue(fakeUrl);

            const result = await adapter.generatePresignedUrl(key);

            expect(getSignedUrl).toHaveBeenCalledWith(
                s3ClientMock,
                expect.any(GetObjectCommand),
                expect.objectContaining({
                    expiresIn: expect.any(Number),
                })
            );

            const command = (getSignedUrl as jest.Mock).mock.calls[0][1];

            expect(command.input).toMatchObject({
                Bucket: bucketName,
                Key: key,
            });

            expect(result).toBe(fakeUrl);
        });

        it("should throw if presign fails", async () => {
            (getSignedUrl as jest.Mock).mockRejectedValue(
                new Error("Presign error")
            );

            await expect(
                adapter.generatePresignedUrl("file.json")
            ).rejects.toThrow("Presign error");
        });
    });
});