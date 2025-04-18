/* eslint-disable react/jsx-key */
import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import Image from "next/image";
import { Disclosure } from "@headlessui/react";
import { useTranslations } from "next-intl";
import axios from "axios";

import Heart from "../../public/icons/Heart";
import DownArrow from "../../public/icons/DownArrow";
import FacebookLogo from "../../public/icons/FacebookLogo";
import InstagramLogo from "../../public/icons/InstagramLogo";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import GhostButton from "../../components/Buttons/GhostButton";
import Button from "../../components/Buttons/Button";
import Card from "../../components/Card/Card";
import Circle from "@uiw/react-color-circle";
import _, { isEmpty } from "lodash";

// swiperjs
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination, Navigation } from "swiper/core";
import { apiProductsType, itemType } from "../../context/cart/cart-types";
import { useWishlist } from "../../context/wishlist/WishlistProvider";
import { useCart } from "../../context/cart/CartProvider";
import HeartSolid from "../../public/icons/HeartSolid";
import copy from "copy-to-clipboard";
import emailjs from "@emailjs/browser";
import moment from "moment";
import { roundDecimal } from "../../components/Util/utilFunc";
import { fbPixelAddToCart, fbPixelPurchase } from "../../components/Util/fb";
import Input from "../../components/Input/Input";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";

// install Swiper modules
SwiperCore.use([Pagination, Navigation]);

type Props = {
  product: any;
  products: any[];
};

const Product: React.FC<Props> = ({ product, products }) => {
  const { addItem } = useCart();
  const { wishlist, addToWishlist, deleteWishlistItem } = useWishlist();
  const [currency, setCurrency] = useState("TND");
  const [size, setSize] = useState("");
  const [mainImg, setMainImg] = useState(product?.mainImg);
  const [currentQty, setCurrentQty] = useState(1);
  const [copied, setCopied] = useState(false);
  const [color, setColor] = useState(product?.options[0]?.color);
  const [productOption, setProductOption] = useState(product?.options[0]);
  const t = useTranslations("Category");
  const router = useRouter();
  const auth = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const alreadyWishlisted = wishlist.some((wItem) => wItem.id === product.id);

  useEffect(() => {
    setMainImg(product?.mainImg);
    setColor(product?.options[0]?.color);
    setProductOption(product?.options[0]);
  }, [product]);

  const handleSize = (value: string) => {
    setSize(value);
  };

  const currentItem = {
    ...product,
    price: product.prixVente,
    img1: productOption?.images?.split(",")[0],
    options: 1,
    size,
    qty: currentQty,
  };

  const handleWishlist = () => {
    alreadyWishlisted
      ? deleteWishlistItem!(currentItem)
      : addToWishlist!(currentItem);
  };

  const calculateTotalPrice = () => {
    const basePrice = Number(currentItem.price) * currentQty + 8;
    const discount = currentQty > 1 ? (currentQty - 1) * 8 : 0;
    return roundDecimal(basePrice - discount) + 8; // 8 TND for shipping
  };

  const handleOrder = async () => {
    setIsOrdering(true);
    setOrderError("");

    try {
      // Register user if not exists
      // await auth.register!(
      //   `client${Date.now()}@client.com`,
      //   name,
      //   "12345678",
      //   shippingAddress,
      //   phone,

      // );

      // Create order
      const orderResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_ORDERS_MODULE}`,
        {
          date: moment().format("MMMM Do YYYY, h:mm:ss a"),
          customerName: name,
          customerAddress: shippingAddress,
          customerPhone: phone,
          items: [
            {
              stockId: product._id,
              color,
              size,
              image: mainImg,
              reference: product.reference,
              nom: product.nom,
              quantity: Number(currentQty),
              prixAchat: Number(productOption.prixAchat),
              prixVente: Number(productOption.prixVente),
            },
          ],
          subtotal: Number(calculateTotalPrice()),
          tax: 0,
          total: Number(calculateTotalPrice()),
          status: "pending",
          notes: "Waiting for confirmation",
        }
      );

      if (orderResponse.data) {
        // fbPixelPurchase(Number(calculateTotalPrice()));
        // setPaymentSuccess(true);
        router.push("/coming-soon");
      } else {
        setOrderError("Erreur lors de la commande. Veuillez réessayer.");
      }
    } catch (error) {
      setOrderError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsOrdering(false);
    }
  };

  // const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = e.target.files;
  //   if (files && files.length > 0) {
  //     const newImages = Array.from(files).slice(0, Number(productOption?.discount) - uploadedImages.length);
  //     setUploadedImages([...uploadedImages, ...newImages]);
  //   }
  // };

  return (
    <div className="bg-gray-50">
      <Header title={`${product.nom} - Haru Fashion`} />

      <main
        id="main-content"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Breadcrumb */}
        <nav className="flex py-4" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link href="/">
                <a className="text-gray-400 hover:text-gray-500">Accueil</a>
              </Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <Link href={`/product-category/${product.categoryName}`}>
                <a className="text-gray-400 hover:text-gray-500 capitalize">
                  {t(product.categoryName as string)}
                </a>
              </Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li className="text-gray-900 font-medium">{product.nom}</li>
          </ol>
        </nav>

        {/* Product Section */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Image Gallery */}
          <div className="mb-8 lg:mb-0">
            <div className="relative mb-4 rounded-lg overflow-hidden">
              <Image
                src={mainImg || productOption?.images?.split(",")[0]}
                alt={product.nom}
                width={800}
                height={800}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {productOption?.images
                ?.split(",")
                ?.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setMainImg(img)}
                    className={`rounded-md overflow-hidden border-2 ${
                      mainImg === img
                        ? "border-green-500"
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product?.name} thumbnail ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-auto object-cover"
                    />
                  </button>
                ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{product.nom}</h1>

            <div className="flex items-center">
              <span className="text-2xl font-semibold text-gray-800">
                {product.prixVente} {currency}
              </span>
              {currentQty > 1 && (
                <span className="ml-4 text-green-600">
                  Économisez {(currentQty - 1) * 8} {currency}
                </span>
              )}
            </div>

            <p className="text-gray-600">{product.description}</p>

            <div className="border-t border-b border-gray-200 py-4">
              <div className="flex items-center mb-2">
                <span className="font-medium mr-2">Disponibilité:</span>
                <span className="text-green-600">En stock</span>
              </div>

              {/* Color Selection */}
              <div className="mb-4">
                <span className="block font-medium mb-2">Couleur:</span>
                <Circle
                  colors={product?.options?.map((el: any) => el.color)}
                  color={color}
                  onChange={(color) => {
                    setColor(color.hex);
                    const option = product?.options?.find(
                      (el: any) => color.hex === el.color
                    );
                    if (option) {
                      setProductOption(option);
                      setMainImg(option?.images?.split(",")[0]);
                      setSize(option?.sizes?.split(",")[0]);
                    }
                  }}
                />
              </div>

              {/* Size Selection */}
              <div className="mb-4">
                <span className="block font-medium mb-2">
                  Taille: <span className="font-bold text-red"> {size}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {productOption?.sizes
                    ?.split(",")
                    ?.map((sizeOption: string) => (
                      <button
                        key={sizeOption}
                        onClick={() => setSize(sizeOption)}
                        className={`px-4 py-2 border rounded-md transition-all duration-150 ${
                          size.toLocaleLowerCase() ===
                          sizeOption.toLocaleLowerCase()
                            ? "bg-green-50 border-green-600 text-green-700 shadow-sm font-medium"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                        }`}
                      >
                        {sizeOption}
                      </button>
                    ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-4">
                <span className="block font-medium mb-2">Quantité:</span>
                <div className="flex items-center">
                  <button
                    onClick={() => setCurrentQty(Math.max(1, currentQty - 1))}
                    className="px-3 py-1 border border-gray-300 rounded-l-md bg-gray-100 hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-t border-b border-gray-300 bg-white">
                    {currentQty}
                  </span>
                  <button
                    onClick={() => setCurrentQty(currentQty + 1)}
                    className="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-100 hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button
                value="Ajouter au panier"
                size="lg"
                extraClass="flex-grow hover:bg-green-700"
                onClick={() => {
                  addItem!({
                    ...product,
                    name: product.nom,
                    price: product.prixVente,
                    img1: productOption?.images?.split(",")[0],
                    options: product._id + color,
                    size,
                    color,
                    qty: currentQty,
                  });
                  fbPixelAddToCart();
                }}
              />
              <GhostButton
                onClick={handleWishlist}
                extraClass="border-2 border-gray-300 hover:border-gray-400"
              >
                {alreadyWishlisted ? (
                  <HeartSolid extraClass="text-red-500" />
                ) : (
                  <Heart extraClass="text-gray-500" />
                )}
              </GhostButton>
            </div>

            {/* Product Details Accordion */}
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="w-full flex justify-between items-center py-3 text-left font-medium text-gray-700 border-b border-gray-200">
                    <span>Détails du produit</span>
                    <DownArrow
                      extraClass={`${
                        open ? "transform rotate-180" : ""
                      } w-5 h-5 text-gray-500 transition-transform`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="py-4 text-gray-600">
                    {product.detail ||
                      "Aucun détail supplémentaire disponible."}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        </div>

        {/* Order Form */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Passer la commande
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nom complet
                </label>
                <Input
                  name="name"
                  type="text"
                  extraClass="w-full"
                  border="border-2 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Numéro de téléphone
                </label>
                <Input
                  placeholder="Exemple: 99 999 999"
                  name="phone"
                  type="tel"
                  extraClass="w-full"
                  border="border-2 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="shipping_address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Adresse de livraison
                </label>
                <textarea
                  id="shipping_address"
                  className="w-full border-2 border-gray-300 focus:border-green-500 focus:ring-green-500 p-3 rounded-md"
                  rows={3}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-bold mb-4">Résumé de la commande</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Produit</span>
                  <span className="font-medium">
                    {roundDecimal(Number(currentItem.price) * currentQty)}{" "}
                    {currency}
                  </span>
                </div>

                {currentQty > 1 && (
                  <div className="flex justify-between text-green-600">
                    <span>Remise</span>
                    <span>
                      -{(currentQty - 1) * 8} {currency}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span className="font-medium">8 {currency}</span>
                </div>

                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>
                      {calculateTotalPrice()} {currency}
                    </span>
                  </div>
                </div>
              </div>

              {orderError && (
                <div className="mt-4 text-red-600 text-center">
                  {orderError}
                </div>
              )}

              <Button
                value={isOrdering ? "Traitement..." : "Confirmer la commande"}
                size="lg"
                extraClass={`w-full mt-6 py-3 ${
                  paymentSuccess
                    ? "bg-green-600"
                    : "bg-green-600 hover:bg-green-700"
                } text-white font-bold`}
                disabled={
                  isEmpty(name) ||
                  isEmpty(phone) ||
                  phone.length !== 8 ||
                  isEmpty(shippingAddress) ||
                  isOrdering ||
                  paymentSuccess
                }
                onClick={handleOrder}
              />

              {paymentSuccess && (
                <div className="mt-4 text-green-600 text-center font-medium">
                  Commande passée avec succès! Redirection...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="mt-16 mb-10">
          <h2 className="text-2xl font-bold mb-8">Produits similaires</h2>
          <div className="relative">
            <Swiper
              slidesPerView={1}
              spaceBetween={20}
              navigation
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              className="py-4"
            >
              {products?.map((item) => (
                <SwiperSlide key={item.id}>
                  <Card item={item} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
}) => {
  const paramId = params!.id as string;
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_PRODUCTS_MODULE}/${paramId}`
  );
  const fetchedProduct: any = res.data;

  const resProducts = await axios.get(
    `${process.env.NEXT_PUBLIC_PRODUCTS_MODULE}`
  );
  const products: any = resProducts.data;

  return {
    props: {
      product: {
        ...fetchedProduct,
        mainImg: fetchedProduct?.options[0]?.images?.split(",")[0],
      },
      products: products?.map((el: any) => ({
        id: el?._id,
        options: el?.options,
        size: el?.options[0].sizes?.split(",")[0],
        name: el?.nom,
        price: el?.prixVente,
        qty: 1,
        description: el?.description || "",
        detail: el?.detail || "",
        img1: el?.options[0]?.images?.split(",")[0],
        img2:
          el?.options[0]?.images?.split(",")[1] ||
          el?.options[0]?.images?.split(",")[0],
        categoryName: el?.categoryName || "uncategorized",
        stock: el?.options[0].quantiteInitiale,
        createdAt: el?.createdAt,
      })),
      messages: (await import(`../../messages/common/${locale}.json`)).default,
    },
  };
};

export default Product;
