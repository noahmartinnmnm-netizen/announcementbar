import { useEffect } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, useActionData, useLoaderData } from "react-router";
import adminStyles from "../../styles/admin.css?url";
import { login } from "../../shopify.server";
import { loginErrorMessage } from "./error.server";

export const links = () => [{ rel: "stylesheet", href: adminStyles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const errors = loginErrorMessage(await login(request));

  return {
    errors,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const errors = loginErrorMessage(await login(request));

  return { errors };
};

export default function Auth() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const { errors } = actionData || loaderData;

  useEffect(() => {
    if (window.top !== window.self) {
      window.top!.location.href = window.location.href;
    }
  }, []);

  return (
    <div className="sab-login">
      <div className="sab-login__card">
        <h1 className="sab-login__title">Log in to Smart Announcement Bar</h1>
        <p className="sab-login__subtitle">
          Enter your Shopify store domain to install or open the app. You can
          use just the store name, for example{" "}
          <strong>your-store.myshopify.com</strong> or <strong>your-store</strong>.
        </p>

        <Form method="post" className="sab-login__form">
          <label className="sab-login__label" htmlFor="shop">
            Shop domain
          </label>
          <input
            id="shop"
            className={`sab-login__input${errors.shop ? " sab-login__input--error" : ""}`}
            type="text"
            name="shop"
            placeholder="your-store.myshopify.com"
            autoComplete="on"
            required
          />
          {errors.shop ? (
            <p className="sab-login__error" role="alert">
              {errors.shop}
            </p>
          ) : null}

          <button className="sab-login__button" type="submit">
            Continue with Shopify
          </button>
        </Form>

        <p className="sab-login__hint">
          Tip: Open this app from your Shopify admin under Apps for the smoothest
          sign-in experience.
        </p>
      </div>
    </div>
  );
}
