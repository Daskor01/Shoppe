import IconFacebook from "@/components/icons/IconFacebook.vue";
import IconTwitter from "@/components/icons/IconTwitter.vue";
import IconInstagram from "@/components/icons/IconInstagram.vue";

export interface LinkItem {
  name: string;
  path: string;
  icon?: any;
}

export const navigationLinks: LinkItem[] = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/Shop" },
  { name: "About", path: "/" },
  { name: "Blog", path: "/Blog" },
  { name: "Help", path: "/" },
  { name: "Contact", path: "/Contact" },
  { name: "Search", path: "/" },
];

export const copyrightLinks: LinkItem[] = [
  { name: "Terms of use", path: "/" },
  { name: "Privacy policy", path: "/" },
];

export const footerLinks: LinkItem[] = [
  { name: "Contact", path: "/" },
  { name: "Terms Of Services", path: "/" },
  { name: "Shipping And Returns", path: "/" },
];

export const socialLinks: LinkItem[] = [
  { name: "Facebook", path: "https://facebook.com", icon: IconFacebook },
  { name: "Twitter", path: "https://twitter.com", icon: IconTwitter },
  { name: "Instagram", path: "https://instagram.com", icon: IconInstagram },
];
