import fs from "fs";
import { pipeline } from "stream/promises";
import { FastifyPluginAsync } from "fastify";

const relatorioFotografico: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.post("/:idOcorrencia", async function (request, reply) {
    //const params = request.params as { idOcorrencia: string };

    const ocorrencia: any | null = {}

    if (!ocorrencia) {
      throw new Error("Ocorrência não encontrada");
    }

    const uploadDir = `uploads/ocorrencias/${ocorrencia.numero}/fotos-relatorio`;
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    let relatorioFotografico: any | null = null;
    console.log(relatorioFotografico)
    let referencias: any[] = [];
    const arquivosAnexados: string[] = [];
    const parts = request.parts();
    for await (const part of parts) {
      if (part.type === "file") {
        try {
          const caminho = `${uploadDir}/${part.filename}`;
          const writeStream = fs.createWriteStream(caminho);
          await pipeline(part.file, writeStream);

          // Close the write stream to release resources.
          writeStream.end();

          arquivosAnexados.push(caminho);
        } catch (err) {
          console.error("Erro ao salvar arquivo", err);
        }
      } else {
        if (part.fieldname === "relatorioFotografico") {
          relatorioFotografico = JSON.parse(String(part.value));
        } else if (part.fieldname === "referencias") {
          referencias = JSON.parse(String(part.value));
          console.log(referencias)
        }
      }
    }

    // const relatorioFotograficoExistente =
    //   await prisma.relatorioFotografico.findFirst({
    //     where: {
    //       idOcorrencia: Number(params.idOcorrencia),
    //     },
    //   });

    //console.log("relatorioFotograficoExistente", relatorioFotograficoExistente);

    //remove fotos antigas
    // if (relatorioFotograficoExistente) {
    //   if (relatorioFotograficoExistente.caminhoFoto1) {
    //     await fs.unlinkSync(relatorioFotograficoExistente.caminhoFoto1);
    //   }
    //   if (relatorioFotograficoExistente.caminhoFoto2) {
    //     await fs.unlinkSync(relatorioFotograficoExistente.caminhoFoto2);
    //   }
    //   if (relatorioFotograficoExistente.caminhoFoto3) {
    //     await fs.unlinkSync(relatorioFotograficoExistente.caminhoFoto3);
    //   }
    //   if (relatorioFotograficoExistente.caminhoFoto4) {
    //     await fs.unlinkSync(relatorioFotograficoExistente.caminhoFoto4);
    //   }
    // }

    // if (relatorioFotografico) {
    //   relatorioFotografico.caminhoFoto1 = arquivosAnexados[0];
    //   relatorioFotografico.caminhoFoto2 = arquivosAnexados[1];
    //   relatorioFotografico.caminhoFoto3 = arquivosAnexados[2];
    //   relatorioFotografico.caminhoFoto4 = arquivosAnexados[3];
    //   relatorioFotografico = await prisma.relatorioFotografico.upsert({
    //     where: {
    //       idOcorrencia: Number(relatorioFotografico.idOcorrencia),
    //     },
    //     update: relatorioFotografico,
    //     create: relatorioFotografico,
    //   });
    // }

    // if (
    //   relatorioFotografico &&
    //   relatorioFotografico.id &&
    //   referencias.length > 0
    // ) {
    //   await prisma.$queryRaw(
    //     Prisma.sql`UPDATE segird.relatorio_fotografico SET referencia_foto_1 = ST_GeomFromGeoJSON(${referencias[0]}), referencia_foto_2 = ST_GeomFromGeoJSON(${referencias[1]}), referencia_foto_3 = ST_GeomFromGeoJSON(${referencias[2]}), referencia_foto_4 = ST_GeomFromGeoJSON(${referencias[3]}) WHERE id = ${relatorioFotografico.id}`
    //   );
    // }

    return {message: "ok"};
  });

};

export default relatorioFotografico;
