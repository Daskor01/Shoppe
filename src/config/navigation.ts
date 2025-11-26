import IconFacebook from '@/components/icons/IconFacebook.vue'
import IconTwitter from '@/components/icons/IconTwitter.vue'
import IconInstagram from '@/components/icons/IconInstagram.vue'
import IconSearch from '@/components/icons/IconSearch.vue'
import IconCart from '@/components/icons/IconCart.vue'
import IconMail from '@/components/icons/IconMail.vue'
import type { Component } from 'vue'

export interface LinkItem {
  name: string
  path: string
  icon?: Component
}

export const headerLinks = [
  { name: 'Shop', path: '/Shop' },
  { name: 'Blog', path: '/' },
  { name: 'Our Story', path: '/' },
]

export const headerActions = [
  { icon: IconSearch, action: 'openSearch' },
  { icon: IconCart, action: 'openCart' },
]

export const navigationLinks: LinkItem[] = [
  { name: 'Home', path: '/' },
  { name: 'Shop', path: '/Shop' },
  { name: 'About', path: '/' },
  { name: 'Blog', path: '/' },
  { name: 'Help', path: '/' },
  { name: 'Contact', path: '/' },
  { name: 'Search', path: '/' },
]

export const copyrightLinks: LinkItem[] = [
  { name: 'Terms of use', path: '/' },
  { name: 'Privacy policy', path: '/' },
]

export const footerLinks: LinkItem[] = [
  { name: 'Contact', path: '/' },
  { name: 'Terms Of Services', path: '/' },
  { name: 'Shipping And Returns', path: '/' },
]

export const socialLinks: LinkItem[] = [
  { name: 'Facebook', path: 'https://facebook.com', icon: IconFacebook },
  { name: 'Twitter', path: 'https://twitter.com', icon: IconTwitter },
  { name: 'Instagram', path: 'https://instagram.com', icon: IconInstagram },
]

export const socialNetworks = [
  { name: 'Message', icon: IconMail, shareUrl: 'sms:?body=' },
  { name: 'Facebook', icon: IconFacebook, shareUrl: 'fb://share?url=' },
  { name: 'Instagram', icon: IconInstagram, shareUrl: 'instagram://share?url=' },
  { name: 'Twitter', icon: IconTwitter, shareUrl: 'twitter://post?message=' },
]
