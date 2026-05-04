export default (sequelize, DataTypes) => {
  return sequelize.define("Form", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: DataTypes.STRING,
    createdBy: DataTypes.UUID,
  });
};