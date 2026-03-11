const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// readiness promise resolved after DB connection is established
const ready = new Promise(async (resolve, reject) => {
  try {
    await prisma.$connect();
    console.log("Prisma connecté à la base de données");
    resolve();
  } catch (err) {
    console.log("Erreur connexion DB avec Prisma", err);
    reject(err);
  }
});

// attach ready promise so consumers can await it
prisma.ready = ready;

module.exports = prisma;