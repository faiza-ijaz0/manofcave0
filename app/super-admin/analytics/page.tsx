'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Download, RefreshCw, Building, PieChart, Activity } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function SuperAdminAnalytics() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const [timeRange, setTimeRange] = useState('30d');

  // Mock analytics data across all branches
  const analytics = {
    overview: {
      totalRevenue: 156780,
      totalBookings: 3875,
      totalCustomers: 2341,
      avgRating: 4.7,
      revenueChange: 18.5,
      bookingsChange: 12.3,
      customersChange: 22.1,
      ratingChange: 0.3
    },
    branchPerformance: [
      { name: "Downtown Premium", revenue: 45230, bookings: 1124, customers: 687, rating: 4.9, growth: 15.2 },
      { name: "Midtown Elite", revenue: 38750, bookings: 956, customers: 583, rating: 4.8, growth: 12.8 },
      { name: "Uptown Luxury", revenue: 42380, bookings: 1048, customers: 639, rating: 4.9, growth: 18.9 },
      { name: "Suburban Comfort", revenue: 15620, bookings: 387, customers: 236, rating: 4.6, growth: 8.4 },
      { name: "Westside Modern", revenue: 9870, bookings: 244, customers: 149, rating: 4.5, growth: 6.1 },
      { name: "Eastside Classic", revenue: 4930, bookings: 122, customers: 74, rating: 4.4, growth: 3.2 },
      { name: "Northgate Plaza", revenue: 2980, bookings: 74, customers: 45, rating: 4.3, growth: -2.1 },
      { name: "Southpoint Mall", revenue: 2020, bookings: 50, customers: 30, rating: 4.2, growth: -5.3 }
    ],
    revenueByService: [
      { service: "Classic Haircut", revenue: 54875, bookings: 1568, percentage: 35.0 },
      { service: "Beard Trim", revenue: 30625, bookings: 1225, percentage: 19.5 },
      { service: "Hair Color", revenue: 34300, bookings: 403, percentage: 21.9 },
      { service: "Hot Towel Shave", revenue: 25375, bookings: 563, percentage: 16.2 },
      { service: "Hair Wash & Style", revenue: 11605, bookings: 290, percentage: 7.4 }
    ],
    monthlyTrends: [
      { month: "Aug", revenue: 12450, bookings: 308 },
      { month: "Sep", revenue: 13890, bookings: 343 },
      { month: "Oct", revenue: 15230, bookings: 377 },
      { month: "Nov", revenue: 16890, bookings: 417 },
      { month: "Dec", revenue: 18320, bookings: 453 }
    ],
    topServices: [
      { name: "Classic Haircut", bookings: 1568, revenue: 54875, growth: 12.5 },
      { name: "Beard Trim & Shape", bookings: 1225, revenue: 30625, growth: 18.3 },
      { name: "Hair Color", bookings: 403, revenue: 34300, growth: 8.7 },
      { name: "Hot Towel Shave", bookings: 563, revenue: 25375, growth: 15.2 },
      { name: "Hair Wash & Style", bookings: 290, revenue: 11605, growth: 22.1 }
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <ProtectedRoute requiredRole="super_admin">
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <AdminSidebar role="super_admin" onLogout={handleLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main Content */}
        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          sidebarOpen ? "lg:ml-64" : "lg:ml-0"
        )}>
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="flex items-center justify-between px-4 py-4 lg:px-8">
              <div className="flex items-center gap-4">
                <AdminMobileSidebar role="super_admin" onLogout={handleLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)} />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">System Analytics</h1>
                  <p className="text-sm text-gray-600">Performance across all branches</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline">
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600 hidden sm:block">Welcome, {user?.email}</span>
                <Button variant="outline" onClick={handleLogout} className="hidden sm:flex">
                  Logout
                </Button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <div className="p-4 lg:p-8">
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(analytics.overview.totalRevenue)}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">{formatPercentage(analytics.overview.revenueChange)}</span> from last period
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.overview.totalBookings.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">{formatPercentage(analytics.overview.bookingsChange)}</span> from last period
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.overview.totalCustomers.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">{formatPercentage(analytics.overview.customersChange)}</span> from last period
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.overview.avgRating.toFixed(1)}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">{formatPercentage(analytics.overview.ratingChange)}</span> from last period
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Branch Performance */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Branch Performance</CardTitle>
                    <CardDescription>Revenue and growth by location</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.branchPerformance.map((branch, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{branch.name}</span>
                              <span className="text-sm text-gray-600">{formatCurrency(branch.revenue)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-secondary h-2 rounded-full"
                                style={{ width: `${(branch.revenue / Math.max(...analytics.branchPerformance.map(b => b.revenue))) * 100}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>{branch.bookings} bookings</span>
                              <span className={branch.growth > 0 ? 'text-green-600' : 'text-red-600'}>
                                {formatPercentage(branch.growth)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Trends</CardTitle>
                    <CardDescription>Revenue and bookings over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.monthlyTrends.map((month, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium w-12">{month.month}</span>
                          <div className="flex-1 mx-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${(month.revenue / Math.max(...analytics.monthlyTrends.map(m => m.revenue))) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{formatCurrency(month.revenue)}</div>
                            <div className="text-xs text-gray-500">{month.bookings} bookings</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Service Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Services</CardTitle>
                    <CardDescription>Most popular services across all branches</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.topServices.map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white font-semibold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{service.name}</p>
                              <p className="text-sm text-gray-600">{service.bookings} bookings</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(service.revenue)}</p>
                            <p className="text-sm text-green-600">{formatPercentage(service.growth)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Service Distribution</CardTitle>
                    <CardDescription>Revenue breakdown by service type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.revenueByService.map((service, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{service.service}</span>
                              <span className="text-sm text-gray-600">{formatCurrency(service.revenue)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${service.percentage}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>{service.bookings} bookings</span>
                              <span>{service.percentage}% of total</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}