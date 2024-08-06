import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CartItem } from './CartItem.entity';
import { Order } from './Order.entity';
import { User } from './User.entity';

@Entity({ name: 'carts' })
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @ManyToOne(() => User, (user) => user.carts, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'enum', enum: ['OPEN', 'ORDERED'], default: 'OPEN' })
  status: string;

  @OneToMany(() => Order, (order) => order.cart)
  orders: Order[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  items: CartItem[];
}
