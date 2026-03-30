// src/presentation/dtos/ObjectDtos.ts

export interface UploadObjectRequestDto {
    localPath: string;
}

export interface UploadObjectResponseDto {
    key: string;
}

export interface PublishObjectResponseDto {
    url: string;
}