import { createAsyncThunk } from "@reduxjs/toolkit";
import { TLoginSchema } from "@/schemas/auth.schema";

export const login = createAsyncThunk<
  { id: string; token: string; role: TLoginSchema["role"] },
  TLoginSchema
>("login", async (data) => {
  try {
    // const response = await doPost("/admins/login", data);
    // successToast("Login success");

    // return response.data;

    return { id: "238746234", token: "2839ued87ew3yer", role: data.role };
  } catch (error: any) {
    throw error;
  }
});
