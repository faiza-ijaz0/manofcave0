import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scissors, MapPin, Star, Clock, Phone, Mail } from "lucide-react";
import { Header } from "@/components/shared/Header";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary to-secondary animate-fade-in">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center text-white px-4 animate-slide-up">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
            Premium Cuts
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto font-light">
            Experience luxury grooming at our 8 locations across the city
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-primary font-semibold px-8 py-3">
              Book Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3">
              Find Location
            </Button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
          <Scissors className="w-8 h-8 text-white" />
        </div>
      </section>

      {/* Region Selection */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12 text-primary">
            Choose Your Location
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Downtown", branches: 2, image: "/api/placeholder/300/200" },
              { name: "Midtown", branches: 2, image: "/api/placeholder/300/200" },
              { name: "Uptown", branches: 2, image: "/api/placeholder/300/200" },
              { name: "Suburbs", branches: 2, image: "/api/placeholder/300/200" },
            ].map((region) => (
              <Card key={region.name} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-full h-32 bg-gray-200 rounded-md mb-4"></div>
                  <CardTitle className="text-center text-primary">{region.name}</CardTitle>
                  <CardDescription className="text-center">{region.branches} Branches</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 px-4 bg-gray-50 animate-fade-in">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4 animate-slide-up">
              Featured Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional grooming services tailored to your style
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {[
              { name: "Haircut & Styling", price: "From $35", description: "Professional cuts with modern techniques", icon: Scissors, duration: "30-45 min" },
              { name: "Beard Grooming", price: "From $25", description: "Precision beard trimming and styling", icon: Star, duration: "20-30 min" },
              { name: "Premium Packages", price: "From $65", description: "Complete grooming experience", icon: Clock, duration: "60-90 min" },
            ].map((service, index) => (
              <Card key={service.name} className="text-center hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                    <service.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-secondary text-xl">{service.name}</CardTitle>
                  <CardDescription className="text-accent font-semibold text-lg">{service.price}</CardDescription>
                  <p className="text-sm text-gray-500 mt-1">{service.duration}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <Button asChild className="w-full bg-secondary hover:bg-secondary/90 text-primary">
                    <Link href="/booking">Book Now</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button asChild size="lg" variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-primary">
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 bg-white animate-fade-in">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-primary mb-4 animate-slide-up">
              Premium Beauty Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional-grade products for your grooming routine
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { name: "Luxury Shampoo", price: "$45", description: "Organic ingredients for healthy hair", category: "Hair Care" },
              { name: "Beard Oil", price: "$35", description: "Nourishing blend for beard care", category: "Beard Care" },
              { name: "Styling Wax", price: "$28", description: "Professional hold and shine", category: "Styling" },
              { name: "Aftershave Balm", price: "$40", description: "Soothing and moisturizing", category: "Skin Care" },
            ].map((product, index) => (
              <Card key={product.name} className="text-center hover:shadow-lg transition-shadow duration-300 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="w-full h-32 bg-gradient-to-br from-secondary to-accent rounded-md mb-4 animate-float"></div>
                  <Badge variant="secondary" className="mb-2">{product.category}</Badge>
                  <CardTitle className="text-primary text-lg">{product.name}</CardTitle>
                  <CardDescription className="text-secondary font-semibold">{product.price}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">{product.description}</p>
                  <Button asChild variant="outline" className="w-full border-secondary text-secondary hover:bg-secondary hover:text-primary">
                    <Link href="/products">View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button asChild size="lg" variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-primary">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-white animate-fade-in">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12 text-primary animate-slide-up">
            What Our Clients Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "John D.", rating: 5, text: "Best barber in town! Always perfect cuts." },
              { name: "Mike R.", rating: 5, text: "Professional service and great atmosphere." },
              { name: "Alex T.", rating: 5, text: "Worth every penny. Highly recommend!" },
            ].map((testimonial, index) => (
              <Card key={testimonial.name} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-secondary text-secondary animate-float" />
                    ))}
                  </div>
                  <CardDescription>"{testimonial.text}"</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-primary">- {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-serif font-bold mb-4">Premium Cuts</h3>
              <p className="text-gray-300">Luxury grooming for discerning gentlemen.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Haircuts</li>
                <li>Beard Grooming</li>
                <li>Premium Packages</li>
                <li>Consultations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Locations</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Downtown</li>
                <li>Midtown</li>
                <li>Uptown</li>
                <li>Suburbs</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>info@premiumcuts.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>8 Locations Citywide</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Premium Cuts. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
