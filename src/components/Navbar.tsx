import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { useLanguage } from "@/context/LanguageContext";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  const navLinks = [
    { name: t('nav.home'), path: "/" },
    { name: t('nav.products'), path: "/products" },
    { name: t('nav.events'), path: "/events" },
    { name: t('nav.about'), path: "/about" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "glass-strong py-3" : "bg-transparent py-5"
        }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="#home"
          className="flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img src={logo} alt="Bee Group" className="h-12 w-auto" />
        </motion.a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.path}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={link.path}
                className="text-foreground/80 hover:text-primary transition-colors font-medium text-lg relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Button & Language Toggle */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="rounded-full hover:bg-black/5"
          >
            <Globe className="w-5 h-5 text-primary" />
            <span className="sr-only">Toggle Language</span>
          </Button>
          <span className="text-sm font-bold text-primary cursor-pointer select-none" onClick={toggleLanguage}>
            {language === 'ar' ? 'English' : 'العربية'}
          </span>
          <Button variant="hero" size="lg">
            {t('nav.contact')}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong mt-2 mx-4 rounded-xl overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-foreground/80 hover:text-primary transition-colors py-2 font-medium"
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center justify-between py-2 border-t border-b border-gray-100">
                <span className="text-sm font-medium">{language === 'ar' ? 'Change Language' : 'تغيير اللغة'}</span>
                <Button variant="ghost" size="sm" onClick={toggleLanguage} className="gap-2">
                  <Globe className="w-4 h-4" />
                  {language === 'ar' ? 'English' : 'العربية'}
                </Button>
              </div>

              <Link to="/login">
                <Button variant="default" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  {t('nav.login')}
                </Button>
              </Link>
              <Button variant="hero" className="mt-2">
                {t('nav.contact')}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
