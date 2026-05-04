import * as service from "../services/form.service.js";

export const createFormController = async (req, res) => {
  const data = await service.createForm(req.body, req.user.id);
  res.json(data);
};

export const getFormsController = async (req, res, next) => {
  try {
    const data = await service.getForms(req.user); 
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getFormController = async (req, res, next) => {
  try {
    const data = await service.getForm(req.params.id, req.user); 
    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const updateFormController = async (req, res, next) => {
  try {
    const data = await service.updateForm(
      req.params.id,
      req.body,
      req.user
    );

    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const submitFormController = async (req, res, next) => {
  console.log(req.body);
  try {
    const data = await service.submitForm(
      req.params.id,
      req.body,
      req.user
    );

    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const getMyResponseController = async (req, res, next) => {
  try {
    const data = await service.getMyResponse(
      req.params.id,
      req.user
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
};

