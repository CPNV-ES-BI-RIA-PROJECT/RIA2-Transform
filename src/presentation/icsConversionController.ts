import { Body, Controller, Post, Route, SuccessResponse } from 'tsoa';
import { ConvertIcsRequest, ConvertIcsResponse } from '../domain/types';
import { IcsService } from '../application/IcsService';

@Route('v1/conversions')
export class IcsConversionController extends Controller {
    constructor(private readonly icsService: IcsService) {
        super();
    }

    @Post()
    @SuccessResponse('201', 'Created')
    public async createConversion(
        @Body() body: ConvertIcsRequest
    ): Promise<ConvertIcsResponse> {
        console.log('[Controller] createConversion called');

        const events = await this.icsService.convertFromUrl(body.url);

        this.setStatus(201);
        return { events };
    }
}