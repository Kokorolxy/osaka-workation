import Image from "next/image";

export function PageHero({
  eyebrow,
  title,
  body,
  image,
}: {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
}) {
  return (
    <section className="relative isolate flex min-h-[52vh] items-end overflow-hidden">
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="hero-overlay absolute inset-0" />
      <div className="container-page relative z-10 pb-14 pt-32">
        <span className="eyebrow text-brand-orange">{eyebrow}</span>
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/80">
          {body}
        </p>
      </div>
    </section>
  );
}
