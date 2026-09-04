"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/site-config";

// Deliberately static rather than CMS-driven — a page like this changes
// rarely and by hand (an admin panel for legal copy would be a lot of
// machinery for something a developer edits directly a few times a year).
const SECTIONS = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    body: [
      `These Terms and Conditions ("Terms") govern enrollment in and attendance of any course, class, or program offered by ${siteConfig.name} ("we", "us", "our"). By registering for a course, submitting an enquiry through our website, or attending a class, you ("student", "parent", or "guardian") agree to be bound by these Terms.`,
      "If you are registering on behalf of a student who is a minor, you confirm that you have the authority to accept these Terms on their behalf and that you accept responsibility for their conduct and attendance.",
    ],
  },
  {
    id: "enrollment",
    title: "2. Enrollment & Registration",
    body: [
      "Enrollment is confirmed only once a completed registration has been submitted and accepted by us. Submitting the registration form on our website, or registering in person, does not guarantee a place in a given batch or timing — class sizes are limited, and placement is subject to availability.",
      "You are responsible for providing accurate contact and subject information at the time of registration. We rely on this information to place you in the correct level (O Level or A Level) and subject group, and to reach you about scheduling, fees, and academic progress.",
    ],
  },
  {
    id: "fees",
    title: "3. Fees, Payments & Refunds",
    body: [
      "Course fees, payment schedules, and accepted payment methods are communicated at the time of enrollment and may vary by subject, level, or batch. Fees are due in advance of the period they cover unless another arrangement has been agreed in writing.",
      "A student's place in a batch may be suspended if fees remain unpaid past the agreed due date. Fees already paid for classes attended are non-refundable. Requests to withdraw before a term begins, or to transfer a payment toward a future term, are considered on a case-by-case basis — please contact us directly to discuss your situation.",
    ],
  },
  {
    id: "attendance",
    title: "4. Attendance & Code of Conduct",
    body: [
      "Regular attendance is expected, as our teaching is structured topic-by-topic and each session builds on the last. Missed classes cannot always be made up, and we are not able to guarantee rescheduled sessions for every absence.",
      "Students are expected to conduct themselves respectfully toward tutors and fellow students at all times. We reserve the right to suspend or discontinue a student's enrollment, without refund of fees already paid, in cases of serious or repeated misconduct.",
    ],
  },
  {
    id: "materials",
    title: "5. Course Materials & Intellectual Property",
    body: [
      "Notes, worksheets, past-paper solutions, and any other materials provided during a course remain the intellectual property of Arif's Methods (or of Sir Arif specifically, where developed by him personally). They are provided for the personal academic use of the enrolled student only.",
      "Materials may not be copied, redistributed, resold, or shared with anyone outside the course — including other students not enrolled in the same batch — without our prior written permission.",
    ],
  },
  {
    id: "privacy",
    title: "6. Privacy Policy",
    body: [
      "This section explains what personal information we collect through our website and in the course of enrollment, and how we use it. It applies whenever you register, submit a contact enquiry, subscribe to our newsletter, or otherwise interact with this site.",
    ],
    subsections: [
      {
        heading: "Information We Collect",
        body: [
          "When you register for a course or submit a contact enquiry, we collect the information you provide directly — typically your name, phone number, email address, the subjects or level you're interested in, and any message you include. If you subscribe to our newsletter, we collect your email address for that purpose.",
        ],
      },
      {
        heading: "How We Use Your Information",
        body: [
          "We use this information to process enrollments, respond to enquiries, communicate about classes and fees, and — only where you've subscribed — send newsletter updates about new courses and results. We do not sell your personal information to third parties.",
        ],
      },
      {
        heading: "Cookies & Analytics",
        body: [
          "We use Google Analytics (GA4) and Meta Pixel to understand how visitors use our website — for example, which pages are viewed and which forms are submitted — so we can improve the site. These tools may set cookies in your browser. You can control or block cookies through your browser settings.",
        ],
      },
      {
        heading: "Third-Party Services",
        body: [
          "We rely on third-party services to run our website and communications: Supabase to store registration and enquiry records, and Brevo to send newsletter emails. These providers process data on our behalf and are not permitted to use it for their own purposes.",
        ],
      },
      {
        heading: "Data Retention",
        body: [
          "Registration records that are archived in our system are automatically and permanently deleted after 14 days. Active records, and newsletter subscriptions, are kept for as long as needed to provide our services, or until you ask us to remove them.",
        ],
      },
      {
        heading: "Your Rights",
        body: [
          "You can ask us at any time to see what information we hold about you, to correct it, or to have it deleted — including unsubscribing from the newsletter. Contact us using the details in Section 9 below to make a request.",
        ],
      },
    ],
  },
  {
    id: "liability",
    title: "7. Limitation of Liability",
    body: [
      "We are committed to providing high-quality tuition, but we cannot guarantee specific exam results or grade outcomes, as these depend on factors beyond our control, including a student's own preparation and effort.",
      "To the extent permitted by law, Arif's Methods is not liable for any indirect or consequential loss arising from a student's participation in our courses, beyond the fees paid for the course in question.",
    ],
  },
  {
    id: "changes",
    title: "8. Changes to These Terms",
    body: [
      "We may update these Terms from time to time — for example, to reflect a change in our fee or attendance policy. The version published on this page is always the current one, and continued enrollment after an update constitutes acceptance of the revised Terms.",
    ],
  },
  {
    id: "contact",
    title: "9. Contact Us",
    body: [
      "If you have any questions about these Terms, you can reach us at:",
    ],
  },
];

export default function TermsContent() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    // -45% bottom margin means a section counts as "active" once it's
    // reached roughly the upper third of the viewport, rather than only
    // when it's fully centered — closer to how a reader actually tracks
    // which section they're "in" while scrolling past a fixed header.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-112px 0px -45% 0px", threshold: 0 }
    );

    for (const section of SECTIONS) {
      const el = sectionRefs.current[section.id];
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <div className="grid gap-12 lg:grid-cols-[260px_1fr]">
        {/* Desktop-only: below lg there's no room for a rail beside the
            content, and a 9-item list stacked above the text just pushes
            the actual content down before a reader can start on it.
            top-28 clears the fixed h-20 header plus breathing room;
            self-start stops the grid's row-stretch from pulling this to the
            content's full height, which would break sticky positioning. */}
        <nav aria-label="Table of contents" className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-navy/40">On this page</p>
          <ul className="space-y-1 border-l border-navy/10">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={`-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors ${
                    activeId === section.id
                      ? "border-amber font-bold text-navy"
                      : "border-transparent text-navy/50 hover:text-navy"
                  }`}
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 rounded-3xl border border-navy/10 bg-white p-8 shadow-sm sm:p-12">
          <p className="mb-10 text-sm text-navy/50">Last updated: September 2026</p>

          <div className="space-y-12">
            {SECTIONS.map((section) => (
              <section
                key={section.id}
                id={section.id}
                ref={(el) => {
                  sectionRefs.current[section.id] = el;
                }}
                className="scroll-mt-28"
              >
                <h2 className="text-xl font-extrabold text-navy sm:text-2xl">{section.title}</h2>
                <div className="mt-4 space-y-4 leading-relaxed text-navy/70">
                  {section.body.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                  {section.subsections && (
                    <div className="space-y-6">
                      {section.subsections.map((sub) => (
                        <div key={sub.heading}>
                          <h3 className="font-bold text-navy">{sub.heading}</h3>
                          {sub.body.map((paragraph, i) => (
                            <p key={i} className="mt-2">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                  {section.id === "contact" && (
                    <ul className="space-y-1">
                      <li>
                        Email:{" "}
                        <a href={`mailto:${siteConfig.contact.email}`} className="text-navy underline hover:text-amber">
                          {siteConfig.contact.email}
                        </a>
                      </li>
                      <li>
                        Phone:{" "}
                        <a href={siteConfig.contact.phoneHref} className="text-navy underline hover:text-amber">
                          {siteConfig.contact.phone}
                        </a>
                      </li>
                      <li>
                        Address: {siteConfig.contact.address.line1}, {siteConfig.contact.address.line2}
                      </li>
                    </ul>
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
