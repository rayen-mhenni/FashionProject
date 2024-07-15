import Link from "next/link";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Menu } from "@headlessui/react";
import { useTranslations } from "next-intl";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Card from "../../components/Card/Card";
import Pagination from "../../components/Util/Pagination";
import { apiProductsType, itemType } from "../../context/cart/cart-types";
import DownArrow from "../../public/icons/DownArrow";
import "rc-collapse/assets/index.css";
import Collapse from "rc-collapse";
import SettingsIcon from "../../public/icons/SettingsIcon";
import { useState } from "react";
import { isEmpty } from "lodash";
import CrossIcon from "../../public/icons/CrossIcon";
import Circle from "@uiw/react-color-circle";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

type OrderType = "latest" | "price" | "price-desc";

type Props = {
  items: itemType[];
  page: number;
  numberOfProducts: number;
  orderby: OrderType;
};
const Panel = Collapse.Panel;

const ProductCategory: React.FC<Props> = ({ items, page, numberOfProducts, orderby }) => {
  const t = useTranslations("Category");
  const [open, setopen] = useState(false);
  const [hex, setHex] = useState("#F44E3B");
  const [size, setSize] = useState("M");
  const [min, setmin] = useState(40);
  const [max, setmax] = useState(150);

  const router = useRouter();
  const { category } = router.query;
  const lastPage = Math.ceil(numberOfProducts / 10);

  const capitalizedCategory = category!.toString().charAt(0).toUpperCase() + category!.toString().slice(1);

  const firstIndex = page === 1 ? page : page * 10 - 9;
  const lastIndex = page * 10;
  const handleSize = (value: string) => {
    setSize(value);
  };
  const log = (value: any) => {
    setmin(value[0]);
    setmax(value[1]);
  };
  return (
    <div>
      {/* ===== Head Section ===== */}
      <Header title={`${capitalizedCategory} - Haru Fashion`} />

      <main id="main-content">
        {/* ===== Breadcrumb Section ===== */}
        <div className="bg-lightgreen h-16 w-full flex items-center">
          <div className="app-x-padding app-max-width w-full">
            <div className="breadcrumb">
              <Link href="/">
                <a className="text-gray400">{t("home")}</a>
              </Link>{" "}
              / <span className="capitalize">{t(category as string)}</span>
            </div>
          </div>
        </div>

        {/* ===== Heading & Filter Section ===== */}
        <div className="app-x-padding app-max-width w-full mt-8">
          <h3 className="text-4xl mb-2 capitalize">{t(category as string)}</h3>
          <div className="flex flex-col-reverse sm:flex-row gap-4 sm:gap-0 justify-between mt-4 sm:mt-6">
            <span>
              {t("showing_from_to", {
                from: firstIndex,
                to: numberOfProducts < lastIndex ? numberOfProducts : lastIndex,
                all: numberOfProducts,
              })}
            </span>

            {category !== "new-arrivals" && <SortMenu orderby={orderby} />}
          </div>
          <div className="w-full flex items-stretch">
            <Collapse
              className="my-4 mx-4 transition-transform transform hover:scale-105 duration-1000 elay-300 w-full"
              expandIcon={() => (open ? <CrossIcon /> ?? null : <SettingsIcon extraClass="mr-3" /> ?? null)}
              onChange={(val) => {
                if (!isEmpty(val)) {
                  setopen(true);
                } else {
                  setopen(false);
                }
              }}
            >
              <Panel header="filters" headerClass="place-content-center bg-gray100" className="w-full">
                <div className="grid md:grid-cols-3 sm:grid-rows gap-4">
                  <div>
                    <div className="mb-2">Filtrer par couleur</div>
                    <Circle
                      colors={["#F44E3B", "#FE9200", "#FCDC00", "#DBDF00", "#000814", "#99582a", "#6a994e", "#003049", "#00b4d8"]}
                      color={hex}
                      pointProps={{
                        style: {
                          marginRight: 15,
                        },
                      }}
                      onChange={(color) => {
                        setHex(color.hex);
                      }}
                    />{" "}
                  </div>
                  <div>
                    <div className="mb-2">Filtrer par Taille</div>

                    <div className="sizeContainer flex space-x-4 text-sm mb-4">
                      <div
                        onClick={() => handleSize("S")}
                        className={`w-8 h-8 flex items-center justify-center border ${
                          size === "S" ? "border-gray500" : "border-gray300 text-gray400"
                        } cursor-pointer hover:bg-gray500 hover:text-gray100`}
                      >
                        S
                      </div>
                      <div
                        onClick={() => handleSize("M")}
                        className={`w-8 h-8 flex items-center justify-center border ${
                          size === "M" ? "border-gray500" : "border-gray300 text-gray400"
                        } cursor-pointer hover:bg-gray500 hover:text-gray100`}
                      >
                        M
                      </div>
                      <div
                        onClick={() => handleSize("L")}
                        className={`w-8 h-8 flex items-center justify-center border ${
                          size === "L" ? "border-gray500" : "border-gray300 text-gray400"
                        } cursor-pointer hover:bg-gray500 hover:text-gray100`}
                      >
                        L
                      </div>
                      <div
                        onClick={() => handleSize("XL")}
                        className={`w-8 h-8 flex items-center justify-center border ${
                          size === "XL" ? "border-gray500" : "border-gray300 text-gray400"
                        } cursor-pointer hover:bg-gray500 hover:text-gray100`}
                      >
                        XL
                      </div>
                      <div
                        onClick={() => handleSize("XXL")}
                        className={`w-8 h-8 flex items-center justify-center border ${
                          size === "XXL" ? "border-gray500" : "border-gray300 text-gray400"
                        } cursor-pointer hover:bg-gray500 hover:text-gray100`}
                      >
                        XXL
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2">Filtrer par Prix</div>
                    <Slider
                      range
                      allowCross={false}
                      min={0}
                      max={1000}
                      defaultValue={[50, 150]}
                      onChange={log}
                      styles={{
                        track: { backgroundColor: "#282828" },
                        handle: { borderColor: "#282828" },
                      }}
                      className="mb-2"
                    />
                    Min Prix: {min} € &nbsp;&nbsp;&nbsp; Max Prix: {max} €
                  </div>
                </div>
              </Panel>
            </Collapse>
          </div>
        </div>

        {/* ===== Main Content Section ===== */}
        <div className="app-x-padding app-max-width mt-3 mb-14">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10 sm:gap-y-6 mb-10">
            {items.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>
          {category !== "new-arrivals" && <Pagination currentPage={page} lastPage={lastPage} orderby={orderby} />}
        </div>
      </main>

      {/* ===== Footer Section ===== */}
      <Footer />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params, locale, query: { page = 1, orderby = "latest" } }) => {
  const paramCategory = params!.category as string;

  const start = +page === 1 ? 0 : (+page - 1) * 10;

  let numberOfProducts = 0;

  // if (paramCategory !== "new-arrivals") {
  //   const numberOfProductsResponse = await axios.get(
  //     `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/count?category=${paramCategory}`
  //   );
  //   numberOfProducts = +numberOfProductsResponse.data.count;
  // } else {
  //   numberOfProducts = 10;
  // }

  let order_by: string;

  if (orderby === "price") {
    order_by = "price";
  } else if (orderby === "price-desc") {
    order_by = "price.desc";
  } else {
    order_by = "createdAt.desc";
  }

  // const reqUrl =
  //   paramCategory === "new-arrivals"
  //     ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products?order_by=createdAt.desc&limit=10`
  //     : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products?order_by=${order_by}&offset=${start}&limit=10&category=${paramCategory}`;

  // const res = await axios.get(reqUrl);

  // const fetchedProducts = res.data.data.map((product: apiProductsType) => ({
  //   ...product,
  //   img1: product.image1,
  //   img2: product.image2,
  // }));

  let items: any[] = [
    {
      id: 8241,
      name: "Skinny Jeans in Dark Wash",
      price: 49.95,
      qty: 2, // Example of optional quantity (e.g., buying 2 of the same item)
      description: "A classic pair of skinny jeans in a dark wash. Perfect for everyday wear.",
      detail: "Made from high-quality stretch denim for a comfortable and flattering fit. Features a five-pocket design.",
      categoryId: 1, // Could reference a separate category table
      stock: 30,
      // ... (optional properties)
      category: {
        id: 1,
        name: "Jeans",
        description: "Find your perfect fit with our selection of jeans",
        thumbnailImage: "https://threadlogic.com/cdn/shop/files/Gildan-Softstyle-Ladies-T-Shirt-23_800x.jpg?v=1712000091",
      },
      img1: "https://threadlogic.com/cdn/shop/files/Gildan-Softstyle-Ladies-T-Shirt-23_800x.jpg?v=1712000091",
      img2: "https://threadlogic.com/cdn/shop/files/Gildan-Softstyle-Ladies-T-Shirt-23_800x.jpg?v=1712000091",
    },
    {
      id: 8241,
      name: "Skinny Jeans in Dark Wash",
      price: 49.95,
      qty: 2, // Example of optional quantity (e.g., buying 2 of the same item)
      description: "A classic pair of skinny jeans in a dark wash. Perfect for everyday wear.",
      detail: "Made from high-quality stretch denim for a comfortable and flattering fit. Features a five-pocket design.",
      categoryId: 1, // Could reference a separate category table
      stock: 30,
      // ... (optional properties)
      category: {
        id: 1,
        name: "Jeans",
        description: "Find your perfect fit with our selection of jeans",
        thumbnailImage: "https://threadlogic.com/cdn/shop/files/Gildan-Softstyle-Ladies-T-Shirt-23_800x.jpg?v=1712000091",
      },
      img1: "https://threadlogic.com/cdn/shop/files/Gildan-Softstyle-Ladies-T-Shirt-23_800x.jpg?v=1712000091",
      img2: "https://threadlogic.com/cdn/shop/files/Gildan-Softstyle-Ladies-T-Shirt-23_800x.jpg?v=1712000091",
    },
    {
      id: 8241,
      name: "Skinny Jeans in Dark Wash",
      price: 49.95,
      qty: 2, // Example of optional quantity (e.g., buying 2 of the same item)
      description: "A classic pair of skinny jeans in a dark wash. Perfect for everyday wear.",
      detail: "Made from high-quality stretch denim for a comfortable and flattering fit. Features a five-pocket design.",
      categoryId: 1, // Could reference a separate category table
      stock: 30,
      // ... (optional properties)
      category: {
        id: 1,
        name: "Jeans",
        description: "Find your perfect fit with our selection of jeans",
        thumbnailImage: "https://threadlogic.com/cdn/shop/files/Gildan-Softstyle-Ladies-T-Shirt-23_800x.jpg?v=1712000091",
      },
      img1: "https://threadlogic.com/cdn/shop/files/Gildan-Softstyle-Ladies-T-Shirt-23_800x.jpg?v=1712000091",
      img2: "https://threadlogic.com/cdn/shop/files/Gildan-Softstyle-Ladies-T-Shirt-23_800x.jpg?v=1712000091",
    },
  ];
  numberOfProducts = 3;
  // fetchedProducts.forEach((product: apiProductsType) => {
  //   items.push(product);
  // });

  return {
    props: {
      messages: (await import(`../../messages/common/${locale}.json`)).default,
      items,
      numberOfProducts,
      page: +page,
      orderby,
    },
  };
};

const SortMenu: React.FC<{ orderby: OrderType }> = ({ orderby }) => {
  const t = useTranslations("Navigation");
  const router = useRouter();
  const { category } = router.query;

  let currentOrder: string;

  if (orderby === "price") {
    currentOrder = "sort_by_price";
  } else if (orderby === "price-desc") {
    currentOrder = "sort_by_price_desc";
  } else {
    currentOrder = "sort_by_latest";
  }
  return (
    <Menu as="div" className="relative">
      <Menu.Button as="a" href="#" className="flex items-center capitalize">
        {t(currentOrder)} <DownArrow />
      </Menu.Button>
      <Menu.Items className="flex flex-col z-10 items-start text-xs sm:text-sm w-auto sm:right-0 absolute p-1 border border-gray200 bg-white mt-2 outline-none">
        <Menu.Item>
          {({ active }) => (
            <button
              type="button"
              onClick={() => router.push(`/product-category/${category}?orderby=latest`)}
              className={`${
                active ? "bg-gray100 text-gray500" : "bg-white"
              } py-2 px-4 text-left w-full focus:outline-none whitespace-nowrap ${
                currentOrder === "sort_by_latest" && "bg-gray500 text-gray100"
              }`}
            >
              {t("sort_by_latest")}
            </button>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button
              type="button"
              onClick={() => router.push(`/product-category/${category}?orderby=price`)}
              className={`${
                active ? "bg-gray100 text-gray500" : "bg-white"
              } py-2 px-4 text-left w-full focus:outline-none whitespace-nowrap ${
                currentOrder === "sort_by_price" && "bg-gray500 text-gray100"
              }`}
            >
              {t("sort_by_price")}
            </button>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button
              type="button"
              onClick={() => router.push(`/product-category/${category}?orderby=price-desc`)}
              className={`${
                active ? "bg-gray100 text-gray500" : "bg-white"
              } py-2 px-4 text-left w-full focus:outline-none whitespace-nowrap ${
                currentOrder === "sort_by_price_desc" && "bg-gray500 text-gray100"
              }`}
            >
              {t("sort_by_price_desc")}
            </button>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
};

export default ProductCategory;
