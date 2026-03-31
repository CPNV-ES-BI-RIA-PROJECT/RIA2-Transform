// src/presentation/controllers/controller.ts

// Re-export S3Controller so other modules can import it
export { S3Controller } from "./S3Controller.js";

// Optionally re-export all DTOs from the same folder
export {
    UploadObjectRequestDto,
    UploadObjectResponseDto,
    PublishObjectResponseDto,
} from "../dtos/ObjectDtos.js";