// "use client";

// import { Footer } from "@/components/footer";
// import PageLayout from "@/components/page-layout";
// import { ChevronDown } from "lucide-react";
// import Link from "next/link";
// import { useState } from "react";

// const faqs = [
//   {
//     category: "Orders & Delivery",
//     questions: [
//       {
//         q: "What are your delivery hours?",
//         a: "Beebites operates exclusively during late-night hours, from 10:00 PM to 5:00 AM. We're here when you need a midnight snack or early morning meal!",
//       },
//       {
//         q: "How long does delivery take?",
//         a: "Typical delivery time is 30-45 minutes, depending on your location and the restaurant's preparation time. You can track your order in real-time through the app.",
//       },
//       {
//         q: "What areas do you deliver to?",
//         a: "We currently deliver across major areas in Assam. Enter your address in the app to check if we deliver to your location.",
//       },
//       {
//         q: "Can I schedule an order for later?",
//         a: "Currently, we only accept immediate orders. However, we're working on adding scheduled ordering in the future!",
//       },
//     ],
//   },
//   {
//     category: "Payments & Pricing",
//     questions: [
//       {
//         q: "What payment methods do you accept?",
//         a: "We accept all major online payment methods including UPI, credit cards, debit cards, and net banking. All payments are processed securely through our payment gateway.",
//       },
//       {
//         q: "Do you accept cash on delivery?",
//         a: "No, Beebites only accepts online payments to ensure a seamless and contactless experience.",
//       },
//       {
//         q: "Are there any delivery charges?",
//         a: "Delivery charges vary based on distance and order value. These charges are clearly shown before you place your order.",
//       },
//       {
//         q: "Do you have a minimum order value?",
//         a: "Yes, minimum order values may vary by restaurant. You'll see the minimum order requirement when browsing each restaurant's menu.",
//       },
//     ],
//   },
//   {
//     category: "Cancellations & Refunds",
//     questions: [
//       {
//         q: "Can I cancel my order?",
//         a: "Yes, you can cancel your order before the restaurant starts preparing it. Standard cancellation charges may apply depending on the timing.",
//       },
//       {
//         q: "How do I get a refund?",
//         a: "If we cancel your order or there's an issue, refunds are automatically processed to your original payment method within 3-4 business days.",
//       },
//       {
//         q: "What if I received the wrong order?",
//         a: "Contact our support team immediately through the app or email. We'll work to resolve the issue and may offer a refund or replacement.",
//       },
//       {
//         q: "What if an item is missing from my order?",
//         a: "Please report missing items through the app within 30 minutes of delivery. Our team will investigate and provide an appropriate resolution.",
//       },
//     ],
//   },
//   {
//     category: "Account & App",
//     questions: [
//       {
//         q: "Do I need to create an account?",
//         a: "Yes, you'll need to create an account to place orders. This helps us provide personalized service and track your orders.",
//       },
//       {
//         q: "How do I reset my password?",
//         a: "Click on 'Forgot Password' on the login page, and we'll send you a password reset link to your registered email.",
//       },
//       {
//         q: "Can I save multiple delivery addresses?",
//         a: "Yes! You can save multiple addresses in your account for quick checkout.",
//       },
//       {
//         q: "Is my data secure?",
//         a: "Absolutely. We use industry-standard encryption and security measures to protect your personal and payment information. Check our Privacy Policy for details.",
//       },
//     ],
//   },
// ];

// export default function FAQ() {
//   const [openItems, setOpenItems] = useState<string[]>([]);

//   const toggleItem = (id: string) => {
//     setOpenItems((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
//     );
//   };

//   return (
//     <PageLayout>
//       <div className="bg-card rounded-xl shadow-xl p-6 sm:p-10 border border-border mb-2">
//         <div className="mb-8">
//           <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
//             ❓ Frequently Asked Questions
//           </h1>
//           <p className="text-foreground/90 text-lg">
//             Find answers to common questions about Beebites
//           </p>
//         </div>

//         <div className="space-y-8">
//           {faqs.map((category, catIndex) => (
//             <div key={catIndex}>
//               <h2 className="text-xl font-semibold text-primary mb-4">
//                 {category.category}
//               </h2>
//               <div className="space-y-3">
//                 {category.questions.map((faq, qIndex) => {
//                   const itemId = `${catIndex}-${qIndex}`;
//                   const isOpen = openItems.includes(itemId);

//                   return (
//                     <div
//                       key={qIndex}
//                       className="border border-border rounded-lg overflow-hidden bg-muted/30"
//                     >
//                       <button
//                         onClick={() => toggleItem(itemId)}
//                         className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-accent/50 transition-colors"
//                       >
//                         <span className="font-medium text-foreground pr-4">
//                           {faq.q}
//                         </span>
//                         <ChevronDown
//                           className={`h-5 w-5 text-primary flex-shrink-0 transition-transform ${
//                             isOpen ? "rotate-180" : ""
//                           }`}
//                         />
//                       </button>
//                       {isOpen && (
//                         <div className="px-5 py-4 pt-0 text-foreground/80 border-t border-border/50">
//                           {faq.a}
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="mt-10 pt-6 border-t border-border">
//           <p className="text-sm text-muted-foreground">
//             Can't find what you're looking for?{" "}
//             <Link
//               href="/contact"
//               className="text-primary hover:text-primary/80 font-medium transition-colors"
//             >
//               Contact our support team
//             </Link>
//           </p>
//         </div>
//       </div>
//       <Footer />
//     </PageLayout>
//   );
// }

import PageLayout from "@/components/page-layout";

const FAQs = () => {
  return (
    <PageLayout>
      <h1>FAQs comming soon.</h1>
    </PageLayout>
  );
};

export default FAQs;
