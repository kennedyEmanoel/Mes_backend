-- CreateTable
CREATE TABLE "branches" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "sku" TEXT NOT NULL,
    "commercial_name" TEXT NOT NULL,
    "version" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "registration_number" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'operador',
    "email" TEXT,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "branchId" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_orders" (
    "id" SERIAL NOT NULL,
    "op_number" TEXT NOT NULL,
    "start_date" TIMESTAMP(3),
    "estimated_end_date" TIMESTAMP(3),
    "target_quantity" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Aberta',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "branchId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "production_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "steps" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,
    "target_quantity" INTEGER NOT NULL DEFAULT 0,
    "productionOrderId" INTEGER NOT NULL,

    CONSTRAINT "steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manual_records" (
    "id" SERIAL NOT NULL,
    "hour_range" TEXT NOT NULL,
    "produced_quantity" INTEGER NOT NULL,
    "defect_quantity" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productionOrderId" INTEGER NOT NULL,
    "stepId" INTEGER NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "manual_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "branches_name_key" ON "branches"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_registration_number_key" ON "users"("registration_number");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "production_orders_op_number_key" ON "production_orders"("op_number");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_orders" ADD CONSTRAINT "production_orders_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_orders" ADD CONSTRAINT "production_orders_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "steps" ADD CONSTRAINT "steps_productionOrderId_fkey" FOREIGN KEY ("productionOrderId") REFERENCES "production_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manual_records" ADD CONSTRAINT "manual_records_productionOrderId_fkey" FOREIGN KEY ("productionOrderId") REFERENCES "production_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manual_records" ADD CONSTRAINT "manual_records_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manual_records" ADD CONSTRAINT "manual_records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
