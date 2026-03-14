import prisma from "../config/database.js";
import { AppError } from "../utils/apperror.js";

interface CreateUserTypeInput {
  name: string;
}

const validateCreateUserType = (data: CreateUserTypeInput) => {
  if (!data.name || data.name.trim().length < 3) {
    throw new AppError(
      "User type name must be at least 3 characters",
      400
    );
  }
};


export const createUserTypeService = async (
  data: CreateUserTypeInput
) => {
  validateCreateUserType(data);

  const existing = await prisma.userTypeMaster.findUnique({
    where: { name: data.name },
  });

  if (existing) {
    throw new AppError("User type already exists", 409);
  }

  const userType = await prisma.userTypeMaster.create({
    data: {
      name: data.name,
    },
  });

  return userType;
};



export const getAllUserTypesService = async () => {
  const userTypes = await prisma.userTypeMaster.findMany({
    orderBy: { id: "asc" },
  });

  return userTypes;
};