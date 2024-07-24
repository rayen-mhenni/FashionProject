import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import axios from "axios";
import Image from "next/image";
import { GetStaticProps } from "next";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Button from "../components/Buttons/Button";
import { roundDecimal } from "../components/Util/utilFunc";
import { useCart } from "../context/cart/CartProvider";
import Input from "../components/Input/Input";
import { itemType } from "../context/wishlist/wishlist-type";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import autocomplete, { AutocompleteItem, EventTrigger } from "autocompleter";
import _, { isEmpty, isNil } from "lodash";

// this type will prevent typescript warnings

type Item = {
  name: string;
  postcode: string;
  city: string;
  context: string;
};

type MyItem = Item & AutocompleteItem;

// let w = window.innerWidth;
type PaymentType = "CASH_ON_DELIVERY" | "BANK_TRANSFER";
type DeliveryType = "DOMICILE" | "POINT_RELE";

type Order = {
  orderNumber: number;
  customerId: number;
  shippingAddress: string;
  township?: null | string;
  city?: null | string;
  state?: null | string;
  zipCode?: null | string;
  orderDate: string;
  paymentType?: PaymentType | null;
  deliveryType: DeliveryType;
  totalPrice: number;
  deliveryDate: string;
};

const ShoppingCart = () => {
  const t = useTranslations("CartWishlist");
  const { cart, clearCart } = useCart();
  const auth = useAuth();
  const [deli, setDeli] = useState<DeliveryType>("DOMICILE");
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentType>("CASH_ON_DELIVERY");

  // Form Fields
  const [name, setName] = useState(auth.user?.fullname || "");
  const [email, setEmail] = useState(auth.user?.email || "");
  const [phone, setPhone] = useState(auth.user?.phone || "");
  const [city, setcity] = useState("");
  const [postcode, setpostcode] = useState("");
  const [context, setcontext] = useState("");
  const [adrname, setadrname] = useState("");
  const [password, setPassword] = useState("");
  const [shippingAddress, setShippingAddress] = useState(
    auth.user?.shippingAddress || ""
  );
  const [isOrdering, setIsOrdering] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [orderError, setOrderError] = useState("");
  const [sendEmail, setSendEmail] = useState(false);

  const products = cart.map((item) => ({
    id: item.id,
    quantity: item.qty,
    option: item?.option,
    size: item?.size,
  }));

  useEffect(() => {
    if (
      typeof document !== "undefined" &&
      !isNil(document.getElementById("myinputfield"))
    )
      autocomplete<MyItem>({
        input: document.getElementById("myinputfield") as any,
        className: "autoComplete",
        emptyMsg: "aucune addresse",
        minLength: 1,
        debounceWaitMs: 1000,
        fetch: async (
          text: string,
          update: (items: Item[]) => void,
          Trigger: EventTrigger,
          cursorPos: number
        ) => {
          console.log("testtttttttttttt", text, Trigger, cursorPos);
          let res1,
            res2,
            res3,
            res4 = [];
          if (text.length >= 3) {
            res1 = await fetch(
              `https://api-adresse.data.gouv.fr/search/?q=${text}&type=street&autocomplete=1`
            )
              .then((res) => res.json())
              .catch((res) => []);

            res2 = await fetch(
              `https://api-adresse.data.gouv.fr/search/?q=${text}&type=locality&autocomplete=1`
            )
              .then((res) => res.json())
              .catch((res) => []);

            res3 = await fetch(
              `https://api-adresse.data.gouv.fr/search/?q=${text}&type=municipality&autocomplete=1`
            )
              .then((res) => res.json())
              .catch((res) => []);
            res4 = await fetch(
              `https://api-adresse.data.gouv.fr/search/?q=${text}&type=housenumber&autocomplete=1`
            )
              .then((res) => res.json())
              .catch((res) => []);

            const arrayOfRes = res1?.features
              ?.map((el: any) => ({
                name: el?.properties?.name,
                postcode: el?.properties?.postcode,
                city: el?.properties?.city,
                context: el?.properties?.context,
              }))
              .concat(
                res2?.features?.map((el: any) => ({
                  name: el?.properties?.name,
                  postcode: el?.properties?.postcode,
                  city: el?.properties?.city,
                  context: el?.properties?.context,
                }))
              )
              .concat(
                res3?.features?.map((el: any) => ({
                  name: el?.properties?.name,
                  postcode: el?.properties?.postcode,
                  city: el?.properties?.city,
                  context: el?.properties?.context,
                }))
              )
              .concat(
                res4?.features?.map((el: any) => ({
                  name: el?.properties?.name,
                  postcode: el?.properties?.postcode,
                  city: el?.properties?.city,
                  context: el?.properties?.context,
                }))
              );

            const finalRes: any = _.uniqBy(_.compact(arrayOfRes), "context");
            if (!isEmpty(finalRes)) update(finalRes);
          }
        },
        onSelect: (item: Item) => {
          setadrname(item?.name);
          setcontext(item?.context);
          setpostcode(item?.postcode);
          setcity(item?.city);

          document.getElementById("myinputfield")!.value =
            item?.name + " " + item?.context ?? "";
        },
        render: function (
          item: Item,
          currentValue: string
        ): HTMLDivElement | undefined {
          const itemElement = document.createElement("div");
          itemElement.className = "subautocomplete";
          itemElement.textContent = item?.name + " " + item.context;
          return itemElement;
        },
      });
  }, [typeof document]);

  // useEffect(() => {
  //   if (!isOrdering) return;

  //   setErrorMsg("");

  //   // if not logged in, register the user
  //   const registerUser = async () => {
  //     const regResponse = await auth.register!(
  //       email,
  //       name,
  //       password,
  //       adrname,
  //       phone
  //     );
  //     if (!regResponse.success) {
  //       setIsOrdering(false);
  //       if (regResponse.message === "alreadyExists") {
  //         setErrorMsg("email_already_exists try to login with this Email !!");
  //       } else {
  //         setErrorMsg("error_occurs");
  //       }
  //       return false;
  //     }
  //   };
  //   if (!auth.user) registerUser();

  //   const makeOrder = async () => {
  //     const res = await axios.post(`${process.env.NEXT_PUBLIC_ORDERS_MODULE}`, {
  //       customerId: auth!.user!.id,
  //       shippingAddress: adrname,
  //       totalPrice: Number(roundDecimal(+subtotal + deliFee)),
  //       deliveryDate: new Date().setDate(new Date().getDate() + 7),
  //       paymentType: "OTHERS",
  //       deliveryType: deli,
  //       products,
  //       sendEmail,
  //     });
  //     if (res?.data?.success) {
  //       setCompletedOrder(res.data.data);
  //       clearCart!();
  //       setIsOrdering(false);
  //     } else {
  //       setOrderError("error_occurs");
  //     }
  //   };
  //   if (auth.user) makeOrder();
  // }, [isOrdering]);


  const Ordering = ()=> {


    setErrorMsg("");

    // if not logged in, register the user
    const registerUser = async () => {
      const regResponse = await auth.register!(
        email,
        name,
        password,
        context,
        phone
      );
      if (!regResponse.success) {
        setIsOrdering(false);
        if (regResponse.message === "alreadyExists") {
          setErrorMsg("email_already_exists try to login with this Email !!");
        } else {
          setErrorMsg("error_occurs");
        }
        return false;
      }
    };
    if (!auth.user) registerUser();

    const makeOrder = async () => {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_ORDERS_MODULE}`, {
        customerId: auth!.user!.id,
        shippingAddress: context,
        totalPrice: Number(roundDecimal(+subtotal + deliFee)),
        deliveryDate: new Date().setDate(new Date().getDate() + 7),
        paymentType: "OTHERS",
        deliveryType: deli,
        products,
        sendEmail,
      });
      if (res?.data?.success) {
        setCompletedOrder(res.data.data);
        clearCart!();
        setIsOrdering(false);
      } else {
        setOrderError("error_occurs");
      }
    };
    if (auth.user) makeOrder();
    
  }

  useEffect(() => {
    if (auth.user) {
      setName(auth.user.fullname);
      setEmail(auth.user.email);
      setShippingAddress(auth.user.shippingAddress || "");
      setPhone(auth.user.phone || "");
    } else {
      setName("");
      setEmail("");
      setShippingAddress("");
      setPhone("");
    }
  }, [auth.user]);

  let subtotal: number | string = 0;

  subtotal = roundDecimal(
    cart.reduce(
      (accumulator: number, currentItem: itemType) =>
        accumulator + currentItem.price * currentItem!.qty!,
      0
    )
  );

  let deliFee = 0;
  if (deli === "POINT_RELE") {
    deliFee = 2.0;
  } else if (deli === "DOMICILE") {
    deliFee = 7.0;
  }

  const stripe: any = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);
  const [paymentSuccess, setpaymentSuccess] = useState(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (elements == null) {
      return;
    }

    // Trigger form validation and wallet collection
    const { error: submitError }: any = await elements.submit();
    if (submitError) {
      // Show error to your customer
      setErrorMessage(submitError.message);
      return;
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_CREATEPAYMENT_MODULE}`,
      {
        totalPrice: Number(roundDecimal(+subtotal + deliFee)),
        email:auth?.user?.email,
        name:auth?.user?.fullname,
      }
    );

    const { error }: any = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      clientSecret: response.data.clientSecret,
      confirmParams: {
        return_url: "https://example.com/order/123/complete",
      },
      redirect: "if_required",
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message);
      setpaymentSuccess(false);
    } else {
      setpaymentSuccess(true);
      setErrorMessage(null);
      toast.success("Payment Done you can complite the order");

      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  let disableOrder = true;

  if (!auth.user) {
    disableOrder =
      name !== "" &&
      email !== "" &&
      phone !== "" &&
      password !== "" &&
      paymentSuccess
        ? false
        : true;
  } else {
    disableOrder =
      name !== "" && email !== "" && phone !== "" && paymentSuccess
        ? false
        : true;
  }

  return (
    <div>
      {/* ===== Head Section ===== */}
      <Header title={`Shopping Cart - Haru Fashion`} />

      <main id="main-content">
        <Toaster />
        {/* ===== Heading & Continue Shopping */}
        <div className="app-max-width px-4 sm:px-8 md:px-20 w-full border-t-2 border-gray100">
          <h1 className="text-2xl sm:text-4xl text-center sm:text-left mt-6 mb-2 animatee__animated animate__bounce">
            {t("checkout")}
          </h1>
        </div>

        {/* ===== Form Section ===== */}
        {!completedOrder ? (
          <div className="app-max-width px-4 sm:px-8 md:px-20 mb-14 flex flex-col lg:flex-row">
            <div className="h-full w-full lg:w-7/12 mr-8">
              <div className="my-4">
                <label htmlFor="name" className="text-lg">
                  {t("name")}
                </label>
                <Input
                  name="name"
                  type="text"
                  extraClass="w-full mt-1 mb-2"
                  border="border-2 border-gray400"
                  value={name}
                  onChange={(e) =>
                    setName((e.target as HTMLInputElement).value)
                  }
                  required
                />
              </div>

              <div className="my-4">
                <label htmlFor="email" className="text-lg mb-1">
                  {t("email_address")}
                </label>
                <Input
                  name="email"
                  type="email"
                  readOnly={auth.user ? true : false}
                  extraClass={`w-full mt-1 mb-2 ${
                    auth.user ? "bg-gray100 cursor-not-allowed" : ""
                  }`}
                  border="border-2 border-gray400"
                  value={email}
                  onChange={(e) =>
                    setEmail((e.target as HTMLInputElement).value)
                  }
                  required
                />
              </div>

              {!auth.user && (
                <div className="my-4">
                  <label htmlFor="password" className="text-lg">
                    {t("password")}
                  </label>
                  <Input
                    name="password"
                    type="password"
                    extraClass="w-full mt-1 mb-2"
                    border="border-2 border-gray400"
                    value={password}
                    onChange={(e) =>
                      setPassword((e.target as HTMLInputElement).value)
                    }
                    required
                  />
                </div>
              )}

              <div className="my-4">
                <label htmlFor="phone" className="text-lg">
                  {t("phone")}
                </label>
                <Input
                  name="phone"
                  type="text"
                  extraClass="w-full mt-1 mb-2"
                  border="border-2 border-gray400"
                  value={phone}
                  onChange={(e) =>
                    setPhone((e.target as HTMLInputElement).value)
                  }
                  required
                />
              </div>
              {/* <label htmlFor="toggle" className="text-lg text-gray-700">
                {"Adresse Livraison"}
              </label> */}

              <div className="my-4">
                <label htmlFor="shipping_address" className="text-lg">
                  {t("shipping_address")}
                </label>

                <Input
                  name="myinputfield"
                  id="myinputfield"
                  type="text"
                  extraClass="w-full mt-1 mb-2"
                  border="border-2 border-gray400"
                />

                {/* <textarea
                  id="shipping_address"
                  aria-label="shipping address"
                  className="w-full mt-1 mb-2 border-2 border-gray400 p-4 outline-none"
                  rows={4}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress((e.target as HTMLTextAreaElement).value)}
                /> */}
              </div>
              <div className="my-4">
                <label htmlFor="shipping_address" className="text-lg">
                  {"Adresse"}
                </label>

                <Input
                  name="Adresse"
                  type="text"
                  extraClass="w-full mt-1 mb-2"
                  border="border-2 border-gray400"
                  value={adrname}
                  onChange={(e) =>
                    setadrname((e.target as HTMLInputElement).value)
                  }
                />
              </div>

              <div className="my-4">
                <label htmlFor="shipping_address" className="text-lg">
                  {"postcode"}
                </label>

                <Input
                  name="postcode"
                  type="text"
                  extraClass="w-full mt-1 mb-2"
                  border="border-2 border-gray400"
                  value={postcode}
                  onChange={(e) =>
                    setpostcode((e.target as HTMLInputElement).value)
                  }
                />
              </div>
              <div className="my-4">
                <label htmlFor="shipping_address" className="text-lg">
                  {"city"}
                </label>

                <Input
                  name="city"
                  type="text"
                  extraClass="w-full mt-1 mb-2"
                  border="border-2 border-gray400"
                  value={city}
                  onChange={(e) =>
                    setcity((e.target as HTMLInputElement).value)
                  }
                />
              </div>

              {!auth.user && (
                <div className="text-sm text-gray400 mt-8 leading-6">
                  {t("form_note")}
                </div>
              )}
            </div>
            <div className="h-full w-full lg:w-5/12 mt-10 lg:mt-4">
              {/* Cart Totals */}
              <div className="border border-gray500 p-6 divide-y-2 divide-gray200">
                <div className="flex justify-between">
                  <span className="text-base uppercase mb-3">
                    {t("product")}
                  </span>
                  <span className="text-base uppercase mb-3">
                    {t("subtotal")}
                  </span>
                </div>

                <div className="pt-2">
                  {cart.map((item: any) => (
                    <div className="flex justify-between mb-2" key={item.id}>
                      <span className="text-base font-medium">
                        {item.name}{" "}
                        <span className="text-gray400">x {item.qty}</span>{" "}
                        <span className="text-gray400">| {item.size}</span>
                      </span>
                      <span className="text-base">
                        $ {roundDecimal(item.price * item!.qty!)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="py-3 flex justify-between">
                  <span className="uppercase">{t("subtotal")}</span>
                  <span>$ {subtotal}</span>
                </div>

                <div className="py-3">
                  <span className="uppercase">{t("delivery")}</span>
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between">
                      <div>
                        <input
                          type="radio"
                          name="deli"
                          value="POINT_RELE"
                          id="POINT_RELE"
                          checked={deli === "POINT_RELE"}
                          onChange={() => setDeli("POINT_RELE")}
                        />{" "}
                        <label htmlFor="POINT_RELE" className="cursor-pointer">
                          {"Livraison en point relais (Mondial Relay)"}
                        </label>
                      </div>
                      <span> € 3.80</span>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <input
                          type="radio"
                          name="deli"
                          value="DOMICILE"
                          id="DOMICILE"
                          checked={deli === "DOMICILE"}
                          onChange={() => setDeli("DOMICILE")}
                        />{" "}
                        <label htmlFor="DOMICILE" className="cursor-pointer">
                          {"Livraison à domicile"}
                        </label>
                      </div>
                      <span> € 8.80</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between py-3">
                    <span>{t("grand_total")}</span>
                    <span>$ {roundDecimal(+subtotal + deliFee)}</span>
                  </div>

                  <div className="grid gap-4 mt-2 mb-4">
                    {/* <label
                      htmlFor="plan-cash"
                      className="relative flex flex-col bg-white p-5 rounded-lg shadow-md border border-gray300 cursor-pointer"
                    >
                      <span className="font-semibold text-gray-500 text-base leading-tight capitalize">
                        {t("cash_on_delivery")}
                      </span>
                      <input
                        type="radio"
                        name="plan"
                        id="plan-cash"
                        value="CASH_ON_DELIVERY"
                        className="absolute h-0 w-0 appearance-none"
                        onChange={() => setPaymentMethod("CASH_ON_DELIVERY")}
                      />
                      <span
                        aria-hidden="true"
                        className={`${
                          paymentMethod === "CASH_ON_DELIVERY" ? "block" : "hidden"
                        } absolute inset-0 border-2 border-gray500 bg-opacity-10 rounded-lg`}
                      >
                        <span className="absolute top-4 right-4 h-6 w-6 inline-flex items-center justify-center rounded-full bg-gray100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-5 w-5 text-green-600"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      </span>
                    </label>
                    <label
                      htmlFor="plan-bank"
                      className="relative flex flex-col bg-white p-5 rounded-lg shadow-md border border-gray300 cursor-pointer"
                    >
                      <span className="font-semibold text-gray-500 leading-tight capitalize">{t("bank_transfer")}</span>
                      <span className="text-gray400 text-sm mt-1">{t("bank_transfer_desc")}</span>
                      <input
                        type="radio"
                        name="plan"
                        id="plan-bank"
                        value="BANK_TRANSFER"
                        className="absolute h-0 w-0 appearance-none"
                        onChange={() => setPaymentMethod("BANK_TRANSFER")}
                      />
                      <span
                        aria-hidden="true"
                        className={`${
                          paymentMethod === "BANK_TRANSFER" ? "block" : "hidden"
                        } absolute inset-0 border-2 border-gray500 bg-opacity-10 rounded-lg`}
                      >
                        <span className="absolute top-4 right-4 h-6 w-6 inline-flex items-center justify-center rounded-full bg-gray100">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="h-5 w-5 text-green-600"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      </span>
                    </label> */}
                    <form onSubmit={handleSubmit}>
                      <PaymentElement />

                      <Button
                        value={"Pay"}
                        size="xl"
                        extraClass={`w-full mt-5`}
                        type="submit"
                        disabled={
                          (!stripe || !elements) &&
                          name !== "" &&
                          email !== "" &&
                          phone !== ""
                        }
                      />

                      {/* Show error message to your customers */}
                      {errorMessage && <div>{errorMessage}</div>}
                    </form>
                  </div>

                  <div className="my-8">
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                      <input
                        type="checkbox"
                        name="send-email-toggle"
                        id="send-email-toggle"
                        checked={sendEmail}
                        onChange={() => setSendEmail(!sendEmail)}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray300 appearance-none cursor-pointer"
                      />
                      <label
                        htmlFor="send-email-toggle"
                        className="toggle-label block overflow-hidden h-6 rounded-full bg-gray300 cursor-pointer"
                      ></label>
                    </div>
                    <label
                      htmlFor="send-email-toggle"
                      className="text-xs text-gray-700"
                    >
                      {t("send_order_email")}
                    </label>
                  </div>
                </div>

                <Button
                  value={t("place_order")}
                  size="xl"
                  extraClass={`w-full`}
                  onClick={() => Ordering()}
                  disabled={disableOrder}
                />
              </div>

              {errorMsg !== "" && (
                <span className="text-red text-sm font-semibold">
                  - {t(errorMsg)}
                </span>
              )}

              {orderError !== "" && (
                <span className="text-red text-sm font-semibold">
                  - {orderError}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="app-max-width px-4 sm:px-8 md:px-20 mb-14 mt-6">
            <div className="text-gray400 text-base">{t("thank_you_note")}</div>

            <div className="flex flex-col md:flex-row">
              <div className="h-full w-full md:w-1/2 mt-2 lg:mt-4">
                <div className="border border-gray500 p-6 divide-y-2 divide-gray200">
                  <div className="flex justify-between">
                    <span className="text-base uppercase mb-3">
                      {t("order_id")}
                    </span>
                    <span className="text-base uppercase mb-3">
                      {completedOrder.orderNumber}
                    </span>
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between mb-2">
                      <span className="text-base">{t("email_address")}</span>
                      <span className="text-base">{auth.user?.email}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-base">{t("order_date")}</span>
                      <span className="text-base">
                        {new Date(
                          completedOrder.orderDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-base">{t("delivery_date")}</span>
                      <span className="text-base">
                        {new Date(
                          completedOrder.deliveryDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="py-3">
                    <div className="flex justify-between mb-2">
                      <span className="">{t("payment_method")}</span>
                      <span>{completedOrder.paymentType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="">{t("delivery_method")}</span>
                      <span>{completedOrder.deliveryType}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between mb-2">
                    <span className="text-base uppercase">{t("total")}</span>
                    <span className="text-base">
                      $ {completedOrder.totalPrice}
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-full w-full md:w-1/2 md:ml-8 mt-4 md:mt-2 lg:mt-4">
                <div>
                  {t("your_order_received")}
                  {completedOrder.paymentType === "BANK_TRANSFER" &&
                    t("bank_transfer_note")}
                  {completedOrder.paymentType === "CASH_ON_DELIVERY" &&
                    completedOrder.deliveryType !== "DOMICILE" &&
                    t("cash_delivery_note")}
                  {completedOrder.deliveryType === "DOMICILE" &&
                    t("store_pickup_note")}
                  {t("thank_you_for_purchasing")}
                </div>

                {completedOrder.paymentType === "BANK_TRANSFER" ? (
                  <div className="mt-6">
                    <h2 className="text-xl font-bold">
                      {t("our_banking_details")}
                    </h2>
                    <span className="uppercase block my-1">Sat Naing :</span>

                    <div className="flex justify-between w-full xl:w-1/2">
                      <span className="text-sm font-bold">AYA Bank</span>
                      <span className="text-base">20012345678</span>
                    </div>
                    <div className="flex justify-between w-full xl:w-1/2">
                      <span className="text-sm font-bold">CB Bank</span>
                      <span className="text-base">0010123456780959</span>
                    </div>
                    <div className="flex justify-between w-full xl:w-1/2">
                      <span className="text-sm font-bold">KPay</span>
                      <span className="text-base">095096051</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-56">
                    <div className="w-3/4">
                      <Image
                        className="justify-center"
                        src="/logo.svg"
                        alt="Haru Fashion"
                        width={220}
                        height={50}
                        layout="responsive"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ===== Footer Section ===== */}
      <Footer />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../messages/common/${locale}.json`)).default,
    },
  };
};

export default ShoppingCart;
