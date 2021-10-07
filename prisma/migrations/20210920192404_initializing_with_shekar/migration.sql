-- CreateTable
CREATE TABLE "shekar" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "phone" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "id" ON "shekar"("id");

-- CreateIndex
CREATE INDEX "username" ON "shekar"("username");
