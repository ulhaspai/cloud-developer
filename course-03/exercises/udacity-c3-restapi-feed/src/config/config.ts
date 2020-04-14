export const config = {
  'dev': {
    'username': process.env.UDAGRAM_USERNAME,
    'password': process.env.UDAGRAM_PASSWORD,
    'database': process.env.UDAGRAM_DATABASE,
    'host': process.env.UDAGRAM_DATABASE_HOST,
    'dialect': 'postgres',
    'aws_reigion': process.env.AWS_REGION,
    'aws_profile': process.env.AWS_PROFILE,
    'aws_media_bucket': process.env.UDAGRAM_S3_BUCKET,
    'url': process.env.UDAGRAM_URL
  },
  'prod': {
    'username': process.env.UDAGRAM_USERNAME,
    'password': process.env.UDAGRAM_PASSWORD,
    'database': process.env.UDAGRAM_DATABASE,
    'host': process.env.UDAGRAM_DATABASE_HOST,
    'dialect': 'postgres'
  },
  'jwt': {
    'secret': process.env.JWT_SECRET
  }
};
