import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

import AppHeader from "../components/Header/AppHeader";
import { GetStaticProps } from "next";
import Header from "../components/Header/Header";
import LeftArrow from "../public/icons/LeftArrow";

const ComingSoon = () => {
  const t = useTranslations("Others");

  return (
    <>
      <AppHeader title="Commande Validée - RAF Fashion" />
      <Header />

      <div className="flex flex-col h-screen justify-center items-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Commande Validée avec Succès!
          </h1>

          <p className="text-gray-600 mb-6">
            Merci pour votre commande. Nous avons bien reçu votre demande et la
            traiterons dans les plus brefs délais.
          </p>

          {/* Delivery Information */}
          <div className="bg-blue-50 p-4 rounded-md mb-6 text-left">
            <h2 className="font-semibold text-blue-800 mb-2">
              Informations Importantes:
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700">
              <li>Livraison dans un délai maximum de 48 heures</li>
              <li>Un Apple de confirmation dans un délai 24H</li>
              <li>Préparation de votre colis en cours</li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="mb-6">
            <p className="text-gray-700">
              Pour toute question, contactez-nous au:
            </p>
            <a
              href="tel:42301531"
              className="text-blue-600 font-bold text-lg hover:text-blue-800"
            >
              55 336 394
            </a>
          </div>

          {/* Continue Shopping Button */}
          <Link href="/">
            <a className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition duration-200">
              Retour à l'accueil
            </a>
          </Link>

          {/* Order Number (if available) */}
          {/* <div className="mt-6 text-sm text-gray-500">
            Numéro de commande: #123456
          </div> */}
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../messages/common/${locale}.json`)).default,
    },
  };
};

export default ComingSoon;
