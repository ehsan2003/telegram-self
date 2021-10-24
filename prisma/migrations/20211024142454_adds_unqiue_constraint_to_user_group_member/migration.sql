/*
  Warnings:

  - A unique constraint covering the columns `[groupId,userId]` on the table `UserGroupMember` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserGroupMember_groupId_userId_key" ON "UserGroupMember"("groupId", "userId");
