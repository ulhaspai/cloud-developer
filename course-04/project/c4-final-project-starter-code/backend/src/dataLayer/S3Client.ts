import * as AWS from "aws-sdk";
import { ITodoFileAccess } from "./ITodoFileAccess";

/**
 * S3Client is an AWS implementation for the {@link ITodoFileAccess}
 */
export class S3Client implements ITodoFileAccess {

    private static readonly BUCKET_NAME: string = process.env.ATTACHMENT_S3_BUCKET
    private static readonly URL_EXPIRATION: string = process.env.ATTACHMENT_URL_EXPIRATION

    private s3: AWS.S3

    constructor() {
        this.s3 = new AWS.S3({
            signatureVersion: 'v4'
        })
    }

    public async deleteAttachment(todoId: string) {
        await this.s3.deleteObject({
            Bucket: S3Client.BUCKET_NAME,
            Key: todoId
        }).promise()
    }

    public getSignedPutUrl(todoId: string): string {
        return this.s3.getSignedUrl('putObject', {
            Bucket: S3Client.BUCKET_NAME,
            Key: todoId,
            Expires: S3Client.URL_EXPIRATION
        })
    }

    public getSignedGetUrl(todoId: string): string {
        return this.s3.getSignedUrl('getObject', {
            Bucket: S3Client.BUCKET_NAME,
            Key: todoId,
            Expires: S3Client.URL_EXPIRATION
        })
    }

}
