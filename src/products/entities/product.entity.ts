import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductionOrder } from '../../production-order/entities/production-order.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sku: string;

  @Column()
  commercial_name: string;

  @Column({ nullable: true })
  version: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(
    () => ProductionOrder,
    (productionOrder) => productionOrder.product,
  )
  productionOrders: ProductionOrder[];
}
