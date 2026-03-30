import { Controller, Route, Post, Body } from "tsoa";
import { S3Adapter } from "../../infrastructure/s3/S3Adapter.js";
import { S3Client } from "@aws-sdk/client-s3";
import {
    UploadObjectRequestDto,
    PublishObjectRequestDto,
    PublishObjectResponseDto,
} from "../dtos/ObjectDtos.js";

/**
 * Controller for S3 bucket operations
 */
@Route("api/v1/objects")
export class S3Controller extends Controller {
    private adapter: S3Adapter;
    /**
     * Constructor accepts an optional S3Adapter.
     * If no adapter is provided, a default one is created.
     * This ensures TSOA-generated routes can instantiate the controller without arguments.
     */

    constructor (){
        super();

        const s3Client = new S3Client();
        this.adapter = new S3Adapter(s3Client);
    }

    /**
     * Upload a local file to S3
     * @param body - contains localPath and remotePath
     */
    @Post("/")
    public async uploadObject(@Body() body: UploadObjectRequestDto): Promise<void> {
        await this.adapter.uploadFile(body.localPath, body.remotePath);
    }

    /**
     * Generate a presigned URL for a file in S3
     * @param body - contains remotePath
     * @returns a presigned URL
     */
    @Post("/publish")
    public async publishObject(
        @Body() body: PublishObjectRequestDto
    ): Promise<PublishObjectResponseDto> {
        const url = await this.adapter.generatePresignedUrl(body.remotePath);
        return { url };
    }
}