import { Clock, Package, Shield, Truck } from "lucide-react";

import React from "react";

export default function Feature() {
  const featuresData = [
    {
      icon: <Truck className="w-8 h-8 text-indigo-600" />,
      title: "Fast Delivery",
      description: "Get your orders delivered in 1-3 days.",
    },
    {
      icon: <Shield className="w-8 h-8 text-indigo-600" />,
      title: "Secure Payments",
      description: "Shop with confidence using our secure checkout.",
    },
    {
      icon: <Clock className="w-8 h-8 text-indigo-600" />,
      title: "24/7 Support",
      description: "We’re here to help anytime, day or night.",
    },
    {
      icon: <Package className="w-8 h-8 text-indigo-600" />,
      title: "Easy Returns",
      description: "Hassle-free returns within 30 days.",
    },
  ];
  return (
    <section className="w-full ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {featuresData.map((feature, index) => (
            <div
              key={`feature-${index}`}
              className="flex flex-col items-center text-center border border-gray-200 rounded-lg p-6"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-foreground">
                {feature.title}
              </h3>
              <p className="text-gray-600 mt-2 dark:text-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
