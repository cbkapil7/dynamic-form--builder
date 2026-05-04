import { sequelize } from "../config/sequelize.js";

export const withTransaction = async (cb) => {
  const t = await sequelize.transaction();
  try {
    const result = await cb(t);
    await t.commit();
    return result;
  } catch (e) {
    await t.rollback();
    throw e;
  }
};