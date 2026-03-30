// src/presentation/controllers/ObjectController.ts

import {
    Body,
    Controller,
    Post,
    Route,
    Path,
    Tags,
} from "tsoa";

import { S3Adapter } from "../../infrastructure/s3/S3Adapter";
import {
    UploadObjectRequestDto,
    UploadObjectResponseDto,
    PublishObjectResponseDto,
} from "../dtos/ObjectDtos";

@Route("/api/v1/objects")
@Tags("Objects")
export class ObjectController extends Controller {
    constructor(private readonly s3Adapter: S3Adapter) {
        super();
    }

    @Post("/")
    public async uploadObject(
        @Body() body: UploadObjectRequestDto
    ): Promise<UploadObjectResponseDto> {
        const result = await this.s3Adapter.uploadFile(body.localPath);
        return { key: result.key };
    }

    @Post("/{id}/publish")
    public async publishObject(
        @Path() id: string
    ): Promise<PublishObjectResponseDto> {
        const url = await this.s3Adapter.generatePresignedUrl(id);
        return { url };
    }
}