export interface UploadObjectRequestDto {
    localPath: string;
    remotePath: string;
}

export interface PublishObjectRequestDto {
    remotePath: string;
}

export interface PublishObjectResponseDto {
    url: string;
}