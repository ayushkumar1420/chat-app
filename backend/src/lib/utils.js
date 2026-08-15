import jsonwebtoken from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const isProduction = process.env.NODE_ENV === "production";

  const token = jsonwebtoken.sign(
    { userId },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });

  return token;
};
