import {
	BaseEntity,
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	Unique,
} from 'typeorm'
import { User } from './User'

@Entity()
export class Entry extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	@Unique(['dateStamp', 'author'])
	dateStamp: string

	@Column()
	content: string

	@ManyToOne(() => User, (user) => user.entries)
	author: User
}
