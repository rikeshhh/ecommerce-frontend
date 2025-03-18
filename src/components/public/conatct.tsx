"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contact`,
        data
      );

      if (response.data.success) {
        toast.success("Message sent successfully!", {
          description: "We’ll get back to you soon.",
          duration: 5000,
        });
        setIsSubmitted(true);
        form.reset();
        setTimeout(() => setIsSubmitted(false), 3000);
      }
    } catch (error) {
      toast.error("Failed to send message", {
        description: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "Something went wrong",
      });
    }
  };

  return (
    <div className="w-full mx-auto px-4 py-12 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <h1 className="text-xl sm:text-4xl font-bold mb-4 sm:mb-12 text-left sm:text-center text-gray-800 dark:text-white tracking-tight">
        Get in Touch
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <Card className="shadow-lg rounded-xl overflow-hidden border-none bg-white dark:bg-gray-950 transform transition-all hover:scale-105">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
            <CardTitle className="sm:text-2xl font-bold">
              Send Us a Message
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isSubmitted ? (
              <div className="text-center py-8 animate-fade-in">
                <p className="text-green-600 dark:text-green-400 font-semibold text-lg">
                  Thank You! Your message has been sent.
                </p>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  We’ll get back to you soon!
                </p>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your name"
                            {...field}
                            className="w-full pl-10 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          Email
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="email"
                              placeholder="your.email@example.com"
                              {...field}
                              className="w-full pl-10 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                            />
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          Subject
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="What’s on your mind?"
                            {...field}
                            className="w-full pl-10 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          Message
                        </FormLabel>
                        <FormControl>
                          <textarea
                            placeholder="Tell us more..."
                            {...field}
                            className="w-full min-h-[120px] p-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 resize-y"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className={cn(
                      "w-full py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300",
                      form.formState.isSubmitting &&
                        "opacity-70 cursor-not-allowed"
                    )}
                  >
                    {form.formState.isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                          />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-xl overflow-hidden border-none bg-white dark:bg-gray-950 transform transition-all hover:scale-105">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-6">
            <CardTitle className="sm:text-2xl font-bold">
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-start gap-4">
              <Mail className="h-6 w-6 text-blue-500 dark:text-blue-400 mt-1" />
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  Email
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  support@example.com
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="h-6 w-6 text-blue-500 dark:text-blue-400 mt-1" />
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  Phone
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  +1 (555) 123-4567
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-blue-500 dark:text-blue-400 mt-1" />
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  Address
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  123 Main St, City, Country
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="mt-8 text-center text-gray-600 dark:text-gray-400 text-sm">
        Follow us on{" "}
        <a
          href="https://x.com/yourhandle"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
        >
          X
        </a>{" "}
        for updates!
      </p>
    </div>
  );
};

export default ContactPage;
