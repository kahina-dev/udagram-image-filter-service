import {Sequelize} from 'sequelize-typescript';
import { config } from './config/config';



// Instantiate new Sequelize instance!
export const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  

  { "host":config.host,
  dialect: 'postgres',
  storage: ':memory:',
  define: {
    freezeTableName: true
  }
});
