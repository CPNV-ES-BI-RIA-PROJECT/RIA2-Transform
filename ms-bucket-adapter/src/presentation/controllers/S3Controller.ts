import {Controller, Route, Post, Body, Path, Get, UploadedFile, Middlewares} from "tsoa";
import { S3Adapter } from "../../infrastructure/s3/S3Adapter.js";
import { S3Client } from "@aws-sdk/client-s3";

import {
    UploadObjectRequestDto,
    UploadObjectResponseDto,
    PublishObjectResponseDto,
} from "../dtos/ObjectDtos.js";

/**
 * Controller for S3 bucket operations
 */
@Route("v1/objects")
export class S3Controller extends Controller {
    private adapter: S3Adapter;

    /**
     * Constructor with optional dependency injection
     * - Used by tests → inject mock adapter
     * - Used by TSOA → default adapter is created
     */
    constructor(adapter?: S3Adapter) {
        super();

        if (adapter) {
            this.adapter = adapter;
        } else {
            const s3Client = new S3Client({
                region: process.env.AWS_REGION
            });
            this.adapter = new S3Adapter(s3Client);
        }
    }

    @Get("/health")
    public async healthcheck(): Promise<{ status: string }> {
        await this.adapter.checkBucketAccess();

        return {
            status: "ok",
        };
    }

    /**
     * Upload a file to S3
     */
    @Post("/")
    public async uploadObject(@Body() body: UploadObjectRequestDto): Promise<UploadObjectResponseDto> {
        if (!body.fileName || !body.content) {
            this.setStatus(400);
            throw new Error("fileName and content are required");
        }

        await this.adapter.uploadFile(body.fileName, Buffer.from(body.content, "utf-8"));

        return { key: body.fileName };
    }

    /**
     * Generate a presigned URL for a file in S3
     */
    @Post("{fileName}/publish")
    public async publishObject(@Path() fileName: string): Promise<PublishObjectResponseDto> {
        const url = await this.adapter.generatePresignedUrl(fileName);
        return { url };
    }
}