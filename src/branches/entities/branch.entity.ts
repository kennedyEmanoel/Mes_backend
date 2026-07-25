import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ProductionOrder } from '../../production-order/entities/production-order.entity';

@Entity('branches')
export class Branch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => User, (user) => user.branch)
  users: User[];

  @OneToMany(() => ProductionOrder, (productionOrder) => productionOrder.branch)
  productionOrders: ProductionOrder[];
}
