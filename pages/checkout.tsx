import { useState } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import moment from "moment";
import _, { isEmpty } from "lodash";
import { roundDecimal } from "../components/Util/utilFunc";
import Header from "../components/Header/Header";
import Input from "../components/Input/Input";
import Button from "../components/Buttons/Button";
import Footer from "../components/Footer/Footer";
import { useCart } from "../context/cart/CartProvider";
import { fbPixelPurchase } from "../components/Util/fb";

type Props = {
  articles: any[];
};

const ShoppingCart: React.FC<Props> = () => {
  const { cart, clearCart } = useCart();

  const articles = cart;

  console.log("articlesddddddddddddd", articles);

  const router = useRouter();
  const [devise] = useState("TND");

  // États du formulaire
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState(false);

  // Calculs des totaux
  const calculerSousTotal = () => {
    return articles.reduce(
      (total, article) => total + article.price * article?.qty,
      0
    );
  };

  const calculerRemise = () => {
    return articles.reduce((total, article) => {
      return total + (article.qty > 1 ? (article.qty - 1) * 8 : 0);
    }, 0);
  };

  const calculerTotal = () => {
    return roundDecimal(calculerSousTotal() + 8); // 8 TND pour livraison
  };

  const passerCommande = async () => {
    console.log("eeeeeeeeeeeee", articles);

    setEnCours(true);
    setErreur("");

    try {
      const reponse = await axios.post(
        `${process.env.NEXT_PUBLIC_ORDERS_MODULE}`,
        {
          date: moment().format("MMMM Do YYYY, h:mm:ss a"),
          customerName: nom,
          customerAddress: adresse,
          customerPhone: telephone,
          items: articles.map((product: any) => ({
            stockId: product._id,
            color: product.color,
            size: product.size,
            image: product.img1,
            reference: product.reference,
            nom: product.name,
            quantity: Number(product.qty || 0),
            prixAchat: Number(product.prixAchat ?? 0),
            prixVente: Number(product.prixVente ?? 0),
          })),

          subtotal: Number(calculerTotal()),
          tax: 0,
          total: Number(calculerTotal()),
          status: "pending",
          notes: "Waiting for confirmation",
        }
      );

      if (reponse.data) {
        fbPixelPurchase(Number(calculerTotal()));
        setSucces(true);
        router.push("/coming-soon");
      } else {
        setErreur("Erreur lors de la commande. Veuillez réessayer.");
      }
    } catch (error) {
      setErreur("Une erreur est survenue. Veuillez réessayer plus tard.");
    } finally {
      setEnCours(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header title="Paiement - RAF Fashion" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Fil d'Ariane */}
        <nav className="flex py-4 mb-6" aria-label="Fil de navigation">
          <ol className="flex items-center space-x-4">
            <li>
              <Link href="/">
                <a className="text-gray-400 hover:text-gray-500">Accueil</a>
              </Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li className="text-gray-900 font-medium">Paiement</li>
          </ol>
        </nav>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Colonne de gauche - Récapitulatif */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md mb-6 lg:mb-0">
            <h2 className="text-2xl font-bold mb-6">
              Récapitulatif de la commande
            </h2>

            {/* Articles */}
            <div className="space-y-4 mb-6">
              {articles.map((article) => (
                <div
                  key={`${article._id}-${article.size}`}
                  className="flex border-b pb-4"
                >
                  <div className="w-24 h-24 flex-shrink-0">
                    <Image
                      src={article.img1}
                      alt={article.name}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <h3 className="font-medium">{article.name}</h3>
                    <p className="text-sm text-gray-500">
                      Taille: {article.size} | Couleur: {article.color}
                    </p>
                    <p className="text-sm text-gray-500">
                      Quantité: {article.qty}
                    </p>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="font-medium">
                      {article.prixVente} X {article.qty} {devise}
                    </p>
                    {/* {Number(article.qty) > 1 && (
                      <p className="text-sm text-green-600">
                        -{(Number(article.qty) - 1) * 8} {devise}
                      </p>
                    )} */}
                  </div>
                </div>
              ))}
            </div>

            {/* Totaux */}
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span>Sous-total</span>
                <span>
                  {roundDecimal(calculerSousTotal())} {devise}
                </span>
              </div>
              {/* <div className="flex justify-between mb-2 text-green-600">
                <span>Remise</span>
                <span>
                  -{calculerRemise()} {devise}
                </span>
              </div> */}
              <div className="flex justify-between mb-2">
                <span>Livraison</span>
                <span>8 {devise}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                <span>Total</span>
                <span>
                  {calculerTotal()} {devise}
                </span>
              </div>
            </div>
          </div>

          {/* Colonne de droite - Informations client */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">Informations client</h2>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="nom"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nom complet
                  </label>
                  <Input
                    name="nom"
                    type="text"
                    extraClass="w-full"
                    border="border-2 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="telephone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Numéro de téléphone
                  </label>
                  <Input
                    placeholder="Exemple: 99 999 999"
                    name="telephone"
                    type="tel"
                    extraClass="w-full"
                    border="border-2 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="adresse"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Adresse de livraison
                  </label>
                  <textarea
                    id="adresse"
                    className="w-full border-2 border-gray-300 focus:border-green-500 focus:ring-green-500 p-3 rounded-md"
                    rows={3}
                    value={adresse}
                    onChange={(e) => setAdresse(e.target.value)}
                    required
                  />
                </div>

                {/* Informations de livraison */}
                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    Informations importantes
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700">
                    <li>Livraison en 48 heures maximum</li>
                    <li>Un SMS de confirmation vous sera envoyé</li>
                    <li>Service client: 42 301 531</li>
                  </ul>
                </div>

                {erreur && (
                  <div className="text-red-600 text-center py-2">{erreur}</div>
                )}

                <Button
                  value={
                    enCours ? "Traitement en cours..." : "Confirmer la commande"
                  }
                  size="lg"
                  extraClass="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 text-white font-bold"
                  disabled={
                    isEmpty(nom) ||
                    isEmpty(telephone) ||
                    telephone.length !== 8 ||
                    isEmpty(adresse) ||
                    enCours ||
                    succes
                  }
                  onClick={passerCommande}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // Dans une application réelle, vous récupéreriez les articles depuis le panier
  // Ceci est un exemple - adaptez à votre système de panier
  const articles = []; // Récupérez les articles depuis votre contexte ou API

  return {
    props: {
      articles,
    },
  };
};

export default ShoppingCart;
