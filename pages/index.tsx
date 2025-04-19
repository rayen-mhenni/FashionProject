import React, { useState, useEffect } from "react";
import { GetStaticProps } from "next";
import Image from "next/image";
import { useTranslations } from "next-intl";
import axios from "axios";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Button from "../components/Buttons/Button";
import Slideshow from "../components/HeroSection/Slideshow";
import OverlayContainer from "../components/OverlayContainer/OverlayContainer";
import Card from "../components/Card/Card";
import TestiSlider from "../components/TestiSlider/TestiSlider";
import { apiProductsType, itemType } from "../context/cart/cart-types";
import LinkButton from "../components/Buttons/LinkButton";

// /bg-img/ourshop.png
import ourShop from "../public/bg-img/empty-boutique-shopping-centre.jpg";
import moment from "moment";
import _ from "lodash";

type Props = {
  products: itemType[];
  collections: any;
};

const Home: React.FC<Props> = ({ collections }) => {
  const t = useTranslations("Index");
  const [currentItems, setCurrentItems] = useState<any>();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_PRODUCTS_MODULE}`);

      const products: any[] = res?.data?.map((el: any) => ({
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
      }));
      setCurrentItems(products);
      setIsFetching(false);
    };
    fetchData();
  }, [isFetching, currentItems?.length]);

  const handleSeemore = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsFetching(true);
  };

  return (
    <>
      {/* ===== Header Section ===== */}
      <Header />

      {/* ===== Carousel Section ===== */}
      <Slideshow />

      <main id="main-content" className="-mt-20">
        {/* ===== Category Section ===== */}
        <section className="app-max-width w-full h-full flex flex-col justify-center mt-20 ">
          <div className="flex justify-center">
            <table width="90%">
              <tr>
                <td>
                  <hr style={{ opacity: "0.2" }} />
                </td>
                <td
                  style={{
                    width: "1px",
                    padding: "0 25px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <h2 className="text-4xl">Collections</h2>
                </td>
                <td>
                  <hr style={{ opacity: "0.2" }} />
                </td>
              </tr>
            </table>
          </div>
        </section>
        <section className="w-full h-auto py-10 mb-20">
          <div className="app-max-width app-x-padding h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="w-full sm:col-span-2 lg:col-span-2 ">
              <OverlayContainer
                imgSrc="/bg-img/banner_minipage3.jpg"
                imgAlt="Men Collection"
              >
                <LinkButton
                  href={`/product-category/Homme`}
                  extraClass="absolute bottom-10-per sm:right-10-per z-20"
                >
                  Homme
                </LinkButton>
              </OverlayContainer>
            </div>
            <div className="w-full sm:col-span-2 lg:col-span-2 ">
              <OverlayContainer
                imgSrc="/bg-img/banner_minipage2.jpg"
                imgAlt="Men Collection"
              >
                <LinkButton
                  href={`/product-category/Femme`}
                  extraClass="absolute bottom-10-per sm:right-10-per z-20"
                >
                  Femme
                </LinkButton>
              </OverlayContainer>
            </div>
          </div>
        </section>

        {/* ===== Best Selling Section ===== */}
        <section className="app-max-width w-full h-full flex flex-col justify-center mt-16 mb-20">
          <div className="flex justify-center">
            <table width="90%" className="mb-10">
              <tr>
                <td>
                  <hr style={{ opacity: "0.2" }} />
                </td>
                <td
                  style={{
                    width: "1px",
                    padding: "0 25px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <h2 className="text-4xl">Nouveautés</h2>
                </td>
                <td>
                  <hr style={{ opacity: "0.2" }} />
                </td>
              </tr>
            </table>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 lg:gap-x-12 gap-y-6 mb-10 app-x-padding">
            {currentItems &&
              currentItems?.map((el: any) => (
                <Card key={el?._id} item={el} outStock />
              ))}
          </div>
        </section>

        <section className="w-full hidden h-full py-16 md:flex flex-col items-center bg-lightgreen">
          <h2 className="text-3xl">{t("testimonial")}</h2>
          <TestiSlider />
        </section>

        {/* <section className="app-max-width mt-16 mb-20 flex flex-col justify-center items-center text-center">
          <div className="textBox w-3/4 md:w-2/4 lg:w-2/5 mb-6">
            <h2 className="text-3xl mb-6">{t("our_shop")}</h2>
            <span className="w-full">{t("our_shop_desc")}</span>
          </div>
          <div className="w-full app-x-padding flex justify-center">
            <Image src={ourShop} alt="Our Shop" />
          </div>
        </section> */}
      </main>

      {/* ===== Footer Section ===== */}
      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  // const res = await axios.get(`${process.env.NEXT_PUBLIC_PRODUCTS_MODULE}`);

  // const sortedArray = _.orderBy(
  //   res.data.data,
  //   (o: any) => {
  //     return moment(o.createdAt).format("YYYY-MM-DD");
  //   },
  //   ["desc"]
  // );

  // const nouveateArray = sortedArray.slice(0, 3);
  // const products: any[] = nouveateArray.map((el) => ({
  //   id: el?.id,
  //   options: el?.options[0].id,
  //   size: el?.options[0].size.split(",")[0],
  //   name: el?.name,
  //   price: el?.options[0].price,
  //   qty: 1,
  //   description: el?.description,
  //   detail: el?.detail,
  //   img1: el?.options[0].images.split(",")[0],
  //   img2:
  //     el?.options[0].images.split(",").length > 1
  //       ? el?.options[0].images.split(",")[1]
  //       : el?.options[0].images.split(",")[0],
  //   // categoryName: ,
  //   stock: el?.options[0].stock,
  //   createdAt: el?.createdAt,
  // }));

  // const collections = await axios.get(
  //   `${process.env.NEXT_PUBLIC_COLLECTIONS_MODULE}`
  // );

  // const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products?order_by=createdAt.desc&limit=10`);
  // const fetchedProducts = res.data;
  // fetchedProducts.data.forEach((product: apiProductsType) => {
  //   products = [
  //     ...products,
  //     {
  //       id: product.id,
  //       name: product.name,
  //       price: product.price,
  //       img1: product.image1,
  //       img2: product.image2,
  //     },
  //   ];
  // });

  return {
    props: {
      messages: {
        // ...require(`../messages/index/${locale}.json`),
        ...require(`../messages/common/${locale}.json`),
      },
      products: [],
      collections: [],
    }, // will be passed to the page component as props
  };
};

export default Home;
