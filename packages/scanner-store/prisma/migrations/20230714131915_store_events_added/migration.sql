-- CreateTable
CREATE TABLE "StoreEvents" (
    "address" TEXT NOT NULL,
    "event" TEXT NOT NULL,

    CONSTRAINT "StoreEvents_pkey" PRIMARY KEY ("address","event")
);
