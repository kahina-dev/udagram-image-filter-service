"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const config_1 = require("./config/config");
// Instantiate new Sequelize instance!
exports.sequelize = new sequelize_typescript_1.Sequelize(config_1.config.database, config_1.config.username, config_1.config.password, { "host": config_1.config.host,
    dialect: 'postgres',
    storage: ':memory:',
    define: {
        freezeTableName: true
    }
});
//# sourceMappingURL=sequelize.js.map