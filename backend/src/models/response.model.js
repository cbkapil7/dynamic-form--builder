export default (sequelize, DataTypes) => {
  return sequelize.define("Response", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    formId: DataTypes.UUID,
    userId: DataTypes.UUID,
  });
};