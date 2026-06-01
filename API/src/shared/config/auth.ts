const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || "church-api-dev-secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  },
};

export default authConfig;
