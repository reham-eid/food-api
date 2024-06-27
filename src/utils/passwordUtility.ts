import bcrypt from "bcryptjs";

export const generateSalt = async () => {
  return await bcrypt.genSalt();
};

export const generateHashPassword = async (password: string, salt: string) => {
  return bcrypt.hashSync(password, salt);
};

export const ValidatePassword = async (
  password: string,
  savedPassword: string,
  salt: string
) => {
  return (await generateHashPassword(password, salt)) === savedPassword;
};

