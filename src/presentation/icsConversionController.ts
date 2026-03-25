import { Body, Controller, Post, Route, SuccessResponse } from 'tsoa';
import {ConvertIcsRequest, ConvertIcsResponse} from '../domain/types';
import { convertIcsService } from '../application/icsService';

@Route('v1/conversions')
export class IcsConversionController extends Controller {

    @Post() // no extra parentheses
    @SuccessResponse('201', 'Created') // no extra parentheses
    public async createConversion(
        @Body() body: ConvertIcsRequest
    ): Promise<ConvertIcsResponse> {
        const events = await convertIcsService(body.url);
        this.setStatus(201);
        return { events };
    }
}