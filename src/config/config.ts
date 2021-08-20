export const config = {
  
  "username": process.env.POSTGRES_USERNAME,
  "password": process.env.POSTGRES_PASSWORD,
  "database": "udagramkahinadev",
  "host": "udagramkahinadev.curzpkwqir3w.us-east-1.rds.amazonaws.com",
  "dialect": "postgres",
  "jwt": process.env.JWT_SECRET_KEY
  
};