'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from "@/components/shared/Header";
import { BookingStepper } from "@/components/booking/BookingStepper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scissors, Star, Clock, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

function BookingContent() {
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get('service');
  const [selectedService, setSelectedService] = useState<string | null>(null);

  // Mock services data - in real app, this would come from API
  const services = [
    {
      id: "1",
      name: "Classic Haircut",
      price: 35,
      duration: "30 min",
      description: "Traditional cut with precision styling",
      category: "Haircuts & Styling",
      rating: 4.8,
      reviews: 124,
      icon: Scissors
    },
    {
      id: "2",
      name: "Premium Haircut & Style",
      price: 55,
      duration: "45 min",
      description: "Advanced styling with premium products",
      category: "Haircuts & Styling",
      rating: 4.9,
      reviews: 89,
      icon: Scissors
    },
    {
      id: "3",
      name: "Beard Trim & Shape",
      price: 25,
      duration: "20 min",
      description: "Precision beard trimming and shaping",
      category: "Beard Care",
      rating: 4.7,
      reviews: 156,
      icon: Star
    },
    {
      id: "4",
      name: "Hot Towel Shave",
      price: 45,
      duration: "30 min",
      description: "Traditional straight razor shave with hot towel",
      category: "Beard Care",
      rating: 4.9,
      reviews: 78,
      icon: Star
    },
    {
      id: "5",
      name: "Complete Grooming Package",
      price: 85,
      duration: "90 min",
      description: "Haircut, beard trim, and facial treatment",
      category: "Premium Packages",
      rating: 4.9,
      reviews: 134,
      icon: Scissors
    },
  ];

  useEffect(() => {
    if (preselectedService) {
      setSelectedService(preselectedService);
    }
  }, [preselectedService]);

  if (selectedService) {
    return (
      <div className="min-h-screen bg-background">
        <Header />

        <div className="pt-24 pb-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Button
                variant="outline"
                onClick={() => setSelectedService(null)}
                className="flex items-center gap-2"
              >
                ← Back to Services
              </Button>
              <div>
                <h1 className="text-3xl font-serif font-bold text-primary">
                  Book Your Appointment
                </h1>
                <p className="text-gray-600">
                  {services.find(s => s.id === selectedService)?.name}
                </p>
              </div>
            </div>

            <BookingStepper selectedServiceId={selectedService} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 bg-gradient-to-br from-primary via-primary to-secondary">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Book Your Premium Grooming Experience
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Choose from our range of professional services and schedule your appointment
          </p>
          <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
            <Link href="/services">
              View All Services
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Service Selection */}
        <div className="mb-12">
          <h2 className="text-3xl font-serif font-bold text-center text-primary mb-8">
            Choose Your Service
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card
                key={service.id}
                className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-secondary"
                onClick={() => setSelectedService(service.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                      <service.icon className="w-6 h-6 text-secondary" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {service.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-primary">{service.name}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {service.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-secondary text-secondary" />
                      {service.rating}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-secondary">${service.price}</span>
                    <span className="text-sm text-gray-500">({service.reviews} reviews)</span>
                  </div>
                  <Button className="w-full bg-secondary hover:bg-secondary/90 text-primary">
                    Select Service
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Popular Packages */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-serif font-bold text-center text-primary mb-6">
            Popular Packages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-secondary/20">
              <CardHeader>
                <CardTitle className="text-secondary">Complete Grooming Package</CardTitle>
                <CardDescription>Includes haircut, beard trim, and facial</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary mb-4">$85</div>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li>• Professional haircut (45 min)</li>
                  <li>• Beard trim & shape (20 min)</li>
                  <li>• Facial treatment (25 min)</li>
                  <li>• Premium products included</li>
                </ul>
                <Button
                  className="w-full bg-secondary hover:bg-secondary/90 text-primary"
                  onClick={() => setSelectedService("5")}
                >
                  Book Package
                </Button>
              </CardContent>
            </Card>

            <Card className="border-secondary/20">
              <CardHeader>
                <CardTitle className="text-secondary">Gentlemen's Day</CardTitle>
                <CardDescription>Ultimate grooming experience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary mb-4">$150</div>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li>• Premium haircut & styling (60 min)</li>
                  <li>• Hot towel shave (30 min)</li>
                  <li>• Scalp massage (25 min)</li>
                  <li>• Luxury products package</li>
                </ul>
                <Button
                  className="w-full bg-secondary hover:bg-secondary/90 text-primary"
                  onClick={() => setSelectedService("5")}
                >
                  Book Experience
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Booking() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingContent />
    </Suspense>
  );
}