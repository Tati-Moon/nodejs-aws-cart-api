import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './User.entity';
import { Cart } from './Cart.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  cart_id: string;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'NO ACTION' })
  user: User;

  @ManyToOne(() => Cart, (cart) => cart.orders, { onDelete: 'NO ACTION' })
  cart: Cart;

  @Column('json', { nullable: true })
  payment: object;

  @Column('json', { nullable: true })
  delivery: object;

  @Column({ nullable: true })
  comments: string;

  @Column({
    type: 'enum',
    enum: [
      'OPEN',
      'INPROGRESS',
      'APPROVED',
      'CONFIRMED',
      'SENT',
      'COMPLETED',
      'CANCELLED',
    ],
    default: 'OPEN',
  })
  status: string;

  @Column('decimal')
  total: number;
}
