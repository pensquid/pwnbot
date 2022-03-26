import { DataSource } from 'typeorm'
import { Entry } from './entities/Entry'
import { User } from './entities/User'

export const AppDataSource = new DataSource({
	type: 'better-sqlite3',
	database: 'db.sqlite3',
	entities: [Entry, User],
	// TODO: disable this for prod
	synchronize: true,
})
