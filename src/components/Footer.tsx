import { motion } from "framer-motion";
import { Facebook, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

const footerLinks = {
  company: [
    { name: "About Us", href: "#about" },
    { name: "Our Vision", href: "#vision" },
    { name: "Products", href: "#products" },
    { name: "Partners", href: "#partners" },
  ],
  services: [
    { name: "General Medicine", href: "#" },
    { name: "Specialty Drugs", href: "#" },
    { name: "Healthcare Solutions", href: "#" },
    { name: "Order Products", href: "#" },
  ],
  support: [
    { name: "Contact Us", href: "#" },
    { name: "Career", href: "#" },
    { name: "FAQ", href: "#" },
    { name: "Terms of Service", href: "#" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "mailto:info@beegroup-eg.com", label: "Email" },
];

export const Footer = () => {
  return (
    <footer className="bg-card/50 border-t border-border">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.a
              href="#home"
              className="inline-block mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <img src={logo} alt="Bee Group" className="h-14 w-auto" />
            </motion.a>

            <p className="text-muted-foreground mb-6 max-w-sm">
              Bee Group Pharmaceuticals - Your trusted partner in healthcare,
              delivering innovative medications since 2018.
            </p>

            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span>TANTA ,GARBIA ,EGYPT</span>
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
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Products</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Bee Group Pharmaceuticals. All rights reserved.
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
