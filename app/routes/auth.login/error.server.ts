import { LoginErrorType } from "@shopify/shopify-app-react-router/server";

interface LoginErrors {
  shop?: LoginErrorType;
}

export function loginErrorMessage(loginErrors: LoginErrors | undefined) {
  if (loginErrors?.shop === LoginErrorType.MissingShop) {
    return { shop: "Please enter your shop domain to log in" };
  }

  if (loginErrors?.shop === LoginErrorType.InvalidShop) {
    return {
      shop: "Enter a valid Shopify domain, such as your-store.myshopify.com",
    };
  }

  return {};
}
