import { z } from "zod";
import { emailField, stringField } from "./global.schema";

export type TLoginSchema = z.infer<typeof loginSchema>;
export const loginSchema = z.object({
  username: stringField("Username"),
  password: stringField("Password", 3),
  role: z.enum(["Issuer", "Holder", "Verifier"], {
    invalid_type_error: "Invalid error type",
    required_error: "Role is required",
  }),
});
