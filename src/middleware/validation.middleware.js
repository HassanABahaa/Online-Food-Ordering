export const validation = (schema) => {
  return (req, res, next) => {
    const inputs = {
      ...req.body,
      ...req.params,
      ...req.query,
    };

    const { error } = schema.validate(inputs, { abortEarly: false });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return next(new Error(messages.join(", "), { cause: 400 }));
    }

    return next();
  };
};
