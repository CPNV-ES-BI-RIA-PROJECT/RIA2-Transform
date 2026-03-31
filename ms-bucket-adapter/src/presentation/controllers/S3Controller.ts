// src/presentation/controllers/S3Controller.ts

import { Controller, Route, Post, Body, Path } from "tsoa";
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
@Route("api/v1/objects")
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
            const s3Client = new S3Client({});
            this.adapter = new S3Adapter(s3Client);
        }
    }

    /**
     * Upload a file to S3
     */
    @Post("/")
    public async uploadObject(
        @Body() body: UploadObjectRequestDto
    ): Promise<UploadObjectResponseDto> {
        await this.adapter.uploadFile(body.fileName, body.fileContent);

        return {
            key: body.fileName,
        };
    }

    /**
     * Generate a presigned URL for a file in S3
     */
    @Post("{fileName}/publish")
    public async publishObject(
        @Path() fileName: string
    ): Promise<PublishObjectResponseDto> {
        const url = await this.adapter.generatePresignedUrl(fileName);

        return {
            url,
        };
    }
}