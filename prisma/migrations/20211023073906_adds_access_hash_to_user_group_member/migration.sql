/*
  Warnings:

  - Added the required column `accessHash` to the `UserGroupMember` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserGroupMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "accessHash" DECIMAL NOT NULL,
    "groupId" TEXT NOT NULL,
    CONSTRAINT "UserGroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "UserGroup" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserGroupMember" ("groupId", "id", "userId") SELECT "groupId", "id", "userId" FROM "UserGroupMember";
DROP TABLE "UserGroupMember";
ALTER TABLE "new_UserGroupMember" RENAME TO "UserGroupMember";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
