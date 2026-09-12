// @ts-nocheck
import "dotenv/config";
import prisma from "@/lib/prisma";



async function main() {
    const favoritesToBackfill = await prisma.favorite.findMany({
        where: { alienId: null }
    });

    let updated = 0;
    let skipped = 0;

    for (const favorite of favoritesToBackfill) {
        const alien = await prisma.alien.findFirst({
            where: { name: favorite.alienName },
        });
    

    if (!alien) {
        console.warn(`Alien is not present: ${ favorite.id }`);
        skipped++;
        continue;
    }

    await prisma.favorite.update({
        where: { id: favorite.id },
        data: { alienId: alien.id }
    });
    updated++;
   }
    console.log(`Done. Updated: ${updated}, Skipped: ${skipped}`);
}

main()
   .catch((err) => {
      console.error("Backfill failes:", err);
      process.exit(1);
   })
   .finally(async () => {
    await prisma.$disconnect();
   })