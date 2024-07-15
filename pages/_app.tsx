import { NextComponentType, NextPageContext } from "next";
import Router from "next/router";
import NProgress from "nprogress";
import { NextIntlProvider } from "next-intl";

import { ProvideCart } from "../context/cart/CartProvider";
import { ProvideWishlist } from "../context/wishlist/WishlistProvider";
import { ProvideAuth } from "../context/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentElement, Elements, useStripe, useElements } from "@stripe/react-stripe-js";

import "../styles/globals.css";
import "animate.css";
import "nprogress/nprogress.css";

// Import Swiper styles
import "swiper/swiper.min.css";
import "swiper/components/navigation/navigation.min.css";
import "swiper/components/pagination/pagination.min.css";
import "swiper/components/scrollbar/scrollbar.min.css";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

type AppCustomProps = {
  Component: NextComponentType<NextPageContext, any, {}>;
  pageProps: any;
  cartState: string;
  wishlistState: string;
};

const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51PcmN3DIMS3Lybv9aOrD9VaN3mLG7bkBBzcDHf3aIaIffVv70VvDv3kdG0b4QUABQigvYHd9juMwttVPn0QRRHTw00Wlb2Qove";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const options = {
  mode: "payment",
  amount: 1099,
  currency: "eur",
  // Fully customizable with appearance API.
  appearance: {
    /*...*/
  },
};

const MyApp = ({ Component, pageProps }: AppCustomProps) => {
  // const stripePromise = await fetch("/api/v1/config").then(async (r) => {
  //   const { publishableKey } = await r.json();
  //  return loadStripe(publishableKey);
  // });

  return (
    <NextIntlProvider messages={pageProps?.messages}>
      <ProvideAuth>
        <ProvideWishlist>
          <ProvideCart>
            <Elements stripe={stripePromise} options={options}>
              <Component {...pageProps} />
            </Elements>
          </ProvideCart>
        </ProvideWishlist>
      </ProvideAuth>
    </NextIntlProvider>
  );
};

export default MyApp;
