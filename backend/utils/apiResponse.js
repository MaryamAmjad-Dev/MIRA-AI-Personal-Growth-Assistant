export function sendSuccess(res, data, statusCode = 200) {
  res.status(statusCode).json({
    success: true,
    data,
  });
}

export function sendError(res, message, statusCode = 500, errors = null) {
  const body = {
    success: false,
    message,
  };

  if (errors) {
    body.errors = errors;
  }

  res.status(statusCode).json(body);
}
