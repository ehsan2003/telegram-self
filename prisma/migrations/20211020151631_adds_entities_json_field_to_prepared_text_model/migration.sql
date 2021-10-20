-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PreparedText" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "entitiesJson" TEXT NOT NULL DEFAULT '[]',
    "identifier" TEXT NOT NULL
);
INSERT INTO "new_PreparedText" ("id", "identifier", "text") SELECT "id", "identifier", "text" FROM "PreparedText";
DROP TABLE "PreparedText";
ALTER TABLE "new_PreparedText" RENAME TO "PreparedText";
CREATE UNIQUE INDEX "PreparedText_identifier_key" ON "PreparedText"("identifier");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
