import { LOGO } from "@/constants/images";
import useForm from "@/hooks/useForm";
import { dismissToast } from "@/lib/toastify";
import { setLoading } from "@/redux/slice/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { login } from "@/redux/thunks/authThunk";
import { TLoginSchema, loginSchema } from "@/schemas/auth.schema";
import UIButton from "@/ui/uibutton";
import UIInput from "@/ui/uiinput";
import UILoader from "@/ui/uiloader";
import UISelect from "@/ui/uiselect";
import Head from "next/head";
import { useRouter } from "next/router";
import { MouseEvent, useEffect } from "react";

const defaultValue: {
  username: string;
  password: string;
  role: TLoginSchema["role"];
} = {
  username: "admin",
  password: "Admin@123",
  role: "Issuer",
};
export default function Home() {
  const router = useRouter();
  const redirect = router.query;

  const { error, state, handleInput, handleSubmit } = useForm<TLoginSchema>({
    data: defaultValue,
    schema: loginSchema,
  });

  const dispatch = useAppDispatch();
  const authSelector = useAppSelector((state) => state.auth);

  const handleLogin = (e: MouseEvent<HTMLElement>) => {
    handleSubmit((data) => {
      dispatch(login(data));
    });
  };

  useEffect(() => {
    dismissToast();
    dispatch(setLoading(false));
    if (authSelector.isLoggedIn && authSelector.token && authSelector.role) {
      router.push(
        redirect?.redirect
          ? decodeURIComponent(redirect.redirect.toString())
          : authSelector.role.toLowerCase()
      );
    }
  }, [authSelector.isLoggedIn, authSelector.role, authSelector.token, router]);

  return (
    <>
      <Head>
        <title>Self Sovereign Identity | Login</title>
        <meta name="description" content="Self Sovereign Identity" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={LOGO.src} />
        <link
          rel="stylesheet"
          href="https://site-assets.fontawesome.com/releases/v6.2.0/css/all.css"
        ></link>
      </Head>
      <main>
        {authSelector.loading ? <UILoader overlay /> : null}
        <div className="login">
          <div className="login-wrapper">
            <div className="login-wrapper--flex">
              <h2 className="login-heading">
                Welcome to <span>Self Sovereign Identity</span>
              </h2>
              <p className="login-caption">
                Create & Manage Credentials through SSI
              </p>
            </div>
            <div className="login-wrapper--flex">
              <UISelect
                label="Role"
                options={[
                  { value: "Issuer" },
                  { value: "Holder" },
                  { value: "Verifier" },
                ]}
                id="role"
                name="role"
                placeholder="Select role"
                onChange={handleInput}
              />
              <UIInput
                id="username"
                name="username"
                isRequired
                label="Username"
                placeholder="eg. example.."
                error={error.username}
                onChange={handleInput}
                defaultValue={state.username}
              />

              <UIInput
                id="password"
                name="password"
                isRequired
                label="Password"
                placeholder="eg. ********"
                type="password"
                error={error.password}
                onChange={handleInput}
                defaultValue={state.password}
              />
            </div>

            <UIButton onClick={handleLogin} label="Login" type="primary" />
          </div>
        </div>
      </main>
    </>
  );
}
