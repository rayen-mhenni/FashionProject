import { FC, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

import Heart from "../../public/icons/Heart";
import styles from "./Card.module.css";
import HeartSolid from "../../public/icons/HeartSolid";
import { itemType } from "../../context/cart/cart-types";
import { useCart } from "../../context/cart/CartProvider";
import { useWishlist } from "../../context/wishlist/WishlistProvider";
import Resize from "../../public/icons/Resize";
import ResizeFull from "../../public/icons/ResizeFull";
import Modal from "@leafygreen-ui/modal";
import { Swiper, SwiperSlide } from "swiper/react";
import Button from "../Buttons/Button";
import GhostButton from "../Buttons/GhostButton";
import { Disclosure } from "@headlessui/react";
import DownArrow from "../../public/icons/DownArrow";
import copy from "copy-to-clipboard";
import ShareLink from "../../public/icons/shareLink";

type Props = {
  item: itemType;
  outStock?: boolean;
};

const Card: FC<Props> = ({ item, outStock = false }) => {
  const { addItem } = useCart();

  const t = useTranslations("CartWishlist");
  const { wishlist, addToWishlist, deleteWishlistItem } = useWishlist();
  const { addOne } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isWLHovered, setIsWLHovered] = useState(false);
  const [open, setopen] = useState(false);
  const [size, setSize] = useState("M");
  const [currentQty, setCurrentQty] = useState(1);
  const [copied, setcopied] = useState(false);

  const currentItem = {
    ...item,
    qty: currentQty,
  };
  const { id, name, price, img1, img2 } = item;

  const itemLink = `/products/${encodeURIComponent(id)}`;

  const alreadyWishlisted = wishlist.filter((wItem) => wItem.id === id).length > 0;

  const handleWishlist = () => {
    alreadyWishlisted ? deleteWishlistItem!(item) : addToWishlist!(item);
  };

  const handleModal = () => {
    setopen(true);
  };

  const handleSize = (value: string) => {
    setSize(value);
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Link href={itemLink}>
          <a tabIndex={-1} onMouseOver={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            {!isHovered && <Image src={img1 as string} alt={name} width={230} height={300} layout="responsive" />}
            {isHovered && (
              <Image
                className="transition-transform transform hover:scale-110 duration-1000"
                src={img2 as string}
                alt={name}
                width={230}
                height={300}
                layout="responsive"
              />
            )}
          </a>
        </Link>
        <button
          type="button"
          className="absolute top-2 right-2 p-1 rounded-full"
          aria-label="Wishlist"
          onClick={handleWishlist}
          onMouseOver={() => setIsWLHovered(true)}
          onMouseLeave={() => setIsWLHovered(false)}
        >
          {isWLHovered || alreadyWishlisted ? <HeartSolid /> : <Heart />}
        </button>
        {isHovered && (
          <button
            type="button"
            className="h-10 w-10 flex items-center justify-center hover:bg-gray200 transition-transform transform hover:scale-220 duration-2000 absolute top-12 right-1 p-1 rounded-full"
            aria-label="Wishlist"
            onClick={handleModal}
          >
            <Resize />
          </button>
        )}
        <button
          type="button"
          onClick={() => addOne!(item)}
          className={!outStock ? styles.addBtn : styles.addBtnDisabled}
          disabled={outStock}
        >
          {!outStock ? t("add_to_cart") : <>Non disponible</>}
        </button>
      </div>

      <div className="content">
        <Link href={itemLink}>
          <a className={styles.itemName}>{name}</a>
        </Link>
        <div className="text-gray400">$ {price}</div>
        <button type="button" onClick={() => addOne!(item)} className="uppercase font-bold text-sm sm:hidden" disabled={outStock}>
          {!outStock ? t("add_to_cart") : <>Non disponible</>}
        </button>
      </div>
      <Modal
        open={open}
        setOpen={() => {
          setopen(false);
          setIsHovered(false);
        }}
        className="z-50 p-0"
        contentClassName={styles.contentClass}
      >
        <div className="w-full">
          <Swiper
            slidesPerView={1}
            spaceBetween={0}
            loop={true}
            pagination={{
              clickable: true,
            }}
            className="w-full"
          >
            <SwiperSlide>
              <Image className="w-full" src={item?.img1 as string} width={420} height={520} alt={item.name} />
            </SwiperSlide>
            <SwiperSlide>
              <Image className="w-full" src={item?.img2 as string} width={420} height={520} alt={item.name} />
            </SwiperSlide>
          </Swiper>
          {/* <Image className="w-full" src={mainImg as string} width={1000} height={1282} alt={product.name} /> */}
        </div>
        <div className=" h-auto py-8 sm:pl-4 flex flex-col">
          <h1 className="text-3xl mb-4">{item.name}</h1>
          <span className="text-2xl text-gray400 mb-2">$ {item.price}</span>
          <span className="mb-2 text-justify">{item.description}</span>
          <span className="mb-2">
            {t("availability")}: {t("in_stock")}
          </span>
          <span className="mb-2">
            {t("size")}: {size}
          </span>
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
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-col xl:flex-col 2xl:flex-row space-y-4 sm:space-y-0 mb-4">
            <div className="plusOrMinus h-12 flex border justify-center border-gray300 divide-x-2 divide-gray300 mb-4 mr-0 sm:mr-4 md:mr-0 lg:mr-4">
              <div
                onClick={() => setCurrentQty((prevState) => prevState - 1)}
                className={`${
                  currentQty === 1 && "pointer-events-none"
                } h-full w-full sm:w-12 flex justify-center items-center cursor-pointer hover:bg-gray500 hover:text-gray100`}
              >
                -
              </div>
              <div className="h-full w-28 sm:w-12 flex justify-center items-center pointer-events-none">{currentQty}</div>
              <div
                onClick={() => setCurrentQty((prevState) => prevState + 1)}
                className="h-full w-full sm:w-12 flex justify-center items-center cursor-pointer hover:bg-gray500 hover:text-gray100"
              >
                +
              </div>
            </div>
            <div className="flex h-12 space-x-4 w-full">
              <Button
                value={!outStock ? t("add_to_cart") : "Non disponible"}
                size="lg"
                extraClass={`flex-grow text-center whitespace-nowrap ${!outStock && "hover:bg-gray200"}`}
                onClick={() => addItem!(currentItem)}
                disabled={outStock}
              />
              <GhostButton onClick={handleWishlist} extraClass="hover:bg-gray200">
                {alreadyWishlisted ? <HeartSolid extraClass="inline" /> : <Heart extraClass="inline" />}
              </GhostButton>
            </div>
          </div>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="py-2 focus:outline-none text-left mb-4 border-b-2 border-gray200 flex items-center justify-between">
                  <span>{t("details")}</span>
                  <DownArrow extraClass={`${open ? "" : "transform rotate-180"} w-5 h-5 text-purple-500`} />
                </Disclosure.Button>
                <Disclosure.Panel className={`text-gray400 animate__animated animate__bounceIn`}>{item.detail}</Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <div className="flex items-center mt-4">
            <span>{t("shareLink")}</span>
            <div
              className="ml-3 cursor-pointer rounded-full h-10 w-10 flex items-center justify-center hover:bg-gray200"
              onClick={() => {
                copy(window.location.href + "products/" + item.id);
                setcopied(true);
              }}
            >
              <ShareLink extraClass="h-5 cursor-pointer" />
            </div>
            {copied && <p className="text-blue">copié!</p>}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Card;
