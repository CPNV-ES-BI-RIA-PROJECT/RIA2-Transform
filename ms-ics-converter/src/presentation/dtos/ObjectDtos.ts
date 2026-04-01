import {IcsEvent} from "../../domain/types.js";

export interface ConvertIcsRequest {
    url: string;
}

export interface ConvertIcsResponse {
    events: IcsEvent[];
}