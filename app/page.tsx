import Header from './components/header';
import Hero from './components/hero';
import Features from './components/features';
import Pricing from './components/pricing';
import Footer from './components/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
