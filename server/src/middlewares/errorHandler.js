export const errorHandler = (error, _req, res) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  if (error.name === "ValidationError") {
    res.status(400).json({
      message: "Validation failed",
      details: Object.values(error.errors).map((item) => item.message),
    });
    return;
  }

  if (error.name === "CastError") {
    res.status(400).json({ message: "Invalid resource identifier" });
    return;
  }

  res.status(statusCode).json({
    message: error.message || "Internal server error",
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
  });
};
