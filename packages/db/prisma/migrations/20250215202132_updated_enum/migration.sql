/*
  Warnings:

  - The values [Asian_American,Middle_Eastern,Native_American,Pacific_Islander,East_Asian] on the enum `EthnicityEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EthnicityEnum_new" AS ENUM ('White', 'Black', 'Asian american', 'Middle eastern', 'Native american', 'Pacific islander', 'East asian', 'Indian', 'Other');
ALTER TABLE "Model" ALTER COLUMN "ethnicity" TYPE "EthnicityEnum_new" USING ("ethnicity"::text::"EthnicityEnum_new");
ALTER TYPE "EthnicityEnum" RENAME TO "EthnicityEnum_old";
ALTER TYPE "EthnicityEnum_new" RENAME TO "EthnicityEnum";
DROP TYPE "EthnicityEnum_old";
COMMIT;
