/*
  Warnings:

  - You are about to drop the column `name` on the `steps` table. All the data in the column will be lost.
  - Added the required column `stepTemplateId` to the `steps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "steps" DROP COLUMN "name",
ADD COLUMN     "stepTemplateId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "step_templates" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "step_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "step_templates_name_key" ON "step_templates"("name");

-- AddForeignKey
ALTER TABLE "steps" ADD CONSTRAINT "steps_stepTemplateId_fkey" FOREIGN KEY ("stepTemplateId") REFERENCES "step_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
