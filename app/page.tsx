import Header from './components/header';
import Hero from './components/hero';
import Features from './components/features';
import Pricing from './components/pricing';
import Footer from './components/footer';
import ApiDemo from './components/apidemo';
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FAFAFA] via-[#F5F5F5] to-[#F0F0F0]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.05),transparent_40%)]" />
      <Header />
      <main className="flex-grow pt-16 relative">
        <Hero />
        <Features />
        <Pricing />
        <ApiDemo />
      </main>
      <Footer />
    </div>
  );
}
