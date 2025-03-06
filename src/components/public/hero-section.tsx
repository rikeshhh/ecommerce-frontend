import Carousel from "../ui/caroussel/carousel";
import CarouselSlide from "../ui/caroussel/carousel-slide";

export function HeroSection() {
  return (
    <div className="w-full">
      <Carousel
        slides={[
          <CarouselSlide className="bg-gradient-to-r from-blue-400 to-blue-600 text-white text-center">
            <h3 className="text-xl font-bold">Slide 1</h3>
            <p className="mt-2">Short content.</p>
          </CarouselSlide>,
          <CarouselSlide className="bg-gradient-to-r from-green-400 to-green-600 text-white text-center">
            <h3 className="text-xl font-bold">Slide 2</h3>
            <p className="mt-2">
              Longer content to test auto height and spacing.
            </p>
          </CarouselSlide>,
          <CarouselSlide className="bg-gradient-to-r from-purple-400 to-purple-600 text-white text-center">
            <h3 className="text-xl font-bold">Slide 3</h3>
            <p className="mt-2">Medium content here.</p>
          </CarouselSlide>,
        ]}
      ></Carousel>
    </div>
  );
}
