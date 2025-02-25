import { ZodType, z } from "zod";

export const passwordSchema = (
  name: string,
  min: number = 8,
  max: number = 32
) =>
  z
    .string({
      required_error: `${name} is required`,
      invalid_type_error: `${name} type is invalid`,
    })
    .min(min, { message: `${name} is too short` })
    .max(max, { message: `${name} is too long` })
    .refine(
      (password) => {
        if (!/[a-z]/.test(password)) return false;
        if (!/[A-Z]/.test(password)) return false;
        if (!/\d/.test(password)) return false;
        if (!/[!@#$%^&*()-_=+{};:'",<.>\/?[\]\\]/.test(password)) return false;
        return true;
      },
      { message: "Invalid password format" }
    );
export const positiveNumberField = (val: string, min: number = 0) =>
  z
    .number({
      required_error: `${val} is required`,
      invalid_type_error: `Provide valid type`,
    })
    .min(min, { message: "Must be a positive number" });

export const positiveNumberString = (name: string) =>
  z.string().refine((value) => !isNaN(parseFloat(value)), {
    message: `${name} must be a positive number.`,
  });
export const positiveNumberPercentageString = (name: string) =>
  z
    .string()
    .refine(
      (value) => !isNaN(parseFloat(value)) && +value >= 0 && +value <= 100,
      {
        message: `${name} must fulfill percentage conditions (0-100).`,
      }
    );

export const percentageField = (val: string) =>
  z
    .number({
      required_error: `${val} is required`,
      invalid_type_error: `Provide valid type`,
    })
    .min(0, { message: "Must be a greater than or equals to 0" })
    .max(100, { message: "Must be a less than or equals to 100" });

export const emailField = (val: string) =>
  z
    .string({
      required_error: `${val} is required`,
      invalid_type_error: "Provide valid type",
    })
    .min(1, { message: `${val} is required` })
    .email("Invalid email address");

export const stringField = (val: string, min: number = 1, max?: number) =>
  z
    .string({
      required_error: `${val} is required`,
      invalid_type_error: "Provide valid type",
    })
    .min(min, { message: `${val} is too short` })
    .refine((data) => (max ? data.length <= max : true), `${val} is too long`);

export const booleanField = (val: string, min: number = 1) =>
  z.boolean({
    required_error: `${val} is required`,
    invalid_type_error: "Provide valid type",
  });

export const optionalStringField = z
  .string({ invalid_type_error: "Provide valid type" })
  .optional()
  .nullable();
export const optionalNumberField = z
  .number({ invalid_type_error: "Provide valid type" })
  .optional()
  .nullable();
export const optionalBooleanField = z
  .boolean({ invalid_type_error: "Provide valid type" })
  .optional()
  .nullable();
export const optionalPositiveIntegerString = z
  .string()
  .refine((value) => (!value ? true : !isNaN(+value)), {
    message: `Field must be a positive integer.`,
  })
  .optional();
export const enumField = (val: any, name: string) =>
  z.enum(val, {
    required_error: `${name} is required`,
    invalid_type_error: "Provide valid type",
  });

export type GetInferedType<T extends ZodType> = z.infer<T>;
