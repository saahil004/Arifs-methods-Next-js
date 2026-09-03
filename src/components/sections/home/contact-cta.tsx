"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { siteConfig } from "@/lib/site-config";

const contactItems = [
  {
    icon: MapPin,
    label: "Address",
    lines: [siteConfig.contact.address.line1, siteConfig.contact.address.line2],
  },
  {
    icon: Phone,
    label: "Phone",
    lines: [siteConfig.contact.phone],
  },
  {
    icon: Mail,
    label: "E-mail",
    lines: [siteConfig.contact.email],
  },
];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function ContactCta() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div className="relative">
          <div
            className="absolute -left-4 -top-4 h-32 w-32 text-amber/50"
            style={{
              backgroundImage: "radial-gradient(currentColor 1.5px, transparent 1.5px)",
              backgroundSize: "14px 14px",
            }}
          />
          <div className="absolute inset-0 -z-10 translate-x-6 translate-y-6 rounded-3xl bg-amber/10" />
          <div className="relative aspect-4/5 overflow-hidden rounded-3xl">
            <Image
              src="/sir-arif.jpg"
              alt="Sir Arif, founder and Mathematics educator at Arif's Methods"
              fill
              sizes="(min-width: 1024px) 500px, 90vw"
              className="object-cover"
            />
          </div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.p
            variants={item}
            className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-amber"
          >
            <span className="h-px w-6 bg-amber" />
            Get in Touch
          </motion.p>
          <motion.h2 variants={item} className="max-w-md text-3xl font-extrabold leading-tight text-navy sm:text-4xl">
            Convinced Yet? Let&apos;s Talk.
          </motion.h2>

          <div className="mt-10 space-y-6">
            {contactItems.map(({ icon: Icon, label, lines }) => (
              <motion.div key={label} variants={item} className="flex gap-4">
                <Icon className="h-5 w-5 shrink-0 text-amber" />
                <div>
                  <p className="font-bold text-navy">{label}</p>
                  {lines.map((line) => (
                    <p key={line} className="text-navy/60">
                      {line}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={item} className="mt-8">
            <Link
              href="/contact"
              className="inline-block rounded-full bg-amber px-8 py-4 font-bold text-navy transition-transform duration-200 hover:scale-105 hover:bg-amber/90 active:scale-95"
            >
              Contact Us
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
