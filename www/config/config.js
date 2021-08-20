"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    "username": process.env.POSTGRES_USERNAME,
    "password": process.env.POSTGRES_PASSWORD,
    "database": process.env.POSTGRES_DATABASE,
    "host": "udagramkahinadev.curzpkwqir3w.us-east-1.rds.amazonaws.com",
    "dialect": "postgres",
    "jwt": process.env.JWT_SECRET_KEY
};
//# sourceMappingURL=config.js.map