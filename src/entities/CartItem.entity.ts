import { Entity, PrimaryColumn, ManyToOne, Column } from 'typeorm';

import { Cart } from './Cart.entity';
import { Product } from './Product.entity';

@Entity({ name: 'cart_items' })
export class CartItem {
  @PrimaryColumn('uuid')
  cart_id: string;

  @PrimaryColumn('uuid')
  product_id: string;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  cart: Cart;

  @ManyToOne(() => Product, { nullable: true })
  product: Product;

  @Column()
  count: number;

  @Column()
  price: number;
}
