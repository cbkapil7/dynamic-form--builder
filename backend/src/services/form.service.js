import db from "../models/index.js";
import { withTransaction } from "../utils/transaction.util.js";
import { createError } from "../utils/error.util.js";
import { Op } from "sequelize";

export const createForm = async (data, userId) => {
  console.log(data);
  if (!data || !data.title || !data.title.trim()) {
    throw createError("Form title is required", 400);
  }

  if (!Array.isArray(data.fields) || data.fields.length === 0) {
    throw createError("At least one field is required", 400);
  }

  const allowedTypes = ["TEXT", "NUMBER", "DATE", "DROPDOWN", "CHECKBOX"];
  const allowedOperators = ["EQUALS", "NOT_EQUALS", "GT", "LT"];

  return withTransaction(async (t) => {
    const form = await db.Form.create(
      {
        title: data.title.trim(),
        createdBy: userId,
      },
      { transaction: t }
    );

    for (let index = 0; index < data.fields.length; index++) {
      const field = data.fields[index];

     
      if (!field.label || !field.label.trim() || !field.type) {
        throw createError("Field label and type are required", 400);
      }

      if (!allowedTypes.includes(field.type)) {
        throw createError(`Invalid field type: ${field.type}`, 400);
      }

      
     
      if (field.type === "DROPDOWN") {
        if (
          !Array.isArray(field.options) ||
          field.options.length === 0 ||
          field.options.some((opt) => !opt || !opt.trim())
        ) {
          throw createError(
            "Dropdown must have at least one non-empty option",
            400
          );
        }
      }

      if (field.type === "CHECKBOX" && field.options?.length) {
        throw createError("Checkbox should not have options", 400);
      }

      const validations = field.validations || {};

      if (validations.min && typeof validations.min !== "number") {
        throw createError("min must be a number", 400);
      }

      if (validations.max && typeof validations.max !== "number") {
        throw createError("max must be a number", 400);
      }

      if (validations.minLength && typeof validations.minLength !== "number") {
        throw createError("minLength must be a number", 400);
      }

      if (validations.maxLength && typeof validations.maxLength !== "number") {
        throw createError("maxLength must be a number", 400);
      }

      let condition = null;

      if (field.condition) {
        const { fieldId, operator, value } = field.condition;

        if (!fieldId || !operator) {
          throw createError("Invalid condition config", 400);
        }

        if (!allowedOperators.includes(operator)) {
          throw createError(`Invalid condition operator: ${operator}`, 400);
        }

        condition = {
          fieldId,
          operator,
          value,
        };
      }

      const order =
        typeof field.order === "number" ? field.order : index;

      await db.Field.create(
        {
          label: field.label.trim(),
          type: field.type,
          formId: form.id,

          options:
            field.type === "DROPDOWN"
              ? field.options.map((o) => o.trim())
              : [],
          order,
          validations,
          condition,
        },
        { transaction: t }
      );
    }

    return {
      id: form.id,
      title: form.title,
    };
  });
};





export const getForms = async (user, page = 1, limit = 5) => {
  const offset = (page - 1) * limit;

  const baseQuery = {
    attributes: ["id", "title", "createdBy"],
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  };


  if (user.role === "ADMIN") {
    const { rows, count } = await db.Form.findAndCountAll(baseQuery);

    return {
      forms: rows,
      total: count,
      page,
      limit,
      hasMore: offset + rows.length < count,
    };
  }


  const { rows, count } = await db.Form.findAndCountAll({
    ...baseQuery,
    include: [
      {
        model: db.User,
        as: "creator",
        attributes: [],
        where: { role: "ADMIN" },
      },
    ],
  });

  return {
    forms: rows,
    total: count,
    page,
    limit,
    hasMore: offset + rows.length < count,
  };
};

export const getForm = async (id, user) => {
  if (!id) {
    throw createError("Form ID is required", 400);
  }

  const form = await db.Form.findByPk(id, {
    include: [
      {
        model: db.Field,
        attributes: [
          "id",
          "label",
          "type",
          "options",     
          "order",        
          "validations",  
          "condition"     
        ],
        order: [["order", "ASC"]] 
      }
    ]
  });

  if (!form) {
    throw createError("Form not found", 404);
  }

  return form;
};


export const updateForm = async (formId, data, user) => {
  const transaction = await db.sequelize.transaction();

  try {
    if (user.role !== "ADMIN") {
      throw createError("Only admin can update form", 403);
    }

    const { title, fields } = data;

    if (!title || !Array.isArray(fields) || fields.length === 0) {
      throw createError("Invalid payload", 400);
    }

    const form = await db.Form.findByPk(formId, { transaction });

    if (!form) {
      throw createError("Form not found", 404);
    }

    await form.update({ title }, { transaction });

    await db.Field.destroy({
      where: { formId },
      transaction,
    });

    for (const field of fields) {
      if (!field.label || !field.type) {
        throw createError("Invalid field data", 400);
      }

      await db.Field.create(
        {
          label: field.label,
          type: field.type,
          options: field.options || [],
          formId,
        },
        { transaction }
      );
    }

    await transaction.commit();

    return { message: "Form updated successfully" };

  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};


export const submitForm = async (formId, values, user) => {
  const t = await db.sequelize.transaction();

  try {
    if (user.role !== "USER") {
      throw createError("Only users can submit forms", 403);
    }

    const form = await db.Form.findByPk(formId, {
      include: [
        {
          model: db.Field,
          attributes: [
            "id",
            "label",
            "type",
            "options",
            "order",
            "validations",
            "condition",
          ],
        },
      ],
      transaction: t,
    });

    if (!form) {
      throw createError("Form not found", 404);
    }

    //  SORT important for consistent validation order
    const fields = [...form.Fields].sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );

    const evaluateCondition = (field) => {
      if (!field.condition) return true;

      const { fieldId, operator = "EQUALS", value } = field.condition;
      const parentVal = values[fieldId];

      switch (operator) {
        case "EQUALS":
          return parentVal === value;
        case "NOT_EQUALS":
          return parentVal !== value;
        case "GT":
          return Number(parentVal) > Number(value);
        case "LT":
          return Number(parentVal) < Number(value);
        default:
          return true;
      }
    };

   
    for (const field of fields) {
      const val = values[field.id];
      const rules = field.validations || {};

     
      const shouldValidate = evaluateCondition(field);
      if (!shouldValidate) continue;

    
      if (rules.required && (val === undefined || val === "" || val === null)) {
        throw createError(`${field.label} is required`, 400);
      }

    
      if (field.type === "NUMBER" && val !== undefined && val !== "") {
        if (isNaN(Number(val))) {
          throw createError(`${field.label} must be a number`, 400);
        }
      }

      if (field.type === "DATE" && val) {
        if (isNaN(Date.parse(val))) {
          throw createError(`${field.label} must be a valid date`, 400);
        }
      }

    
      if (field.type === "TEXT" && typeof val === "string") {
        if (rules.minLength && val.length < rules.minLength) {
          throw createError(
            `${field.label} must be at least ${rules.minLength} characters`,
            400
          );
        }
        if (rules.maxLength && val.length > rules.maxLength) {
          throw createError(
            `${field.label} must be at most ${rules.maxLength} characters`,
            400
          );
        }
      }

      // numeric min/max
      if (field.type === "NUMBER" && val !== undefined && val !== "") {
        const num = Number(val);

        if (rules.min !== undefined && num < rules.min) {
          throw createError(`${field.label} must be >= ${rules.min}`, 400);
        }

        if (rules.max !== undefined && num > rules.max) {
          throw createError(`${field.label} must be <= ${rules.max}`, 400);
        }
      }

      // dropdown options validation
      if (field.type === "DROPDOWN" && val) {
        if (!field.options?.includes(val)) {
          throw createError(`${field.label} has invalid value`, 400);
        }
      }
    }

    
    let response = await db.Response.findOne({
      where: { formId, userId: user.id },
      transaction: t,
      order: [["createdAt", "DESC"]],
    });

    const isNew = !response;

    if (isNew) {
      response = await db.Response.create(
        { formId, userId: user.id },
        { transaction: t }
      );
    } else {
      await db.ResponseValue.destroy({
        where: { responseId: response.id },
        transaction: t,
      });
    }

   
    for (const fieldId in values) {
      await db.ResponseValue.create(
        {
          responseId: response.id,
          fieldId,
          value: String(values[fieldId]),
        },
        { transaction: t }
      );
    }

    await t.commit();

    return {
      message: isNew
        ? "Form submitted successfully"
        : "Form updated successfully",
      id: response.id,
    };
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

export const getMyResponse = async (formId, user) => {
  console.log("==== getMyResponse START ====");
  const allResponses = await db.Response.findAll({ raw: true });

  const response = await db.Response.findOne({
    where: {
      formId,
      userId: user.id,
    },
    include: [
      {
        model: db.ResponseValue,
        as: "values",
      },
    ],
    order: [["createdAt", "DESC"]]
  });

  if (!response) {
    console.log(" No response found for given formId + userId");
    console.log("==== getMyResponse END ====");
    return {};
  }

  const allValues = await db.ResponseValue.findAll({ raw: true });

  if (!response.values || response.values.length === 0) {
    console.log(" No values found for this responseId:", response.id);
  }

  const mapped = {};
  for (const v of response.values || []) {

    mapped[v.fieldId] = v.value;
  }

  console.log("Final mapped object:", mapped);
  console.log("==== getMyResponse END ====");

  return mapped;
};