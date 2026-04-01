// src/controllers/TransformController.ts
import { Controller, Post, Route, Body, SuccessResponse } from 'tsoa';
import { OrchestratorService } from '../../application/OrchestratorService.js';
import { IcsService } from '../../application/IcsService.js';
import { BucketAdapterClient } from '../../infrastructure/clients/BucketAdapterClient.js';
import {TransformRequest, TransformResponse} from "../dtos/ObjectDtos.js";

@Route('v1/transforms')
export class TransformController extends Controller {
    private orchestrator = new OrchestratorService(new IcsService(), new BucketAdapterClient());

    @Post()
    @SuccessResponse('201', 'Created')
    public async createTransform(@Body() body: TransformRequest): Promise<TransformResponse> {
        const result = await this.orchestrator.convertAndPublish(body.url);
        return {
            url: result.url
        };
    }
}