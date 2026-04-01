// src/presentation/dtos/ObjectDtos.ts

export interface UploadObjectRequestDto {
    /**
     * Name of the file to store in S3
     */
    fileName: string;

    /**
     * Content of the file as a string (JSON string or plain text)
     */
    content: string;
}

export interface UploadObjectResponseDto {
    /**
     * Key of the uploaded file in the S3 bucket
     */
    key: string;
}

export interface PublishObjectResponseDto {
    /**
     * Presigned URL to access the file
     */
    url: string;
}