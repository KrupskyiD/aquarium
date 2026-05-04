-- CreateTable
CREATE TABLE "aquarium" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "min_salt" DECIMAL,
    "max_salt" DECIMAL,
    "min_temp" DECIMAL,
    "max_temp" DECIMAL,
    "device_serial" VARCHAR(100),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aquarium_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "biotopes" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "min_salt" DECIMAL,
    "max_salt" DECIMAL,
    "min_temp" DECIMAL,
    "max_temp" DECIMAL,
    "description" TEXT,

    CONSTRAINT "biotopes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calibration" (
    "id" SERIAL NOT NULL,
    "salinity_value" DECIMAL NOT NULL,
    "aquarium_id" INTEGER NOT NULL,
    "duration_ms" INTEGER,
    "calibrated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "next_calibration_at" TIMESTAMPTZ(6),

    CONSTRAINT "calibration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metrics" (
    "id" SERIAL NOT NULL,
    "aquarium_id" INTEGER NOT NULL,
    "temperature" DECIMAL NOT NULL,
    "salinity" DECIMAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "is_verified" BOOLEAN DEFAULT false,
    "refresh_token" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_token" (
    "id" SERIAL NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "verification_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "aquarium_device_serial_key" ON "aquarium"("device_serial");

-- CreateIndex
CREATE UNIQUE INDEX "biotopes_name_key" ON "biotopes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "verification_token_token_key" ON "verification_token"("token");

-- AddForeignKey
ALTER TABLE "aquarium" ADD CONSTRAINT "aquarium_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "calibration" ADD CONSTRAINT "calibration_aquarium_id_fkey" FOREIGN KEY ("aquarium_id") REFERENCES "aquarium"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "metrics" ADD CONSTRAINT "metrics_aquarium_id_fkey" FOREIGN KEY ("aquarium_id") REFERENCES "aquarium"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "verification_token" ADD CONSTRAINT "verification_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
