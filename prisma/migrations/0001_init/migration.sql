-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "DoseStatus" AS ENUM ('PENDING', 'TAKEN', 'MISSED', 'SNOOZED');

-- CreateEnum
CREATE TYPE "DoseAction" AS ENUM ('TAKEN', 'MISSED', 'SNOOZED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('REMINDER', 'WARNING');

-- CreateEnum
CREATE TYPE "InteractionKind" AS ENUM ('DRUG_DRUG', 'DRUG_CLASS', 'OTC_CLASS');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MODERATE', 'HIGH');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('url', 'doi');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicationMaster" (
    "id" TEXT NOT NULL,
    "drugName" TEXT NOT NULL,
    "brandName" TEXT,
    "activeIngredient" TEXT NOT NULL,
    "drugClass" TEXT NOT NULL,
    "indications" TEXT NOT NULL,
    "sideEffectsCommon" TEXT NOT NULL,
    "sideEffectsSerious" TEXT NOT NULL,
    "contraindications" TEXT NOT NULL,
    "warningsPregnancy" TEXT NOT NULL,
    "warningsRenal" TEXT NOT NULL,
    "warningsHepatic" TEXT NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicationMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SourceLink" (
    "id" TEXT NOT NULL,
    "medicationId" TEXT NOT NULL,
    "type" "SourceType" NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT,

    CONSTRAINT "SourceLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMedication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "medicationId" TEXT NOT NULL,
    "strength" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "scheduleTimes" TEXT[],
    "withFood" BOOLEAN NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserMedication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoseSchedule" (
    "id" TEXT NOT NULL,
    "userMedicationId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "status" "DoseStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DoseSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoseLog" (
    "id" TEXT NOT NULL,
    "doseScheduleId" TEXT NOT NULL,
    "action" "DoseAction" NOT NULL,
    "actionAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,

    CONSTRAINT "DoseLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InAppNotification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "InAppNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InteractionRule" (
    "id" TEXT NOT NULL,
    "kind" "InteractionKind" NOT NULL,
    "a" TEXT NOT NULL,
    "b" TEXT NOT NULL,
    "riskLevel" "RiskLevel" NOT NULL,
    "mechanism" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,

    CONSTRAINT "InteractionRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminLog" (
    "id" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "diffJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DoseSchedule_userMedicationId_scheduledAt_key" ON "DoseSchedule"("userMedicationId", "scheduledAt");

-- AddForeignKey
ALTER TABLE "SourceLink" ADD CONSTRAINT "SourceLink_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "MedicationMaster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMedication" ADD CONSTRAINT "UserMedication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMedication" ADD CONSTRAINT "UserMedication_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "MedicationMaster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoseSchedule" ADD CONSTRAINT "DoseSchedule_userMedicationId_fkey" FOREIGN KEY ("userMedicationId") REFERENCES "UserMedication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoseLog" ADD CONSTRAINT "DoseLog_doseScheduleId_fkey" FOREIGN KEY ("doseScheduleId") REFERENCES "DoseSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InAppNotification" ADD CONSTRAINT "InAppNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminLog" ADD CONSTRAINT "AdminLog_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

