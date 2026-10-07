import React from 'react';
import { Globe, Camera, MessageCircle, Briefcase } from 'lucide-react';
import { MinimalistHero } from '@/components/ui/minimalist-hero';

const MinimalistHeroDemo = () => {
  const navLinks = [
    { label: 'HOME', href: '#' },
    { label: 'PRODUCT', href: '#' },
    { label: 'STORE', href: '#' },
    { label: 'ABOUT US', href: '#' },
  ];

  const socialLinks = [
    { icon: Globe, href: '#' },
    { icon: Camera, href: '#' },
    { icon: MessageCircle, href: '#' },
    { icon: Briefcase, href: '#' },
  ];

  return (
    <MinimalistHero
      logoText="mnmlst."
      navLinks={navLinks}
      mainText="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultrices, justo vel tempus."
      readMoreLink="#"
      imageSrc="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face"
      imageAlt="A portrait of a person, in profile."
      overlayText={{
        part1: 'less is',
        part2: 'more.',
      }}
      socialLinks={socialLinks}
      locationText="Arlington Heights, IL"
    />
  );
};

export default MinimalistHeroDemo;
