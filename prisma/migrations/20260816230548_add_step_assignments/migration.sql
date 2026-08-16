-- CreateTable
CREATE TABLE "step_assignments" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stepId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "step_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "step_assignments_stepId_userId_key" ON "step_assignments"("stepId", "userId");

-- AddForeignKey
ALTER TABLE "step_assignments" ADD CONSTRAINT "step_assignments_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "step_assignments" ADD CONSTRAINT "step_assignments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
