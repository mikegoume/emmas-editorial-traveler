"use client";

import { sendContactEmailAction } from "@/app/about/actions";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useTransition } from "react";

const INQUIRY_TYPES = ["Συνεργασία", "Ομιλίες", "Χαιρετισμός"];

const EMPTY = { name: "", email: "", inquiryType: INQUIRY_TYPES[0], message: "" };

export default function ContactForm() {
  const [fields, setFields] = useState(EMPTY);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function set(key: keyof typeof EMPTY, value: string) {
    setFields((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await sendContactEmailAction(fields);
      if (result?.error) {
        setError(result.error);
      } else {
        setFields(EMPTY);
        setShowSuccess(true);
      }
    });
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-surface-container-lowest p-8 md:p-12 rounded-lg editorial-shadow border border-white/50"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label block">
              Ονοματεπώνυμο
            </label>
            <input
              required
              type="text"
              value={fields.name}
              onChange={(e) => set("name", e.target.value)}
              className="w-full bg-surface-container-low border-0 border-b border-outline-variant/20 focus:ring-0 focus:border-secondary transition-all py-3 px-4 text-on-surface placeholder:text-outline-variant/50"
              placeholder="Ιωάννα Παπαδοπούλου"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label block">
              Διεύθυνση Email
            </label>
            <input
              required
              type="email"
              value={fields.email}
              onChange={(e) => set("email", e.target.value)}
              className="w-full bg-surface-container-low border-0 border-b border-outline-variant/20 focus:ring-0 focus:border-secondary transition-all py-3 px-4 text-on-surface placeholder:text-outline-variant/50"
              placeholder="ioanna@example.com"
            />
          </div>

          {/* Inquiry type */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label">
              Είδος Επικοινωνίας
            </label>
            <div className="flex flex-wrap gap-3 mt-2">
              {INQUIRY_TYPES.map((type, i) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => set("inquiryType", type)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    fields.inquiryType === type
                      ? "bg-secondary-container text-on-secondary-container scale-105"
                      : "bg-surface-container-high text-on-surface-variant hover:bg-secondary-container/50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label">
              Το Μήνυμά σας
            </label>
            <textarea
              required
              value={fields.message}
              onChange={(e) => set("message", e.target.value)}
              className="w-full bg-surface-container-low border-0 border-b border-outline-variant/20 focus:ring-0 focus:border-secondary transition-all py-3 px-4 text-on-surface resize-none placeholder:text-outline-variant/50"
              placeholder="Πείτε μου για το έργο ή τον προορισμό σας..."
              rows={4}
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2 pt-4 space-y-3">
            <button
              type="submit"
              disabled={isPending}
              className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-secondary to-secondary-dim text-on-secondary rounded-full font-bold text-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-60 disabled:hover:scale-100"
            >
              {isPending ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">
                    progress_activity
                  </span>
                  Αποστολή…
                </>
              ) : (
                <>
                  Αποστολή Μηνύματος
                  <span className="material-symbols-outlined">send</span>
                </>
              )}
            </button>

            {error && (
              <p className="text-sm text-error font-body bg-error-container/20 border border-error/20 rounded-lg px-4 py-3">
                {error}
              </p>
            )}
          </div>
        </div>
      </form>

      {/* Success popup */}
      <AnimatePresence>
        {showSuccess && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
              onClick={() => setShowSuccess(false)}
            />

            {/* Modal */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-[201] flex items-center justify-center px-4 pointer-events-none"
            >
              <div className="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/20 p-10 max-w-sm w-full text-center pointer-events-auto">
                <div className="w-16 h-16 bg-secondary-container rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-3xl text-secondary">
                    mark_email_read
                  </span>
                </div>
                <h3 className="font-headline text-2xl font-bold text-on-background mb-3">
                  Το μήνυμά σας στάλθηκε!
                </h3>
                <p className="font-body text-on-surface-variant text-sm leading-relaxed mb-8">
                  Σας ευχαριστώ για την επικοινωνία. Θα επικοινωνήσω μαζί σας το συντομότερο δυνατό.
                </p>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="bg-secondary text-on-secondary px-8 py-3 rounded-full font-headline font-bold hover:bg-secondary/90 transition-colors"
                >
                  Κλείσιμο
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
