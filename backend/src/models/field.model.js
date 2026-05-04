export default (sequelize, DataTypes) => {
  return sequelize.define("Field", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    label: DataTypes.STRING,
    type: DataTypes.STRING,
    formId: DataTypes.UUID,
    order: DataTypes.INTEGER,             
    validations: DataTypes.JSONB,        
    condition: DataTypes.JSONB
  });
};