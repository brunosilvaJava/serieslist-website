-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "List" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "shareId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Serie" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT,
    "listId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Serie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "List_shareId_key" ON "List"("shareId");

-- CreateIndex
CREATE INDEX "List_userId_idx" ON "List"("userId");

-- CreateIndex
CREATE INDEX "List_shareId_idx" ON "List"("shareId");

-- CreateIndex
CREATE INDEX "Serie_listId_idx" ON "Serie"("listId");

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Serie" ADD CONSTRAINT "Serie_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;
