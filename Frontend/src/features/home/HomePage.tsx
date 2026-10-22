import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

import Collections from "@/features/home/components/Collections";
import TrendingHardware from "@/features/home/components/TrendingHardware";
import Newsletter from "@/features/home/components/Newsletter";
import woodenSpeaker from "@/assets/images/woodenspeaker.webp";

const Home = () => {
  // const { scrollYProgress } = useScroll();

  // const smoothProgress = useSpring(scrollYProgress, {
  //   stiffness: 100,
  //   damping: 30,
  //   mass: 0.2,
  // });

  // const progressHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <main className="bg-white text-slate-950">
      {/* <div className="pointer-events-none fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 md:block">
        <div className="mb-4 flex items-center justify-end gap-3 text-[10px] font-medium tracking-widest text-white/60">
          <span className="text-black">01</span>
          <span className="h-px w-3 bg-black" />
          <span className="text-black">04</span>
        </div>

        <div className="relative ml-auto h-44 w-px bg-black">
          <motion.div
            className="absolute left-1/2 top-0 w-[2px] -translate-x-1/2 origin-top"
            style={{
              height: progressHeight,
            }}
          />

          <motion.div
            className="absolute left-1/2 size-2 -translate-x-1/2 rounded-full bg-black shadow-[0_0_12px_rgba(255,255,255,0.8)]"
            style={{
              top: useTransform(smoothProgress, [0, 1], ["0%", "100%"]),
            }}
          />
        </div>
      </div> */}

      <section
        id="hero"
        className="relative h-[min(720px,calc(100svh-4rem))]
        min-h-[480px] overflow-hidden border-b border-slate-800
        sm:h-[min(720px,calc(100svh-4.5rem))]
        sm:min-h-[520px]"
      >
        <motion.img
          src={woodenSpeaker}
          alt="Obsidian Series wooden speaker"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 1.5,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.5)_42%,transparent_78%)] sm:bg-[linear-gradient(90deg,rgba(0,0,0,0.68)_0%,rgba(0,0,0,0.5)_22%,rgba(0,0,0,0.25)_38%,transparent_55%)]"
        />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="max-w-[31rem] pb-4 sm:pb-0"
          >
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mb-4 text-[10px] font-semibold tracking-[0.2em] text-blue-300 sm:text-xs"
            >
              INTRODUCING
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.5,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-white"
            >
              The Obsidian Series
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.65,
                duration: 0.7,
              }}
              className="mt-4 max-w-md text-sm leading-6 text-slate-200 sm:text-base sm:leading-7"
            >
              Engineered for absolute silence. Crafted for infinite power.
              Discover the next evolution in premium desktop computing and
              architectural audio.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.8,
                duration: 0.7,
              }}
              className="mt-7 flex flex-wrap items-center gap-3 sm:mt-8 sm:gap-5"
            >
              <Button className="group h-11 rounded-full bg-blue-600 px-6 text-[10px] font-bold tracking-wide text-white transition-all duration-300 hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.35)] sm:h-12 sm:px-7">
                EXPLORE SERIES
                <ArrowRight className="ml-2 size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>

              <Button
                variant="ghost"
                className="group h-11 gap-2 rounded-full border border-transparent bg-transparent px-4 text-[10px] font-bold tracking-wide text-white transition-all hover:border-white/20 hover:bg-white/10 hover:backdrop-blur-md hover:text-blue-200 sm:h-12"
              >
                <Play className="size-3.5 fill-current transition-transform duration-300 group-hover:scale-110" />
                WATCH FILM
                <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-7 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
        >
          <span className="text-[9px] font-medium tracking-[0.3em] text-white/50">
            SCROLL
          </span>

          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="h-7 w-px bg-gradient-to-b from-white/70 to-transparent"
          />
        </motion.div>
      </section>

      <section id="collections">
        <Collections />
      </section>

      <section id="trending">
        <TrendingHardware />
      </section>

      <section id="newsletter">
        <Newsletter />
      </section>
    </main>
  );
};

export default Home;
