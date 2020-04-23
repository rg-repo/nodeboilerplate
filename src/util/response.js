const constant = require('@src/constant');

function prepareResponse(res, resMeta) {
  const { message, data, status, statusCode } = resMeta;
  const resStatus = status || true;
  const resStatusCode = statusCode || 200;
  const resData = data || {};
  res.status(resStatusCode);
  if (resMeta.token) {
    res.header(constant.AUTH_TOKEN, resMeta.token);
  }
  res.json({
    message,
    status: resStatus,
    data: resData
  });
}

module.exports = {
  prepareResponse
};
