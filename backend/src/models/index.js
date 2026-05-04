import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

import User from "./user.model.js";
import Form from "./form.model.js";
import Field from "./field.model.js";
import Response from "./response.model.js";
import ResponseValue from "./responseValue.model.js";

const db = {};

db.User = User(sequelize, DataTypes);
db.Form = Form(sequelize, DataTypes);
db.Field = Field(sequelize, DataTypes);
db.Response = Response(sequelize, DataTypes);
db.ResponseValue = ResponseValue(sequelize, DataTypes);

// relations
db.Form.hasMany(db.Field, { foreignKey: "formId" });
db.Field.belongsTo(db.Form);

db.Form.hasMany(db.Response, { foreignKey: "formId" });
db.Response.belongsTo(db.Form);

db.Response.hasMany(db.ResponseValue, {
  foreignKey: "responseId",
  as: "values",
});

db.ResponseValue.belongsTo(db.Response, {
  foreignKey: "responseId",
});

db.ResponseValue.belongsTo(db.Field, {
  foreignKey: "fieldId",
});

db.Field.hasMany(db.ResponseValue, {
  foreignKey: "fieldId",
});

db.Form.belongsTo(db.User, {
  foreignKey: "createdBy",
  as: "creator", // alias
});

db.User.hasMany(db.Form, {
  foreignKey: "createdBy",
});

db.sequelize = sequelize;

export default db;