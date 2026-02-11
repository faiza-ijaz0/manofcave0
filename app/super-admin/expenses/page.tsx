'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Calendar, 
  BarChart3, 
  Download,
  RefreshCw,
  Building2,
  ShoppingCart,
  Percent,
  FileText,
  PieChart,
  Plus,
  X,
  Save,
  Trash2,
  Edit,
  Users,
  Clock,
  Activity,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ProtectedRoute from "@/components/ProtectedRoute";
import { AdminSidebar, AdminMobileSidebar } from "@/components/admin/AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  getDocs, 
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import {
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Firebase Data Interfaces
interface Product {
  id: string;
  name: string;
  price: number;
  cost: number;
  category: string;
  branchNames: string[];
  totalStock: number;
  totalSold: number;
  revenue: number;
  createdAt: any;
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  category: string;
  branchNames: string[];
  totalBookings: number;
  revenue: number;
  createdAt: any;
}

interface Booking {
  id: string;
  serviceName: string;
  servicePrice: number;
  totalAmount: number;
  customerName: string;
  branch: string;
  date: string;
  time: string;
  status: string;
  paymentStatus: string;
  createdAt: any;
}

// Manual Expense Interface
interface ManualExpense {
  id: string;
  title: string;
  description: string;
  amount: number;
  category: string;
  branch: string;
  date: string;
  paymentMethod: string;
  status: 'paid' | 'pending' | 'cancelled';
  createdAt: any;
  updatedAt: any;
  createdBy: string;
  notes?: string;
}

// Branch Interface
interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  status: string;
  openingTime: string;
  closingTime: string;
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  createdAt: any;
}

interface ExpenseSummary {
  totalManualExpenses: number;
  totalSystemExpenses: number;
  totalSystemRevenue: number;
  totalSystemProfit: number;
  profitMargin: number;
  monthWiseData: Array<{
    month: string;
    systemRevenue: number;
    systemExpenses: number;
    manualExpenses: number;
    profit: number;
  }>;
  categoryWiseExpenses: Array<{
    category: string;
    systemAmount: number;
    manualAmount: number;
    totalAmount: number;
  }>;
}

// Expense Categories
const EXPENSE_CATEGORIES = [
  'Salaries',
  'Rent',
  'Utilities',
  'Marketing',
  'Supplies',
  'Maintenance',
  'Travel',
  'Training',
  'Software',
  'Hardware',
  'Office Supplies',
  'Insurance',
  'Taxes',
  'Other'
];

const PAYMENT_METHODS = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'Check',
  'Digital Wallet',
  'Other'
];

const STATUS_OPTIONS = ['paid', 'pending', 'cancelled'] as const;

// AED Currency Formatter
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 2
  }).format(amount);
};

// AED Tooltip Formatter for Charts
const aedTooltipFormatter = (value: number) => {
  return formatCurrency(value);
};

// AED YAxis Formatter for Charts
const aedYAxisFormatter = (value: number) => {
  return `AED ${value}`;
};

export default function SuperAdminExpensesPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [manualExpenses, setManualExpenses] = useState<ManualExpense[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  
  // Summary State
  const [expenseSummary, setExpenseSummary] = useState<ExpenseSummary>({
    totalManualExpenses: 0,
    totalSystemExpenses: 0,
    totalSystemRevenue: 0,
    totalSystemProfit: 0,
    profitMargin: 0,
    monthWiseData: [],
    categoryWiseExpenses: []
  });

  // Manual Expense Modal State
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ManualExpense | null>(null);
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    description: '',
    amount: 0,
    category: EXPENSE_CATEGORIES[0],
    branch: 'all',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: PAYMENT_METHODS[0],
    status: 'paid' as 'paid' | 'pending' | 'cancelled',
    notes: ''
  });

  // Filter States
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Fetch all data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      await Promise.all([
        fetchProducts(),
        fetchServices(),
        fetchBookings(),
        fetchManualExpenses(),
        fetchBranches()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch Branches - Fixed query to avoid composite index error
  const fetchBranches = async () => {
    try {
      const branchesRef = collection(db, 'branches');
      // Simple query without composite filters - will fetch all and filter locally
      const q = query(branchesRef);
      const querySnapshot = await getDocs(q);
      
      const branchesData: Branch[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Filter active branches locally
        if (data.status === 'active') {
          branchesData.push({
            id: doc.id,
            name: data.name || '',
            address: data.address || '',
            city: data.city || '',
            country: data.country || '',
            phone: data.phone || '',
            email: data.email || '',
            status: data.status || 'active',
            openingTime: data.openingTime || '',
            closingTime: data.closingTime || '',
            managerName: data.managerName || '',
            managerEmail: data.managerEmail || '',
            managerPhone: data.managerPhone || '',
            createdAt: data.createdAt
          });
        }
      });
      
      // Sort branches by name locally
      branchesData.sort((a, b) => a.name.localeCompare(b.name));
      
      setBranches(branchesData);
      console.log('Branches fetched:', branchesData.length);
    } catch (error) {
      console.error('Error fetching branches:', error);
      // Fallback: Create some default branches if fetch fails
      setBranches([
        { id: '1', name: 'Main Branch', address: '', city: '', country: '', phone: '', email: '', status: 'active', openingTime: '', closingTime: '', managerName: '', managerEmail: '', managerPhone: '', createdAt: null },
        { id: '2', name: 'Dubai Branch', address: '', city: '', country: '', phone: '', email: '', status: 'active', openingTime: '', closingTime: '', managerName: '', managerEmail: '', managerPhone: '', createdAt: null }
      ]);
    }
  };

  // Fetch Manual Expenses
  const fetchManualExpenses = async () => {
    try {
      const expensesRef = collection(db, 'manualExpenses');
      const q = query(expensesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const expensesData: ManualExpense[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        expensesData.push({
          id: doc.id,
          title: data.title || '',
          description: data.description || '',
          amount: data.amount || 0,
          category: data.category || EXPENSE_CATEGORIES[0],
          branch: data.branch || '',
          date: data.date || new Date().toISOString().split('T')[0],
          paymentMethod: data.paymentMethod || PAYMENT_METHODS[0],
          status: data.status || 'paid',
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          createdBy: data.createdBy || '',
          notes: data.notes || ''
        });
      });
      
      setManualExpenses(expensesData);
    } catch (error) {
      console.error('Error fetching manual expenses:', error);
    }
  };

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const productsRef = collection(db, 'products');
      const q = query(productsRef, where('status', '==', 'active'));
      const querySnapshot = await getDocs(q);
      
      const productsData: Product[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        productsData.push({
          id: doc.id,
          name: data.name || '',
          price: data.price || 0,
          cost: data.cost || 0,
          category: data.category || '',
          branchNames: data.branchNames || [],
          totalStock: data.totalStock || 0,
          totalSold: data.totalSold || 0,
          revenue: data.revenue || 0,
          createdAt: data.createdAt
        });
      });
      
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Fetch Services
  const fetchServices = async () => {
    try {
      const servicesRef = collection(db, 'services');
      const q = query(servicesRef, where('status', '==', 'active'));
      const querySnapshot = await getDocs(q);
      
      const servicesData: Service[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        servicesData.push({
          id: doc.id,
          name: data.name || '',
          price: data.price || 0,
          duration: data.duration || 0,
          category: data.category || '',
          branchNames: data.branchNames || [],
          totalBookings: data.totalBookings || 0,
          revenue: data.revenue || 0,
          createdAt: data.createdAt
        });
      });
      
      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  // Fetch Bookings
  const fetchBookings = async () => {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const bookingsData: Booking[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        bookingsData.push({
          id: doc.id,
          serviceName: data.serviceName || '',
          servicePrice: data.servicePrice || 0,
          totalAmount: data.totalAmount || 0,
          customerName: data.customerName || '',
          branch: data.branch || '',
          date: data.date || '',
          time: data.time || '',
          status: data.status || '',
          paymentStatus: data.paymentStatus || '',
          createdAt: data.createdAt
        });
      });
      
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  // Manual Expense Functions
  const openExpenseModal = (expense?: ManualExpense) => {
    if (expense) {
      setEditingExpense(expense);
      setExpenseForm({
        title: expense.title,
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        branch: expense.branch || 'all',
        date: expense.date,
        paymentMethod: expense.paymentMethod,
        status: expense.status,
        notes: expense.notes || ''
      });
    } else {
      setEditingExpense(null);
      setExpenseForm({
        title: '',
        description: '',
        amount: 0,
        category: EXPENSE_CATEGORIES[0],
        branch: 'all',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: PAYMENT_METHODS[0],
        status: 'paid',
        notes: ''
      });
    }
    setShowExpenseModal(true);
  };

  const closeExpenseModal = () => {
    setShowExpenseModal(false);
    setEditingExpense(null);
  };

  const handleExpenseFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setExpenseForm(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setExpenseForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const submitManualExpense = async () => {
    if (!expenseForm.title.trim() || expenseForm.amount <= 0) {
      alert('Please enter a valid title and amount');
      return;
    }

    try {
      const expenseData = {
        ...expenseForm,
        branch: expenseForm.branch === 'all' ? '' : expenseForm.branch,
        createdBy: user?.email || 'super_admin',
        createdAt: editingExpense ? editingExpense.createdAt : serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      if (editingExpense) {
        await updateDoc(doc(db, 'manualExpenses', editingExpense.id), expenseData);
      } else {
        await addDoc(collection(db, 'manualExpenses'), expenseData);
      }

      await fetchManualExpenses();
      closeExpenseModal();
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Failed to save expense. Please try again.');
    }
  };

  const deleteManualExpense = async (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteDoc(doc(db, 'manualExpenses', id));
        await fetchManualExpenses();
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Failed to delete expense.');
      }
    }
  };

  // Calculate expense summary
  useEffect(() => {
    calculateExpenseSummary();
  }, [products, services, bookings, manualExpenses, selectedBranch]);

  const calculateExpenseSummary = () => {
    // Calculate System Revenue (from completed bookings)
    const completedBookings = bookings.filter(b => b.status === 'completed' || b.paymentStatus === 'completed');
    const totalSystemRevenue = completedBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);

    // Calculate System Expenses (from products cost)
    const totalProductsCost = products.reduce((sum, product) => 
      sum + ((product.cost || 0) * (product.totalStock || 0)), 0
    );

    // Calculate total manual expenses
    const totalManualExpenses = manualExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

    // Total system expenses (products cost)
    const totalSystemExpenses = totalProductsCost;

    // Calculate profit
    const totalSystemProfit = totalSystemRevenue - totalSystemExpenses - totalManualExpenses;
    const profitMargin = totalSystemRevenue > 0 ? (totalSystemProfit / totalSystemRevenue) * 100 : 0;

    // Generate month-wise data
    const monthWiseData = generateMonthWiseData(completedBookings, products, manualExpenses);
    
    // Generate category-wise expenses
    const categoryWiseExpenses = generateCategoryWiseExpenses(products, manualExpenses);

    setExpenseSummary({
      totalManualExpenses,
      totalSystemExpenses,
      totalSystemRevenue,
      totalSystemProfit,
      profitMargin,
      monthWiseData,
      categoryWiseExpenses
    });
  };

  const generateMonthWiseData = (completedBookings: Booking[], products: Product[], manualExpenses: ManualExpense[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    return months.map(month => {
      const monthIndex = months.indexOf(month);
      const monthStart = new Date(currentYear, monthIndex, 1);
      const monthEnd = new Date(currentYear, monthIndex + 1, 0);
      
      // Revenue for this month
      const monthRevenue = completedBookings
        .filter(b => {
          const bookingDate = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          return bookingDate >= monthStart && bookingDate <= monthEnd;
        })
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

      // Manual expenses for this month
      const monthManualExpenses = manualExpenses
        .filter(e => {
          const expenseDate = new Date(e.date);
          return expenseDate >= monthStart && expenseDate <= monthEnd;
        })
        .reduce((sum, e) => sum + e.amount, 0);

      // System expenses (distribute products cost evenly across months)
      const monthSystemExpenses = expenseSummary.totalSystemExpenses / 12;

      const profit = monthRevenue - monthSystemExpenses - monthManualExpenses;
      
      return {
        month,
        systemRevenue: parseFloat(monthRevenue.toFixed(2)),
        systemExpenses: parseFloat(monthSystemExpenses.toFixed(2)),
        manualExpenses: parseFloat(monthManualExpenses.toFixed(2)),
        profit: parseFloat(profit.toFixed(2))
      };
    });
  };

  const generateCategoryWiseExpenses = (products: Product[], manualExpenses: ManualExpense[]) => {
    const categoryMap = new Map<string, { systemAmount: number; manualAmount: number }>();

    // Add system expenses (products) by category
    products.forEach(product => {
      const category = product.category || 'Uncategorized';
      const existing = categoryMap.get(category) || { systemAmount: 0, manualAmount: 0 };
      const productCost = (product.cost || 0) * (product.totalStock || 0);
      existing.systemAmount += productCost;
      categoryMap.set(category, existing);
    });

    // Add manual expenses by category
    manualExpenses.forEach(expense => {
      const category = expense.category || 'Other';
      const existing = categoryMap.get(category) || { systemAmount: 0, manualAmount: 0 };
      existing.manualAmount += expense.amount;
      categoryMap.set(category, existing);
    });

    // Convert to array and calculate totals
    return Array.from(categoryMap.entries()).map(([category, amounts]) => ({
      category,
      systemAmount: parseFloat(amounts.systemAmount.toFixed(2)),
      manualAmount: parseFloat(amounts.manualAmount.toFixed(2)),
      totalAmount: parseFloat((amounts.systemAmount + amounts.manualAmount).toFixed(2))
    })).sort((a, b) => b.totalAmount - a.totalAmount);
  };

  // Get unique branch names from various sources
  const getBranchOptions = () => {
    // First, use branches from branches collection
    if (branches.length > 0) {
      return branches.map(branch => branch.name);
    }
    
    // Fallback: collect from other sources
    const allBranches = new Set<string>();
    
    // Add from products
    products.forEach(product => {
      if (product.branchNames && Array.isArray(product.branchNames)) {
        product.branchNames.forEach(branch => allBranches.add(branch));
      }
    });
    
    // Add from services
    services.forEach(service => {
      if (service.branchNames && Array.isArray(service.branchNames)) {
        service.branchNames.forEach(branch => allBranches.add(branch));
      }
    });
    
    // Add from bookings
    bookings.forEach(booking => {
      if (booking.branch) {
        allBranches.add(booking.branch);
      }
    });
    
    // Add from manual expenses
    manualExpenses.forEach(expense => {
      if (expense.branch) {
        allBranches.add(expense.branch);
      }
    });
    
    return Array.from(allBranches).filter(branch => branch.trim() !== '');
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <ProtectedRoute requiredRole="super_admin">
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <AdminSidebar
          role="super_admin"
          onLogout={handleLogout}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out min-h-0">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 shrink-0">
            <div className="flex items-center justify-between px-4 py-4 lg:px-8">
              <div className="flex items-center gap-4">
                <AdminMobileSidebar
                  role="super_admin"
                  onLogout={handleLogout}
                  isOpen={sidebarOpen}
                  onToggle={() => setSidebarOpen(!sidebarOpen)}
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Expense Management</h1>
                  <p className="text-sm text-gray-600">Track and manage all expenses in AED</p>
                </div>
              </div>
              
              <Button
                onClick={() => openExpenseModal()}
                className="bg-blue-600 hover:bg-blue-700 rounded-lg px-6 py-2 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Manual Expense</span>
              </Button>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-auto p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {/* Filters */}
              <div className="flex flex-col lg:flex-row gap-4 mb-8">
                <div className="flex-1 flex flex-wrap gap-2">
                  <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger className="w-48">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <SelectValue placeholder="Select Branch" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Branches</SelectItem>
                      {branches.length > 0 ? (
                        branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.name}>
                            {branch.name}
                          </SelectItem>
                        ))
                      ) : (
                        // Fallback if branches not loaded
                        getBranchOptions().map((branch, index) => (
                          <SelectItem key={index} value={branch}>
                            {branch}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                      className="w-40"
                    />
                    <Input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                      className="w-40"
                    />
                  </div>
                </div>

              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="system">System Data</TabsTrigger>
                  <TabsTrigger value="manual">Manual Expenses</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">System Revenue</p>
                            <p className="text-2xl font-bold text-green-600">
                              {formatCurrency(expenseSummary.totalSystemRevenue)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {bookings.filter(b => b.status === 'completed' || b.paymentStatus === 'completed').length} completed bookings
                            </p>
                          </div>
                          <DollarSign className="w-10 h-10 text-green-100" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">System Expenses</p>
                            <p className="text-2xl font-bold text-blue-600">
                              {formatCurrency(expenseSummary.totalSystemExpenses)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {products.length} products inventory
                            </p>
                          </div>
                          <ShoppingCart className="w-10 h-10 text-blue-100" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Manual Expenses</p>
                            <p className="text-2xl font-bold text-orange-600">
                              {formatCurrency(expenseSummary.totalManualExpenses)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {manualExpenses.length} manual entries
                            </p>
                          </div>
                          <FileText className="w-10 h-10 text-orange-100" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Net Profit</p>
                            <p className={cn(
                              "text-2xl font-bold",
                              expenseSummary.totalSystemProfit >= 0 ? "text-green-600" : "text-red-600"
                            )}>
                              {formatCurrency(expenseSummary.totalSystemProfit)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Margin: {expenseSummary.profitMargin.toFixed(2)}%
                            </p>
                          </div>
                          <Activity className="w-10 h-10 text-green-100" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          Monthly Performance (AED)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={expenseSummary.monthWiseData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis tickFormatter={aedYAxisFormatter} />
                              <Tooltip formatter={aedTooltipFormatter} />
                              <Legend />
                              <Bar dataKey="systemRevenue" fill="#10B981" name="Revenue (AED)" />
                              <Bar dataKey="profit" fill="#3B82F6" name="Profit (AED)" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <PieChart className="w-5 h-5" />
                          Expense Distribution (AED)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={[
                                  { name: 'System Expenses', value: expenseSummary.totalSystemExpenses },
                                  { name: 'Manual Expenses', value: expenseSummary.totalManualExpenses }
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                <Cell fill="#3B82F6" />
                                <Cell fill="#F59E0B" />
                              </Pie>
                              <Tooltip formatter={aedTooltipFormatter} />
                              <Legend />
                            </RechartsPieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Category-wise Expenses */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Category-wise Expenses (AED)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">System Expenses (AED)</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Manual Expenses (AED)</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total (AED)</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Percentage</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {expenseSummary.categoryWiseExpenses.map((category) => (
                              <tr key={category.category} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium">{category.category}</td>
                                <td className="px-4 py-3 text-blue-600">
                                  {formatCurrency(category.systemAmount)}
                                </td>
                                <td className="px-4 py-3 text-orange-600">
                                  {formatCurrency(category.manualAmount)}
                                </td>
                                <td className="px-4 py-3 font-bold">
                                  {formatCurrency(category.totalAmount)}
                                </td>
                                <td className="px-4 py-3">
                                  {((category.totalAmount / (expenseSummary.totalSystemExpenses + expenseSummary.totalManualExpenses)) * 100).toFixed(1)}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* System Data Tab */}
                <TabsContent value="system" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Products Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Package className="w-5 h-5" />
                          Products Inventory (AED)
                          <Badge variant="secondary" className="ml-2">
                            {products.length}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Total Inventory Cost: {formatCurrency(products.reduce((sum, p) => sum + ((p.cost || 0) * (p.totalStock || 0)), 0))}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {products.slice(0, 10).map((product) => (
                            <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-gray-600">{product.category}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">{formatCurrency((product.cost || 0) * (product.totalStock || 0))}</p>
                                <p className="text-sm text-gray-600">Stock: {product.totalStock}</p>
                              </div>
                            </div>
                          ))}
                          {products.length > 10 && (
                            <p className="text-center text-sm text-gray-500">
                              Showing 10 of {products.length} products
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Services Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ShoppingCart className="w-5 h-5" />
                          Services (AED)
                          <Badge variant="secondary" className="ml-2">
                            {services.length}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Total Revenue: {formatCurrency(services.reduce((sum, s) => sum + (s.revenue || 0), 0))}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {services.slice(0, 10).map((service) => (
                            <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium">{service.name}</p>
                                <p className="text-sm text-gray-600">{service.category}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">{formatCurrency(service.price)}</p>
                                <p className="text-sm text-gray-600">Bookings: {service.totalBookings}</p>
                              </div>
                            </div>
                          ))}
                          {services.length > 10 && (
                            <p className="text-center text-sm text-gray-500">
                              Showing 10 of {services.length} services
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Bookings Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Recent Bookings (AED)
                        <Badge variant="secondary" className="ml-2">
                          {bookings.filter(b => b.status === 'completed' || b.paymentStatus === 'completed').length} completed
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Total Revenue: {formatCurrency(bookings.filter(b => b.status === 'completed' || b.paymentStatus === 'completed').reduce((sum, b) => sum + (b.totalAmount || 0), 0))}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Customer</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Service</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Branch</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount (AED)</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {bookings
                              .filter(b => b.status === 'completed' || b.paymentStatus === 'completed')
                              .slice(0, 10)
                              .map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-3">
                                    <p className="font-medium">{booking.customerName}</p>
                                  </td>
                                  <td className="px-4 py-3">{booking.serviceName}</td>
                                  <td className="px-4 py-3">{booking.branch}</td>
                                  <td className="px-4 py-3 font-bold text-green-600">
                                    {formatCurrency(booking.totalAmount)}
                                  </td>
                                  <td className="px-4 py-3">
                                    <Badge className={cn(
                                      "rounded-full",
                                      (booking.status === 'completed' || booking.paymentStatus === 'completed') 
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                    )}>
                                      {booking.status || booking.paymentStatus}
                                    </Badge>
                                  </td>
                                </tr>
                              ))
                            }
                          </tbody>
                        </table>
                        {bookings.filter(b => b.status === 'completed' || b.paymentStatus === 'completed').length > 10 && (
                          <p className="text-center text-sm text-gray-500 mt-4">
                            Showing 10 of {bookings.filter(b => b.status === 'completed' || b.paymentStatus === 'completed').length} completed bookings
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Manual Expenses Tab */}
                <TabsContent value="manual" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Manual Expenses (AED)
                        <Badge variant="secondary" className="ml-2">
                          {manualExpenses.length}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Total Amount: {formatCurrency(expenseSummary.totalManualExpenses)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Title</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount (AED)</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {manualExpenses.length === 0 ? (
                              <tr>
                                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                  No manual expenses found. Click "Add Manual Expense" to add one.
                                </td>
                              </tr>
                            ) : (
                              manualExpenses.map((expense) => (
                                <tr key={expense.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-3">
                                    <p className="font-medium">{expense.title}</p>
                                  </td>
                                  <td className="px-4 py-3">
                                    <p className="text-sm text-gray-600 max-w-xs truncate">{expense.description || '-'}</p>
                                  </td>
                                  <td className="px-4 py-3 font-bold text-orange-600">
                                    {formatCurrency(expense.amount)}
                                  </td>
                                  <td className="px-4 py-3">
                                    <Badge variant="outline">{expense.category}</Badge>
                                  </td>
                                  <td className="px-4 py-3">{expense.date}</td>
                                  <td className="px-4 py-3">
                                    <Badge className={cn(
                                      "rounded-full",
                                      expense.status === 'paid' ? "bg-green-100 text-green-700" :
                                      expense.status === 'pending' ? "bg-yellow-100 text-yellow-700" :
                                      "bg-red-100 text-red-700"
                                    )}>
                                      {expense.status}
                                    </Badge>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => openExpenseModal(expense)}
                                        className="h-8 px-3"
                                      >
                                        <Edit className="w-3 h-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => deleteManualExpense(expense.id)}
                                        className="h-8 px-3"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50" onClick={closeExpenseModal} />
          <div className="absolute inset-y-0 right-0 flex max-w-full">
            <div className="relative w-screen max-w-md">
              <div className="flex h-full flex-col bg-white shadow-xl">
                <div className="bg-blue-600 text-white px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                      {editingExpense ? 'Edit Manual Expense' : 'Add Manual Expense'}
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={closeExpenseModal}
                      className="text-white hover:bg-white/20"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Expense Title *</label>
                      <Input
                        name="title"
                        value={expenseForm.title}
                        onChange={handleExpenseFormChange}
                        placeholder="Enter expense title"
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        name="description"
                        value={expenseForm.description}
                        onChange={handleExpenseFormChange}
                        placeholder="Enter expense description"
                        className="w-full min-h-[80px] border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Amount (AED) *</label>
                        <Input
                          type="number"
                          name="amount"
                          value={expenseForm.amount}
                          onChange={handleExpenseFormChange}
                          placeholder="0.00"
                          className="w-full"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Date *</label>
                        <Input
                          type="date"
                          name="date"
                          value={expenseForm.date}
                          onChange={handleExpenseFormChange}
                          className="w-full"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Category *</label>
                      <Select
                        value={expenseForm.category}
                        onValueChange={(value) => handleSelectChange('category', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {EXPENSE_CATEGORIES.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Branch</label>
                        <Select
                          value={expenseForm.branch}
                          onValueChange={(value) => handleSelectChange('branch', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select branch" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Branches</SelectItem>
                            {branches.map((branch) => (
                              <SelectItem key={branch.id} value={branch.name}>
                                {branch.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Payment Method *</label>
                        <Select
                          value={expenseForm.paymentMethod}
                          onValueChange={(value) => handleSelectChange('paymentMethod', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            {PAYMENT_METHODS.map(method => (
                              <SelectItem key={method} value={method}>
                                {method}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Status *</label>
                      <div className="flex gap-2">
                        {STATUS_OPTIONS.map(status => (
                          <Button
                            key={status}
                            type="button"
                            variant={expenseForm.status === status ? "default" : "outline"}
                            onClick={() => handleSelectChange('status', status)}
                            className="capitalize"
                          >
                            {status}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Additional Notes</label>
                      <textarea
                        name="notes"
                        value={expenseForm.notes}
                        onChange={handleExpenseFormChange}
                        placeholder="Any additional notes..."
                        className="w-full min-h-[60px] border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="border-t px-6 py-4">
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={closeExpenseModal}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={submitManualExpense}
                      disabled={!expenseForm.title.trim() || expenseForm.amount <= 0}
                      className="gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {editingExpense ? 'Update Expense' : 'Save Expense'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}