import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { StepsModule } from './steps/steps.module';
import { ProductionOrderModule } from './production-order/production-order.module';
import { ManualRecordModule } from './manual-record/manual-record.module';
import { BranchesModule } from './branches/branches.module';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    StepsModule,
    ProductionOrderModule,
    ManualRecordModule,
    BranchesModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
