import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function PhevsDemo() {
  return (
    <div className="min-h-screen bg-[#F7FBF8] text-[#133A2F] font-sans">
      {/* Navbar */}
      <header className="bg-[#1B5E20] text-white px-8 py-4 flex items-center justify-between shadow-md">
        <h1 className="text-2xl font-bold">PHEVs.eu</h1>
        <nav className="space-x-6 text-sm font-medium">
          <a href="#" className="hover:text-[#8BC34A] transition-colors">Home</a>
          <a href="#" className="hover:text-[#8BC34A] transition-colors">Compare</a>
          <a href="#" className="hover:text-[#8BC34A] transition-colors">Articles</a>
          <a href="#" className="hover:text-[#8BC34A] transition-colors">Contact</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-b from-[#1B5E20] to-[#2E7D32] text-white">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold mb-4"
        >
          Drive Clean. Think Green.
        </motion.h2>
        <p className="text-lg text-[#C8E6C9] mb-8">
          Discover eco-friendly plug-in hybrids designed for real sustainability.
        </p>
        <Button className="bg-[#8BC34A] hover:bg-[#7CB342] text-[#133A2F] px-6 py-3 rounded-full shadow-lg">
          Explore Models
        </Button>
      </section>

      {/* Content Section */}
      <main className="px-8 py-16 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {["Eco Range Insights", "CO₂ Savings", "Charging Optimization"].map((title, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
          >
            <Card className="rounded-2xl shadow-lg border-none hover:shadow-xl transition-shadow bg-white">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2 text-[#1B5E20]">{title}</h3>
                <p className="text-[#406E4B] text-sm">
                  Learn how sustainable hybrid technology can reduce emissions and maximize efficiency.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </main>

      {/* Footer */}
      <footer className="bg-[#1B5E20] text-[#C8E6C9] py-6 text-center text-sm">
        © 2025 PHEVs.eu — All rights reserved.
      </footer>
    </div>
  );
}
