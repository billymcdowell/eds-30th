import React, { useState, useEffect, useRef, ReactNode, createContext, useContext } from 'react';
import { useWebHaptics } from 'web-haptics/react';

const TRIP_DATE = new Date('2026-06-15T12:00:00'); // Set a future date
const BASE_URL = '/eds-30th/';

const HapticsContext = createContext<{ trigger: (pattern?: any) => void }>({
  trigger: () => {},
});

// --- HOOKS ---
function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const { trigger } = useContext(HapticsContext);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          trigger();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, trigger]);
  return [ref, visible] as const;
}

// --- COMPONENTS ---

const ConfettiBurst = ({ active, x, y }: { active: boolean, x?: number, y?: number }) => {
  if (!active) return null;
  const particles = Array.from({ length: 40 });
  const colors = ['#C9A84C', '#B8001F', '#6CABDD', '#FFFDF7'];

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" style={x && y ? { left: x, top: y } : {}}>
      {particles.map((_, i) => {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const duration = 2 + Math.random() * 2;
        const delay = Math.random() * 0.5;
        const size = 5 + Math.random() * 10;
        return (
          <div
            key={i}
            className="absolute top-0 animate-confettiFall"
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size * 2}px`,
              backgroundColor: color,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        );
      })}
    </div>
  );
};

const BubbleBackground = ({ color = '#C9A84C' }) => {
  const bubbles = Array.from({ length: 15 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {bubbles.map((_, i) => {
        const size = 8 + Math.random() * 12;
        const left = Math.random() * 100;
        const duration = 4 + Math.random() * 6;
        const delay = Math.random() * 5;
        return (
          <div
            key={i}
            className="absolute bottom-0 rounded-full border opacity-0 animate-floatUp"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              borderColor: color,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
};

const CartoonImagePlaceholder = ({ description, minHeight = "200px", delay = 0 }: { description: string, minHeight?: string, delay?: number }) => {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`relative rounded-2xl border-4 border-cartoon-black bg-white p-4 shadow-[8px_8px_0px_#1A1A1A] flex flex-col items-center justify-center text-center overflow-hidden hover-swing transition-transform duration-300 ${visible ? 'animate-zoomBounce' : 'opacity-0'}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="text-4xl mb-2 animate-gentleSway">🎨</div>
      <p className="font-fredoka text-city-navy text-sm">{description}</p>
    </div>
  );
};

const TripImageCard = (
  { src, alt, minHeight = "200px", delay = 0 }:
  { src: string; alt: string; minHeight?: string; delay?: number }
) => {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`relative rounded-2xl border-4 border-cartoon-black bg-white shadow-[8px_8px_0px_#1A1A1A] overflow-hidden hover-swing transition-transform duration-300 ${visible ? 'animate-zoomBounce' : 'opacity-0'}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

const AnimatedText = ({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) => {
  const [ref, visible] = useScrollReveal();
  return (
    <div ref={ref} className={`inline-block hover-rubberBand ${className}`}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className={`inline-block ${visible ? 'animate-letterPop' : 'opacity-0'}`}
          style={{ animationDelay: `${delay + i * 0.05}s` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
};

// --- SECTIONS ---

const HeroSection = ({ onEdClick }: { onEdClick: () => void }) => {
  const [ref, visible] = useScrollReveal();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (visible) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  }, [visible]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col items-center justify-center bg-stella-cream bg-dot-grid overflow-hidden p-6 pt-20">
      <BubbleBackground />
      <ConfettiBurst active={showConfetti} />
      
      <div className="z-10 flex flex-col items-center text-center max-w-3xl">
        <div className={`inline-block px-4 py-2 rounded-full border-2 border-stella-gold bg-white text-stella-gold font-bold text-sm mb-6 animate-pulse-glow ${visible ? 'animate-bounceIn' : 'opacity-0'}`}>
          🎂 Belgian Birthday Surprise
        </div>
        
        <h1 className="text-5xl md:text-7xl font-fredoka text-city-navy mb-4 cursor-pointer" onClick={onEdClick}>
          <AnimatedText text="HAPPY 30th ED!" />
        </h1>
        
        <h2 className={`text-xl md:text-2xl text-gray-700 mb-10 font-bold ${visible ? 'animate-slideInLeft' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
          We&apos;re off to Belgium for brewery tours, waffles, and Brussels adventures<span className="animate-pulse">...</span>
        </h2>
        
        <div className="w-full max-w-md mb-12">
          <TripImageCard
            src={`${BASE_URL}Gemini_Generated_Image_25vw7u25vw7u25vw.png`}
            alt="Ed and a friend celebrating outside the Stella Artois brewery in Leuven"
            delay={0.8}
          />
        </div>
        
        <button 
          className={`px-8 py-4 bg-stella-red text-white font-fredoka text-xl rounded-xl border-4 border-cartoon-black shadow-[4px_4px_0px_#1A1A1A] hover-wobble active:animate-jello transition-transform ${visible ? 'animate-bounceIn' : 'opacity-0'}`}
          style={{ animationDelay: '1.2s' }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          KEEP SCROLLING 👇
        </button>
      </div>
      
      <div className="absolute bottom-8 animate-bounce text-stella-gold text-4xl">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
      </div>
    </section>
  );
};

const DestinationSection = () => {
  const [ref, visible] = useScrollReveal(0.2);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => setShowBadge(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const bullets = [
    { icon: '✈️', text: 'Flights being booked' },
    { icon: '🍻', text: 'Pints waiting' },
    { icon: '🍟', text: 'Frites ready' },
    { icon: '🇧🇪', text: 'Belgium calling' }
  ];

  return (
    <section ref={ref} className="relative py-20 px-6 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        
        <div className={`flex-1 ${visible ? 'animate-slideInLeft' : 'opacity-0'}`}>
          <h2 className="text-4xl md:text-6xl font-fredoka text-city-navy mb-6 hover-rubberBand cursor-default">
            We&apos;re going to <br/>
            <span className="relative inline-block">
              Leuven &amp; Brussels! 🇧🇪
              <span className={`absolute bottom-0 left-0 h-2 bg-stella-gold transition-all duration-1000 ease-out ${visible ? 'w-full' : 'w-0'}`}></span>
            </span>
          </h2>
          
          <ul className="space-y-4 text-xl font-bold text-gray-700">
            {bullets.map((bullet, i) => (
              <li 
                key={i} 
                className={`flex items-center gap-4 ${visible ? 'animate-slideInLeft' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                <span className="text-3xl hover-spin inline-block cursor-default">{bullet.icon}</span>
                {bullet.text}
              </li>
            ))}
          </ul>
          
          {showBadge && (
            <div className="mt-8 inline-block px-6 py-3 bg-stella-gold text-white font-fredoka rounded-full border-2 border-cartoon-black shadow-[4px_4px_0px_#1A1A1A] animate-bounceIn hover-wobble">
              🌟 Stella Brewery in Leuven, Grand Place, waffles &amp; more
            </div>
          )}
        </div>
        
        <div className={`flex-1 w-full ${visible ? 'animate-slideInRight' : 'opacity-0'}`}>
          <TripImageCard
            src={`${BASE_URL}Gemini_Generated_Image_kakhztkakhztkakh2.png`}
            alt="Two friends arriving in Brussels at night on the Grand Place with suitcases" 
          />
        </div>
        
      </div>
    </section>
  );
};

type ItineraryItem = {
  icon: string;
  title: string;
  imgDesc?: string;
  imageSrc?: string;
  imageAlt?: string;
};

const ItineraryCard: React.FC<{ item: ItineraryItem, index: number }> = ({ item, index }) => {
  const [ref, visible] = useScrollReveal(0.5);
  const rotations = [-2, 2, -1, 3, -2];
  const finalRotation = rotations[index % rotations.length];
  
  return (
    <div 
      ref={ref}
      className={`relative w-full md:w-64 flex-shrink-0 bg-white border-4 border-cartoon-black rounded-2xl p-4 shadow-[4px_4px_0px_#1A1A1A] hover:shadow-[8px_8px_0px_#1A1A1A] hover:scale-105 transition-all duration-300 group ${visible ? 'animate-zoomBounce' : 'opacity-0'}`}
      style={{ 
        transform: visible ? `rotate(${finalRotation}deg)` : 'rotate(-10deg) scale(0)',
      }}
    >
      <div className="absolute -top-6 -left-6 w-12 h-12 bg-stella-gold rounded-full border-4 border-cartoon-black flex items-center justify-center font-fredoka text-xl text-white z-10 group-hover:animate-borderDance">
        {index + 1}
      </div>
      <div className="text-4xl text-center mb-4 animate-heartbeat">{item.icon}</div>
      <div className="w-full aspect-square mb-3">
        {item.imageSrc ? (
          <TripImageCard
            src={item.imageSrc}
            alt={item.imageAlt || item.title}
          />
        ) : (
          <CartoonImagePlaceholder description={item.imgDesc || item.title} minHeight="100%" />
        )}
      </div>
      <h3 className="font-fredoka text-xl text-city-navy mt-4 text-center">{item.title}</h3>
    </div>
  );
};

const ItinerarySection = () => {
  const items: ItineraryItem[] = [
    {
      icon: '🍺',
      title: 'Stella Brewery Tour – Leuven',
      imageSrc: `${BASE_URL}Gemini_Generated_Image_25vw7u25vw7u25vw.png`,
      imageAlt: 'Friends celebrating outside the Stella Artois brewery in Leuven'
    },
    {
      icon: '🌆',
      title: 'Grand Place at Night – Brussels',
      imageSrc: `${BASE_URL}Gemini_Generated_Image_kakhztkakhztkakh3.png`,
      imageAlt: 'Two friends with suitcases in the Grand Place at night'
    },
    {
      icon: '🧇',
      title: 'Waffles & Manneken Pis',
      imageSrc: `${BASE_URL}Gemini_Generated_Image_kakhztkakhztkakh4.png`,
      imageAlt: 'Friends sharing Belgian waffles with Manneken Pis in the window'
    },
    {
      icon: '🏛️',
      title: 'Royal Palace Flag Wave',
      imageSrc: `${BASE_URL}Gemini_Generated_Image_kakhztkakhztkakh1.png`,
      imageAlt: 'Friends holding Belgian flags outside the Royal Palace'
    },
    {
      icon: '🔬',
      title: 'Atomium Adventure',
      imageSrc: `${BASE_URL}Gemini_Generated_Image_kakhztkakhztkakh2.png`,
      imageAlt: 'Friends at the Atomium with a model in hand'
    }
  ];

  return (
    <section className="py-20 px-6 bg-stella-cream overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-fredoka text-center text-city-navy mb-16 hover-rubberBand cursor-default">
          The Belgium Game Plan 🗺️
        </h2>
        
        <div className="relative flex flex-col md:flex-row gap-8 md:gap-6 justify-center items-center md:items-stretch flex-wrap">
          {items.map((item, i) => (
            <ItineraryCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ label, value, delay, isInfinity = false }: { label: string, value: number, delay: number, isInfinity?: boolean }) => {
  const [ref, visible] = useScrollReveal();
  const [count, setCount] = useState(0);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (visible && !isInfinity) {
      let start = 0;
      const duration = 1500;
      const increment = value / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [visible, value, isInfinity]);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 800);
  };

  return (
    <div 
      ref={ref}
      className={`relative bg-white border-4 border-cartoon-black rounded-xl p-6 text-center shadow-[4px_4px_0px_#1A1A1A] cursor-pointer hover-wobble ${visible ? 'animate-bounceIn' : 'opacity-0'} ${clicked ? 'animate-tada' : ''}`}
      style={{ animationDelay: `${delay}s` }}
      onClick={handleClick}
    >
      <ConfettiBurst active={clicked} />
      <div className="text-5xl font-fredoka text-city-blue mb-2 text-shadow-cartoon">
        {isInfinity ? <span className="inline-block animate-starSpin">∞</span> : count}
      </div>
      <div className="font-bold text-gray-700 uppercase text-sm">{label}</div>
    </div>
  );
};

const FootballSection = () => {
  const [ref, visible] = useScrollReveal();

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-city-blue to-city-navy overflow-hidden relative">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(hexagon 10px at 50% 50%, white 100%, transparent 0)' }}></div>
      
      <div className={`max-w-5xl mx-auto px-6 flex flex-col items-center ${visible ? 'animate-slideInLeft' : 'opacity-0'}`}>
        <h2 className="text-5xl md:text-7xl font-fredoka text-white mb-12 animate-flashText hover-tada cursor-default text-center">
          City 'Til We Die ⚽
        </h2>
        
        <div className="w-48 h-48 mb-12 relative group">
          <div className="absolute inset-0 animate-[spin_8s_linear_infinite] group-hover:animate-starSpin">
            <CartoonImagePlaceholder description="Cartoon Man City badge" minHeight="192px" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-16">
          <StatCard label="Years Supporting City" value={30} delay={0.2} />
          <StatCard label="Stellas at the Etihad" value={999} delay={0.4} isInfinity={true} />
          <StatCard label="Epic Birthdays" value={1} delay={0.6} />
        </div>
      </div>
      
      {/* Ticker Strip */}
      <div className="w-full bg-stella-gold py-3 border-y-4 border-cartoon-black overflow-hidden flex whitespace-nowrap group">
        <div className="animate-marqueeScroll group-hover:[animation-play-state:paused] flex text-xl font-fredoka text-cartoon-black">
          <span className="mx-4">Ed Connell • Man City Fan • Turning 30 • Still Believes • Champions • Blue Moon • Est. 1994 • Future Leuven Legend • Stella Artois Enthusiast • 30 and Brilliant •</span>
          <span className="mx-4">Ed Connell • Man City Fan • Turning 30 • Still Believes • Champions • Blue Moon • Est. 1994 • Future Leuven Legend • Stella Artois Enthusiast • 30 and Brilliant •</span>
        </div>
      </div>
    </section>
  );
};

const PersonalNoteSection = () => {
  const [refImg, imgVisible] = useScrollReveal();
  const [refText, textVisible] = useScrollReveal();
  const [typedText, setTypedText] = useState('');
  const fullText = "Happy 30th Birthday, mate! We've had some epic times over the years, from the Etihad to the pub. Now it's time to take the celebrations international. Think pints outside the Stella brewery in Leuven, wandering the Grand Place at night, demolishing waffles by Manneken Pis, waving flags at the Royal Palace and messing about at the Atomium. Pack your bags, practice your Belgian, and get ready for a weekend of pure Stella-fuelled chaos. You deserve it!";
  const [emojis, setEmojis] = useState<{id: number, emoji: string, left: number}[]>([]);

  useEffect(() => {
    if (textVisible) {
      let i = 0;
      const timer = setInterval(() => {
        setTypedText(fullText.substring(0, i));
        i++;
        if (i > fullText.length) {
          clearInterval(timer);
        } else if (Math.random() > 0.8) {
          const emojiList = ['🍺', '🎉', '⚽', '🇧🇪', '🌟'];
          setEmojis(prev => [...prev, {
            id: Date.now(),
            emoji: emojiList[Math.floor(Math.random() * emojiList.length)],
            left: Math.random() * 80 + 10
          }]);
        }
      }, 40);
      return () => clearInterval(timer);
    }
  }, [textVisible]);

  return (
    <section className="py-20 px-6 bg-[#FFF9E6] relative overflow-hidden">
      {emojis.map(e => (
        <div key={e.id} className="absolute bottom-20 text-3xl animate-floatUp pointer-events-none" style={{ left: `${e.left}%` }}>
          {e.emoji}
        </div>
      ))}
      
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div ref={refImg} className={`w-full md:w-1/3 ${imgVisible ? 'animate-zoomBounce' : 'opacity-0'}`}>
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl animate-pulse-glow"></div>
            <TripImageCard
              src={`${BASE_URL}Gemini_Generated_Image_kakhztkakhztkakh3.png`}
              alt="Two friends laughing over a huge plate of Belgian waffles"
              minHeight="300px"
            />
          </div>
        </div>
        
        <div ref={refText} className={`w-full md:w-2/3 bg-white p-8 rounded-3xl border-4 border-cartoon-black shadow-[8px_8px_0px_#1A1A1A] ${textVisible ? 'animate-slideInLeft' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
          <h2 className="text-4xl font-fredoka text-stella-red mb-6">
            <AnimatedText text="Why you, Ed?" />
          </h2>
          <p className="text-xl text-gray-800 leading-relaxed font-bold min-h-[150px]">
            {typedText}
            <span className="animate-pulse inline-block w-2 h-6 bg-stella-red ml-1 align-middle"></span>
          </p>
        </div>
      </div>
    </section>
  );
};

const GetYourLiverReadySection = () => {
  const [ref, visible] = useScrollReveal();

  return (
    <section ref={ref} className="py-24 px-6 bg-city-navy relative overflow-hidden">
      <BubbleBackground color="#C9A84C" />

      <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center gap-10">
        <h2
          className={`text-4xl md:text-6xl font-fredoka text-white ${visible ? 'animate-flashText' : 'opacity-0'}`}
        >
          Get your liver ready 🍻
        </h2>

        <div className={`w-full max-w-xl ${visible ? 'animate-zoomBounce' : 'opacity-0'}`}>
          <TripImageCard
            src={`${BASE_URL}image13.png`}
            alt="Two friends toasting with beers in front of Brussels town hall"
            minHeight="420px"
          />
        </div>

        <p
          className={`text-xl md:text-2xl font-bold text-stella-gold max-w-2xl ${visible ? 'animate-slideInLeft' : 'opacity-0'}`}
          style={{ animationDelay: '0.2s' }}
        >
          Hydrate now, because Belgium is about to test your pint‑lifting skills.
        </p>
      </div>
    </section>
  );
};

const FooterSection = () => {
  const [ref, visible] = useScrollReveal();
  const [overflow, setOverflow] = useState(false);

  const handleGlassClick = () => {
    setOverflow(true);
    setTimeout(() => setOverflow(false), 2000);
  };

  return (
    <section ref={ref} className="py-20 px-6 bg-stella-cream text-center overflow-hidden relative">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        
        <div 
          className={`relative cursor-pointer mb-10 ${visible ? 'animate-zoomBounce' : 'opacity-0'}`}
          onClick={handleGlassClick}
        >
          
          {overflow && (
            <>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white border-2 border-cartoon-black px-4 py-2 rounded-2xl font-fredoka text-stella-red text-xl animate-bounceIn z-20 whitespace-nowrap">
                CHEERS! 🍺
              </div>
              <ConfettiBurst active={true} />
            </>
          )}
        </div>
        
        <h2 className="text-4xl md:text-5xl font-fredoka text-city-navy mb-8">
          <AnimatedText text="Cheers to 30, you absolute legend. 🥂" />
        </h2>
        
        <p className={`text-gray-500 font-bold ${visible ? 'animate-slideInLeft' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
          Organised with love (and a lot of Stella research) by The Boys
        </p>
      </div>

      <div className="mt-12 max-w-xl mx-auto">
        <TripImageCard
          src={`${BASE_URL}image12.png`}
          alt="Ed's 30th celebration illustration with a giant Stella glass"
          minHeight="420px"
        />
      </div>

      <div className="mt-8 max-w-xl mx-auto">
        <TripImageCard
          src={`${BASE_URL}image14.png`}
          alt="Two partners sharing a kiss on a nighttime Belgian street"
          minHeight="420px"
        />
      </div>
    </section>
  );
};

const StickyHeader = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.8) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed top-0 left-0 w-full bg-stella-gold border-b-4 border-cartoon-black z-40 transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between font-fredoka text-cartoon-black">
        <div className="flex items-center gap-2">
          <span className="text-xl">🍺</span>
          <span className="hidden md:inline">Ed's 30th</span>
        </div>
        <div className="flex-1 overflow-hidden mx-4">
          <div className="animate-marqueeScroll-mobile md:animate-none md:text-center whitespace-nowrap">
            Leuven, Belgium | {TRIP_DATE.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>
        <div className="animate-starSpin text-xl">⭐</div>
      </div>
    </div>
  );
};

const CursorCompanion = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsDesktop(false);
      return;
    }

    let requestRef: number;
    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const update = () => {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      setPos({ x: currentX, y: currentY });
      requestRef = requestAnimationFrame(update);
    };

    window.addEventListener('mousemove', onMouseMove);
    requestRef = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(requestRef);
    };
  }, []);

  if (!isDesktop) return null;

  return (
    <div 
      className="fixed pointer-events-none z-50 w-8 h-8 bg-stella-red rounded-full border-2 border-cartoon-black flex items-center justify-center text-white font-fredoka text-xs shadow-[2px_2px_0px_#1A1A1A] animate-wobble"
      style={{ left: pos.x + 15, top: pos.y + 15, transition: 'opacity 0.2s' }}
    >
      30
    </div>
  );
};

const KonamiCode = ({ onTrigger }: { onTrigger: () => void }) => {
  useEffect(() => {
    const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konami[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konami.length) {
          onTrigger();
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTrigger]);

  return null;
};

const IdleAnimation = () => {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const resetTimer = () => {
      setIsIdle(false);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsIdle(true), 10000);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('scroll', resetTimer);
    window.addEventListener('keydown', resetTimer);
    resetTimer();

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('scroll', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      clearTimeout(timeout);
    };
  }, []);

  if (!isIdle) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-bounceIn">
      <div className="bg-white border-2 border-cartoon-black px-4 py-2 rounded-2xl font-fredoka text-sm shadow-[4px_4px_0px_#1A1A1A]">
        ...are you still there? 👀
      </div>
    </div>
  );
};

export default function App() {
  const [edClicks, setEdClicks] = useState(0);
  const [blueMoonMode, setBlueMoonMode] = useState(false);
  const [goalCelebration, setGoalCelebration] = useState(false);
  const { trigger } = useWebHaptics();

  const handleEdClick = () => {
    const newClicks = edClicks + 1;
    setEdClicks(newClicks);
    if (newClicks === 5) {
      setBlueMoonMode(true);
      console.log("🌙 Blue Moon, you saw me standing alone...");
      setTimeout(() => setBlueMoonMode(false), 5000);
      setEdClicks(0);
    }
  };

  const handleKonami = () => {
    setGoalCelebration(true);
    setTimeout(() => setGoalCelebration(false), 4000);
  };

  return (
    <HapticsContext.Provider value={{ trigger }}>
      <div className={`min-h-screen transition-colors duration-1000 ${blueMoonMode ? 'bg-city-blue' : ''} ${goalCelebration ? 'animate-shake' : ''}`}>
        <StickyHeader />
        <CursorCompanion />
        <KonamiCode onTrigger={handleKonami} />
        <IdleAnimation />

        {blueMoonMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none bg-city-blue/80">
            <h1 className="text-6xl md:text-9xl font-fredoka text-white animate-pulse text-shadow-cartoon">BLUE MOON</h1>
          </div>
        )}

        {goalCelebration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <ConfettiBurst active={true} />
            <h1 className="text-8xl md:text-[150px] font-fredoka text-stella-red animate-tada text-shadow-cartoon">GOAL! ⚽</h1>
            <div className="absolute inset-0 flex justify-around items-start overflow-hidden">
              {['🎉', '⚽', '🍺', '🏆'].map((emoji, i) => (
                <div key={i} className="text-6xl animate-confettiFall" style={{ animationDelay: `${i * 0.2}s`, animationDuration: '2s' }}>{emoji}</div>
              ))}
            </div>
          </div>
        )}

        <HeroSection onEdClick={handleEdClick} />
        <DestinationSection />
        <ItinerarySection />
        <FootballSection />
        <PersonalNoteSection />
        <GetYourLiverReadySection />
        <FooterSection />
      </div>
    </HapticsContext.Provider>
  );
}
