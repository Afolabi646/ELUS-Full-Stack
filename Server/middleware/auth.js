import jwt from "jsonwebtoken";

const auth = async (request, response, next) => {
  try {
    console.log("Request URL:", request.url);
    console.log("Cookies:", request.cookies);
    console.log("Headers:", request.headers);

    const token =
      request.cookies.accessToken ||
      request?.headers?.authorization?.split(" ")[1];
    console.log("Token:", token);

    if (!token) {
      return response.status(401).json({
        message: "Please login",
        error: true,
        success: false,
      });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
    request.userId = decode.id;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return response.status(401).json({
        message: "Token has expired",
        error: true,
        success: false,
      });
    } else if (error.name === "JsonWebTokenError") {
      return response.status(401).json({
        message: "Invalid token",
        error: true,
        success: false,
      });
    }
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export default auth;
