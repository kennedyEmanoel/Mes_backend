import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Branch } from '../../branches/entities/branch.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('production_orders')
export class ProductionOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  op_number: string;

  @ManyToOne(() => Branch, (branch) => branch.productionOrders)
  branch: Branch;

  @ManyToOne(() => Product, (product) => product.productionOrders)
  product: Product;

  @Column({ type: 'timestamp', nullable: true })
  start_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  estimated_end_date: Date;

  @Column({ type: 'int' })
  target_quantity: number;

  @Column({ default: 'Aberta' })
  status: string;

  @CreateDateColumn()
  created_at!: Date;
}
