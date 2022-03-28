import {
	Entity,
	BaseEntity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
} from 'typeorm'
import { Entry } from './Entry'

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ unique: true })
	discordID: string

	@Column()
	timezone: string

	@Column()
	isRegistered: boolean

	@OneToMany(() => Entry, (entry) => entry.author)
	entries: Entry[]
}
