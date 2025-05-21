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
  paramId: any;
};

const ProductOptions = ({
  product,
  currency,
  color,
  setColor,
  size,
  setSize,
  currentQty,
  setCurrentQty,
  productOption,
  setProductOption,
  setMainImg,
  mainImg,
  originalPrice,
  calculateDiscountPrice,
  packageOptions,
  pairSelections,
  setPairSelections,
  setSelectedPackage,
  selectedPackage,
}) => {
  // Update quantity based on package selection
  // useEffect(() => {
  //   setCurrentQty(selectedPackage);
  // }, [selectedPackage, setCurrentQty]);

  // Handle updating a specific pair's color
  const handleColorChange = (pairIndex, newColor, option) => {
    setColor(option.color);
    setProductOption(option);
    setMainImg(option?.images?.split(",")[0]);
    setSize(option?.sizes?.split(",")[0]);

    const updatedSelections = [...pairSelections];
    updatedSelections[pairIndex].color = newColor;
    updatedSelections[pairIndex].image = option?.images?.split(",")[0];
    setPairSelections(updatedSelections);
  };

  // Handle updating a specific pair's size
  const handleSizeChange = (pairIndex, newSize) => {
    const updatedSelections = [...pairSelections];
    updatedSelections[pairIndex].size = newSize;
    setPairSelections(updatedSelections);
  };
  return (
    <div className="space-y-6">
      {/* Package Selection with Radio Buttons */}
      <div className="space-y-4">
        {packageOptions.map((option) => (
          <div
            key={option.id}
            className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
              selectedPackage === option.id
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div
              className="flex items-center justify-between"
              onClick={() => {
                setPairSelections(
                  pairSelections.map((el: any) => ({
                    ...el,
                    color: product?.options[0]?.color,
                    size: product?.options[0]?.sizes?.split(",")[0],
                    image: product?.option?.images?.split(",")[0],
                    // quantity: Number(option.itemNb),
                  }))
                );
                setSelectedPackage(option?.id);
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-5 h-5">
                  <input
                    type="radio"
                    checked={selectedPackage === option.id}
                    onChange={() => {
                      setPairSelections([]);
                      const str = [];
                      for (let i = 0; i < option?.itemNb; i++) {
                        console.log("str", str);
                        str.push({
                          color: productOption.color,
                          size: productOption?.sizes?.split(",")[0],
                          image: productOption?.images?.split(",")[0],
                          stockId: product?._id,
                          reference: product?.reference,
                          nom: product?.nom,
                          quantity: Number(1),
                          prixAchat: Number(product?.prixAchat ?? 0),
                          prixVente: Number(product?.prixVente ?? 0),
                          discount: product?.discount || 0,
                        });
                      }
                      console.log("str", str);
                      setPairSelections([...str]);
                      setSelectedPackage(option.id);
                    }}
                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                </div>

                <div className="font-medium">
                  {option.name}
                  {option.label && (
                    <span
                      className={`ml-5 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md animate-pulse `}
                      style={{
                        backgroundColor: "#dc2626",
                        animation: "pulse 1.5s infinite",
                        boxShadow: "0 2px 8px rgba(255, 0, 0, 0.3)",
                        textShadow: "0 1px 1px rgba(0,0,0,0.2)",
                      }}
                    >
                      {option.label}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-lg">
                  {option.price.toFixed(3)} {currency}
                </div>

                {option.itemNb > 1 && option.originalPrice && (
                  <div className="text-sm text-gray-500 line-through">
                    {option.originalPrice.toFixed(3)} {currency}
                  </div>
                )}
              </div>
            </div>
            {option.id !== 1 && (
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                  {option.id === 2 ? "Populaire" : ""}
                </span>
              </div>
            )}

            {selectedPackage === option.id && (
              <div className="mt-6">
                {/* Multiple pair selectors */}
                {Array.from({ length: option.id }).map((_, index) => (
                  <div
                    key={index}
                    className="mb-4 pb-4 border-b border-gray-200 last:border-0"
                  >
                    {/* <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">{index + 1}.</div>
                    </div> */}

                    <div className="flex items-center justify-between mb-1">
                      {/* Custom Color Selector */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <h3 className="font-medium text-gray-700">
                              Couleur
                            </h3>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          {product?.options?.map((option) => {
                            const isSelected =
                              pairSelections[index]?.color === option.color;

                            console.log(
                              "tttttt",
                              pairSelections[index]?.color,
                              option.color
                            );
                            return (
                              <div
                                key={option.color}
                                className="flex flex-col items-center"
                              >
                                <button
                                  onClick={() =>
                                    handleColorChange(
                                      index,
                                      option.color,
                                      option
                                    )
                                  }
                                  className={`w-8 h-8 rounded-full border-3 transition-all duration-200 flex items-center justify-center shadow-sm ${
                                    isSelected
                                      ? "border-blue-500 scale-105 ring-2 ring-blue-200"
                                      : "border-gray-100 hover:border-gray-300"
                                  }`}
                                  style={{
                                    backgroundColor: option.color,
                                    border: "1px solid",
                                  }}
                                  aria-label={`Sélectionner la couleur ${option.color}`}
                                >
                                  {isSelected && (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5 text-white"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      style={{
                                        filter:
                                          "drop-shadow(0 0 2px rgba(0,0,0,0.5))",
                                      }}
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* {option.id === 1 && (
                        <div>
                          <span className="block font-medium mb-2">
                            Quantité:
                          </span>
                          <div className="flex items-center">
                            <button
                              onClick={() =>
                                setCurrentQty(Math.max(1, currentQty - 1))
                              }
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
                      )} */}

                      {/* Size dropdown */}

                      <div>
                        <label
                          htmlFor={`size-${index}`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Taille
                        </label>
                        <select
                          id={`size-${index}`}
                          value={pairSelections[index]?.size}
                          onChange={(e) =>
                            handleSizeChange(index, e.target.value)
                          }
                          className="appearance-none block w-full pl-10 pr-6 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          {product.options
                            .find(
                              (elm: any) =>
                                elm.color === pairSelections[index]?.color
                            )
                            ?.sizes?.split(",")
                            ?.map((sizeOption: any) => (
                              <option key={sizeOption} value={sizeOption}>
                                {sizeOption}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
const Product: React.FC<Props> = ({ paramId }) => {
  const { addItem } = useCart();
  const { wishlist, addToWishlist, deleteWishlistItem } = useWishlist();
  const [currency, setCurrency] = useState("TND");
  const [size, setSize] = useState("");
  const [mainImg, setMainImg] = useState("");
  const [currentQty, setCurrentQty] = useState(1);
  const [copied, setCopied] = useState(false);
  const [color, setColor] = useState("");
  const [productOption, setProductOption] = useState<any>();
  const [originalPrice, setOriginalPrice] = useState(0);

  const [product, setProduct] = useState<any>();
  const [products, setProducts] = useState<any>();

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

  const [pairSelections, setPairSelections] = useState([]);

  const [selectedPackage, setSelectedPackage] = useState(1);

  // Default to 3 pairs based on the image
  const [packageOptions, setpackageOptions] = useState([]); // Default to 3 pairs based on the image
  // Package options with discounts

  const fetchData = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_PRODUCTS_MODULE}/${paramId}`
    );
    const fetchedProduct: any = res.data;

    const resProducts = await axios.get(
      `${process.env.NEXT_PUBLIC_PRODUCTS_MODULE}`
    );
    const products: any[] = resProducts?.data?.map((el: any) => ({
      id: el?._id,
      options: el?.options,
      size: el?.options[0].sizes?.split(",")[0],
      name: el?.nom,
      price: el?.prixVente,
      qty: 1,
      description: "",
      detail: "",
      img1: el?.options[0]?.images?.split(",")[0],
      img2:
        el?.options[0]?.images?.split(",").length > 1
          ? el?.options[0]?.images?.split(",")[1]
          : el?.options[0]?.images?.split(",")[0],
      stock: el?.options[0].quantiteInitiale,
      createdAt: el?.createdAt,
    }));

    setProduct(fetchedProduct);
    setProducts(products);
    setpackageOptions(fetchedProduct?.packageOptions);

    setPairSelections(
      fetchedProduct?.packageOptions.map((el) => ({
        color: fetchedProduct?.options[0]?.color,
        size: fetchedProduct?.options[0]?.sizes?.split(",")[0],
        image: fetchedProduct?.options[0]?.images?.split(",")[0],
        stockId: fetchedProduct?._id,
        reference: fetchedProduct?.reference,
        nom: fetchedProduct?.nom,
        quantity: Number(currentQty),
        prixAchat: Number(fetchedProduct?.prixAchat ?? 0),
        prixVente: Number(fetchedProduct?.prixVente),
        discount: fetchedProduct?.discount || 0,
      }))
    );

    setMainImg(fetchedProduct?.options[0]?.images?.split(",")[0]);
    setColor(fetchedProduct?.options[0]?.color);
    setProductOption(fetchedProduct?.options[0]);
    setOriginalPrice(fetchedProduct?.prixVente);
  };

  console.log("packageOptions", packageOptions);

  useEffect(() => {
    fetchData();
  }, [paramId]);

  // State for individual pair selections

  const alreadyWishlisted = wishlist.some((wItem) => wItem.id === product?.id);

  const calculateDiscountPrice = () => {
    if (!product?.discount) return originalPrice;
    return originalPrice - product.discount;
  };

  console.log("handleColorChange", mainImg);

  const currentItem = {
    ...product,
    price: calculateDiscountPrice(),
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
    // let gfg = _.sumBy(arr, function (o) { return o.n; });
    // const basePrice = _.sumBy(
    //   pairSelections.slice(0, selectedPackage),
    //   function (o) {
    //     return Number(o?.prixVente);
    //   }
    // );
    if (selectedPackage !== 1) {
      return roundDecimal(
        Number(
          isEmpty(packageOptions)
            ? 0
            : packageOptions[selectedPackage - 1]?.price
        ) + 8
      );
    } else {
      return roundDecimal(
        Number(packageOptions && packageOptions[0]?.originalPrice) *
          currentQty +
          8
      );
    }

    // 8 TND for shipping
  };

  const handleOrder = async () => {
    setIsOrdering(true);
    setOrderError("");

    try {
      // console.log(
      //   "eeeeeeeeeee",
      //   selectedPackage !== 1
      //     ? pairSelections.slice(0, selectedPackage)
      //     : [
      //         {
      //           color: pairSelections[0]?.color,
      //           size: pairSelections[0]?.size,
      //           image: pairSelections[0]?.image,
      //           stockId: pairSelections[0]?._id,
      //           reference: pairSelections[0]?.reference,
      //           nom: pairSelections[0]?.nom,
      //           quantity: Number(currentQty),
      //           prixAchat: pairSelections[0]?.prixAchat,
      //           prixVente: pairSelections[0]?.prixVente,
      //           discount: pairSelections[0]?.discount,
      //         },
      //       ]
      // );
      const orderResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_ORDERS_MODULE}`,
        {
          date: moment().format("MMMM Do YYYY, h:mm:ss a"),
          customerName: name,
          customerAddress: shippingAddress,
          customerPhone: phone,
          items:
            selectedPackage !== 1
              ? pairSelections.slice(0, selectedPackage)
              : [
                  {
                    color: pairSelections[0]?.color,
                    size: pairSelections[0]?.size,
                    image: pairSelections[0]?.image,
                    stockId: pairSelections[0]?._id,
                    reference: pairSelections[0]?.reference,
                    nom: pairSelections[0]?.nom,
                    quantity: Number(currentQty),
                    prixAchat: pairSelections[0]?.prixAchat,
                    prixVente: pairSelections[0]?.prixVente,
                    discount: pairSelections[0]?.discount,
                  },
                ],
          subtotal: Number(calculateTotalPrice()),
          tax: 0,
          total: Number(calculateTotalPrice()),
          status: "pending",
          notes: "En attente de confirmation",
        }
      );

      if (orderResponse.data) {
        fbPixelPurchase(Number(calculateTotalPrice()));
        setPaymentSuccess(true);
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
  return (
    <div className="bg-gray-50">
      <Header title={`${product?.nom} - RAF SHOP`} />

      <main
        id="main-content"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Fil d'Ariane */}
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
              <Link href={`/product-category/${product?.categoryName}`}>
                <a className="text-gray-400 hover:text-gray-500 capitalize">
                  {t(product?.categoryName as string)}
                </a>
              </Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li className="text-gray-900 font-medium">{product?.nom}</li>
          </ol>
        </nav>

        {/* Section Produit */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Galerie d'images */}
          <div className="mb-8 lg:mb-0">
            <div className="relative mb-4 rounded-lg overflow-hidden">
              {productOption?.images
                ?.split(",")
                ?.map((img: string, index: number) => (
                  <div
                    key={img + index}
                    className={`transition-opacity duration-300 ${
                      mainImg === img
                        ? "opacity-100"
                        : "opacity-0 absolute inset-0"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product?.nom} view ${index + 1}`}
                      width={800}
                      height={800}
                      className="w-full h-auto object-contain"
                      priority={index === 0}
                    />
                  </div>
                ))}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {productOption?.images
                ?.split(",")
                ?.map((img: string, index: number) => (
                  <button
                    key={img + index}
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

          {/* Informations Produit */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{product?.nom}</h1>

            <div className="flex items-center">
              {product?.discount ? (
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-semibold text-gray-800">
                    {calculateDiscountPrice()} {currency}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {originalPrice} {currency}
                  </span>
                  <span
                    className="relative bg-red-600 text-red text-sm font-bold px-3 py-1 rounded-md animate-pulse"
                    style={{
                      animation: "pulse 1.5s infinite",
                      boxShadow: "0 2px 8px rgba(255, 0, 0, 0.3)",
                      textShadow: "0 1px 1px rgba(0,0,0,0.2)",
                    }}
                  >
                    -{product.discount} {currency}
                    <span
                      className="absolute -right-1 bottom-0 w-2 h-2 bg-red-800 transform rotate-45"
                      style={{ clipPath: "polygon(0 0, 100% 100%, 0 100%)" }}
                    ></span>
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-semibold text-gray-800">
                  {originalPrice} {currency}
                </span>
              )}
            </div>

            <p className="text-gray-600">{product?.description}</p>

            <div className="border-t border-b border-gray-200 py-4">
              <div className="flex items-center mb-2">
                <span className="font-medium mr-2">Disponibilité:</span>
                <span className="text-green-600">En stock</span>
              </div>
              <ProductOptions
                product={product}
                currency={currency}
                color={color}
                setColor={setColor}
                size={size}
                setSize={setSize}
                currentQty={currentQty}
                setCurrentQty={setCurrentQty}
                productOption={productOption}
                setProductOption={setProductOption}
                setMainImg={setMainImg}
                originalPrice={originalPrice}
                calculateDiscountPrice={calculateDiscountPrice}
                packageOptions={packageOptions}
                pairSelections={pairSelections}
                setPairSelections={setPairSelections}
                setSelectedPackage={setSelectedPackage}
                selectedPackage={selectedPackage}
                mainImg={mainImg}
              />

              {/* {false && (
                <>
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <h3 className="font-medium text-gray-900">Couleur</h3>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                      {product?.options?.map((option: any) => {
                        const isSelected = color === option.color;
                        return (
                          <div
                            key={option.color}
                            className="flex flex-col items-center"
                          >
                            <button
                              onClick={() => {
                                setColor(option.color);
                                setProductOption(option);
                                setMainImg(option?.images?.split(",")[0]);
                                setSize(option?.sizes?.split(",")[0]);
                              }}
                              className={` w-8 h-8 rounded-full border-3 transition-all duration-200 flex items-center justify-center shadow-sm ${
                                isSelected
                                  ? "border-blue-500 scale-105 ring-2 ring-blue-200"
                                  : "border-gray-100 hover:border-gray-300"
                              } `}
                              style={{
                                backgroundColor: option.color,
                                border: "1px solid",
                              }}
                              aria-label={`Sélectionner la couleur ${option.color}`}
                            >
                              {isSelected && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-white"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  style={{
                                    filter:
                                      "drop-shadow(0 0 2px rgba(0,0,0,0.5))",
                                  }}
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="block font-medium mb-2">
                      Taille:{" "}
                      <span className="font-bold text-red"> {size}</span>
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

                  <div className="mb-4">
                    <span className="block font-medium mb-2">Quantité:</span>
                    <div className="flex items-center">
                      <button
                        onClick={() =>
                          setCurrentQty(Math.max(1, currentQty - 1))
                        }
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
                </>
              )} */}
            </div>

            {/* Boutons d'action */}
            {/* <div className="flex space-x-4">
              <Button
                value="Ajouter au panier"
                size="lg"
                disabled={isEmpty(size)}
                extraClass="flex-grow hover:bg-green-700"
                onClick={() => {
                  addItem!({
                    ...product,
                    name: product?.nom,
                    price: calculateDiscountPrice(),
                    img1: product?.options[0]?.images?.split(",")[0],
                    options: product?._id + color,
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
            </div> */}

            {/* Détails Produit Accordéon */}
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
                    {product?.details &&
                      product?.details?.split("✅").map((el: any) => (
                        <>
                          {" "}
                          <span>✅ {el} </span> <br />
                        </>
                      ))}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        </div>

        {/* Formulaire de commande */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Passer la commande
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Colonne gauche */}
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

            {/* Colonne droite - Récapitulatif */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-bold mb-4">Résumé de la commande</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Produit</span>
                  <span className="font-medium">
                    {Number(calculateTotalPrice()) - 8} {currency}
                  </span>
                </div>

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
                  isEmpty(pairSelections.slice(0, selectedPackage)) ||
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

        {/* Produits similaires */}
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
  return {
    props: {
      paramId,
      messages: (await import(`../../messages/common/${locale}.json`)).default,
    },
  };
};

export default Product;
