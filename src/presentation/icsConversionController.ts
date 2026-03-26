import { Body, Controller, Post, Route, SuccessResponse } from 'tsoa';
import { ConvertIcsRequest, ConvertIcsResponse } from '../domain/types';
import { IcsService } from '../application/IcsService';

@Route('v1/conversions')
export class IcsConversionController extends Controller {
    private icsService = new IcsService();

    @Post()
    @SuccessResponse('201', 'Created')
    public async createConversion(
        @Body() body: ConvertIcsRequest
    ): Promise<ConvertIcsResponse> {

        if (!body?.url) {
            this.setStatus(400);
            throw new Error('Missing url');
        }

        const events = await this.icsService.convertFromUrl(body.url);

        this.setStatus(201);
        return { events };
    }
}