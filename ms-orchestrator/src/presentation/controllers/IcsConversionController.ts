import { Body, Controller, Post, Route, SuccessResponse } from "tsoa";
import { OrchestratorService } from "../../application/IcsService.js";
import {ConvertIcsRequest, ConvertIcsResponse} from "../dtos/ObjectDtos.js"

@Route("v1/conversions")
export class IcsConversionController extends Controller {
    private readonly icsService: OrchestratorService;

    constructor(icsService?: OrchestratorService) {
        super();
        this.icsService = icsService ?? new OrchestratorService();
    }

    @Post()
    @SuccessResponse("201", "Created")
    public async createConversion(
        @Body() body: ConvertIcsRequest
    ): Promise<ConvertIcsResponse> {
        const result = await this.icsService.convertFromUrl(body.url);

        this.setStatus(201);
        return result;
    }
}