import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

const socialLinks = [
  { icon: Mail, href: "mailto:info@beegroub.com", label: "Email" },
];

export const Footer = () => {
  const { t } = useLanguage();

  const footerLinks = {
    company: [
      { name: t('footer.aboutUs'), href: "/about" },
      { name: t('footer.products'), href: "/products" },
    ],
    support: [
      { name: t('footer.company'), href: "/contact" }, // Using "Company" as generic contact/support
      { name: t('footer.order'), href: "/contact" },
      { name: t('footer.careers'), href: "/careers" },
      { name: t('footer.faq'), href: "/faq" },
      { name: t('footer.terms'), href: "/terms" },
    ],
  };

  return (
    <footer className="bg-card/50 border-t border-border relative z-50">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
              >
                <img src={logo} alt="Bee Group" className="h-14 w-auto" />
              </motion.div>
            </Link>

            <p className="text-muted-foreground mb-6 max-w-sm">
              {t('footer.desc')}
            </p>

            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{t('footer.address')}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <span>+20 10 06546152</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <span>info@beegroub.com</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t('footer.company')}</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href + link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">{t('footer.support')}</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href + link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} {t('footer.rights')}
          </p>

          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <social.icon className="w-4 h-4 text-foreground" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
