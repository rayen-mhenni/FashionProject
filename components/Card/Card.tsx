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
import { isEmpty } from "lodash";

type Props = {
  item: any;
  outStock?: boolean;
};

const Card: FC<Props> = ({ item, outStock = false }) => {
  console.log("eeeeeeee", item);
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

  const alreadyWishlisted =
    wishlist.filter((wItem) => wItem.id === id).length > 0;

  const handleWishlist = () => {
    alreadyWishlisted ? deleteWishlistItem!(item) : addToWishlist!(item);
  };

  const handleModal = () => {
    setopen(true);
  };

  const handleSize = (value: string) => {
    setSize(value);
  };

  const calculateDiscountPrice = () => {
    if (!item?.discount) return price;
    return item?.prixVente - item.discount;
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Link href={itemLink}>
          <a
            tabIndex={-1}
            onMouseOver={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {!isHovered && (
              <Image
                className="w-full h-auto object-contain"
                src={img1 as string}
                alt={name}
                width={230}
                height={300}
                layout="responsive"
              />
            )}
            {isHovered && (
              <Image
                className="transition-transform transform hover:scale-110 object-contain duration-1000"
                src={(isEmpty(img2) ? img1 : img2) as string}
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
      </div>

      <div className="content">
        <Link href={itemLink}>
          <a className={styles.itemName}>{name}</a>
        </Link>

        <div className="flex flex-col">
          {item.discount > 0 ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-gray-900">
                  {calculateDiscountPrice()} TND
                </span>
                <span className="bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                  -{item.discount} TND
                </span>
              </div>
              <span className="text-xs text-gray-500 line-through">
                {price} TND
              </span>
            </>
          ) : (
            <span className="text-base font-bold text-gray-900">
              {price} TND
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
