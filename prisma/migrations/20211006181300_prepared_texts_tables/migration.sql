-- CreateTable
CREATE TABLE "PreparedText" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "identifier" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PreparedTextCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PreparedTextToPreparedTextCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    FOREIGN KEY ("A") REFERENCES "PreparedText" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "PreparedTextCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "PreparedText_identifier_key" ON "PreparedText"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "_PreparedTextToPreparedTextCategory_AB_unique" ON "_PreparedTextToPreparedTextCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_PreparedTextToPreparedTextCategory_B_index" ON "_PreparedTextToPreparedTextCategory"("B");
