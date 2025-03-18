"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqQuestions } from "@/data/faqQuestion";

export function FAQAccordion() {
  return (
    <section className="w-full py-16 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl md:text-4xl font-bold text-gray-800 dark:text-white text-left sm:text-center mb-4 sm:mb-12 tracking-tight">
          Frequently Asked Questions
        </h2>

        <div className="w-full rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-1 sm:p-6 transform transition-all hover:shadow-xl">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqQuestions.map((item) => (
              <AccordionItem
                key={item.value}
                value={item.value}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900 transition-all hover:shadow-md"
              >
                <AccordionTrigger className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="bg-gray-50 dark:bg-gray-800 px-5 py-4 text-gray-600 dark:text-gray-300">
                  <p className="text-sm md:text-base font-normal leading-relaxed">
                    {item.answer}
                  </p>
                  {item.answerInpoint && item.answerInpoint.length > 0 && (
                    <ul className="list-disc pl-6 space-y-2 mt-3 text-sm md:text-base text-gray-700 dark:text-gray-400">
                      {item.answerInpoint.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
