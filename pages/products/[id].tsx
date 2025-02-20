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
import { EasyZoomOnMove } from "easy-magnify";
import ShareLink from "../../public/icons/shareLink";
import copy from "copy-to-clipboard";

// install Swiper modules
SwiperCore.use([Pagination]);

type Props = {
  product: any;
  products: any[];
};

const Product: React.FC<Props> = ({ product, products, url }) => {
  // const img1 = product?.option[0]?.images?.split(",")[0];
  // const img2 = product?.option[1]?.images?.split(",")[0];

  const { addItem } = useCart();
  const { wishlist, addToWishlist, deleteWishlistItem } = useWishlist();
  const [size, setSize] = useState("S");
  const [mainImg, setMainImg] = useState(product?.mainImg);
  const [currentQty, setCurrentQty] = useState(1);
  const [copied, setcopied] = useState(false);
  const [color, setcolor] = useState(product?.option[0]?.color);
  const [productOption, setproductOption] = useState(product?.option[0]);
  const t = useTranslations("Category");

  const alreadyWishlisted =
    wishlist.filter((wItem) => wItem.id === product.id).length > 0;

  useEffect(() => {
    setMainImg(product?.mainImg);
    setcolor(product?.option[0]?.color);
    setproductOption(product?.option[0]);
  }, [product]);

  const handleSize = (value: string) => {
    setSize(value);
  };

  const currentItem = {
    ...product,
    price: productOption.price,
    img1: productOption.images.split(",")[0],
    option: productOption.id,
    size,
    qty: currentQty,
  };

  const handleWishlist = () => {
    alreadyWishlisted
      ? deleteWishlistItem!(currentItem)
      : addToWishlist!(currentItem);
  };

  return (
    <div>
      {/* ===== Head Section ===== */}
      <Header title={`${product.name} - Haru Fashion`} />

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
              / <span>{product.name}</span>
            </div>
          </div>
        </div>
        {/* ===== Main Content Section ===== */}
        <div className="itemSection app-max-width app-x-padding flex flex-col md:flex-row">
          <div className="imgSection w-full md:w-1/2 h-full flex">
            <div className="hidden sm:block w-full sm:w-1/4 h-full space-y-4 my-4">
              {productOption?.images?.split(",").map((el: any) => (
                <Image
                  className={`cursor-pointer ${
                    mainImg === el
                      ? "opacity-100 border border-gray300"
                      : "opacity-50"
                  }`}
                  onClick={() => setMainImg(el)}
                  src={el as string}
                  alt={product.name}
                  width={1000}
                  height={1282}
                />
              ))}
            </div>
            <div className="w-full sm:w-3/4 h-full m-0 sm:m-4">
              <EasyZoomOnMove
                mainImage={{
                  src: mainImg,
                  alt: "My Product",
                  width: 466,
                  height: 466,
                }}
                zoomImage={{
                  src: mainImg,
                  alt: "My Product",
                }}
              />
            </div>
          </div>
          <div className="infoSection w-full md:w-1/2 h-auto py-8 sm:pl-4 flex flex-col">
            <h1 className="text-3xl mb-4">{product.name}</h1>
            <span className="text-2xl text-gray400 mb-2">
              $ {productOption.price}
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
              {productOption?.size?.split(",")?.map((el: any) => (
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
              colors={product?.option?.map((el: any) => el.color)}
              color={color}
              pointProps={{
                style: {
                  marginRight: 15,
                  marginTop: 15,
                  marginBottom: 25,
                  borderRadius: "50%",
                  height: "20px",
                  width: "20px",
                  // border:"1px solid black",
                  // boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
                  // boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px"
                  boxShadow:
                    " rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px",
                },
              }}
              onChange={(color) => {
                setcolor(color.hex);
                setproductOption(
                  product?.option?.find((el: any) => color.hex === el.color)
                );
                setMainImg(
                  product?.option
                    ?.find((el: any) => color.hex === el.color)
                    .images.split(",")[0]
                );
                setSize(
                  product?.option
                    ?.find((el: any) => color.hex === el.color)
                    .size.split(",")[0]
                );
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
            <div className="flex items-center mt-4">
              <span>{t("shareLink")}</span>
              <div
                className="ml-3 cursor-pointer rounded-full h-10 w-10 flex items-center justify-center hover:bg-gray200"
                onClick={() => {
                  copy(window.location.href);
                  setcopied(true);
                }}
              >
                <ShareLink extraClass="h-5 cursor-pointer" />
              </div>
              {copied && <p className="text-blue">copié!</p>}
            </div>
          </div>
        </div>
        {/* ===== Horizontal Divider ===== */}
        <div className="border-b-2 border-gray200"></div>

        {/* ===== You May Also Like Section ===== */}
        <div className="recSection my-8 app-max-width app-x-padding">
          <h2 className="text-3xl mb-6">{t("you_may_also_like")}</h2>
          <Swiper
            slidesPerView={2}
            // centeredSlides={true}
            spaceBetween={10}
            loop={true}
            grabCursor={true}
            pagination={{
              clickable: true,
              type: "bullets",
            }}
            className="mySwiper card-swiper sm:hidden"
          >
            {products.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="mb-6">
                  <Card key={item.id} item={item} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-10 sm:gap-y-6 mb-10">
            {products.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>
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

  const fetchedProduct: any = res.data.data;

  const resProduct = await axios.get(
    `${process.env.NEXT_PUBLIC_PRODUCTS_MODULE}/col/${fetchedProduct?.collectionId}`
  );

  const products: any = resProduct.data.data;

  //   id: 1234,
  //   name: "Blue Cotton T-Shirt",
  //   price: 29.99,
  //   detail:
  //     "A comfortable and stylish blue cotton t-shirt. Perfect for casual wear.",
  //   img1: "https://threadlogic.com/cdn/shop/files/Gildan-Softstyle-Ladies-T-Shirt-23_800x.jpg?v=1712000091", // Replace with actual image path
  //   img2: "https://threadlogic.com/cdn/shop/files/Gildan-Softstyle-Ladies-T-Shirt-23_800x.jpg?v=1712000091", // Replace with actual image path (optional)
  //   categoryName: "Shirts",
  // };

  // Might be temporary solution for suggested products
  // const randomProductRes = await axios.get(
  //   `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products?category=${product.categoryName}`
  // );
  // const fetchedProducts: apiProductsType[] = randomProductRes.data.data;

  // // Shuffle array
  // const shuffled = fetchedProducts.sort(() => 0.5 - Math.random());

  // // Get sub-array of first 5 elements after shuffled
  // let randomFetchedProducts = shuffled.slice(0, 5);

  // let products: itemType[] = [
  //   {
  //     id: 1234,
  //     name: "Blue Cotton T-Shirt",
  //     price: 29.99,
  //     detail:
  //       "A comfortable and stylish blue cotton t-shirt. Perfect for casual wear.",
  //     img1: "https://threadlogic.com/cdn/shop/files/Gildan-Softstyle-Ladies-T-Shirt-23_800x.jpg?v=1712000091", // Replace with actual image path
  //     img2: "https://threadlogic.com/cdn/shop/files/Gildan-Softstyle-Ladies-T-Shirt-23_800x.jpg?v=1712000091", // Replace with actual image path (optional)
  //     categoryName: "Shirts",
  //   },
  //   {
  //     id: 1234,
  //     name: "Blue Cotton T-Shirt",
  //     price: 29.99,
  //     detail:
  //       "A comfortable and stylish blue cotton t-shirt. Perfect for casual wear.",
  //     img1: "https://threadlogic.com/cdn/shop/files/Gildan-Softstyle-Ladies-T-Shirt-23_800x.jpg?v=1712000091", // Replace with actual image path
  //     img2: "https://threadlogic.com/cdn/shop/files/Gildan-Softstyle-Ladies-T-Shirt-23_800x.jpg?v=1712000091", // Replace with actual image path (optional)
  //     categoryName: "Shirts",
  //   },
  //   {
  //     id: 1234,
  //     name: "Blue Cotton T-Shirt",
  //     price: 29.99,
  //     detail:
  //       "A comfortable and stylish blue cotton t-shirt. Perfect for casual wear.",
  //     img1: "https://threadlogic.com/cdn/shop/files/Gildan-Softstyle-Ladies-T-Shirt-23_800x.jpg?v=1712000091", // Replace with actual image path
  //     img2: "https://threadlogic.com/cdn/shop/files/Gildan-Softstyle-Ladies-T-Shirt-23_800x.jpg?v=1712000091", // Replace with actual image path (optional)
  //     categoryName: "Shirts",
  //   },
  //   {
  //     id: 1234,
  //     name: "Blue Cotton T-Shirt",
  //     price: 29.99,
  //     detail:
  //       "A comfortable and stylish blue cotton t-shirt. Perfect for casual wear.",
  //     img1: "https://threadlogic.com/cdn/shop/files/Gildan-Softstyle-Ladies-T-Shirt-23_800x.jpg?v=1712000091", // Replace with actual image path
  //     img2: "https://threadlogic.com/cdn/shop/files/Gildan-Softstyle-Ladies-T-Shirt-23_800x.jpg?v=1712000091", // Replace with actual image path (optional)
  //     categoryName: "Shirts",
  //   },
  //   {
  //     id: 1234,
  //     name: "Blue Cotton T-Shirt",
  //     price: 29.99,
  //     detail:
  //       "A comfortable and stylish blue cotton t-shirt. Perfect for casual wear.",
  //     img1: "https://threadlogic.com/cdn/shop/files/Gildan-Softstyle-Ladies-T-Shirt-23_800x.jpg?v=1712000091", // Replace with actual image path
  //     img2: "https://threadlogic.com/cdn/shop/files/Gildan-Softstyle-Ladies-T-Shirt-23_800x.jpg?v=1712000091", // Replace with actual image path (optional)
  //     categoryName: "Shirts",
  //   },
  // ];
  // randomFetchedProducts.forEach((randomProduct: apiProductsType) => {
  //   products.push({
  //     id: randomProduct.id,
  //     name: randomProduct.name,
  //     price: randomProduct.price,
  //     img1: randomProduct.image1,
  //     img2: randomProduct.image2,
  //   });
  // });

  // Pass data to the page via props
  return {
    props: {
      product: {
        ...fetchedProduct,
        mainImg: fetchedProduct.option[0]?.images?.split(",")[0],
      },
      products: products.map((el: any) => ({
        id: el?.id,
        name: el?.name,
        price: el?.option[0]?.price,
        detail: el?.detail,
        img1: el?.option[0]?.images?.split(",")[0],
        img2:
          el?.option[0]?.images?.split(",")?.length > 1
            ? el?.option[0]?.images?.split(",")[1]
            : el?.option[0]?.images?.split(",")[0],
        // categoryName: "Shirts",
        stock: el?.option[0]?.stock,
        option: el?.option[0]?.id,
        size: el?.option[0].size.split(",")[0],
      })),
      messages: (await import(`../../messages/common/${locale}.json`)).default,
      url: req?.headers?.host + req?.url,
    },
  };
};

export default Product;
