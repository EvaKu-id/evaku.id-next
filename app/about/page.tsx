import Image from "next/image";


type AboutProps = {
  /** Path gambar di folder public/, mis. "/about.jpg". Kosong = placeholder. */
  imageSrc?: string;
  imageAlt?: string;
};

/** Placeholder: latar biru dengan garis diagonal + siluet dua orang. */
function ImagePlaceholder() {
  return (
    <svg
      viewBox="0 0 600 400"
      className="absolute inset-0 size-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="600" height="400" fill="#0B2A4A" fillOpacity=".14" />
      <g fill="#F1F5F9" fillOpacity=".55">
        <path d="M60 0h70L40 190 0 190Z" />
        <path d="M260 0h60L230 160 190 160Z" />
        <path d="M470 0h70L450 210 410 210Z" />
        <path d="M560 120h40v140l-60 0Z" />
      </g>
      {/* orang kiri */}
      <circle cx="270" cy="150" r="42" fill="#0B2A4A" />
      <path d="M170 400c0-80 40-135 100-135s100 55 100 135Z" fill="#071B30" />
      {/* orang kanan */}
      <circle cx="400" cy="210" r="38" fill="#0B2A4A" fillOpacity=".8" />
      <path d="M320 400c0-62 32-105 80-105s80 43 80 105Z" fill="#0B2A4A" fillOpacity=".9" />
    </svg>
  );
}

export default function About({ imageSrc, imageAlt = "" }: AboutProps) {
  return (
    <section
      id="about"
      className="scroll-mt-24 bg-[#F1F5F9] px-4 py-16 text-[#0B2A4A] sm:px-6 sm:py-20"
    >
      <div className="mx-auto grid max-w-6xl  lg:grid-cols-2 lg:gap-5">
        <article className="flex flex-col justify-between gap- rounded-3xl bg-white p-6 shadow-[0_1px_0_rgba(11,42,74,0.04)] sm:p-9 lg:gap-16">
          <div>
            <p className="text-base font-semibold text-[#0B2A4A]/60">How it started</p>
            <h2 className="mt-4 text-4xl font-semibold leading-[1.15] tracking-tight text-[#071B30] sm:text-5xl">
              Tujuan kami membuat ini adalah 
            </h2>
          </div>

          <p className="max-w-prose text-sm leading-7 text-[#0B2A4A]/80 sm:text-[15px]">
            Untuk mempersiapkan apa yang harus dilakukan, kapan harus evakuasi, dimana harus berlari dan rute mana yang harus di lewati dari bencana banjir menggunakan evaku.id
          </p>
        </article>

        {/* ===== Gambar + statistik ===== */}
        <div className="flex flex-col gap-4 lg:gap-5">
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-3xl bg-[#0B2A4A]/10">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <ImagePlaceholder />
            )}
          </div>

        </div>
      </div>
    </section>
  );
}