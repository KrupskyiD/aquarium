-- Align PostgreSQL with SaltGuard schema: table `aquariums`, columns `type`, `device_number`, `status`.
-- Safe to run once when upgrading from legacy `aquarium` / `device_serial` / `water_type` / `connection_status`.

DO $$
BEGIN
  IF to_regclass('public.aquarium') IS NOT NULL AND to_regclass('public.aquariums') IS NULL THEN
    ALTER TABLE "aquarium" RENAME TO "aquariums";
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'aquariums' AND column_name = 'water_type'
  ) THEN
    ALTER TABLE "aquariums" RENAME COLUMN "water_type" TO "type";
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'aquariums' AND column_name = 'device_serial'
  ) THEN
    ALTER TABLE "aquariums" RENAME COLUMN "device_serial" TO "device_number";
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'aquariums' AND column_name = 'connection_status'
  ) THEN
    ALTER TABLE "aquariums" RENAME COLUMN "connection_status" TO "status";
  END IF;
END $$;
