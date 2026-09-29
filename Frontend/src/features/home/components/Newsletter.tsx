import { Mail } from "lucide-react";
import landingPagePreview from "@/assets/images/landingpage.png";

const Newsletter = () => {
  const backgroundImage = "";

  return (
    <section className="relative overflow-hidden bg-[#f7f9ff] px-5 py-16 sm:px-8 sm:py-20 lg:py-28">
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#dce8ff] blur-sm sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute right-[-8rem] top-[-8rem] h-[30rem] w-[30rem] rounded-[35%] bg-[#cbdcff] rotate-12" />
      <div className="pointer-events-none absolute bottom-[-12rem] left-[38%] h-[28rem] w-[28rem] rounded-[35%] bg-[#d4e1ff] rotate-45" />

      <div className="relative mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-2xl bg-[#e4eeff] shadow-[0_25px_70px_rgba(55,80,130,0.18)]">
          <div className="absolute -right-20 -top-32 h-80 w-80 rounded-[40%] bg-[#c5d7f8] rotate-12" />
          <div className="absolute -bottom-44 right-24 h-96 w-96 rounded-[35%] bg-[#c8d9f8] rotate-45" />

          <div className="relative z-10 grid min-h-[390px] lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative z-10 flex items-center px-7 py-12 sm:px-12 lg:px-16 lg:py-14">
              <div className="max-w-[29rem]">
                <p className="text-[10px] font-semibold tracking-[0.2em] text-blue-700 sm:text-xs">
                  INSIDER ACCESS
                </p>

                <h2 className="mt-3 text-3xl font-semibold leading-[1.05] tracking-[-0.045em] text-slate-950 sm:text-4xl">
                  The Architecture of Sound
                </h2>

                <p className="mt-4 max-w-md text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                  Join the Kinetic list for early access to product drops,
                  technical deep dives, and exclusive firmware optimizations for
                  your devices.
                </p>

                <form className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <label className="flex h-12 min-w-0 flex-1 items-center gap-2 rounded-md bg-white px-4 shadow-sm">
                    <Mail className="size-4 shrink-0 text-slate-400" />

                    <input
                      aria-label="Email address"
                      type="email"
                      placeholder="Email address"
                      className="w-full min-w-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                    />
                  </label>

                  <button
                    type="submit"
                    className="h-12 shrink-0 rounded-md bg-blue-600 px-6 text-[10px] font-bold tracking-wide text-white shadow-sm transition-colors hover:bg-blue-700"
                  >
                    SUBSCRIBE
                  </button>
                </form>

                <p className="mt-4 text-[10px] leading-4 text-slate-500">
                  By subscribing, you agree to our Terms &amp; Privacy Policy.
                </p>
              </div>
            </div>

            <div className="relative flex min-h-[390px] items-center justify-center p-6 sm:p-10 lg:min-h-[430px] lg:p-8">
              <img
                src={landingPagePreview}
                alt="Kinetic audio collection preview"
                className="h-auto w-full max-w-[700px] max-h-[600px] rounded-xl border border-slate-300 bg-white shadow-[0_25px_45px_rgba(30,45,75,0.25)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
