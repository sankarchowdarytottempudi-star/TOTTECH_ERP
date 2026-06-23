import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString =
  process.env.DATABASE_URL!;

const pool = new Pool({
  connectionString,
});

const adapter =
  new PrismaPg(pool);

const globalForPrisma =
  global as unknown as {
    prisma: ReturnType<
      typeof createPrismaClient
    >;
  };

const writeOperations = new Set([
  "create",
  "createMany",
  "update",
  "updateMany",
  "upsert",
  "delete",
  "deleteMany",
]);

const asRecord = (
  value: unknown
) =>
  value &&
  typeof value === "object" &&
  !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

const numericValue = (
  value: unknown
) =>
  typeof value === "number"
    ? value
    : typeof value === "string" &&
      value.trim()
    ? Number(value)
    : null;

const createPrismaClient = () => {
  const base =
    new PrismaClient({
      adapter,
    });

  return base.$extends({
    query: {
      $allModels: {
        async $allOperations({
          model,
          operation,
          args,
          query,
        }) {
          const result =
            await query(args);

          if (
            model &&
            model !== "audit_logs" &&
            writeOperations.has(operation)
          ) {
            const input =
              asRecord(args);
            const data =
              asRecord(input.data);
            const where =
              asRecord(input.where);
            const schoolId =
              numericValue(
                data.school_id ??
                  where.school_id
              );
            const userId =
              numericValue(
                data.user_id ??
                  where.user_id
              );

            void base.audit_logs
              .create({
                data: {
                  school_id: schoolId,
                  user_id: userId,
                  action_type: `${model}.${operation}`,
                  action_details:
                    JSON.stringify({
                      model,
                      operation,
                      where,
                      dataKeys:
                        Object.keys(
                          data
                        ).filter(
                          (key) =>
                            !key
                              .toLowerCase()
                              .includes(
                                "password"
                              )
                        ),
                    }).slice(0, 1900),
                },
              })
              .catch((error) => {
                console.error(
                  "Prisma audit log failed",
                  error
                );
              });
          }

          return result;
        },
      },
    },
  });
};

export const prisma =
  globalForPrisma.prisma ||
  createPrismaClient();

if (
  process.env.NODE_ENV !==
  "production"
) {
  globalForPrisma.prisma =
    prisma;
}
