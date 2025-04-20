import { useTranslations } from "next-intl";
import Image from "next/image";

import TextButton from "../Buttons/TextButton";
import styles from "./Hero.module.css";

// swiperjs
import { Swiper, SwiperSlide } from "swiper/react";

// import Swiper core and required modules
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper/core";
import { isEmpty } from "lodash";
import Button from "../Buttons/Button";
import { useRouter } from "next/router";

// install Swiper modules
SwiperCore.use([Pagination, Navigation, Autoplay]);

const sliders = [
  {
    id: 3,
    image: "/bg-img/monigote.jpg",
    imageTablet: "/bg-img/monigote-tablet.png",
    imageMobile: "/bg-img/test2.png",
    subtitle: "",
    titleUp: "RAF CLOTHING",
    titleDown: "SHOP",
    url: "/product-category/Homme",
    rightText: false,
  },
  {
    id: 2,
    image: "/bg-img/curly_hair_white-1.jpg",
    imageTablet: "/bg-img/curly_hair_white-1.jpg",
    imageMobile: "/bg-img/test.png",
    subtitle: "",
    titleUp: "",
    titleDown: "",
    url: "/product-category/Femme",
    rightText: true,
  },
];

const Slideshow = () => {
  const t = useTranslations("Index");
  const router = useRouter();
  return (
    <>
      <div className="relative -top-20 slide-container w-full z-20">
        <Swiper
          slidesPerView={1}
          spaceBetween={0}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          navigation={true}
          pagination={{
            clickable: true,
            type: "fraction",
            dynamicBullets: true,
          }}
          className="mySwiper"
        >
          {sliders.map((slider) => (
            <SwiperSlide key={slider.id}>
              <div className="hidden lg:block">
                <Image
                  layout="responsive"
                  src={slider.image}
                  width={1144}
                  height={572}
                  alt={"some name"}
                />
              </div>
              <div className="hidden sm:block lg:hidden">
                <Image
                  layout="responsive"
                  src={slider.imageTablet}
                  width={820}
                  height={500}
                  alt={"some name"}
                />
              </div>

              <div className="sm:hidden">
                <Image
                  layout="responsive"
                  src={slider.imageMobile}
                  width={428}
                  height={700}
                  alt={"some name"}
                />

                <div
                  className={
                    slider.rightText
                      ? styles.rightTextSection
                      : styles.leftTextSection
                  }
                  style={{
                    borderRadius: "50px",
                    fontSize: "20px",
                    color: "#fff",
                    backgroundColor: "#000",
                  }}
                >
                  <button
                    onClick={() => {
                      router.push(slider.url);
                    }}
                  >
                    VOIR LA COLLECTION
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default Slideshow;
