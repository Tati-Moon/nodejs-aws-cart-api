import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { Cart, CartItem, Product } from '../models';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class CartService {
  constructor(private databaseService: DatabaseService) {}
  private userCarts: Record<string, Cart> = {};

  async findByUserId(userId: string): Promise<Cart> {
    const query = `
      SELECT * FROM carts WHERE user_id = $1
    `;
    const values = [userId];

    const result = await this.databaseService.query(query, values);
    const items = await this.databaseService.query(
      `SELECT c.product_id, c.count, p.price FROM cart_items as c inner join products as p on c.product_id=p.id  WHERE cart_id = $1`,
      [result.rows[0].id],
    );
    return { ...result.rows[0], items: items.rows };
  }

  async createByUserId(userId: string): Promise<Cart> {
    const id = v4();
    const query = `
      INSERT INTO carts (id, user_id, created_at, updated_at, status) VALUES ($1, $2, $3, $4, $5)
    `;
    const values = [id, userId, new Date(), new Date(), 'OPEN'];
    await this.databaseService.query(query);
    return this.findByUserId(userId);
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return await this.createByUserId(userId);
  }

  async updateByUserId(userId: string, item: CartItem): Promise<Cart> {
    const cart = await this.findOrCreateByUserId(userId);
  
    const existingItemResult = await this.databaseService.query(
      'SELECT count FROM cart_items WHERE cart_id = $1 AND product_id = $2',
      [cart.id, item.product.id]
    );
  
    if (existingItemResult.rows.length > 0) {
      const existingCount = existingItemResult.rows[0].count;
      await this.databaseService.query(
        'UPDATE cart_items SET count = $1 WHERE cart_id = $2 AND product_id = $3',
        [existingCount + item.count, cart.id, item.product.id]
      );
    } else {

      await this.databaseService.query(
        'INSERT INTO cart_items (cart_id, product_id, count, price) VALUES ($1, $2, $3, $4)',
        [cart.id, item.product.id, item.count, item.product.price]
      );
    }
  

    return this.findByUserId(userId);
  }
  async removeByUserId(userId: string): Promise<void> {
     const cart = await this.findByUserId(userId);
    if (cart) {
      await this.databaseService.query(
        'DELETE FROM cart_items WHERE cart_id = $1',
        [cart.id],
      );
      await this.databaseService.query('DELETE FROM carts WHERE id = $1', [
        cart.id,
      ]);
    }
  }
}
