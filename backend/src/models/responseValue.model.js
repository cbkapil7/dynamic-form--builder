export default (sequelize, DataTypes) => {
  return sequelize.define("ResponseValue", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    responseId: DataTypes.UUID,
    fieldId: DataTypes.UUID,
    value: DataTypes.TEXT,
  });
};