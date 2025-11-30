'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/shared/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Scissors, Star, Clock, MapPin, Search, Filter } from 'lucide-react';

export default function ServicesPage() {
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - in real app, this would come from API
  const branches = [
    { id: 'all', name: 'All Branches' },
    { id: 'downtown', name: 'Downtown Premium' },
    { id: 'midtown', name: 'Midtown Elite' },
    { id: 'uptown', name: 'Uptown Luxury' },
    { id: 'suburban', name: 'Suburban Comfort' },
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'haircut', name: 'Haircuts & Styling' },
    { id: 'beard', name: 'Beard Care' },
    { id: 'facial', name: 'Facial Treatments' },
    { id: 'massage', name: 'Massage & Spa' },
    { id: 'packages', name: 'Premium Packages' },
  ];

  const services = [
    {
      id: 1,
      name: "Classic Haircut",
      category: "haircut",
      price: 35,
      duration: "30 min",
      description: "Traditional cut with precision styling",
      branches: ["downtown", "midtown", "uptown", "suburban"],
      rating: 4.8,
      reviews: 124,
      icon: Scissors
    },
    {
      id: 2,
      name: "Premium Haircut & Style",
      category: "haircut",
      price: 55,
      duration: "45 min",
      description: "Advanced styling with premium products",
      branches: ["downtown", "uptown"],
      rating: 4.9,
      reviews: 89,
      icon: Scissors
    },
    {
      id: 3,
      name: "Beard Trim & Shape",
      category: "beard",
      price: 25,
      duration: "20 min",
      description: "Precision beard trimming and shaping",
      branches: ["downtown", "midtown", "uptown", "suburban"],
      rating: 4.7,
      reviews: 156,
      icon: Star
    },
    {
      id: 4,
      name: "Hot Towel Shave",
      category: "beard",
      price: 45,
      duration: "30 min",
      description: "Traditional straight razor shave with hot towel",
      branches: ["downtown", "uptown"],
      rating: 4.9,
      reviews: 78,
      icon: Star
    },
    {
      id: 5,
      name: "Facial Treatment",
      category: "facial",
      price: 65,
      duration: "45 min",
      description: "Deep cleansing facial with premium products",
      branches: ["midtown", "uptown"],
      rating: 4.8,
      reviews: 92,
      icon: Clock
    },
    {
      id: 6,
      name: "Scalp Massage",
      category: "massage",
      price: 40,
      duration: "25 min",
      description: "Relaxing scalp and neck massage",
      branches: ["downtown", "midtown", "uptown"],
      rating: 4.6,
      reviews: 67,
      icon: Clock
    },
    {
      id: 7,
      name: "Complete Grooming Package",
      category: "packages",
      price: 85,
      duration: "90 min",
      description: "Haircut, beard trim, and facial treatment",
      branches: ["downtown", "uptown"],
      rating: 4.9,
      reviews: 134,
      icon: Scissors
    },
    {
      id: 8,
      name: "Executive Package",
      category: "packages",
      price: 120,
      duration: "120 min",
      description: "Complete grooming experience with massage",
      branches: ["uptown"],
      rating: 5.0,
      reviews: 45,
      icon: Star
    },
  ];

  const filteredServices = services.filter(service => {
    const matchesBranch = selectedBranch === 'all' || service.branches.includes(selectedBranch);
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 bg-gradient-to-br from-primary via-primary to-secondary">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Our Services
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Discover our complete range of professional grooming services
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map(branch => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredServices.map((service) => (
            <Card key={service.id} className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                    <service.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <Badge variant="secondary">
                    {categories.find(cat => cat.id === service.category)?.name}
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
                    {service.rating} ({service.reviews})
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-secondary">${service.price}</span>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    {service.branches.length} branches
                  </div>
                </div>
                <Button asChild className="w-full bg-secondary hover:bg-secondary/90 text-primary">
                  <Link href={`/booking?service=${service.id}`}>Book Now</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <Scissors className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No services found</h3>
            <p className="text-gray-500">Try adjusting your filters or search query</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-primary text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-serif font-bold mb-4">Ready to Book?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Experience our premium grooming services at any of our locations
          </p>
          <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-primary">
            <Link href="/booking">Book Your Appointment</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}