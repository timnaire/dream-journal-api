import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

// S3 Client Configuration
const s3Config = {
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY || "",
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY || "",
  },
};

// Initialize the S3 Client
const s3Client = new S3Client(s3Config);
const BUCKET_NAME = "dream-journal-blob";

export enum BlobType {
  Image,
  Audio,
}

export class S3Service {
  constructor(private userId: string) {
    this.userId = userId;
  }

  delete = async (filename: string, blobType: BlobType = BlobType.Image) => {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: this.generatePath(filename, blobType),
    });

    console.log("command", command);

    try {
      const data = await s3Client.send(command);
      console.log("Success. Object deleted.", data);
      return data; // For unit tests.
    } catch (err) {
      console.log("Error", err);
    }
  };

  private generatePath(filename: string, type: BlobType): string {
    let path = `users`;

    switch (type) {
      case BlobType.Image:
        path = `${path}/${this.userId}/media/${filename}`;
        break;
      case BlobType.Audio:
        path = `${path}/${this.userId}/audio/${filename}`;
        break;
      default:
        path = filename;
    }

    return path;
  }
}
