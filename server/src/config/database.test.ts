import { createConnection } from 'typeorm';
import { User } from '../user/entities/user.entity';
import * as dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    const connection = await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'nest_auth',
      entities: [User],
    });
    console.log('Connexion à la base de données réussie !');
    await connection.close();
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
  }
}

testConnection();
