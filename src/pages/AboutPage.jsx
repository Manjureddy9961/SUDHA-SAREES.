import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Award, Users, CheckCircle, MapPin, Feather } from 'lucide-react';
import TempleBorder from '../components/common/TempleBorder';
import Logo from '../components/common/Logo';

export default function AboutPage() {
  const milestones = [
    {
      year: '1989',
      title: 'Humble Looms in Rayalaseema',
      description: 'Founded with a modest collection of handwoven Dharmavaram and Gadwal sarees, partnering directly with master weaving families.'
    },
    {
      year: '1998',
      title: 'Bridal Silk Sanctuary',
      description: 'Expanded directly to Kanchipuram and Varanasi looms, establishing dedicated bridal muhurtham trousseau curation.'
    },
    {
      year: '2010',
      title: 'The Landmark Rayachoty Showroom',
      description: 'Inaugurated our spacious flagship store opposite the New Police Station on Kadiri Road, Rayachoty, becoming a regional wedding shopping landmark.'
    },
    {
      year: '2018',
      title: 'National Silk Mark Certification',
      description: 'Recognized for unwavering purity standards, testing and guaranteeing 100% pure silk and tested zari across every drape.'
    },
    {
      year: 'Present',
      title: 'Digital VIP Pre-Booking',
      description: 'Blending ancient artisan looms with modern digital convenience—allowing patrons worldwide to pre-book and reserve heirloom weaves.'
    }
  ];

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-charcoal overflow-hidden">
      {/* Hero Header */}
      <section className="relative bg-brand-maroon-dark text-brand-ivory py-20 px-4 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 space-y-4">
          <span className="text-xs uppercase tracking-widest font-semibold text-brand-gold-light inline-flex items-center gap-1.5 font-sans">
            <Feather size={14} />
            <span>Our Weaver Heritage</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-brand-gold-light">
            The Story of Sudha Sarees
          </h1>
          <div className="w-24 h-0.5 bg-brand-gold mx-auto my-3" />
          <p className="text-xs sm:text-base text-brand-blush/90 max-w-2xl mx-auto font-light leading-relaxed">
            Rooted in Rayachoty, dedicated to Indian handlooms, and cherishing the auspicious moments of over fifty thousand brides.
          </p>
        </div>
        <TempleBorder variant="gold" className="absolute bottom-0 inset-x-0" />
      </section>

      {/* Heritage Narrative & Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Imagery Collage */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-brand-gold/40">
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85"
                alt="Sudha Sarees Rayachoty Heritage"
                className="w-full h-[450px] object-cover"
              />
            </div>
            {/* Small floating badge */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 bg-brand-maroon text-brand-gold-light p-4 rounded-2xl border border-brand-gold/50 shadow-xl max-w-xs text-xs">
              <div className="flex items-center gap-2 font-serif font-bold text-sm text-brand-gold-light">
                <Award size={18} />
                <span>Pure Handloom Guarantee</span>
              </div>
              <p className="mt-1 text-brand-blush/80 text-[11px] leading-snug">
                Every thread woven with honor, respect for the weaver, and devotion to the craft.
              </p>
            </div>
          </div>

          {/* Right: Narrative Story */}
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest font-semibold text-brand-gold-dark font-sans">
              Born from Tradition
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-maroon-dark leading-snug">
              Preserving Ancient Looms for Modern Celebrations
            </h2>
            <p className="text-xs sm:text-sm text-brand-charcoal/80 leading-relaxed font-light">
              For over three decades, <strong className="text-brand-maroon font-semibold">Sudha Sarees</strong> has stood as a beacon of handloom integrity in Rayachoty. What began as a heartfelt mission to bridge master artisans with discerning patrons has flourished into one of Andhra Pradesh's most cherished wedding destinations.
            </p>
            <p className="text-xs sm:text-sm text-brand-charcoal/80 leading-relaxed font-light">
              From our landmark showroom opposite the New Police Station on Kadiri Road, we take pride in curating authentic Kanchipuram mulberry silks, Banarasi brocades, Dharmavaram temple weaves, and Pochampally double-ikkats directly from the master weavers who breathe life into each shuttle.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-brand-blush">
              <div className="flex items-center gap-2.5">
                <CheckCircle size={18} className="text-brand-gold-dark flex-shrink-0" />
                <span className="text-xs font-semibold text-brand-maroon-dark">100% Certified Silk Mark</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle size={18} className="text-brand-gold-dark flex-shrink-0" />
                <span className="text-xs font-semibold text-brand-maroon-dark">Ethical Weaver Partnerships</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle size={18} className="text-brand-gold-dark flex-shrink-0" />
                <span className="text-xs font-semibold text-brand-maroon-dark">Authentic Tested Gold Zari</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle size={18} className="text-brand-gold-dark flex-shrink-0" />
                <span className="text-xs font-semibold text-brand-maroon-dark">Bespoke Bridal Consultations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Heritage Timeline */}
      <section className="bg-brand-blush-soft py-20 border-y border-brand-gold/30 relative">
        <TempleBorder variant="gold" className="absolute top-0 inset-x-0" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest font-semibold text-brand-gold-dark font-sans">
              Our Journey
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-maroon-dark mt-1">
              Milestones of Grace &amp; Trust
            </h2>
            <div className="w-20 h-0.5 bg-brand-gold mx-auto my-3" />
          </div>

          {/* Timeline Nodes */}
          <div className="relative border-l-2 border-brand-gold/40 pl-6 sm:pl-8 ml-4 sm:ml-12 space-y-12">
            {milestones.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                {/* Node circle */}
                <div className="absolute -left-[35px] sm:-left-[43px] top-1 w-6 h-6 rounded-full bg-brand-maroon border-2 border-brand-gold flex items-center justify-center text-brand-gold-light shadow-md">
                  <div className="w-2 h-2 rounded-full bg-brand-gold-light" />
                </div>

                <div className="bg-white p-6 rounded-2xl border border-brand-gold/30 shadow-md hover:border-brand-gold transition duration-300">
                  <span className="font-serif text-xl sm:text-2xl font-bold text-brand-maroon">
                    {item.year}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-brand-maroon-dark mt-1">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-charcoal/80 leading-relaxed font-light mt-2">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <TempleBorder variant="gold" className="absolute bottom-0 inset-x-0" flip={true} />
      </section>

      {/* Showroom Invitation */}
      <section className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="p-8 bg-brand-ivory rounded-3xl border border-brand-gold/40 shadow-xl space-y-4">
          <Logo size="md" variant="dark" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-maroon-dark">
            We Welcome You to Experience the Weaves
          </h2>
          <p className="text-xs sm:text-sm text-brand-charcoal/70 max-w-xl mx-auto leading-relaxed">
            Visit us in Rayachoty opposite the New Police Station on Kadiri Road. Experience the weight of pure silk, the warmth of tested gold zari, and the hospitality of our bridal styling advisors.
          </p>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-maroon bg-brand-blush px-4 py-2 rounded-full border border-brand-gold/30">
              <MapPin size={14} className="text-brand-gold-dark" />
              <span>Rayachoty &bull; Annamayya District &bull; Andhra Pradesh</span>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
