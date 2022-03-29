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
@Unique('onePerDay', ['dateStamp', 'author'])
export class Entry extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	dateStamp: string

	@Column()
	content: string

	@ManyToOne(() => User, (user) => user.entries)
	author: User
}
