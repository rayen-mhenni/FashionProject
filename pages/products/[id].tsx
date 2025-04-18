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
// import Swiper core and required modules
import SwiperCore, { Pagination } from "swiper/core";
import { apiProductsType, itemType } from "../../context/cart/cart-types";
import { useWishlist } from "../../context/wishlist/WishlistProvider";
import { useCart } from "../../context/cart/CartProvider";
import HeartSolid from "../../public/icons/HeartSolid";
import { EasyZoomOnMove, makeImageLoader } from "easy-magnify";
import copy from "copy-to-clipboard";

// install Swiper modules
SwiperCore.use([Pagination]);

type Props = {
  product: any;
  products: any[];
};

const Product: React.FC<Props> = ({ product, products }) => {
  console.log("eeeeeeeeeeeeeeee", products);
  // const img1 = product?.options[0]?.images?.split(",")[0];
  // const img2 = product?.options[1]?.images?.split(",")[0];

  const { addItem } = useCart();
  const { wishlist, addToWishlist, deleteWishlistItem } = useWishlist();
  const [size, setSize] = useState("S");
  const [mainImg, setMainImg] = useState(product?.mainImg);
  const [currentQty, setCurrentQty] = useState(1);
  const [copied, setcopied] = useState(false);
  const [color, setcolor] = useState(product?.options[0]?.color);
  const [productOption, setproductOption] = useState(product?.options[0]);
  const t = useTranslations("Category");

  const alreadyWishlisted =
    wishlist.filter((wItem) => wItem.id === product.id).length > 0;

  useEffect(() => {
    setMainImg(product?.mainImg);
    setcolor(product?.options[0]?.color);
    setproductOption(product?.options[0]);
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
  console.log("product.categoryName", product.categoryName);
  return (
    <div>
      {/* ===== Head Section ===== */}
      <Header title={`${product.nom} - Haru Fashion`} />

      <main id="main-content">
        {/* ===== Breadcrumb Section ===== */}
        <div className="bg-lightgreen h-16 w-full flex items-center border-t-2 border-gray200">
          <div className="app-x-padding app-max-width w-full">
            <div className="breadcrumb">
              <Link href="/">
                <a className="text-gray400">{t("home")}</a>
              </Link>{" "}
              /{" "}
              <Link href={`/product-category/${product.categoryName}`}>
                <a className="text-gray400 capitalize">
                  {t(product.categoryName as string)}
                </a>
              </Link>{" "}
              / <span>{product.nom}</span>
            </div>
          </div>
        </div>
        {/* ===== Main Content Section ===== */}
        <div className="itemSection app-max-width app-x-padding flex flex-col md:flex-row">
          <div className="imgSection w-full md:w-1/2 h-full flex">
            <Swiper
              slidesPerView={1}
              // centeredSlides={true}
              spaceBetween={10}
              loop={true}
              grabCursor={true}
              pagination={{
                clickable: true,
                type: "bullets",
              }}
              className="mySwiper card-swiper"
            >
              {productOption?.images
                ?.split(",")
                ?.map((item: any, index: any) => (
                  <SwiperSlide key={index}>
                    <Image
                      className={`cursor-pointer ${
                        mainImg === item
                          ? "opacity-100 border border-gray300"
                          : "opacity-50"
                      }`}
                      src={item as string}
                      alt={product.name}
                      width={1000}
                      height={1282}
                    />
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
          <div className="infoSection w-full md:w-1/2 h-auto py-8 sm:pl-4 flex flex-col">
            <h1 className="text-3xl mb-4">{product.name}</h1>
            <span className="text-2xl text-gray400 mb-2">
              {product.prixVente} TND
            </span>
            <span className="mb-2 text-justify break-words">
              {product.description}
            </span>
            <span className="mb-2">
              {t("availability")}: {t("in_stock")}
            </span>
            <span className="mb-2">
              {t("size")}: {size}
            </span>
            <div className="sizeContainer flex space-x-4 text-sm mb-4">
              {productOption?.sizes?.split(",")?.map((el: any) => (
                <div
                  onClick={() => handleSize(el)}
                  className={`w-8 h-8 flex items-center justify-center border ${
                    size === el
                      ? "border-gray500"
                      : "border-gray300 text-gray400"
                  } cursor-pointer hover:bg-gray500 hover:text-gray100`}
                >
                  {el}
                </div>
              ))}
            </div>
            <span className="mb-2">
              {"Couleur"}: {color}
            </span>
            <Circle
              colors={product?.options?.map((el: any) => el.color)}
              color={color}
              pointProps={{
                style: {
                  marginRight: 15,
                  marginTop: 15,
                  marginBottom: 25,
                  borderRadius: "50%",
                  height: "20px",
                  width: "20px",
                  boxShadow:
                    " rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px",
                },
              }}
              onChange={(color) => {
                setcolor(color.hex);
                const option = product?.options?.find(
                  (el: any) => color.hex === el.color
                );
                if (option) {
                  setproductOption(option);
                  setMainImg(option?.images?.split(",")[0]);
                  setSize(option?.sizes?.split(",")[0]);
                }
              }}
              // }}
            />{" "}
            <div className="addToCart flex flex-col sm:flex-row md:flex-col lg:flex-row space-y-4 sm:space-y-0 mb-4">
              <div className="plusOrMinus h-12 flex border justify-center border-gray300 divide-x-2 divide-gray300 mb-4 mr-0 sm:mr-4 md:mr-0 lg:mr-4">
                <div
                  onClick={() => setCurrentQty((prevState) => prevState - 1)}
                  className={`${
                    currentQty === 1 && "pointer-events-none"
                  } h-full w-full sm:w-12 flex justify-center items-center cursor-pointer hover:bg-gray500 hover:text-gray100`}
                >
                  -
                </div>
                <div className="h-full w-28 sm:w-12 flex justify-center items-center pointer-events-none">
                  {currentQty}
                </div>
                <div
                  onClick={() => setCurrentQty((prevState) => prevState + 1)}
                  className="h-full w-full sm:w-12 flex justify-center items-center cursor-pointer hover:bg-gray500 hover:text-gray100"
                >
                  +
                </div>
              </div>
              <div className="flex h-12 space-x-4 w-full">
                <Button
                  value={t("add_to_cart")}
                  size="lg"
                  extraClass={`flex-grow text-center whitespace-nowrap hover:bg-gray200`}
                  onClick={() => addItem!(currentItem)}
                />
                <GhostButton
                  onClick={handleWishlist}
                  extraClass="hover:bg-gray200"
                >
                  {alreadyWishlisted ? (
                    <HeartSolid extraClass="inline" />
                  ) : (
                    <Heart extraClass="inline" />
                  )}
                </GhostButton>
              </div>
            </div>
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="py-2 focus:outline-none text-left mb-4 border-b-2 border-gray200 flex items-center justify-between">
                    <span>{t("details")}</span>
                    <DownArrow
                      extraClass={`${
                        open ? "" : "transform rotate-180"
                      } w-5 h-5 text-purple-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel
                    className={`text-gray400 animate__animated animate__bounceIn`}
                  >
                    {product.detail}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        </div>
        {/* ===== Horizontal Divider ===== */}
        <div className="border-b-2 border-gray200"></div>

        {/* ===== You May Also Like Section ===== */}
        <div className="recSection my-8 app-max-width app-x-padding">
          <h2 className="text-3xl mb-6">{t("you_may_also_like")}</h2>
          <Swiper
            slidesPerView={5}
            centeredSlides={true}
            spaceBetween={10}
            // loop={true}
            // grabCursor={true}
            pagination={{
              clickable: true,
              type: "bullets",
            }}
            className="mySwiper card-swiper"
          >
            {products?.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="mb-6">
                  <Card key={item.id} item={item} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </main>

      {/* ===== Footer Section ===== */}
      <Footer />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
  req,
}) => {
  const paramId = params!.id as string;
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_PRODUCTS_MODULE}/${paramId}`
  );

  const fetchedProduct: any = res.data;

  const resProduct = await axios.get(
    `${process.env.NEXT_PUBLIC_PRODUCTS_MODULE}`
  );

  const products: any = resProduct.data;
  // Pass data to the page via props
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
        description: "",
        detail: "",
        img1: el?.options[0]?.images?.split(",")[0],
        img2:
          el?.options[0]?.images?.split(",").length > 1
            ? el?.options[0]?.images?.split(",")[1]
            : el?.options[0]?.images?.split(",")[0],
        // categoryName: ,
        stock: el?.options[0].quantiteInitiale,
        createdAt: el?.createdAt,
      })),
      messages: (await import(`../../messages/common/${locale}.json`)).default,
    },
  };
};

export default Product;
