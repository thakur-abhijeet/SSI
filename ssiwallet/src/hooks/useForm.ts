import { errorToast, successToast } from "@/lib/toastify";
import { UISelectOptionEvent } from "@/ui/uiselect";
import { parseInputType, validateSchema } from "@/utils/helpers";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { ZodType } from "zod";

interface UseFormProps<T> {
  data?: Partial<T>;
  schema: ZodType<T, any, any>;
}
export default function useForm<T>({ schema, data }: UseFormProps<T>) {
  const [formKey, setFormKey] = useState<number>(1);
  const [state, setState] = useState<Partial<T>>({});
  const [error, setError] = useState<{
    [K in keyof Partial<T>]?: string;
  }>({});

  useEffect(() => {
    data && setState(data);
  }, [data]);

  const handleSubmit = (callback: (val: T) => void) => {
    const response = handleValidation(state);

    if (!response) return;
    callback(response);
  };

  const resetForm = (msg?: string) => {
    setState(data ?? {});
    setError({});
    setFormKey((prev) => prev + 1);
    msg && successToast(msg);
  };

  const handleValidation = (rawData: typeof state) => {
    try {
      const response = validateSchema<T>(rawData, schema);

      console.log(response);

      if (response.errors?.hasError) {
        errorToast("Please verify indicated fields");
        setError(response.errors.error);
        return;
      }

      return response.data;
    } catch (error) {
      errorToast("Something went wrong with validation");
    }
  };

  const handleInput = useCallback(
    (
      e:
        | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | UISelectOptionEvent
    ) => {
      {
        const name = e.target.name;
        const type = e.target.type;
        const required = e.target.required;
        const value = parseInputType(type, e);
        const valid = value !== null && value !== undefined && value !== "";

        setState((prev) => ({ ...prev, [name]: valid ? value : undefined }));

        required &&
          valid &&
          setError((prev) => ({
            ...prev,
            [name]: "",
          }));
      }
    },
    []
  );

  return {
    state,
    error,
    formKey,

    setState,
    setError,
    setFormKey,
    handleInput,
    handleValidation,
    handleSubmit,
    resetForm,
  };
}
