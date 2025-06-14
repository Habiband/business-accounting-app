import { Hero } from '@/components/home/Hero';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Categories } from '@/components/home/Categories';
import { Newsletter } from '@/components/home/Newsletter';
import { Testimonials } from '@/components/home/Testimonials';
import { Features } from '@/components/home/Features';

export default function HomePage() {
  return (
    <div className="space-y-16 pb-16">
      <Hero />
      <div className="container mx-auto px-4">
        <FeaturedProducts />
        <Categories />
        <Features />
        <Testimonials />
        <Newsletter />
      </div>
    </div>
  );
}
