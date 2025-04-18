import { FC, useCallback, useEffect, useState } from "react";
import LeftArrow from "../../public/icons/LeftArrow";
import RightArrow from "../../public/icons/RightArrow";
import Image from "next/image";

interface Testimonial {
  speech: string;
  name: string;
  occupation: string;
  rating: number;
  avatar: string;
  location: string;
}

const testimonials: Testimonial[] = [
  {
    speech: "Les t-shirts  sont d'une qualité exceptionnelle. Le coton est doux et résistant, et les coupes sont parfaites. Je les recommande à tous mes followers!",
    name: "Alexandre D.",
    occupation: "Influenceur Mode",
    rating: 5,
    avatar: "/favicons/androgynous-avatar-non-binary-queer-person.jpg",
    location: "Paris, France"
  },
  {
    speech: "En tant qu'athlète, je recherche des vêtements confortables et respirants. Les t-shirts  répondent parfaitement à mes besoins, même lors des entraînements intensifs.",
    name: "Sarah M.",
    occupation: "Athlète Professionnelle",
    rating: 5,
    avatar: "/favicons/brunet-man-wearing-round-eyeglasses-blue-shirt.jpg",
    location: "Lyon, France"
  },
  {
    speech: "Je commande régulièrement pour mon entreprise. La qualité premium et le service client impeccable font toute la différence. Nos employés adorent!",
    name: "Thomas L.",
    occupation: "Directeur d'Entreprise",
    rating: 4,
    avatar: "/favicons/androgynous-avatar-non-binary-queer-person.jpg",
    location: "Bordeaux, France"
  },
  {
    speech: "Les designs uniques et les coupes féminines sont exactement ce que je cherchais. Je ne porte presque plus que des t-shirts  maintenant!",
    name: "Émilie R.",
    occupation: "Designer Graphique",
    rating: 5,
    avatar: "/favicons/brunet-man-wearing-round-eyeglasses-blue-shirt.jpg",
    location: "Marseille, France"
  }
];

const TestimonialSlider: FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animation, setAnimation] = useState("animate__fadeIn");
  const [isHovered, setIsHovered] = useState(false);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
    setAnimation("animate__fadeInRight");
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setAnimation("animate__fadeInLeft");
  }, []);

  const goToIndex = (index: number) => {
    setAnimation(index > currentIndex ? "animate__fadeInRight" : "animate__fadeInLeft");
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [handleNext, isHovered]);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <span 
        key={i} 
        className={`text-xl ${i < rating ? 'text-yellow' : 'text-gray'}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div 
      className="relative w-full max-w-4xl mx-auto py-12 px-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
        Ce que nos clients disent
      </h2>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {testimonials.map((testimonial, index) => (
          index === currentIndex && (
            <div 
              key={testimonial.name}
              className={`animate__animated ${animation} p-8 md:p-12 flex flex-col md:flex-row items-center gap-8`}
            >
              <div className="w-32 h-32 relative flex-shrink-0">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full border-4 border-green-100"
                  priority
                />
              </div>
              
              <div className="text-center md:text-left">
                <div className="mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                
                <blockquote className="text-lg italic text-gray-600 mb-6">
                  "{testimonial.speech}"
                </blockquote>
                
                <div className="text-gray-800">
                  <p className="font-bold text-lg">{testimonial.name}</p>
                  <p className="text-sm">{testimonial.occupation}</p>
                  <p className="text-xs text-gray-500 mt-1">{testimonial.location}</p>
                </div>
              </div>
            </div>
          )
        ))}
      </div>

      {/* Navigation */}
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-green-50 transition-colors"
        aria-label="Témoignage précédent"
      >
        <LeftArrow className="w-6 h-6 text-gray-700" />
      </button>
      
      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-green-50 transition-colors"
        aria-label="Témoignage suivant"
      >
        <RightArrow className="w-6 h-6 text-gray-700" />
      </button>

      {/* Indicators */}
      <div className="flex justify-center mt-6 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToIndex(index)}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-green-500' : 'bg-gray-300'}`}
            aria-label={`Aller au témoignage ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialSlider;