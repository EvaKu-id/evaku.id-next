import Image from "next/image";

export default function Home() {
    return (
         <section className="relative overflow-hidden bg-[#F1F5F9] text-[#0B2A4A]">
      <div className="mx-auto grid min-h-svh max-w-7xl items-center gap-12 px-5 pb-16 pt-32 sm:px-8 lg:grid-cols-2 lg:gap-8 lg:pt-28">
        <div className="lg:pl-6">
          <h1 className="text-5xl leading-[1.05] tracking-tight sm:text-6xl xl:text-7xl">
            <span className="block font-light">Get To Know Us</span>
            <span className="block font-extrabold">Evaku.id</span>
            <span className="block font-semibold">Flood Management</span>
          </h1>
 
          <p className="mt-6 max-w-md text-base leading-relaxed text-[#0B2A4A]/70 sm:text-lg">
            Website Ini adalah web flood management 
          </p>
 
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a
              href="#about"
              className="inline-flex h-14 items-center justify-center rounded-full border border-[#071B30] bg-[#0B2A4A] px-9 text-base font-semibold text-[#F1F5F9] transition-colors duration-200 hover:bg-[#071B30] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B2A4A]"
            >
            Discover more about us
            </a>
          </div>
        </div>
        <figure className="relative mx-auto w-full max-w-xl lg:ml-auto">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#0B2A4A]/15 bg-[#0B2A4A]/10 shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1400&q=85"
              alt="Mobil terendam di jalan perkotaan akibat banjir"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              preload
            />
          </div>
        </figure>
        </div>
        </section>
    );
}