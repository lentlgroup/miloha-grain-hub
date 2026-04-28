import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, MapPin, Phone, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { submitLentlInquiry, type LentlInquiryPayload } from "@/lib/api";

const schema = z.object({
  name: z.string().min(2, "Full name is required"),
  phone: z.string().min(7, "Phone number is required"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  company: z.string().optional(),
  interest_area: z.enum(
    ["pure-grains", "logistics", "agro-solutions", "partnership", "general-inquiry"],
    { errorMap: () => ({ message: "Please select an area of interest" }) },
  ),
  message: z.string().min(10, "Please describe your inquiry (at least 10 characters)"),
});

type FormData = z.infer<typeof schema>;

const interestOptions = [
  { value: "pure-grains", label: "MILOHA Pure Grains" },
  { value: "logistics", label: "MILOHA Logistics" },
  { value: "agro-solutions", label: "MILOHA Agro Solutions" },
  { value: "partnership", label: "Partnership / Investment" },
  { value: "general-inquiry", label: "General Inquiry" },
];

const fieldClass =
  "w-full rounded-xl border border-lentl-navy/15 bg-white px-4 py-3 text-sm text-lentl-charcoal outline-none transition focus:border-lentl-navy/40 focus:ring-4 focus:ring-lentl-navy/8 placeholder:text-lentl-charcoal/35";

const errorClass = "mt-1 text-xs font-medium text-red-500";

export const LentlContact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    try {
      await submitLentlInquiry(data as LentlInquiryPayload);
      setSubmitted(true);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <section id="contact" className="bg-lentl-bg py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          {/* ── Left: Info ── */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-lentl-navy/15 bg-white px-4 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-lentl-lime" />
              <span className="font-montserrat text-[11px] font-semibold uppercase tracking-[0.24em] text-lentl-navy">
                Contact
              </span>
            </div>

            <h2 className="mt-6 font-montserrat text-4xl font-bold text-lentl-navy lg:text-5xl">
              Let's Start a
              <br />
              <span className="text-lentl-green">Conversation</span>
            </h2>

            <p className="mt-5 text-lg leading-8 text-lentl-charcoal/70">
              Whether you are a buyer, farmer, investor, logistics partner, or simply curious
              about what LeNTL Group is building — we want to hear from you.
            </p>

            <div className="mt-10 space-y-5">
              <div className="flex items-start gap-4 rounded-2xl border border-lentl-navy/10 bg-white p-5">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lentl-navy/8">
                  <MapPin size={18} className="text-lentl-navy" />
                </div>
                <div>
                  <p className="font-montserrat text-xs font-semibold uppercase tracking-[0.2em] text-lentl-navy/50">
                    Location
                  </p>
                  <p className="mt-1 text-sm font-medium text-lentl-charcoal">
                    Dar es Salaam, Tanzania
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-lentl-navy/10 bg-white p-5">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lentl-navy/8">
                  <Phone size={18} className="text-lentl-navy" />
                </div>
                <div>
                  <p className="font-montserrat text-xs font-semibold uppercase tracking-[0.2em] text-lentl-navy/50">
                    Phone / WhatsApp
                  </p>
                  <p className="mt-1 text-sm font-medium text-lentl-charcoal">
                    +255 XXX XXX XXX
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-lentl-navy/10 bg-white p-5">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lentl-navy/8">
                  <Mail size={18} className="text-lentl-navy" />
                </div>
                <div>
                  <p className="font-montserrat text-xs font-semibold uppercase tracking-[0.2em] text-lentl-navy/50">
                    Email
                  </p>
                  <p className="mt-1 text-sm font-medium text-lentl-charcoal">
                    info@lentlgroup.co.tz
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div className="rounded-3xl border border-lentl-navy/10 bg-white p-8 shadow-[0_20px_60px_-24px_rgba(28,53,94,0.12)]">
            {submitted ? (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-lentl-lime/15">
                  <CheckCircle2 size={32} className="text-lentl-green" />
                </div>
                <h3 className="mt-5 font-montserrat text-xl font-bold text-lentl-navy">
                  Inquiry Received
                </h3>
                <p className="mt-3 max-w-sm text-base leading-7 text-lentl-charcoal/70">
                  Thank you for reaching out. Our team will review your inquiry and respond
                  within 1–2 business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Full Name */}
                  <div>
                    <label className="mb-1.5 block font-montserrat text-xs font-semibold uppercase tracking-[0.18em] text-lentl-navy/60">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("name")}
                      type="text"
                      placeholder="Your full name"
                      className={fieldClass}
                    />
                    {errors.name && <p className={errorClass}>{errors.name.message}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-1.5 block font-montserrat text-xs font-semibold uppercase tracking-[0.18em] text-lentl-navy/60">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("phone")}
                      type="tel"
                      placeholder="+255 XXX XXX XXX"
                      className={fieldClass}
                    />
                    {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Email */}
                  <div>
                    <label className="mb-1.5 block font-montserrat text-xs font-semibold uppercase tracking-[0.18em] text-lentl-navy/60">
                      Email Address
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="your@email.com"
                      className={fieldClass}
                    />
                    {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                  </div>

                  {/* Company */}
                  <div>
                    <label className="mb-1.5 block font-montserrat text-xs font-semibold uppercase tracking-[0.18em] text-lentl-navy/60">
                      Company / Organisation
                    </label>
                    <input
                      {...register("company")}
                      type="text"
                      placeholder="Your company name"
                      className={fieldClass}
                    />
                  </div>
                </div>

                {/* Area of Interest */}
                <div>
                  <label className="mb-1.5 block font-montserrat text-xs font-semibold uppercase tracking-[0.18em] text-lentl-navy/60">
                    Area of Interest <span className="text-red-500">*</span>
                  </label>
                  <select {...register("interest_area")} className={fieldClass}>
                    <option value="">Select an area of interest…</option>
                    {interestOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.interest_area && (
                    <p className={errorClass}>{errors.interest_area.message}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="mb-1.5 block font-montserrat text-xs font-semibold uppercase tracking-[0.18em] text-lentl-navy/60">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register("message")}
                    rows={5}
                    placeholder="Describe your inquiry, interest, or question…"
                    className={fieldClass}
                  />
                  {errors.message && <p className={errorClass}>{errors.message.message}</p>}
                </div>

                {serverError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {serverError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-lentl-navy px-6 py-4 font-montserrat text-base font-bold text-white transition-colors hover:bg-lentl-navy-dark disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      Send Inquiry <Send size={16} />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-lentl-charcoal/40">
                  Your inquiry is reviewed by our team within 1–2 business days.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
