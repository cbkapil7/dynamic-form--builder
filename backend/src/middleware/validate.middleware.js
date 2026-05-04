import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true, removeAdditional: "failing" });
addFormats(ajv);

// CACHE
const validatorCache = new WeakMap();

export const validate = (schema) => {
  let validateFn = validatorCache.get(schema);

  if (!validateFn) {
    validateFn = ajv.compile(schema);
    validatorCache.set(schema, validateFn);
  }

  return (req, res, next) => {
    const valid = validateFn(req.body);

    if (!valid) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validateFn.errors
      });
    }

    next();
  };
};