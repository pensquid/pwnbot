import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './User'

@Entity()
export class Entry extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => User, (user) => user.entries)
	author: User
}
