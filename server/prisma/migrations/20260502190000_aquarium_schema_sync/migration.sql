-- Align legacy DB with Aquarium model (@@map("aquariums"), device_number, volume, type).

DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'aquarium'
  ) THEN
    ALTER TABLE "aquarium" RENAME TO "aquariums";
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'aquariums' AND column_name = 'device_serial'
  ) THEN
    ALTER TABLE "aquariums" RENAME COLUMN "device_serial" TO "device_number";
  END IF;
END $$;

ALTER TABLE "aquariums" ADD COLUMN IF NOT EXISTS "volume" INTEGER;
ALTER TABLE "aquariums" ADD COLUMN IF NOT EXISTS "type" VARCHAR(255);

UPDATE "aquariums" SET "volume" = 0 WHERE "volume" IS NULL;
UPDATE "aquariums" SET "type" = 'marine' WHERE "type" IS NULL;
UPDATE "aquariums" SET "device_number" = CONCAT('legacy-', "id"::text) WHERE "device_number" IS NULL OR TRIM("device_number") = '';

ALTER TABLE "aquariums" ALTER COLUMN "volume" SET NOT NULL;
ALTER TABLE "aquariums" ALTER COLUMN "type" SET NOT NULL;
ALTER TABLE "aquariums" ALTER COLUMN "device_number" SET NOT NULL;

DROP INDEX IF EXISTS "aquarium_device_serial_key";
CREATE UNIQUE INDEX IF NOT EXISTS "aquariums_device_number_key" ON "aquariums"("device_number");
