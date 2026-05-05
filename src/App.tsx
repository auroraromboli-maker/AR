/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  ShoppingBag, 
  Home as HomeIcon, 
  Layers, 
  Grid2X2, 
  BookOpen, 
  ArrowRight,
  Plus,
  Sparkles
} from 'lucide-react';

// --- Types ---
type Page = 'home' | 'dresses' | 'tights' | 'story' | 'product';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  fabric?: string;
  colors?: string[];
}

// --- Mock Data ---
const DRESSES: Product[] = [
  {
    id: 'd1',
    name: 'The Apollo Flare',
    price: 420,
    category: 'MIDI',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDASvkD6aMinp7uKK40Kj2DOd-WWTus-ZS2cW5Xi6IsX95ceNSn88f7WEIXdTt5IKmdGLjq9Joc2eavz-KjjrDs3EzzftPGYnwQ6t538vgwKgtO5uVKmmnJNGCjF9Eqqg3VzYKbbugWvemovUJ-2kGufjsv1hFNG-ANeETISvdavwzTxsBCg2TVtUruh_LCRbGlA7_oNaVLdilbJC8_1DRw5ofTMWJbjqcGTNQMctolw7OJLj96FCjSLhpgidr04b71nEkLP5HbSeOJ',
    fabric: 'BLUSH PATTERNED SILK',
    colors: ['#F2D2BD', '#E2E2E2']
  },
  {
    id: 'd2',
    name: 'Lunar Orbit Mini',
    price: 385,
    category: 'MINI',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDw6fZ1f491PJste7dFFzvS-rewnEVpdEf8-OEbp_eKQthYQ9FRVaL084VLkibt5HJKiJ6gmUnIucPUhFq7M158p-QbfKkcCEZ8T4Bju7I9CiJvRqq5Dt8vmjvJI5SsdZORSfp7qQqfH6pbvErmnYCznePxNrOsskt9MPsYw1PIYaEHLfRLw0QMVeGKl9yH1DN1qaVHRank78U-4m_FeIA_MbHNSym2QL-RiFM8fg3rqhS0S5FV3pmvtyWHjJEwVlunTODv9jnhj4E8',
    fabric: 'HEAVYWEIGHT COTTON POPLIN',
    colors: ['#1A1C1A', '#F2D2BD']
  },
  {
    id: 'd3',
    name: 'Cosmic Swing Gown',
    price: 650,
    category: 'MAXI',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWmtX8DaFvjIXg8rVJ8o66BOU-UQyGGSObODhTWI9nKPX0uislsiYGgffJ-FQfDlT9MuchrMI-T2p9kHiAnyJ0f7F96tLxnOTtmZr-z_pqNBwr7SbP2cvDrNKSg0nZRC0A6OcpyPKEa9VsHrWzFticBZHgS11LFntyDr-WAJqoBpjVI8M6Mh4ZHgFk--WNSKE77aq0aIlpy5SQZDV62xKSXebC16s0PSjwqjnUnCWnpnn2aOCxBt_YFqLILbqLo8-f9HziyS1Q-owL',
    fabric: 'TAFFETA WITH SHEEN',
    colors: ['#F2D2BD', '#FFFFFF']
  }
];

const HOSIERY: Product[] = [
  {
    id: 'h1',
    name: 'Orbital Dot',
    price: 48,
    category: 'POLKA DOTS',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWGTFmhpxkTfGvcsuIpR9ZEDF858TabW2SscqiCzJwO4DibAiJ-JH50aN1GDkIZGYD5T9LqJDQaJKe5X4lTCaVxrHukzGhSH6dXxqvLli4Udaj0XvuYGAiiufuDpMecz224-MZEqOSTOBYLVUZPEmfdhwOr-_kZODCRisoyIPgOpG0l3TJh1p5-S3LsK8feuMQYW8-wacIPaH9EneK4p5OSHT_VQE9olyIrZSRKV02lA4Z5PKgTWGgGYwsDbm-oXGUMLTPIcaHomGl'
  },
  {
    id: 'h2',
    name: 'Matrix Mesh',
    price: 42,
    category: 'GEOMETRIC',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9a9_a7ho-iUVFQ7lbxVzeFy2k-2wqg2edwfAcwKMouCDKQmMpo5S7jfJZrtYAyGE1y83StoO5iHfiuiqO-b9z0yn1BGjUvbwA4NAvZsJqkcXmV_g44soF8euZgejOdcnsmeTIwDNd5qZqBCmNSSeJO_jHRg0RU3EFzzgUWokdEIcQuwE2QLY6DW49YWybg85KihILBsWsgfoPPV3SWTfVTCPdrPbf-XeKWwytHtOdKDaE7OfQJ-41mf2I2iWQbfbQHYNy5oipOXu4'
  },
  {
    id: 'h3',
    name: 'Lunar Stripe',
    price: 45,
    category: 'STRIPES',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAljAha1nKbfpqdxjILiboAsQYhJ89wFPZaVw0B0L4_KEHUiJDyStgD4yjofQyJBNE26gDeJgORkdsGomjVo7o9X2529fV7d8muGipeddVmF6EfO3HHjYmEUIWl8tBcz0cdeAa6wC3Ak23VDfEAlE_dVCjcnHjLXA8dhP401msX-_F1wio07dgCSClZV73Z-k-oIj-UZra2cV5GAvTDPxMhD9bvkMZG-fJ3Lkn1oqKJ-zEqkuRwWuIbEVT5oZlWDNwiZHcrQp8tslGQ'
  }
];

// --- Components ---

const TopBar = ({ title = "MOD LUNAR" }: { title?: string }) => (
  <header id="top-bar" className="fixed top-0 w-full z-50 glass flex justify-between items-center px-6 h-16">
    <button id="menu-btn" className="active:opacity-50 transition-opacity">
      <Menu size={20} />
    </button>
    <h1 id="brand-logo" className="font-serif font-bold tracking-[0.2em] text-xl text-on-surface uppercase">{title}</h1>
    <button id="cart-btn" className="active:opacity-50 transition-opacity">
      <ShoppingBag size={20} />
    </button>
  </header>
);

const BottomNav = ({ active, onChange }: { active: Page, onChange: (p: Page) => void }) => {
  const items = [
    { id: 'home' as const, label: 'Home', icon: HomeIcon },
    { id: 'dresses' as const, label: 'Dresses', icon: Layers },
    { id: 'tights' as const, label: 'Tights', icon: Grid2X2 },
    { id: 'story' as const, label: 'Story', icon: BookOpen },
  ];

  return (
    <nav id="bottom-nav" className="fixed bottom-0 w-full z-50 flex justify-around items-center h-20 pb-safe px-4 bg-primary-container/90 backdrop-blur-3xl border-t-[0.5px] border-on-surface/10">
      {items.map((item) => (
        <button
          key={item.id}
          id={`nav-${item.id}`}
          onClick={() => onChange(item.id)}
          className={`flex flex-col items-center justify-center transition-all active:scale-95 ${
            (active === item.id || (active === 'product' && item.id === 'dresses')) ? 'text-secondary font-bold' : 'text-on-surface/60'
          }`}
        >
          <item.icon size={20} strokeWidth={active === item.id ? 2.5 : 1.5} />
          <span className="font-serif text-[10px] uppercase tracking-tighter mt-1">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

const Footer = () => (
  <footer id="footer" className="w-full py-16 px-8 flex flex-col items-center text-center space-y-6 bg-on-surface text-primary-container mt-20">
    <div className="font-serif font-bold tracking-[0.3em] mb-4 text-xl">MOD LUNAR</div>
    <div className="flex flex-wrap justify-center gap-6">
      {['Privacy', 'Shipping', 'Returns', 'Contact'].map(link => (
        <a key={link} href="#" className="font-serif text-[10px] tracking-widest uppercase text-on-surface-variant hover:text-white transition-colors">{link}</a>
      ))}
    </div>
    <p className="font-serif text-[10px] tracking-widest uppercase text-on-surface-variant mt-12 opacity-50">© 1966 MOD LUNAR COSMIC COUTURE</p>
  </footer>
);

// --- Pages ---

const HomePage = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-16 pb-20">
    {/* Hero Section */}
    <section id="hero" className="relative h-[751px] w-full overflow-hidden bg-primary-container">
      <img 
        className="w-full h-full object-cover contrast-[110%]" 
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxeZ9BSbYYY1VwXQV_3Yg0fCWNWMs5lBZH8JNJgRAoP5AykU3RNNWev64npzK3WLDzdJETS0V8i3SO_lgiNCLh4HmsxmtXvfFj75QTuAoX5dYixxk-bBWxqcqcEiOZVkP_2AlIvzvaqNJOm7Jlu1IaxAUF85CpbLb0WmIIbUiqsmAXPc4qHeHnegI6syOwB_d9UXiklfQtiJcnF8g-8VYBrssD78NNbBlQvMbLjFLj4xnh-1-oH6F0gLIUEIVVtsCULP0iuwaaIxWQ" 
        alt="Collection No. 01 Hero"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-on-surface/40 to-transparent flex flex-col justify-end p-8 pb-16">
        <p className="btn-label text-white mb-2 tracking-[0.3em]">COLLECTION NO. 01</p>
        <h2 className="font-serif text-6xl text-white mb-6 uppercase tracking-tight">MOD LUNAR</h2>
        <div className="flex gap-4">
          <button className="px-8 py-4 bg-white text-on-surface btn-label hover:bg-transparent hover:border-white hover:text-white border border-transparent transition-all duration-500">SHOP NEW</button>
        </div>
      </div>
    </section>

    {/* New Arrivals */}
    <section id="new-arrivals" className="mt-section px-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="btn-label text-primary tracking-widest">FRESH FROM ORBIT</span>
          <h3 className="font-serif text-3xl mt-1">New Arrivals</h3>
        </div>
        <a href="#" className="btn-label text-primary border-b border-primary pb-1">VIEW ALL</a>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 relative aspect-[4/5] bg-surface-container-low overflow-hidden">
          <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjozwmiCJa1XnNazbC7KNYOt96SQf8AdhiDxbBwLvDKYXJuLgGy9EMUj4tW5IGooQbBs_jTNVySri7pwfCi5zJvBYLG7KMoPhojICTaMFJJIcZgklOvRtKq8YHJ-x1lNbOgfeJ_X9YNUjnjNUhE2PlXtWa2UG4nCnOSIEh3nP1URZcAcyKK-Gzsy9wH1R5E9tswpndx8_9hD0rbMdroMIg0RI1KHo46iFWe6K2Bufq0yKH-0CmAn2Zptt5Y0X_DhtXC0cl64KVd008" alt="Lunar Shift" />
          <div className="absolute bottom-4 left-4">
            <p className="font-serif text-xl">Lunar Shift</p>
            <p className="font-mono text-xs text-on-surface-variant">$240</p>
          </div>
        </div>
        <div className="relative aspect-square bg-surface-container-low overflow-hidden">
          <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDs7jqtRV2-tph1rGGTc0pz-LLJvNQHRqVK0E8AcvBlNBYeStEB1Q_0jDmxiyOR7dIa-4ZgQi5lSQtzxhzDZUVusO1GLlINn8RAcEPqvmxcwkGCJo_OA_SMKNrimFmGTKkOWc-hbmSceyCMEt8Q75IYHQhtalBkgprAQUoSs9nO5ewM5vdki_lZ66Ir15CnmfxK_tMkd5CtYY0dB5cxvT4dexqp-nOONLKwN331gkaPg9YDAzCzsXJ_q5CUa7ELbPXrBoxbv6iNfKud" alt="Orbit Scarf" />
          <div className="absolute bottom-3 left-3"><p className="btn-label text-[10px]">Orbit Scarf</p></div>
        </div>
        <div className="relative aspect-square bg-surface-container-low overflow-hidden">
          <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaaLe5yP2DMjMK_FyGlic9DCl2F6DMxutrTtLwavZ3Pn0GuT8Hp1U1yA5DfbpIC7Y5Dx5ECJ2U99LdXrxPd7H-WV6G1_2nNOUk1R4CrTupFlfcw2DpX-QmrPCXfW7eFXxY8toxgsNfKQPabNc4rMidJu0qcsmBIDWbd--qbAFm-ZeUfliuHLPUDs0lCInc960xekOtMOiZkrVlaveEBckfgIi6yKiTzJ4q6v7dlTwVM1BdCr1EaEQWjYHIb1bWNrVKmULCTHcXdSyC" alt="Moon Walkers" />
          <div className="absolute bottom-3 left-3"><p className="btn-label text-[10px]">Moon Walkers</p></div>
        </div>
      </div>
    </section>

    {/* The Trapeze Feature */}
    <section id="trapeze-feature" className="mt-section bg-primary-container/30 py-24">
      <div className="px-6 flex flex-col items-center text-center">
        <h3 className="font-serif text-5xl italic mb-4">The Trapeze</h3>
        <p className="font-sans text-lg text-on-surface-variant max-w-xs mb-10 leading-relaxed">Architectural freedom in every stitch. Designed for movement, engineered for the future.</p>
        <div className="w-full relative aspect-[3/4] mb-8 group overflow-hidden">
          <img className="w-full h-full object-cover editorial-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCC4gW8EZjofFIeo5GKxeqa6Uowbj-DAjnDEdoSAJamIE_0yRNnAGs60xy3_6Q2GgIaKxwqHZbaYCVkIOojnQfMBMd-8w4d94Lh6ePC4c9uWx6R11ZC8A9OKsJmJ8hjlzHxfybPehJcspAJJav_MgEVUUxkupdQCiTziVvOao3ace6qI4IoHMrOdcmPxmyCIR-Qj4G7cYpEQdMM6tJzr_3NavIocsjXfx5jHNDyiO_I30FY51KfdAyYZL5CU7zRv9fxa3HUvI6-Ujp8" alt="The Trapeze" />
          <div className="absolute inset-0 border-[0.5px] border-on-surface/10 m-4"></div>
        </div>
        <button className="px-12 py-5 bg-on-surface text-white btn-label hover:bg-on-surface/80 transition-colors">EXPLORE SILHOUETTES</button>
      </div>
    </section>

    {/* Mission Statement */}
    <section id="mission" className="mt-section px-8 py-20 border-y border-on-surface/5 bg-white">
      <div className="max-w-md mx-auto text-center space-y-8">
        <Sparkles className="mx-auto text-primary" size={32} />
        <h3 className="font-serif text-3xl italic">Every body is a heavenly body.</h3>
        <p className="font-sans text-lg text-on-surface-variant leading-relaxed">
          Our mission is to celebrate human diversity through the lens of cosmic optimism. By blending inclusive sizing (0-32) with high-concept design, we ensure that the future of fashion belongs to everyone.
        </p>
        <div className="pt-4">
          <a href="#" className="btn-label border-b-2 border-primary-container pb-2 hover:border-primary transition-all">READ OUR MANIFESTO</a>
        </div>
      </div>
    </section>

    <Footer />
  </motion.div>
);

const DressesPage = ({ onSelectProduct }: { onSelectProduct: (p: Product) => void }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-24 pb-32">
    <section className="px-6 mb-12">
      <div className="space-y-2">
        <p className="btn-label text-primary tracking-[0.2em]">The 1966 Collection</p>
        <h1 className="font-serif text-5xl">Trapeze Dresses</h1>
        <p className="font-sans text-on-surface-variant max-w-xs italic opacity-70">Voluminous silhouettes designed for movement across lunar landscapes.</p>
      </div>
    </section>

    {/* Filter Bar */}
    <section className="sticky top-16 z-40 bg-background/95 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b-[0.5px] border-on-surface/10 mb-8">
      <div className="flex space-x-6 overflow-x-auto hide-scrollbar">
        <button className="flex items-center space-x-2 btn-label">
          <span>FILTERS</span>
        </button>
        <div className="h-4 w-[1px] bg-on-surface/10 self-center"></div>
        <button className="btn-label text-on-surface/40">MINI</button>
        <button className="btn-label text-on-surface border-b border-on-surface pb-0.5">MIDI</button>
        <button className="btn-label text-on-surface/40">MAXI</button>
      </div>
      <div className="pl-4">
        <Sparkles size={18} />
      </div>
    </section>

    <div className="px-6 grid grid-cols-1 gap-y-12">
      {DRESSES.map(dress => (
        <article key={dress.id} className="group relative cursor-pointer" onClick={() => onSelectProduct(dress)}>
          <div className="aspect-[4/5] bg-surface-container-low overflow-hidden mb-4 rounded-lg">
            <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={dress.image} alt={dress.name} />
          </div>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-serif text-2xl">{dress.name}</h3>
              <p className="btn-label text-on-surface-variant opacity-60">{dress.fabric}</p>
            </div>
            <div className="btn-label text-sm">${dress.price}</div>
          </div>
          <div className="mt-4 flex space-x-2">
            {dress.colors?.map(c => (
              <div key={c} className="w-4 h-4 rounded-full border border-on-surface/10" style={{ backgroundColor: c }}></div>
            ))}
          </div>
        </article>
      ))}
    </div>
  </motion.div>
);

const TightsPage = () => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="pt-24 pb-32 px-4">
    <section className="py-8 flex flex-col space-y-6">
      <div className="max-w-2xl px-2">
        <h1 className="font-serif text-6xl uppercase leading-none">The Hosiery<br/><span className="italic font-light">Laboratory</span></h1>
        <p className="font-sans text-on-surface-variant mt-6 max-w-xs leading-relaxed text-lg opacity-80">Space-age geometries met with mid-century patterns. Our tights are engineered for cosmic movement and visual impact.</p>
      </div>
      
      <div className="flex space-x-4 overflow-x-auto hide-scrollbar py-4 px-2">
        {['ALL PATTERNS', 'POLKA DOTS', 'GEOMETRIC GRID', 'COSMIC STRIPE'].map((f, i) => (
          <button key={f} className={`flex-shrink-0 px-6 py-2 border rounded-full btn-label transition-all ${i===0 ? 'border-on-surface bg-secondary text-white' : 'border-outline-variant text-on-surface-variant hover:border-outline'}`}>
            {f}
          </button>
        ))}
      </div>
    </section>

    <section className="grid grid-cols-2 gap-4">
      <div className="col-span-2 relative aspect-[4/5] bg-surface-container overflow-hidden rounded-xl">
        <img className="w-full h-full object-cover mix-blend-multiply opacity-90" src={HOSIERY[0].image} alt="Featured Tights" />
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
          <div>
            <span className="btn-label text-secondary tracking-widest block mb-1">New Arrival</span>
            <h3 className="font-serif text-3xl">Orbital Dot</h3>
          </div>
          <span className="btn-label text-lg">$48.00</span>
        </div>
      </div>
      
      {HOSIERY.slice(1).map(h => (
        <div key={h.id} className="relative aspect-square overflow-hidden rounded-xl bg-primary-container/20 group">
          <img className="w-full h-full object-cover editorial-img" src={h.image} alt={h.name} />
          <div className="absolute inset-0 bg-gradient-to-t from-on-surface/40 to-transparent"></div>
          <div className="absolute bottom-4 left-4">
            <h3 className="btn-label text-white">{h.name}</h3>
            <p className="font-mono text-xs text-white/70">${h.price.toFixed(2)}</p>
          </div>
        </div>
      ))}

      <div className="col-span-2 relative aspect-[3/4] bg-surface-variant overflow-hidden rounded-xl mt-4">
        <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcGOAnOFqAVUblyyxZ4nMlNUIx3s4PFQZPMROA7ZxmwC-7FDqhgf6HM5CPF8G8qPzsHApkPJAzr6Ne_a8ZF2_qKsraH6hhaxS-wJyJ0k2Ay_rrb129P8jkkMThO1e0uYrfhtoiFGwVwFhvkrIBURzE9KPL7pOHHX2EHffMcTZjzveK7V40SOIacdR5bvHhAMk4YjiPcDHvAzA4PiY2GpHYrjylN2ix403yYV-xMgym16Wrab16gR5toFl1DrVwD9qjegttvfByydCQ" alt="Editorial Texture" />
        <div className="absolute bottom-8 left-6 right-6">
          <div className="p-6 bg-primary-container/60 backdrop-blur-xl border border-white/20">
            <h3 className="font-serif text-2xl mb-2">Atomic Floral</h3>
            <p className="font-sans text-on-surface-variant mb-5 opacity-90">A radical reimagining of the classic lace pattern for the lunar age.</p>
            <button className="w-full py-3 bg-on-surface text-primary-container btn-label hover:bg-on-surface/90">EXPLORE TEXTURE</button>
          </div>
        </div>
      </div>
    </section>

    <section className="mt-20 py-16 text-center border-y border-on-surface/10 bg-white -mx-4 px-8">
      <h2 className="font-serif text-3xl text-primary uppercase tracking-tight mb-4">JOIN THE COUTURE CLAN</h2>
      <p className="font-sans text-on-surface-variant mb-8 opacity-70">Updates from the lunar surface. New patterns, exclusive drops, and styling guides.</p>
      <div className="space-y-4 max-w-xs mx-auto">
        <input className="w-full bg-transparent border-b border-on-surface/20 py-3 btn-label focus:outline-none focus:border-secondary transition-colors" placeholder="EMAIL ADDRESS" type="email" />
        <button className="w-full py-4 bg-primary text-white btn-label hover:bg-secondary transition-all">SUBSCRIBE</button>
      </div>
    </section>
  </motion.div>
);

const StoryPage = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-16 pb-24">
    <header className="relative w-full h-[751px] overflow-hidden">
      <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7bU90ZFnvOKWKuHkAxzw_ZOImPVq95fWvC6yVjau7ngjn9dZ-2gauV2NtttZ9F3-L1cvPGFX8PpOPXIx3Vpppb-ZlqCV3f1F8gKCBODCcb6EuY6ApplQE2sU78yTPLEzZ_JaSgjEOCIHGpVpa_xSverNvFxp0N-OfFC5N3cDuJGBmOrp29pTNucKOvJgJkOY2xl2vFO20uOYm8eSjtlS7suP_h8BqxE2KVdAkr2pmph_QU9yYIqh5-oPzcHYKqZPGgAkwJWpn7TgU" alt="Our Story" />
      <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-background/90 to-transparent">
        <h1 className="font-serif text-7xl text-on-surface mb-2 tracking-tight">Our Story</h1>
        <p className="btn-label text-primary tracking-[0.2em]">Cosmic Couture Since 1966</p>
      </div>
    </header>

    <section className="px-8 mt-24">
      <div className="max-w-md mx-auto space-y-10">
        <h2 className="font-serif text-4xl leading-tight border-l-2 border-primary-container pl-8">
          We believe getting dressed should feel like a <span className="italic">revolution.</span>
        </h2>
        <div className="space-y-8 text-on-surface-variant text-xl leading-relaxed">
          <p>MOD LUNAR was founded on a singular premise: that the future would be bright, bold, and inclusive. We call it <span className="text-secondary font-semibold">Dopamine Dressing</span>.</p>
          <p>Our aesthetic is a love letter to the space-age optimism of the sixties, reimagined for the digital age. It’s where retro-futurism meets modern precision.</p>
        </div>
      </div>
    </section>

    <section className="px-6 mt-32 grid grid-cols-2 gap-4">
      <div className="col-span-2 aspect-[16/7] overflow-hidden rounded-xl">
        <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaUabFquHrrSDFZ0pCkH7Mo_4fyyvsANFi0QeWwuBUS1fDvGWq1bLJ9PfxRDxtf1tJMqa-wy9F2c0SFUXNTQuK12h2TC_i24EA9_LShY-VIhp6LBAp9Y8pO-a-SsT5-MnfDSDehPk5DqAUVuG2OoVaXHDlUrFbHMA5X3m6lPz6PrCPe5itbAqcVYGawsa-EapK59EYvtdmoPjrbhWOnyuF4ZlA7WAV4n_DpleT1E3XSLvqqUrwQ8qUypMJX_zOeWeVTIThZaoGE5QP" alt="Textures" />
      </div>
      <div className="aspect-[4/5] overflow-hidden rounded-xl">
        <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0Db78ZX3-uqejlvjfLBnFrMIsMfvT6aYB8UWcWbo6UXbwzDN6DTFbiOLsUA41CCyUro3tFdv4S9W9CmLmXblEJKacDrMW3ofzl0BgW1IecfdMuO7iLzBaeMlTcx3x82_AG2jit1mfCaI9xS9fjmXaGDnECNB_0pXCtdPkNSrVhU795tM9REJ8C3SlnM3ZOdIYcde2ZGD3fz2XKlioojQhJXjLX30Toy55PlsWnjKMYxzvrTPRV9RzHv70iTAJv17YHJIP69MeCYwK" alt="Portrait" />
      </div>
      <div className="aspect-[4/5] bg-primary-container flex items-center justify-center p-8 rounded-xl">
        <p className="font-serif text-3xl italic text-on-surface text-center leading-snug">Form follows feeling.</p>
      </div>
    </section>

    <section className="mt-32 mb-12 px-8">
      <div className="relative py-24 border-y border-on-surface/10 text-center">
        <Sparkles className="mb-8 mx-auto text-secondary opacity-40" size={40} />
        <blockquote className="font-serif text-4xl italic text-on-surface leading-tight">
          Style is the shortest distance between your mood and the moon.
        </blockquote>
      </div>
    </section>
    
    <Footer />
  </motion.div>
);

const ProductPage = ({ product, onBack }: { product: Product, onBack: () => void }) => (
  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="pt-16 pb-32">
    <div className="relative w-full aspect-[3/4] bg-surface-container overflow-hidden">
      <img className="w-full h-full object-cover" src={product.image} alt={product.name} />
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 w-10 h-10 rounded-full glass flex items-center justify-center text-on-surface"
      >
        <ArrowRight className="rotate-180" size={20} />
      </button>
    </div>

    <section className="px-6 mt-10">
      <div className="flex justify-between items-start">
        <div>
          <span className="btn-label text-primary tracking-widest">Spring '66 Collection</span>
          <h1 className="font-serif text-4xl mt-2 italic">{product.name}</h1>
        </div>
        <div className="btn-label text-lg pt-2 opacity-70">${product.price}</div>
      </div>

      <div className="mt-10 space-y-6">
        <p className="font-sans text-on-surface-variant leading-relaxed text-lg">A definitive homage to the space-age optimism of the 1960s. This trapeze silhouette features a dramatic A-line flare starting from a structured high collar, engineered to move with architectural grace.</p>
        <p className="font-sans text-on-surface-variant leading-relaxed text-lg">Crafted from our signature <span className="font-bold">LUNAR-CREPE™</span>—a sustainable blend of recycled ocean plastics and organic cotton.</p>
      </div>

      {/* Select Size */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-5">
          <h3 className="btn-label text-on-surface">SELECT SIZE</h3>
          <button className="btn-label text-secondary underline normal-case tracking-normal">Size Guide</button>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {['02', '04', '06', '08', '10'].map((sz, i) => (
            <button 
              key={sz} 
              className={`h-14 border flex items-center justify-center btn-label ${i === 2 ? 'bg-on-surface text-background border-on-surface' : 'border-outline text-on-surface'}`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* FABRIC FINISH */}
      <div className="mt-12">
        <h3 className="btn-label text-on-surface mb-6">FABRIC FINISH</h3>
        <div className="flex gap-8">
          {['Solid', 'Dot', 'Stripe'].map((f, i) => (
            <div key={f} className="flex flex-col items-center gap-3">
              <div className={`w-14 h-14 rounded-full p-1 border ${i === 0 ? 'border-on-surface' : 'border-transparent'}`}>
                <div className="w-full h-full rounded-full border border-on-surface/10 bg-primary-container"></div>
              </div>
              <span className="font-serif text-[10px] uppercase opacity-60">{f}</span>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full mt-16 h-16 bg-on-surface text-background btn-label flex items-center justify-center gap-4 transition-transform active:scale-[0.98]">
        ADD TO CLOSET
        <ArrowRight size={18} />
      </button>
    </section>

    {/* Complete The Look */}
    <section className="mt-24 px-6">
      <h2 className="font-serif text-3xl italic mb-10">Complete the Look</h2>
      <div className="grid grid-cols-2 gap-6">
        {HOSIERY.slice(0, 2).map(item => (
          <div key={item.id} className="space-y-4">
            <div className="aspect-[3/4] bg-surface-container overflow-hidden rounded-lg">
              <img className="w-full h-full object-cover grayscale opacity-70" src={item.image} alt={item.name} />
            </div>
            <div>
              <h4 className="btn-label text-on-surface">{item.name}</h4>
              <p className="font-mono text-xs text-on-surface-variant opacity-60">${item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    <Footer />
  </motion.div>
);

// --- Main App ---

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductSelect = (p: Product) => {
    setSelectedProduct(p);
    setPage('product');
    window.scrollTo({ top: 0 });
  };

  const navTitle = useMemo(() => {
    switch(page) {
      case 'dresses': return 'TRA PEZE';
      case 'tights': return 'LABO ';
      case 'story': return 'OUR STORY';
      default: return 'MOD LUNAR';
    }
  }, [page]);

  return (
    <div className="min-h-screen bg-background">
      <TopBar title={navTitle} />
      
      <main className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {page === 'home' && <HomePage key="home" />}
          {page === 'dresses' && <DressesPage key="dresses" onSelectProduct={handleProductSelect} />}
          {page === 'tights' && <TightsPage key="tights" />}
          {page === 'story' && <StoryPage key="story" />}
          {page === 'product' && selectedProduct && (
            <ProductPage 
              key="product" 
              product={selectedProduct} 
              onBack={() => setPage('dresses')} 
            />
          )}
        </AnimatePresence>
      </main>

      <BottomNav active={page} onChange={setPage} />
    </div>
  );
}
