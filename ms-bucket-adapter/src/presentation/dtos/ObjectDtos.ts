export interface UploadObjectRequestDto {
    /**
     * Name of the file (used as S3 object key)
     */
    fileName: string;

    /**
     * File content (JSON string or raw string)
     */
    fileContent: string;
}

export interface UploadObjectResponseDto {
    /**
     * Uploaded object key
     */
    key: string;
}

export interface PublishObjectResponseDto {
    /**
     * Pre-signed URL to access the object
     */
    url: string;
}