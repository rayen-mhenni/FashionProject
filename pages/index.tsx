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
import ourShop from "../public/bg-img/ourshop.png";

type Props = {
  products: itemType[];
};

const Home: React.FC<Props> = ({ products }) => {
  const t = useTranslations("Index");
  const [currentItems, setCurrentItems] = useState(products);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!isFetching) return;
    const fetchData = async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_PROD_BACKEND_URL}/api/v1/products?order_by=createdAt.desc&offset=${currentItems.length}&limit=10`
      );
      const fetchedProducts = res.data.data.map((product: apiProductsType) => ({
        ...product,
        img1: product.image1,
        img2: product.image2,
      }));
      setCurrentItems((products) => [...products, ...fetchedProducts]);
      setIsFetching(false);
    };
    fetchData();
  }, [isFetching, currentItems.length]);

  const handleSeemore = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
        <section className="w-full h-auto py-10 border border-b-2 border-gray100">
          <div className="app-max-width app-x-padding h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="w-full sm:col-span-2 lg:col-span-2">
              <OverlayContainer
                imgSrc="/bg-img/banner_minipage1.jpg"
                imgSrc2="/bg-img/banner_minipage1-tablet.jpg"
                imgAlt="New Arrivals"
              >
                <LinkButton href="/product-category/new-arrivals" extraClass="absolute bottom-10-per sm:right-10-per z-20">
                  {t("new_arrivals")}
                </LinkButton>
              </OverlayContainer>
            </div>
            <div className="w-full">
              <OverlayContainer imgSrc="/bg-img/banner_minipage2.jpg" imgAlt="Women Collection">
                <LinkButton href="/product-category/women" extraClass="absolute bottom-10-per z-20">
                  {t("women_collection")}
                </LinkButton>
              </OverlayContainer>
            </div>
            <div className="w-full">
              <OverlayContainer imgSrc="/bg-img/banner_minipage3.jpg" imgAlt="Men Collection">
                <LinkButton href="/product-category/men" extraClass="absolute bottom-10-per z-20">
                  {t("men_collection")}
                </LinkButton>
              </OverlayContainer>
            </div>
          </div>
        </section>

        {/* ===== Best Selling Section ===== */}
        <section className="app-max-width w-full h-full flex flex-col justify-center mt-16 mb-20">
          <div className="flex justify-center">
            {/* <div className="border-t border-gray-300 flex-grow"></div>
              <h2 className="text-4xl mb-4">Nouveautés</h2>
              <div className="border-t border-gray-300 flex-grow"></div> */}
            {/* <span>{t("best_selling_desc")}</span> */}
            <table width="90%" className="mb-10">
              <tr>
                <td>
                  <hr style={{ opacity: "0.2" }} />
                </td>
                <td style={{ width: "1px", padding: "0 25px", whiteSpace: "nowrap" }}>
                  <h2 className="text-4xl">Nouveautés</h2>
                </td>
                <td>
                  <hr style={{ opacity: "0.2" }} />
                </td>
              </tr>
            </table>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 lg:gap-x-12 gap-y-6 mb-10 app-x-padding">
            <Card key={currentItems[1].id} item={currentItems[1]} />
            <Card key={currentItems[2].id} item={currentItems[2]} />
            <Card key={currentItems[3].id} item={currentItems[3]} />
            <Card key={currentItems[4].id} item={currentItems[4]} />
          </div>
        </section>

        {/* ===== Testimonial Section ===== */}
        {/* <section className="w-full hidden h-full py-16 md:flex flex-col items-center bg-lightgreen">
          <h2 className="text-3xl">{t("testimonial")}</h2>
          <TestiSlider />
        </section> */}
  <div className="border-gray100 border-b-2"></div>

        {/* ===== Featured Products Section ===== */}
        <section className="app-max-width app-x-padding my-16 flex flex-col">
          <div className="text-center mb-6">
            
            <h2 className="text-3xl">Collections</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10 sm:gap-y-6 mb-10">
            {currentItems.map((item) => (
              <>
              <div className="relative ">
              <Card key={item.id} item={item} ></Card>
              
              <Button value={!isFetching ? 'DECOUVREZ LA COLLECTION' : 'Chargement...'} onClick={handleSeemore} />
            </div>
            </>
            ))}
          
          </div>
       
        </section>

        <div className="border-gray100 border-b-2"></div>

        {/* ===== Our Shop Section */}
        <section className="app-max-width mt-16 mb-20 flex flex-col justify-center items-center text-center">
          <div className="textBox w-3/4 md:w-2/4 lg:w-2/5 mb-6">
            <h2 className="text-3xl mb-6">{t("our_shop")}</h2>
            <span className="w-full">{t("our_shop_desc")}</span>
          </div>
          <div className="w-full app-x-padding flex justify-center">
            <Image src={ourShop} alt="Our Shop" />
          </div>
        </section>
      </main>

      {/* ===== Footer Section ===== */}
      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const products: itemType[] = [
    {
      id: 1,
      name: "Veste de survêtement ALAA",
      price: 59.99,
      qty: 1,
      description: "Start your day with a delicious cup of coffee brewed with this stylish coffee maker.",
      img1: "https://celio.tn/media/catalog/product/cache/dd9d425ebb6d2ec92fb4ce41e2a39a01/t/-/t-shirt-col-rond-100-coton-bleu-1112713-3-product_1_11.jpg",
      img2: "https://celio.tn/media/catalog/product/cache/dd9d425ebb6d2ec92fb4ce41e2a39a01/e/s/essentiel-le-t-shirt-slim-vert-1116523-3-product_1_5.jpg",
      categoryName: "survêtement",
      stock: 100,
      createdAt: "2024-06-30T15:15:00Z",
      category: {
        id: 1,
        name: "Home Appliances",
        description: "A wide range of appliances for your home.",
        thumbnailImage: "https://robohash.org/O7D.png?set=set2",
        createdAt: "2024-06-25T09:00:00Z",
      },
    },
    {
      id: 2,
      name: "Veste de survêtement ALAA",
      price: 59.99,
      qty: 1,
      description: "Start your day with a delicious cup of coffee brewed with this stylish coffee maker.",
      img1: "https://celio.tn/media/catalog/product/cache/dd9d425ebb6d2ec92fb4ce41e2a39a01/t/-/t-shirt-col-rond-100-coton-bleu-1112713-3-product_1_11.jpg",
      img2: "https://celio.tn/media/catalog/product/cache/dd9d425ebb6d2ec92fb4ce41e2a39a01/e/s/essentiel-le-t-shirt-slim-vert-1116523-3-product_1_5.jpg",
      categoryName: "survêtement",
      stock: 100,
      createdAt: "2024-06-30T15:15:00Z",
      category: {
        id: 2,
        name: "Home Appliances",
        description: "A wide range of appliances for your home.",
        thumbnailImage: "https://robohash.org/O7D.png?set=set2",
        createdAt: "2024-06-25T09:00:00Z",
      },
    },
    {
      id: 3,
      name: "Veste de survêtement ALAA",
      price: 59.99,
      qty: 1,
      description: "Start your day with a delicious cup of coffee brewed with this stylish coffee maker.",
      img1: "https://celio.tn/media/catalog/product/cache/dd9d425ebb6d2ec92fb4ce41e2a39a01/t/-/t-shirt-col-rond-100-coton-bleu-1112713-3-product_1_11.jpg",
      img2: "https://celio.tn/media/catalog/product/cache/dd9d425ebb6d2ec92fb4ce41e2a39a01/e/s/essentiel-le-t-shirt-slim-vert-1116523-3-product_1_5.jpg",
      categoryName: "survêtement",
      stock: 100,
      createdAt: "2024-06-30T15:15:00Z",
      category: {
        id: 10,
        name: "Home Appliances",
        description: "A wide range of appliances for your home.",
        thumbnailImage: "https://robohash.org/O7D.png?set=set2",
        createdAt: "2024-06-25T09:00:00Z",
      },
    },
    {
      id: 4,
      name: "Veste de survêtement ALAA",
      price: 59.99,
      qty: 1,
      description: "Start your day with a delicious cup of coffee brewed with this stylish coffee maker.",
      img1: "https://celio.tn/media/catalog/product/cache/dd9d425ebb6d2ec92fb4ce41e2a39a01/t/-/t-shirt-col-rond-100-coton-bleu-1112713-3-product_1_11.jpg",
      img2: "https://celio.tn/media/catalog/product/cache/dd9d425ebb6d2ec92fb4ce41e2a39a01/e/s/essentiel-le-t-shirt-slim-vert-1116523-3-product_1_5.jpg",
      categoryName: "survêtement",
      stock: 100,
      createdAt: "2024-06-30T15:15:00Z",
      category: {
        id: 10,
        name: "Home Appliances",
        description: "A wide range of appliances for your home.",
        thumbnailImage: "https://robohash.org/O7D.png?set=set2",
        createdAt: "2024-06-25T09:00:00Z",
      },
    },
    {
      id: 5,
      name: "Veste de survêtement ALAA",
      price: 59.99,
      qty: 1,
      description: "Start your day with a delicious cup of coffee brewed with this stylish coffee maker.",
      img1: "https://celio.tn/media/catalog/product/cache/dd9d425ebb6d2ec92fb4ce41e2a39a01/t/-/t-shirt-col-rond-100-coton-bleu-1112713-3-product_1_11.jpg",
      img2: "https://celio.tn/media/catalog/product/cache/dd9d425ebb6d2ec92fb4ce41e2a39a01/e/s/essentiel-le-t-shirt-slim-vert-1116523-3-product_1_5.jpg",
      categoryName: "survêtement",
      stock: 100,
      createdAt: "2024-06-30T15:15:00Z",
      category: {
        id: 10,
        name: "Home Appliances",
        description: "A wide range of appliances for your home.",
        thumbnailImage: "https://robohash.org/O7D.png?set=set2",
        createdAt: "2024-06-25T09:00:00Z",
      },
    },
  ];

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
      products,
    }, // will be passed to the page component as props
  };
};

export default Home;
