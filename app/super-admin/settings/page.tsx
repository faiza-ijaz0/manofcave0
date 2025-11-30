'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Settings, User, Bell, Shield, Palette, Database, Mail, Phone, MapPin, Clock, Save, RefreshCw } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function SuperAdminSettings() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const [settings, setSettings] = useState({
    // General Settings
    businessName: "Luxury Barbershop Chain",
    businessEmail: "admin@luxurybarbershop.com",
    businessPhone: "+1 (555) 123-4567",
    businessAddress: "123 Main Street, Suite 100",
    businessCity: "New York",
    businessState: "NY",
    businessZip: "10001",
    timezone: "America/New_York",
    currency: "USD",

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    bookingReminders: true,
    paymentNotifications: true,
    systemAlerts: true,

    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90",
    loginAttempts: "5",

    // Appearance Settings
    theme: "luxury",
    primaryColor: "#1a1a1a",
    secondaryColor: "#d4af37",
    accentColor: "#8b4513",

    // System Settings
    autoBackup: true,
    backupFrequency: "daily",
    dataRetention: "365",
    maintenanceMode: false,
    debugMode: false
  });

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log('Settings saved:', settings);
  };

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
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
                  <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
                  <p className="text-sm text-gray-600">Configure system-wide settings and preferences</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
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
              <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="general" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    General
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger value="appearance" className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger value="system" className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    System
                  </TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general">
                  <Card>
                    <CardHeader>
                      <CardTitle>Business Information</CardTitle>
                      <CardDescription>Basic business details and contact information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="businessName">Business Name</Label>
                          <Input
                            id="businessName"
                            value={settings.businessName}
                            onChange={(e) => handleInputChange('businessName', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="businessEmail">Business Email</Label>
                          <Input
                            id="businessEmail"
                            type="email"
                            value={settings.businessEmail}
                            onChange={(e) => handleInputChange('businessEmail', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="businessPhone">Business Phone</Label>
                          <Input
                            id="businessPhone"
                            value={settings.businessPhone}
                            onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timezone">Timezone</Label>
                          <Select value={settings.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="America/New_York">Eastern Time</SelectItem>
                              <SelectItem value="America/Chicago">Central Time</SelectItem>
                              <SelectItem value="America/Denver">Mountain Time</SelectItem>
                              <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Business Address</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="businessAddress">Street Address</Label>
                            <Input
                              id="businessAddress"
                              value={settings.businessAddress}
                              onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="businessCity">City</Label>
                            <Input
                              id="businessCity"
                              value={settings.businessCity}
                              onChange={(e) => handleInputChange('businessCity', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="businessState">State</Label>
                            <Input
                              id="businessState"
                              value={settings.businessState}
                              onChange={(e) => handleInputChange('businessState', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="businessZip">ZIP Code</Label>
                            <Input
                              id="businessZip"
                              value={settings.businessZip}
                              onChange={(e) => handleInputChange('businessZip', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="currency">Currency</Label>
                          <Select value={settings.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD ($)</SelectItem>
                              <SelectItem value="EUR">EUR (€)</SelectItem>
                              <SelectItem value="GBP">GBP (£)</SelectItem>
                              <SelectItem value="CAD">CAD (C$)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Notification Settings */}
                <TabsContent value="notifications">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>Configure how and when you receive notifications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Email Notifications</Label>
                            <p className="text-sm text-gray-600">Receive notifications via email</p>
                          </div>
                          <Switch
                            checked={settings.emailNotifications}
                            onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>SMS Notifications</Label>
                            <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                          </div>
                          <Switch
                            checked={settings.smsNotifications}
                            onCheckedChange={(checked) => handleInputChange('smsNotifications', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Push Notifications</Label>
                            <p className="text-sm text-gray-600">Receive push notifications in browser</p>
                          </div>
                          <Switch
                            checked={settings.pushNotifications}
                            onCheckedChange={(checked) => handleInputChange('pushNotifications', checked)}
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Notification Types</h3>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Booking Reminders</Label>
                            <p className="text-sm text-gray-600">Notify about upcoming appointments</p>
                          </div>
                          <Switch
                            checked={settings.bookingReminders}
                            onCheckedChange={(checked) => handleInputChange('bookingReminders', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Payment Notifications</Label>
                            <p className="text-sm text-gray-600">Notify about payment activities</p>
                          </div>
                          <Switch
                            checked={settings.paymentNotifications}
                            onCheckedChange={(checked) => handleInputChange('paymentNotifications', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>System Alerts</Label>
                            <p className="text-sm text-gray-600">Notify about system issues and updates</p>
                          </div>
                          <Switch
                            checked={settings.systemAlerts}
                            onCheckedChange={(checked) => handleInputChange('systemAlerts', checked)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security">
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Configuration</CardTitle>
                      <CardDescription>Manage security settings and access controls</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Two-Factor Authentication</Label>
                            <p className="text-sm text-gray-600">Require 2FA for all admin accounts</p>
                          </div>
                          <Switch
                            checked={settings.twoFactorAuth}
                            onCheckedChange={(checked) => handleInputChange('twoFactorAuth', checked)}
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                          <Select value={settings.sessionTimeout} onValueChange={(value) => handleInputChange('sessionTimeout', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="15">15 minutes</SelectItem>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="60">1 hour</SelectItem>
                              <SelectItem value="120">2 hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                          <Select value={settings.passwordExpiry} onValueChange={(value) => handleInputChange('passwordExpiry', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30">30 days</SelectItem>
                              <SelectItem value="60">60 days</SelectItem>
                              <SelectItem value="90">90 days</SelectItem>
                              <SelectItem value="180">180 days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                          <Select value={settings.loginAttempts} onValueChange={(value) => handleInputChange('loginAttempts', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3">3 attempts</SelectItem>
                              <SelectItem value="5">5 attempts</SelectItem>
                              <SelectItem value="10">10 attempts</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Appearance Settings */}
                <TabsContent value="appearance">
                  <Card>
                    <CardHeader>
                      <CardTitle>Appearance & Branding</CardTitle>
                      <CardDescription>Customize the look and feel of your system</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="theme">Theme</Label>
                          <Select value={settings.theme} onValueChange={(value) => handleInputChange('theme', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="luxury">Luxury (Gold & Black)</SelectItem>
                              <SelectItem value="modern">Modern</SelectItem>
                              <SelectItem value="classic">Classic</SelectItem>
                              <SelectItem value="minimal">Minimal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Color Scheme</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="primaryColor">Primary Color</Label>
                            <Input
                              id="primaryColor"
                              type="color"
                              value={settings.primaryColor}
                              onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                              className="w-full h-10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="secondaryColor">Secondary Color</Label>
                            <Input
                              id="secondaryColor"
                              type="color"
                              value={settings.secondaryColor}
                              onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                              className="w-full h-10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="accentColor">Accent Color</Label>
                            <Input
                              id="accentColor"
                              type="color"
                              value={settings.accentColor}
                              onChange={(e) => handleInputChange('accentColor', e.target.value)}
                              className="w-full h-10"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* System Settings */}
                <TabsContent value="system">
                  <Card>
                    <CardHeader>
                      <CardTitle>System Configuration</CardTitle>
                      <CardDescription>Advanced system settings and maintenance options</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Automatic Backups</Label>
                            <p className="text-sm text-gray-600">Automatically backup system data</p>
                          </div>
                          <Switch
                            checked={settings.autoBackup}
                            onCheckedChange={(checked) => handleInputChange('autoBackup', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Maintenance Mode</Label>
                            <p className="text-sm text-gray-600">Put system in maintenance mode</p>
                          </div>
                          <Switch
                            checked={settings.maintenanceMode}
                            onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Debug Mode</Label>
                            <p className="text-sm text-gray-600">Enable detailed logging and debugging</p>
                          </div>
                          <Switch
                            checked={settings.debugMode}
                            onCheckedChange={(checked) => handleInputChange('debugMode', checked)}
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="backupFrequency">Backup Frequency</Label>
                          <Select value={settings.backupFrequency} onValueChange={(value) => handleInputChange('backupFrequency', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hourly">Hourly</SelectItem>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="dataRetention">Data Retention (days)</Label>
                          <Select value={settings.dataRetention} onValueChange={(value) => handleInputChange('dataRetention', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="90">90 days</SelectItem>
                              <SelectItem value="180">180 days</SelectItem>
                              <SelectItem value="365">1 year</SelectItem>
                              <SelectItem value="730">2 years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}