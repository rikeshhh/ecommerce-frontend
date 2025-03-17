import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqQuestions } from "@/data/faqQuestion";

export function FAQAccordion() {
  return (
    <section className="w-full min-h-screen container mx-auto flex justify-center items-center p-6">
      <div className=" w-full  rounded-2xl shadow-lg p-2 border border-gray-200 ">
        <h2 className="md:text-2xl text-sm font-bold text-gray-800 text-center mb-6">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqQuestions.map((item) => (
            <AccordionItem
              key={item.value}
              value={item.value}
              className="border bg-lightWhite rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="text-sm md:text-base font-semibold text-gray-700 px-4 py-3  transition-all">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="bg-gray-50 md:px-5  bg-lightWhite py-4 text-gray-600">
                <p className="text-xs md:text-base font-normal">
                  {item.answer}
                </p>

                {item.answerInpoint && item.answerInpoint.length > 0 && (
                  <ul className="list-disc pl-5 space-y-2 mt-3 text-sm text-gray-700">
                    {item.answerInpoint.map((point, index) => (
                      <li key={index} className="text-xs md:text-sm">
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
