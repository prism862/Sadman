import React from 'react';
import { motion } from 'motion/react';
import { fadeInUp, staggerContainer, staggerItem } from '../constants/animations';

export default function RefundPolicy() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-12"
        >
          <motion.div variants={fadeInUp}>
            <h1 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter mb-4">
              Refund <span className="prism-text">Policy</span>
            </h1>
            <p className="text-white/40 font-mono text-sm tracking-widest uppercase">
              Last Updated: April 2026
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="space-y-8 text-white/70 leading-relaxed font-light">
            <section>
              <h2 className="text-xl font-display font-bold text-white uppercase tracking-widest mb-4">1. Overview</h2>
              <p>
                At PRISM, we stand behind the quality of our spectrum-engineered apparel. If you are not completely satisfied with your purchase, we are here to help with a smooth refund process.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white uppercase tracking-widest mb-4">2. Eligibility for Refunds</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Items must be returned within 7 days of delivery.</li>
                <li>Items must be unworn, unwashed, and in their original condition with all tags attached.</li>
                <li>Spectrum Series items must include their original specialized packaging.</li>
                <li>Proof of purchase (Order ID or Invoice) is required.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white uppercase tracking-widest mb-4">3. Non-Refundable Items</h2>
              <p>
                Certain items are ineligible for return or refund:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                <li>Items marked as "Final Sale" or "Archive".</li>
                <li>Customized or personalized pieces.</li>
                <li>Items damaged through normal wear and tear or improper care.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white uppercase tracking-widest mb-4">4. Refund Process</h2>
              <p>
                To initiate a refund, please contact our support team via Instagram <span className="text-prism-mid">@prism_thebest</span> or email us at <span className="text-prism-mid">support@prismclothing.com</span> with your Order ID.
              </p>
              <p className="mt-4">
                Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed via your original payment method within 5-10 business days.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-bold text-white uppercase tracking-widest mb-4">5. Exchanges</h2>
              <p>
                We only replace items if they are defective or damaged. If you need to exchange it for the same item in a different size, please contact us immediately.
              </p>
            </section>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            className="p-8 glass border-white/10 rounded-3xl text-center"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Need immediate assistance?</p>
            <a 
              href="https://instagram.com/prism_thebest" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-white text-black font-display font-bold uppercase tracking-widest text-xs rounded-full hover:scale-105 transition-transform"
            >
              Contact Support
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
