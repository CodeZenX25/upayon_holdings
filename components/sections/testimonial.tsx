import Image from "next/image";
import { Quote, Star } from "lucide-react";
import { SectionTitle } from "@/components/sections/section-title";

export function Testimonial() {
  return (
    <section className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <SectionTitle
          eyebrow="Client stories"
          title={
            <>
              Client{" "}
              <span className="font-serif font-semibold italic text-navy-600">
                testimonials
              </span>
            </>
          }
          description="Hear directly from the families who trusted Upayon Holdings Ltd."
        />

        <figure
          data-reveal
          className="relative mx-auto mt-14 grid max-w-4xl items-center gap-8 rounded-[32px] bg-white p-8 shadow-[0_40px_80px_-40px_rgba(17,20,58,0.35)] ring-1 ring-slate-200/70 md:grid-cols-[auto_1fr] md:p-12"
        >
          <Quote
            aria-hidden="true"
            className="absolute right-8 top-8 size-16 fill-navy-900/5 text-navy-900/5"
          />
          <div className="relative mx-auto size-32 overflow-hidden rounded-full ring-4 ring-gold/40 ring-offset-4 md:size-36">
            <Image
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=85"
              alt=""
              fill
              sizes="144px"
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex gap-1 text-gold" role="img" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="size-4 fill-current" aria-hidden="true" />
              ))}
            </div>
            <blockquote className="mt-4 font-serif text-[21px] italic leading-[1.7] text-navy-900 md:text-[24px]">
              &ldquo;Investing in the land share of Upayon Uttara Crest was
              seamless. Having the land registered directly in our name gave
              us complete peace of mind — the progress reports are always
              clear and on time.&rdquo;
            </blockquote>
            <figcaption className="mt-6">
              <span className="block text-[17px] font-extrabold text-navy-900">
                Tariqul Islam Chowdhury
              </span>
              <span className="text-[14px] text-slate-500">
                Shareholder, Upayon Uttara Crest
              </span>
            </figcaption>
          </div>
        </figure>
      </div>
    </section>
  );
}
