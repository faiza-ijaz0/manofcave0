// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { Header } from '@/components/shared/Header';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Calendar,
//   Package,
//   Wallet,
//   Star,
//   Settings,
//   LogOut,
//   Clock,
//   ChevronRight,
//   Gift,
//   Award,
//   History,
//   User,
//   Sparkles,
//   ArrowUpRight,
//   Loader2,
//   MessageSquare,
//   ShoppingCart,
//   CheckCircle,
//   XCircle,
//   Plus,
//   TrendingUp,
//   Trash2,
//   Eye,
//   Check,
//   X,
//   CreditCard,
//   MapPin,
//   Tag,
// } from 'lucide-react';
// import { formatDistanceToNow, format } from 'date-fns';

// // Firebase imports
// import { db, auth } from '@/lib/firebase';
// import { 
//   collection, 
//   query, 
//   where, 
//   getDocs, 
//   addDoc, 
//   serverTimestamp,
//   onSnapshot,
//   orderBy,
//   doc,
//   getDoc,
//   Timestamp,
//   updateDoc,
//   deleteDoc,
//   increment
// } from 'firebase/firestore';
// import { onAuthStateChanged, signOut } from 'firebase/auth';

// // Types
// interface Customer {
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   avatar?: string;
//   createdAt?: any;
// }

// interface Booking {
//   id: string;
//   customerId: string;
//   customerName: string;
//   customerEmail: string;
//   serviceId: string;
//   serviceName: string; // MUST BE INCLUDED
//   servicePrice: number;
//   date: string;
//   time: string;
//   totalAmount: number;
//   status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
//   createdAt: any;
//   notes?: string;
// }

// interface Order {
//   id: string;
//   customerId: string;
//   customerName: string;
//   customerEmail: string;
//   products: Array<{
//     productId: string;
//     productName: string; // MUST BE INCLUDED
//     quantity: number;
//     price: number;
//     image?: string;
//   }>;
//   totalAmount: number;
//   status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
//   createdAt: any;
//   shippingAddress?: string;
//   paymentMethod?: string;
// }

// interface Feedback {
//   id: string;
//   customerId: string;
//   customerName: string;
//   customerEmail: string;
//   serviceOrProduct: string;
//   serviceOrProductId?: string;
//   type: 'service' | 'product';
//   rating: number;
//   comment: string;
//   createdAt: any;
//   status: 'pending' | 'approved' | 'rejected';
//   adminReply?: string;
// }

// interface Transaction {
//   id: string;
//   customerId: string;
//   type: 'wallet_topup' | 'points_earned' | 'points_redeemed' | 'purchase' | 'refund' | 'booking' | 'order';
//   amount: number;
//   pointsAmount?: number;
//   description: string;
//   createdAt: any;
//   status: 'success' | 'failed' | 'pending';
//   referenceId?: string;
// }

// interface CustomerWallet {
//   id: string;
//   customerId: string;
//   balance: number;
//   loyaltyPoints: number;
//   totalPointsEarned: number;
//   totalPointsRedeemed: number;
//   updatedAt: any;
// }

// interface Service {
//   id: string;
//   name: string;
//   description?: string;
//   price: number;
//   duration?: string;
//   category?: string;
//   imageUrl?: string;
//   branchNames?: string[];
//   branches?: string[];
//   status: 'active' | 'inactive';
//   createdAt?: any;
//   popularity?: string;
//   revenue?: number;
//   totalBookings?: number;
//   categoryId?: string;
// }

// interface Product {
//   id: string;
//   name: string;
//   description?: string;
//   price: number;
//   category?: string;
//   imageUrl?: string;
//   branchNames?: string[];
//   branches?: string[];
//   stock: number;
//   status: 'active' | 'inactive';
//   createdAt?: any;
//   cost?: number;
//   rating?: number;
//   reviews?: number;
//   sku?: string;
//   revenue?: number;
//   totalSold?: number;
//   totalStock?: number;
//   categoryId?: string;
// }

// // Cart Item Interface
// interface CartItem {
//   [x: string]: string;
//   id: string;
//   customerId: string;
//   customerName: string;
//   customerEmail: string;
//   itemId: string;
//   itemName: string;
//   itemImage: string;
//   price: number;
//   quantity: number;
//   addedAt: any;
//   updatedAt?: any;
//   status: 'active' | 'purchased' | 'removed';
//   type: 'product' | 'service';
//   serviceId?: string;
//   productId?: string;
//   branchNames?: string[];
// }

// export default function CustomerPortal() {
//   const router = useRouter();
  
//   // States
//   const [customer, setCustomer] = useState<Customer | null>(null);
//   const [wallet, setWallet] = useState<CustomerWallet | null>(null);
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
//   const [transactions, setTransactions] = useState<Transaction[]>([]);
//   const [services, setServices] = useState<Service[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [recentServices, setRecentServices] = useState<Service[]>([]);
//   const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  
//   // Cart Items State
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [isLoadingCart, setIsLoadingCart] = useState(false);
  
//   const [isLoading, setIsLoading] = useState(true);
//   const [isLoadingData, setIsLoadingData] = useState(false);
//   const [feedbackRating, setFeedbackRating] = useState(5);
//   const [feedbackComment, setFeedbackComment] = useState('');
//   const [feedbackService, setFeedbackService] = useState('');
//   const [feedbackType, setFeedbackType] = useState<'service' | 'product'>('service');
//   const [showFeedbackForm, setShowFeedbackForm] = useState(false);
//   const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [updatingCartItem, setUpdatingCartItem] = useState<string | null>(null);
//   const [removingCartItem, setRemovingCartItem] = useState<string | null>(null);
//   const [hasIndexError, setHasIndexError] = useState(false);
//   const [checkoutLoading, setCheckoutLoading] = useState(false);
  
//   // New states for booking management
//   const [confirmingBooking, setConfirmingBooking] = useState<string | null>(null);
//   const [cancellingBooking, setCancellingBooking] = useState<string | null>(null);
//   const [completingBooking, setCompletingBooking] = useState<string | null>(null);

//   // Add to Cart for Service - FIXED
//   const handleAddServiceToCart = async (service: Service) => {
//     if (!customer) {
//       router.push('/customer/login');
//       return;
//     }

//     try {
//       console.log('Adding service to cart:', service);
      
//       // Check if service already in cart
//       const existingItem = cartItems.find(item => 
//         item.type === 'service' && item.itemId === service.id
//       );
      
//       if (existingItem) {
//         alert('Service already in cart!');
//         return;
//       }

//       const cartItemData = {
//         customerId: customer.id,
//         customerName: customer.name || 'Customer',
//         customerEmail: customer.email || '',
//         itemId: service.id,
//         itemName: service.name,
//         itemImage: service.imageUrl || 'https://images.unsplash.com/photo-1512690196222-7c7d3f993c1b?q=80&w=2070&auto=format&fit=crop',
//         serviceName: service.name, // IMPORTANT: Save serviceName too
//         price: service.price || 0,
//         quantity: 1,
//         type: 'service' as const,
//         serviceId: service.id,
//         productId: '',
//         branchNames: service.branchNames || [],
//         addedAt: serverTimestamp(),
//         status: 'active' as const
//       };

//       console.log('Adding to cart:', cartItemData);

//       // Add to cart collection
//       await addDoc(collection(db, 'cart'), cartItemData);
      
//       alert(`${service.name} added to cart!`);
      
//     } catch (error) {
//       console.error('Error adding service to cart:', error);
//       alert('Failed to add service to cart. Please try again.');
//     }
//   };

//   // Add to Cart for Product - FIXED
//   const handleAddProductToCart = async (product: Product) => {
//     if (!customer) {
//       router.push('/customer/login');
//       return;
//     }

//     try {
//       console.log('Adding product to cart:', product);
      
//       // Check if product already in cart
//       const existingItem = cartItems.find(item => 
//         item.type === 'product' && item.itemId === product.id
//       );
      
//       if (existingItem) {
//         // Update quantity if already exists
//         await updateDoc(doc(db, 'cart', existingItem.id), {
//           quantity: (existingItem.quantity || 1) + 1,
//           updatedAt: serverTimestamp()
//         });
//         alert('Product quantity updated in cart!');
//         return;
//       }

//       const cartItemData = {
//         customerId: customer.id,
//         customerName: customer.name || 'Customer',
//         customerEmail: customer.email || '',
//         itemId: product.id,
//         itemName: product.name,
//         itemImage: product.imageUrl || 'https://images.unsplash.com/photo-1512690196222-7c7d3f993c1b?q=80&w=2070&auto=format&fit=crop',
//         productName: product.name, // IMPORTANT: Save productName too
//         price: product.price || 0,
//         quantity: 1,
//         type: 'product' as const,
//         serviceId: '',
//         productId: product.id,
//         branchNames: product.branchNames || [],
//         addedAt: serverTimestamp(),
//         status: 'active' as const
//       };

//       console.log('Adding to cart:', cartItemData);

//       // Add to cart collection
//       await addDoc(collection(db, 'cart'), cartItemData);
      
//       alert(`${product.name} added to cart!`);
      
//     } catch (error) {
//       console.error('Error adding product to cart:', error);
//       alert('Failed to add product to cart. Please try again.');
//     }
//   };

//   // Fetch all initial data
//   useEffect(() => {
//     const initializeData = async () => {
//       setIsLoading(true);
      
//       // Check authentication
//       const authData = localStorage.getItem('customerAuth');
//       if (!authData) {
//         router.push('/customer/login');
//         return;
//       }

//       try {
//         const { customer: customerData } = JSON.parse(authData);
//         const customerObj = {
//           id: customerData.uid || customerData.id || `cust_${Date.now()}`,
//           name: customerData.name || 'Customer',
//           email: customerData.email || '',
//           phone: customerData.phone || '',
//           avatar: customerData.avatar
//         };
        
//         console.log('Setting customer:', customerObj);
//         setCustomer(customerObj);

//         // Fetch all data
//         await fetchCustomerData(customerObj.id);
//         await fetchServices();
//         await fetchProducts();
        
//         // Fetch recent items after main data is loaded
//         await fetchRecentServices();
//         await fetchRecentProducts();
        
//       } catch (error) {
//         console.error('Initialization error:', error);
//         // Check if it's an index error
//         if (error instanceof Error && error.message.includes('index')) {
//           setHasIndexError(true);
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     initializeData();

//     // Set up real-time listeners after initial load
//     const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
//       if (firebaseUser && customer) {
//         setupRealtimeListeners(firebaseUser.uid);
//       }
//     });

//     return () => {
//       unsubscribeAuth();
//     };
//   }, []);

//   // Fetch customer data from Firebase
//   const fetchCustomerData = async (customerId: string) => {
//     if (!customerId) {
//       console.error('No customer ID provided');
//       return;
//     }
    
//     setIsLoadingData(true);
//     console.log(`Fetching data for customer: ${customerId}`);
    
//     try {
//       // Fetch wallet
//       try {
//         const walletDoc = await getDoc(doc(db, 'wallets', customerId));
//         if (walletDoc.exists()) {
//           console.log('Wallet found:', walletDoc.data());
//           setWallet({ id: walletDoc.id, ...walletDoc.data() } as CustomerWallet);
//         } else {
//           console.log('No wallet found, creating default');
//           const defaultWallet: CustomerWallet = {
//             id: customerId,
//             customerId,
//             balance: 0,
//             loyaltyPoints: 0,
//             totalPointsEarned: 0,
//             totalPointsRedeemed: 0,
//             updatedAt: new Date()
//           };
//           setWallet(defaultWallet);
//         }
//       } catch (walletError) {
//         console.error('Error fetching wallet:', walletError);
//       }

//       // Fetch bookings - FIXED
//       console.log('Fetching bookings...');
//       try {
//         const bookingsQuery = query(
//           collection(db, 'bookings'),
//           where('customerId', '==', customerId)
//         );
//         const bookingsSnapshot = await getDocs(bookingsQuery);
//         const bookingsData: Booking[] = [];
        
//         console.log(`Found ${bookingsSnapshot.size} bookings`);
        
//         bookingsSnapshot.forEach(doc => {
//           const data = doc.data();
//           console.log(`Booking ${doc.id}:`, data);
          
//           const booking: Booking = {
//             id: doc.id,
//             customerId: data.customerId || customerId,
//             customerName: data.customerName || 'Customer',
//             customerEmail: data.customerEmail || '',
//             serviceId: data.serviceId || '',
//             serviceName: data.serviceName || 'Unknown Service', // FIXED: Ensure serviceName is included
//             servicePrice: typeof data.servicePrice === 'number' ? data.servicePrice : 0,
//             date: data.date || new Date().toISOString().split('T')[0],
//             time: data.time || '10:00 AM',
//             totalAmount: typeof data.totalAmount === 'number' ? data.totalAmount : 0,
//             status: ['pending', 'confirmed', 'completed', 'cancelled'].includes(data.status) 
//               ? data.status 
//               : 'pending',
//             createdAt: data.createdAt || serverTimestamp(),
//             notes: data.notes || ''
//           };
          
//           bookingsData.push(booking);
//         });
        
//         // Client-side sorting by date (newest first)
//         bookingsData.sort((a, b) => {
//           try {
//             const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
//             const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
//             return dateB.getTime() - dateA.getTime();
//           } catch (error) {
//             return 0;
//           }
//         });
        
//         console.log('Processed bookings:', bookingsData);
//         setBookings(bookingsData);
//       } catch (bookingsError) {
//         console.error('Error fetching bookings:', bookingsError);
//         setBookings([]);
//       }

//       // Fetch orders - FIXED
//       console.log('Fetching orders...');
//       try {
//         const ordersQuery = query(
//           collection(db, 'orders'),
//           where('customerId', '==', customerId)
//         );
//         const ordersSnapshot = await getDocs(ordersQuery);
//         const ordersData: Order[] = [];
        
//         console.log(`Found ${ordersSnapshot.size} orders`);
        
//         ordersSnapshot.forEach(doc => {
//           const data = doc.data();
//           console.log(`Order ${doc.id}:`, data);
          
//           const order: Order = {
//             id: doc.id,
//             customerId: data.customerId || customerId,
//             customerName: data.customerName || 'Customer',
//             customerEmail: data.customerEmail || '',
//             products: Array.isArray(data.products) ? data.products.map((p: any) => ({
//               productId: p.productId || '',
//               productName: p.productName || 'Product', // FIXED: Ensure productName is included
//               quantity: typeof p.quantity === 'number' ? p.quantity : 1,
//               price: typeof p.price === 'number' ? p.price : 0,
//               image: p.image || p.productImage || ''
//             })) : [],
//             totalAmount: typeof data.totalAmount === 'number' ? data.totalAmount : 0,
//             status: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(data.status)
//               ? data.status
//               : 'pending',
//             createdAt: data.createdAt || serverTimestamp(),
//             shippingAddress: data.shippingAddress || '',
//             paymentMethod: data.paymentMethod || 'wallet'
//           };
          
//           ordersData.push(order);
//         });
        
//         // Client-side sorting by date (newest first)
//         ordersData.sort((a, b) => {
//           try {
//             const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
//             const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
//             return dateB.getTime() - dateA.getTime();
//           } catch (error) {
//             return 0;
//           }
//         });
        
//         console.log('Processed orders:', ordersData);
//         setOrders(ordersData);
//       } catch (ordersError) {
//         console.error('Error fetching orders:', ordersError);
//         setOrders([]);
//       }

//       // Fetch feedbacks
//       try {
//         const feedbacksQuery = query(
//           collection(db, 'feedbacks'),
//           where('customerId', '==', customerId)
//         );
//         const feedbacksSnapshot = await getDocs(feedbacksQuery);
//         const feedbacksData: Feedback[] = [];
        
//         feedbacksSnapshot.forEach(doc => {
//           const data = doc.data();
//           feedbacksData.push({
//             id: doc.id,
//             customerId: data.customerId || customerId,
//             customerName: data.customerName || 'Customer',
//             customerEmail: data.customerEmail || '',
//             serviceOrProduct: data.serviceOrProduct || '',
//             serviceOrProductId: data.serviceOrProductId || '',
//             type: data.type || 'service',
//             rating: typeof data.rating === 'number' ? data.rating : 5,
//             comment: data.comment || '',
//             createdAt: data.createdAt || serverTimestamp(),
//             status: data.status || 'pending',
//             adminReply: data.adminReply || ''
//           } as Feedback);
//         });
        
//         // Client-side sorting
//         feedbacksData.sort((a, b) => {
//           try {
//             const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
//             const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
//             return dateB.getTime() - dateA.getTime();
//           } catch (error) {
//             return 0;
//           }
//         });
        
//         setFeedbacks(feedbacksData);
//       } catch (error) {
//         console.error('Error fetching feedbacks:', error);
//         setFeedbacks([]);
//       }

//       // Fetch transactions
//       try {
//         const transactionsQuery = query(
//           collection(db, 'transactions'),
//           where('customerId', '==', customerId)
//         );
//         const transactionsSnapshot = await getDocs(transactionsQuery);
//         const transactionsData: Transaction[] = [];
        
//         transactionsSnapshot.forEach(doc => {
//           const data = doc.data();
//           transactionsData.push({
//             id: doc.id,
//             customerId: data.customerId || customerId,
//             type: data.type || 'purchase',
//             amount: typeof data.amount === 'number' ? data.amount : 0,
//             pointsAmount: typeof data.pointsAmount === 'number' ? data.pointsAmount : 0,
//             description: data.description || '',
//             createdAt: data.createdAt || serverTimestamp(),
//             status: data.status || 'success',
//             referenceId: data.referenceId || ''
//           } as Transaction);
//         });
        
//         // Client-side sorting
//         transactionsData.sort((a, b) => {
//           try {
//             const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
//             const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
//             return dateB.getTime() - dateA.getTime();
//           } catch (error) {
//             return 0;
//           }
//         });
        
//         setTransactions(transactionsData);
//       } catch (error) {
//         console.error('Error fetching transactions:', error);
//         setTransactions([]);
//       }

//       // Fetch cart items
//       await fetchCartItems(customerId);

//     } catch (error) {
//       console.error('Error fetching customer data:', error);
//     } finally {
//       setIsLoadingData(false);
//     }
//   };

//   // Fetch cart items - FIXED
//   const fetchCartItems = async (customerId: string) => {
//     if (!customerId) return;
    
//     setIsLoadingCart(true);
//     try {
//       console.log('Fetching cart items for customer:', customerId);
      
//       const cartQuery = query(
//         collection(db, 'cart'),
//         where('customerId', '==', customerId)
//       );
//       const cartSnapshot = await getDocs(cartQuery);
//       const cartData: CartItem[] = [];
      
//       cartSnapshot.forEach(doc => {
//         const data = doc.data();
//         console.log(`Cart item ${doc.id}:`, data); // Debug log
        
//         // Filter active items client-side
//         if (data.status === 'active' || !data.status) {
//           const cartItem: CartItem = {
//             id: doc.id,
//             customerId: data.customerId || customerId,
//             customerName: data.customerName || 'Customer',
//             customerEmail: data.customerEmail || '',
            
//             // Check for all possible field names
//             itemId: data.itemId || data.serviceId || data.productId || '',
//             itemName: data.itemName || data.serviceName || data.productName || 'Item',
            
//             // Check for imageUrl field too
//             itemImage: data.itemImage || data.imageUrl || data.image || data.productImage || 
//                       'https://images.unsplash.com/photo-1512690196222-7c7d3f993c1b?q=80&w=2070&auto=format&fit=crop',
            
//             price: typeof data.price === 'number' ? data.price : 0,
//             quantity: typeof data.quantity === 'number' ? data.quantity : 1,
//             addedAt: data.addedAt || serverTimestamp(),
//             updatedAt: data.updatedAt,
//             status: data.status || 'active',
//             type: data.type || (data.serviceId ? 'service' : 'product'),
//             serviceId: data.serviceId || '',
//             productId: data.productId || '',
//             branchNames: data.branchNames || []
//           };
//           cartData.push(cartItem);
//         }
//       });
      
//       // Client-side sorting
//       cartData.sort((a, b) => {
//         try {
//           const dateA = a.addedAt?.toDate ? a.addedAt.toDate() : new Date(0);
//           const dateB = b.addedAt?.toDate ? b.addedAt.toDate() : new Date(0);
//           return dateB.getTime() - dateA.getTime();
//         } catch (error) {
//           return 0;
//         }
//       });
      
//       console.log('Cart items found (detailed):', cartData);
//       setCartItems(cartData);
//     } catch (error) {
//       console.error('Error fetching cart items:', error);
//       setCartItems([]);
//     } finally {
//       setIsLoadingCart(false);
//     }
//   };

//   // Fetch all services - UPDATED
//   const fetchServices = async () => {
//     try {
//       const servicesQuery = query(
//         collection(db, 'services'),
//         where('status', '==', 'active')
//       );
//       const servicesSnapshot = await getDocs(servicesQuery);
//       const servicesData: Service[] = [];
      
//       servicesSnapshot.forEach(doc => {
//         const data = doc.data();
//         console.log(`Service ${doc.id}:`, data); // Debug log
        
//         servicesData.push({
//           id: doc.id,
//           name: data.name || 'Service',
//           description: data.description || '',
//           price: typeof data.price === 'number' ? data.price : 0,
//           duration: data.duration || '',
//           category: data.category || '',
//           imageUrl: data.imageUrl || '', // Changed from image to imageUrl
//           branchNames: data.branchNames || [], // Added branchNames
//           branches: data.branches || [], // Added branches
//           status: data.status || 'active',
//           createdAt: data.createdAt || null,
//           popularity: data.popularity || 'low',
//           revenue: data.revenue || 0,
//           totalBookings: data.totalBookings || 0,
//           categoryId: data.categoryId || ''
//         } as Service);
//       });
      
//       console.log('Services loaded:', servicesData);
//       setServices(servicesData);
//     } catch (error) {
//       console.error('Error fetching services:', error);
//       setServices([]);
//     }
//   };

//   // Fetch all products - UPDATED
//   const fetchProducts = async () => {
//     try {
//       const productsQuery = query(
//         collection(db, 'products'),
//         where('status', '==', 'active')
//       );
//       const productsSnapshot = await getDocs(productsQuery);
//       const productsData: Product[] = [];
      
//       productsSnapshot.forEach(doc => {
//         const data = doc.data();
//         console.log(`Product ${doc.id}:`, data); // Debug log
        
//         // Filter stock client-side
//         if ((data.totalStock || 0) > 0) {
//           productsData.push({
//             id: doc.id,
//             name: data.name || 'Product',
//             description: data.description || '',
//             price: typeof data.price === 'number' ? data.price : 0,
//             category: data.category || '',
//             imageUrl: data.imageUrl || '', // Changed from image to imageUrl
//             branchNames: data.branchNames || [], // Added branchNames
//             branches: data.branches || [], // Added branches
//             stock: typeof data.totalStock === 'number' ? data.totalStock : 0,
//             status: data.status || 'active',
//             createdAt: data.createdAt || null,
//             cost: data.cost || 0,
//             rating: data.rating || 0,
//             reviews: data.reviews || 0,
//             sku: data.sku || '',
//             revenue: data.revenue || 0,
//             totalSold: data.totalSold || 0,
//             totalStock: data.totalStock || 0,
//             categoryId: data.categoryId || ''
//           } as Product);
//         }
//       });
      
//       console.log('Products loaded:', productsData);
//       setProducts(productsData);
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       setProducts([]);
//     }
//   };

//   // Fetch recent services
//   const fetchRecentServices = async () => {
//     try {
//       const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
//       const recentServicesData = services
//         .filter(service => {
//           if (!service.createdAt) return true;
//           try {
//             const createdAt = service.createdAt?.toDate ? service.createdAt.toDate() : new Date(0);
//             return createdAt >= thirtyDaysAgo;
//           } catch {
//             return true;
//           }
//         })
//         .sort((a, b) => {
//           try {
//             const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
//             const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
//             return dateB.getTime() - dateA.getTime();
//           } catch {
//             return 0;
//           }
//         })
//         .slice(0, 6);
      
//       setRecentServices(recentServicesData);
//     } catch (error) {
//       console.error('Error fetching recent services:', error);
//       const fallback = services.slice(0, 6);
//       setRecentServices(fallback);
//     }
//   };

//   // Fetch recent products
//   const fetchRecentProducts = async () => {
//     try {
//       const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
//       const recentProductsData = products
//         .filter(product => {
//           if (!product.createdAt) return true;
//           try {
//             const createdAt = product.createdAt?.toDate ? product.createdAt.toDate() : new Date(0);
//             return createdAt >= thirtyDaysAgo;
//           } catch {
//             return true;
//           }
//         })
//         .sort((a, b) => {
//           try {
//             const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
//             const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
//             return dateB.getTime() - dateA.getTime();
//           } catch {
//             return 0;
//           }
//         })
//         .slice(0, 6);
      
//       setRecentProducts(recentProductsData);
//     } catch (error) {
//       console.error('Error fetching recent products:', error);
//       const fallback = products.slice(0, 6);
//       setRecentProducts(fallback);
//     }
//   };

//   // Set up real-time listeners
//   const setupRealtimeListeners = (customerId: string) => {
//     if (!customerId) return;
    
//     console.log('Setting up real-time listeners for:', customerId);
    
//     try {
//       // Real-time bookings listener
//       const bookingsQuery = query(
//         collection(db, 'bookings'),
//         where('customerId', '==', customerId)
//       );
      
//       const unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
//         console.log('Bookings real-time update:', snapshot.size, 'documents');
//         const bookingsData: Booking[] = [];
//         snapshot.forEach(doc => {
//           const data = doc.data();
//           bookingsData.push({
//             id: doc.id,
//             customerId: data.customerId || customerId,
//             customerName: data.customerName || 'Customer',
//             customerEmail: data.customerEmail || '',
//             serviceId: data.serviceId || '',
//             serviceName: data.serviceName || 'Unknown Service',
//             servicePrice: typeof data.servicePrice === 'number' ? data.servicePrice : 0,
//             date: data.date || new Date().toISOString().split('T')[0],
//             time: data.time || '10:00 AM',
//             totalAmount: typeof data.totalAmount === 'number' ? data.totalAmount : 0,
//             status: ['pending', 'confirmed', 'completed', 'cancelled'].includes(data.status) 
//               ? data.status 
//               : 'pending',
//             createdAt: data.createdAt || serverTimestamp(),
//             notes: data.notes || ''
//           } as Booking);
//         });
        
//         // Client-side sorting
//         bookingsData.sort((a, b) => {
//           try {
//             const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
//             const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
//             return dateB.getTime() - dateA.getTime();
//           } catch {
//             return 0;
//           }
//         });
        
//         console.log('Updated bookings:', bookingsData);
//         setBookings(bookingsData);
//       }, (error) => {
//         console.error('Bookings listener error:', error);
//       });

//       // Real-time orders listener
//       const ordersQuery = query(
//         collection(db, 'orders'),
//         where('customerId', '==', customerId)
//       );
      
//       const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
//         console.log('Orders real-time update:', snapshot.size, 'documents');
//         const ordersData: Order[] = [];
//         snapshot.forEach(doc => {
//           const data = doc.data();
//           ordersData.push({
//             id: doc.id,
//             customerId: data.customerId || customerId,
//             customerName: data.customerName || 'Customer',
//             customerEmail: data.customerEmail || '',
//             products: Array.isArray(data.products) ? data.products.map((p: any) => ({
//               productId: p.productId || '',
//               productName: p.productName || 'Product',
//               quantity: typeof p.quantity === 'number' ? p.quantity : 1,
//               price: typeof p.price === 'number' ? p.price : 0,
//               image: p.image || p.productImage || ''
//             })) : [],
//             totalAmount: typeof data.totalAmount === 'number' ? data.totalAmount : 0,
//             status: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(data.status)
//               ? data.status
//               : 'pending',
//             createdAt: data.createdAt || serverTimestamp(),
//             shippingAddress: data.shippingAddress || '',
//             paymentMethod: data.paymentMethod || 'wallet'
//           } as Order);
//         });
        
//         // Client-side sorting
//         ordersData.sort((a, b) => {
//           try {
//             const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
//             const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
//             return dateB.getTime() - dateA.getTime();
//           } catch {
//             return 0;
//           }
//         });
        
//         console.log('Updated orders:', ordersData);
//         setOrders(ordersData);
//       }, (error) => {
//         console.error('Orders listener error:', error);
//       });

//       // Real-time feedbacks listener
//       const feedbacksQuery = query(
//         collection(db, 'feedbacks'),
//         where('customerId', '==', customerId)
//       );
      
//       const unsubscribeFeedbacks = onSnapshot(feedbacksQuery, (snapshot) => {
//         const feedbacksData: Feedback[] = [];
//         snapshot.forEach(doc => {
//           const data = doc.data();
//           feedbacksData.push({
//             id: doc.id,
//             customerId: data.customerId || customerId,
//             customerName: data.customerName || 'Customer',
//             customerEmail: data.customerEmail || '',
//             serviceOrProduct: data.serviceOrProduct || '',
//             serviceOrProductId: data.serviceOrProductId || '',
//             type: data.type || 'service',
//             rating: typeof data.rating === 'number' ? data.rating : 5,
//             comment: data.comment || '',
//             createdAt: data.createdAt || serverTimestamp(),
//             status: data.status || 'pending',
//             adminReply: data.adminReply || ''
//           } as Feedback);
//         });
        
//         // Client-side sorting
//         feedbacksData.sort((a, b) => {
//           try {
//             const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
//             const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
//             return dateB.getTime() - dateA.getTime();
//           } catch {
//             return 0;
//           }
//         });
        
//         setFeedbacks(feedbacksData);
//       }, (error) => {
//         console.error('Feedbacks listener error:', error);
//       });

//       // Real-time wallet listener
//       const unsubscribeWallet = onSnapshot(doc(db, 'wallets', customerId), (doc) => {
//         if (doc.exists()) {
//           console.log('Wallet updated:', doc.data());
//           setWallet({ id: doc.id, ...doc.data() } as CustomerWallet);
//         }
//       }, (error) => {
//         console.error('Wallet listener error:', error);
//       });

//       // Real-time transactions listener
//       const transactionsQuery = query(
//         collection(db, 'transactions'),
//         where('customerId', '==', customerId)
//       );
      
//       const unsubscribeTransactions = onSnapshot(transactionsQuery, (snapshot) => {
//         const transactionsData: Transaction[] = [];
//         snapshot.forEach(doc => {
//           const data = doc.data();
//           transactionsData.push({
//             id: doc.id,
//             customerId: data.customerId || customerId,
//             type: data.type || 'purchase',
//             amount: typeof data.amount === 'number' ? data.amount : 0,
//             pointsAmount: typeof data.pointsAmount === 'number' ? data.pointsAmount : 0,
//             description: data.description || '',
//             createdAt: data.createdAt || serverTimestamp(),
//             status: data.status || 'success',
//             referenceId: data.referenceId || ''
//           } as Transaction);
//         });
        
//         // Client-side sorting
//         transactionsData.sort((a, b) => {
//           try {
//             const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
//             const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
//             return dateB.getTime() - dateA.getTime();
//           } catch {
//             return 0;
//           }
//         });
        
//         setTransactions(transactionsData);
//       }, (error) => {
//         console.error('Transactions listener error:', error);
//       });

//       // Real-time cart listener
//       const cartQuery = query(
//         collection(db, 'cart'),
//         where('customerId', '==', customerId)
//       );
      
//       const unsubscribeCart = onSnapshot(cartQuery, (snapshot) => {
//         console.log('Cart real-time update:', snapshot.size, 'documents');
//         const cartData: CartItem[] = [];
//         snapshot.forEach(doc => {
//           const data = doc.data();
//           // Filter active items client-side
//           if (data.status === 'active' || !data.status) {
//             cartData.push({
//               id: doc.id,
//               customerId: data.customerId || customerId,
//               customerName: data.customerName || 'Customer',
//               customerEmail: data.customerEmail || '',
//               itemId: data.itemId || data.productId || '',
//               itemName: data.itemName || data.productName || 'Item',
//               itemImage: data.itemImage || data.productImage || data.image || 'https://images.unsplash.com/photo-1512690196222-7c7d3f993c1b?q=80&w=2070&auto=format&fit=crop',
//               price: typeof data.price === 'number' ? data.price : 0,
//               quantity: typeof data.quantity === 'number' ? data.quantity : 1,
//               addedAt: data.addedAt || serverTimestamp(),
//               updatedAt: data.updatedAt,
//               status: data.status || 'active',
//               type: data.type || 'product',
//               serviceId: data.serviceId || '',
//               productId: data.productId || '',
//               branchNames: data.branchNames || []
//             } as CartItem);
//           }
//         });
        
//         // Sort client side
//         cartData.sort((a, b) => {
//           try {
//             const dateA = a.addedAt?.toDate ? a.addedAt.toDate() : new Date(0);
//             const dateB = b.addedAt?.toDate ? b.addedAt.toDate() : new Date(0);
//             return dateB.getTime() - dateA.getTime();
//           } catch {
//             return 0;
//           }
//         });
        
//         setCartItems(cartData);
//       }, (error) => {
//         console.error('Cart listener error:', error);
//       });

//       // Return cleanup function
//       return () => {
//         unsubscribeBookings();
//         unsubscribeOrders();
//         unsubscribeFeedbacks();
//         unsubscribeWallet();
//         unsubscribeTransactions();
//         unsubscribeCart();
//       };
//     } catch (error) {
//       console.warn('Could not set up real-time listeners:', error);
//     }
//   };

//   // Handle logout
//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//     localStorage.removeItem('customerAuth');
//     localStorage.removeItem('user');
//     router.push('/customer/login');
//   };

//   // Handle remove from cart
//   const handleRemoveFromCart = async (cartItemId: string) => {
//     if (!customer) return;
    
//     setRemovingCartItem(cartItemId);
//     try {
//       await deleteDoc(doc(db, 'cart', cartItemId));
//       console.log('Cart item removed:', cartItemId);
//     } catch (error) {
//       console.error('Error removing from cart:', error);
//       alert('Failed to remove item from cart');
//     } finally {
//       setRemovingCartItem(null);
//     }
//   };

//   // Handle update quantity
//   const handleUpdateQuantity = async (cartItemId: string, newQuantity: number) => {
//     if (!customer || newQuantity < 1) return;
    
//     setUpdatingCartItem(cartItemId);
//     try {
//       await updateDoc(doc(db, 'cart', cartItemId), {
//         quantity: newQuantity,
//         updatedAt: serverTimestamp()
//       });
//       console.log('Cart item quantity updated:', cartItemId, newQuantity);
//     } catch (error) {
//       console.error('Error updating quantity:', error);
//       alert('Failed to update quantity');
//     } finally {
//       setUpdatingCartItem(null);
//     }
//   };

//   // Handle checkout - FIXED for service name
//   const handleCheckout = async () => {
//     if (!customer || cartItems.length === 0) {
//       alert('Cart is empty');
//       return;
//     }
    
//     setCheckoutLoading(true);
//     console.log('Starting checkout process...');
//     console.log('Cart items:', cartItems);
    
//     try {
//       // Separate services and products
//       const serviceItems = cartItems.filter(item => item.type === 'service');
//       const productItems = cartItems.filter(item => item.type === 'product');
      
//       console.log('Service items:', serviceItems);
//       console.log('Product items:', productItems);
      
//       let successMessages = [];
      
//       // Handle services - create bookings WITH SERVICE NAME
//       if (serviceItems.length > 0) {
//         console.log('Processing services...');
        
//         for (const serviceItem of serviceItems) {
//           try {
//             console.log('Creating booking for:', serviceItem.itemName);
            
//             const bookingData = {
//               customerId: customer.id,
//               customerName: customer.name || 'Customer',
//               customerEmail: customer.email || '',
//               serviceId: serviceItem.itemId,
//               serviceName: serviceItem.itemName || serviceItem.serviceName || 'Service', // FIXED: Include serviceName
//               servicePrice: serviceItem.price || 0,
//               date: new Date().toISOString().split('T')[0],
//               time: '10:00 AM',
//               totalAmount: serviceItem.price || 0,
//               status: 'pending',
//               createdAt: serverTimestamp(),
//               notes: 'Booked from cart checkout'
//             };

//             console.log('Booking data:', bookingData);

//             // Create booking
//             const bookingRef = await addDoc(collection(db, 'bookings'), bookingData);
//             console.log('Booking created with ID:', bookingRef.id);
            
//             // Remove from cart
//             await deleteDoc(doc(db, 'cart', serviceItem.id));
            
//             // Add transaction
//             await addDoc(collection(db, 'transactions'), {
//               customerId: customer.id,
//               type: 'booking',
//               amount: -(serviceItem.price || 0),
//               description: `Booking for ${serviceItem.itemName}`,
//               status: 'success',
//               referenceId: bookingRef.id,
//               createdAt: serverTimestamp()
//             });

//             successMessages.push(`✓ ${serviceItem.itemName} booked successfully`);
            
//           } catch (error) {
//             console.error(`Error booking ${serviceItem.itemName}:`, error);
//             alert(`Failed to book ${serviceItem.itemName}. Please try again.`);
//           }
//         }
//       }
      
//       // Handle products - create orders WITH PRODUCT NAME
//       if (productItems.length > 0) {
//         console.log('Processing products...');
        
//         const orderProducts = productItems.map(item => ({
//           productId: item.itemId || '',
//           productName: item.itemName || item.productName || 'Product', // FIXED: Include productName
//           quantity: Math.max(1, item.quantity || 1),
//           price: Math.max(0, item.price || 0),
//           image: item.itemImage || ''
//         }));
        
//         const totalAmount = productItems.reduce((sum, item) => 
//           sum + (Math.max(0, item.price || 0) * Math.max(1, item.quantity || 1)), 
//         0);

//         try {
//           const orderData = {
//             customerId: customer.id || '',
//             customerName: customer.name || 'Customer',
//             customerEmail: customer.email || '',
//             products: orderProducts,
//             totalAmount: totalAmount,
//             status: 'pending',
//             createdAt: serverTimestamp(),
//             shippingAddress: '',
//             paymentMethod: 'wallet'
//           };

//           console.log('Order data:', orderData);

//           const orderRef = await addDoc(collection(db, 'orders'), orderData);
//           console.log('Order created with ID:', orderRef.id);
          
//           // Remove products from cart
//           const deletePromises = productItems.map(item =>
//             deleteDoc(doc(db, 'cart', item.id))
//           );
          
//           await Promise.all(deletePromises);
          
//           await addDoc(collection(db, 'transactions'), {
//             customerId: customer.id || '',
//             type: 'order',
//             amount: -totalAmount,
//             description: `Purchase of ${productItems.length} products`,
//             status: 'success',
//             referenceId: orderRef.id,
//             createdAt: serverTimestamp()
//           });

//           successMessages.push(`✓ Order placed for ${productItems.length} product(s)`);
          
//         } catch (error) {
//           console.error('Error creating order:', error);
//           alert('Failed to place order. Please try again.');
//         }
//       }
      
//       // Show success message
//       if (successMessages.length > 0) {
//         let finalMessage = '';
        
//         if (serviceItems.length > 0) {
//           finalMessage += `${serviceItems.length} service(s) booked successfully!\n`;
//           setActiveTab('bookings');
//         }
        
//         if (productItems.length > 0) {
//           finalMessage += `${productItems.length} product(s) ordered successfully!\n`;
//           if (serviceItems.length === 0) {
//             setActiveTab('orders');
//           }
//         }
        
//         finalMessage += '\nCheck the respective sections for details.';
//         alert(finalMessage);
//       }
      
//       // Refresh cart
//       await fetchCartItems(customer.id);
      
//     } catch (error) {
//       console.error('Error during checkout:', error);
//       alert('Failed to process checkout. Please try again.');
//     } finally {
//       setCheckoutLoading(false);
//     }
//   };

//   // Handle feedback submission
//   const handleAddFeedback = async () => {
//     if (!feedbackComment.trim() || !feedbackService.trim() || !customer) {
//       alert('Please fill all required fields');
//       return;
//     }

//     setIsSubmittingFeedback(true);
//     try {
//       const feedbackData = {
//         customerId: customer.id,
//         customerName: customer.name || 'Customer',
//         customerEmail: customer.email || '',
//         serviceOrProduct: feedbackService,
//         type: feedbackType,
//         rating: feedbackRating,
//         comment: feedbackComment,
//         status: 'pending' as const,
//         createdAt: serverTimestamp()
//       };

//       console.log('Submitting feedback:', feedbackData);

//       // Add to Firebase feedbacks collection
//       const docRef = await addDoc(collection(db, 'feedbacks'), feedbackData);
      
//       // Also add a transaction record for points
//       if (feedbackRating >= 4) {
//         const pointsEarned = feedbackRating === 5 ? 50 : 25;
//         await addDoc(collection(db, 'transactions'), {
//           customerId: customer.id,
//           type: 'points_earned',
//           pointsAmount: pointsEarned,
//           amount: 0,
//           description: `Feedback points for ${feedbackService}`,
//           status: 'success',
//           createdAt: serverTimestamp()
//         });

//         // Update wallet points
//         if (wallet) {
//           await addDoc(collection(db, 'wallets'), {
//             customerId: customer.id,
//             balance: wallet.balance,
//             loyaltyPoints: wallet.loyaltyPoints + pointsEarned,
//             totalPointsEarned: wallet.totalPointsEarned + pointsEarned,
//             totalPointsRedeemed: wallet.totalPointsRedeemed,
//             updatedAt: serverTimestamp()
//           });
//         }
//       }

//       // Clear form
//       setFeedbackComment('');
//       setFeedbackService('');
//       setFeedbackRating(5);
//       setShowFeedbackForm(false);
      
//       alert('Thank you for your feedback! You have earned loyalty points.');
      
//     } catch (error) {
//       console.error('Error submitting feedback:', error);
//       alert('Failed to submit feedback. Please try again.');
//     } finally {
//       setIsSubmittingFeedback(false);
//     }
//   };

//   // Handle quick service booking - FIXED for service name
//   const handleQuickBook = async (service: Service) => {
//     if (!customer) {
//       router.push('/customer/login');
//       return;
//     }

//     try {
//       console.log('Creating booking for service:', service);
      
//       const bookingData = {
//         customerId: customer.id,
//         customerName: customer.name || 'Customer',
//         customerEmail: customer.email || '',
//         serviceId: service.id,
//         serviceName: service.name, // FIXED: Include serviceName
//         servicePrice: service.price || 0,
//         date: new Date().toISOString().split('T')[0],
//         time: '10:00 AM',
//         totalAmount: service.price || 0,
//         status: 'pending',
//         createdAt: serverTimestamp(),
//         notes: 'Quick booking from portal'
//       };

//       console.log('Booking data to save:', bookingData);

//       // Add booking
//       const bookingRef = await addDoc(collection(db, 'bookings'), bookingData);
//       console.log('Booking created with ID:', bookingRef.id);
      
//       // Add transaction
//       await addDoc(collection(db, 'transactions'), {
//         customerId: customer.id,
//         type: 'booking',
//         amount: -(service.price || 0),
//         description: `Booking for ${service.name}`,
//         status: 'success',
//         referenceId: bookingRef.id,
//         createdAt: serverTimestamp()
//       });

//       alert(`Booking created for ${service.name}! Check your bookings.`);
      
//       // Automatically switch to bookings tab
//       setActiveTab('bookings');
      
//     } catch (error) {
//       console.error('Error creating booking:', error);
//       alert('Failed to create booking. Please try again.');
//     }
//   };

//   // Handle confirm booking
//   const handleConfirmBooking = async (bookingId: string) => {
//     if (!customer) return;
    
//     setConfirmingBooking(bookingId);
//     try {
//       const booking = bookings.find(b => b.id === bookingId);
//       if (!booking) {
//         alert('Booking not found');
//         return;
//       }

//       // Update booking status to confirmed
//       await updateDoc(doc(db, 'bookings', bookingId), {
//         status: 'confirmed',
//         confirmedAt: serverTimestamp()
//       });

//       // Add transaction for payment
//       await addDoc(collection(db, 'transactions'), {
//         customerId: customer.id,
//         type: 'booking',
//         amount: -(booking.totalAmount || 0),
//         description: `Payment for ${booking.serviceName} booking`,
//         status: 'success',
//         referenceId: bookingId,
//         createdAt: serverTimestamp()
//       });

//       // Update wallet balance
//       if (wallet) {
//         const newBalance = (wallet.balance || 0) - (booking.totalAmount || 0);
//         await updateDoc(doc(db, 'wallets', customer.id), {
//           balance: newBalance,
//           updatedAt: serverTimestamp()
//         });
//       }

//       alert('Booking confirmed successfully!');
      
//     } catch (error) {
//       console.error('Error confirming booking:', error);
//       alert('Failed to confirm booking. Please try again.');
//     } finally {
//       setConfirmingBooking(null);
//     }
//   };

//   // Handle cancel booking
//   const handleCancelBooking = async (bookingId: string) => {
//     if (!customer) return;
    
//     setCancellingBooking(bookingId);
//     try {
//       const booking = bookings.find(b => b.id === bookingId);
//       if (!booking) {
//         alert('Booking not found');
//         return;
//       }

//       // Confirm cancellation
//       if (!confirm('Are you sure you want to cancel this booking?')) {
//         setCancellingBooking(null);
//         return;
//       }

//       // Update booking status to cancelled
//       await updateDoc(doc(db, 'bookings', bookingId), {
//         status: 'cancelled',
//         cancelledAt: serverTimestamp()
//       });

//       // Add transaction for refund if booking was paid
//       if (booking.status === 'confirmed') {
//         await addDoc(collection(db, 'transactions'), {
//           customerId: customer.id,
//           type: 'refund',
//           amount: booking.totalAmount || 0,
//           description: `Refund for cancelled booking: ${booking.serviceName}`,
//           status: 'success',
//           referenceId: bookingId,
//           createdAt: serverTimestamp()
//         });

//         // Update wallet balance for refund
//         if (wallet) {
//           const newBalance = (wallet.balance || 0) + (booking.totalAmount || 0);
//           await updateDoc(doc(db, 'wallets', customer.id), {
//             balance: newBalance,
//             updatedAt: serverTimestamp()
//           });
//         }
//       }

//       alert('Booking cancelled successfully!');
      
//     } catch (error) {
//       console.error('Error cancelling booking:', error);
//       alert('Failed to cancel booking. Please try again.');
//     } finally {
//       setCancellingBooking(null);
//     }
//   };

//   // Handle complete booking
//   const handleCompleteBooking = async (bookingId: string) => {
//     if (!customer) return;
    
//     setCompletingBooking(bookingId);
//     try {
//       const booking = bookings.find(b => b.id === bookingId);
//       if (!booking) {
//         alert('Booking not found');
//         return;
//       }

//       // Update booking status to completed
//       await updateDoc(doc(db, 'bookings', bookingId), {
//         status: 'completed',
//         completedAt: serverTimestamp()
//       });

//       // Add loyalty points for completed service
//       const pointsEarned = 100;
//       await addDoc(collection(db, 'transactions'), {
//         customerId: customer.id,
//         type: 'points_earned',
//         pointsAmount: pointsEarned,
//         amount: 0,
//         description: `Points for completed service: ${booking.serviceName}`,
//         status: 'success',
//         referenceId: bookingId,
//         createdAt: serverTimestamp()
//       });

//       // Update wallet points
//       if (wallet) {
//         await updateDoc(doc(db, 'wallets', customer.id), {
//           loyaltyPoints: (wallet.loyaltyPoints || 0) + pointsEarned,
//           totalPointsEarned: (wallet.totalPointsEarned || 0) + pointsEarned,
//           updatedAt: serverTimestamp()
//         });
//       }

//       alert('Booking marked as completed! You earned 100 loyalty points.');
      
//     } catch (error) {
//       console.error('Error completing booking:', error);
//       alert('Failed to mark booking as completed. Please try again.');
//     } finally {
//       setCompletingBooking(null);
//     }
//   };

//   // Handle quick product purchase - FIXED for product name
//   const handleQuickPurchase = async (product: Product) => {
//     if (!customer) {
//       router.push('/customer/login');
//       return;
//     }

//     try {
//       console.log('Creating order for product:', product);
      
//       const orderData = {
//         customerId: customer.id,
//         customerName: customer.name || 'Customer',
//         customerEmail: customer.email || '',
//         products: [{
//           productId: product.id,
//           productName: product.name, // FIXED: Include productName
//           quantity: 1,
//           price: product.price || 0,
//           image: product.imageUrl || ''
//         }],
//         totalAmount: product.price || 0,
//         status: 'pending' as const,
//         createdAt: serverTimestamp(),
//         shippingAddress: '',
//         paymentMethod: 'wallet'
//       };

//       console.log('Order data to save:', orderData);

//       // Add order
//       const orderRef = await addDoc(collection(db, 'orders'), orderData);
//       console.log('Order created with ID:', orderRef.id);
      
//       // Add transaction
//       await addDoc(collection(db, 'transactions'), {
//         customerId: customer.id,
//         type: 'order',
//         amount: -(product.price || 0),
//         description: `Purchase of ${product.name}`,
//         status: 'success',
//         referenceId: orderRef.id,
//         createdAt: serverTimestamp()
//       });

//       alert(`Order placed for ${product.name}! Check your orders.`);
      
//       // Automatically switch to orders tab
//       setActiveTab('orders');
      
//     } catch (error) {
//       console.error('Error creating order:', error);
//       alert('Failed to place order. Please try again.');
//     }
//   };

//   // Helper functions
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'completed':
//       case 'delivered':
//       case 'approved':
//         return 'bg-green-100 text-green-700 border-green-200';
//       case 'confirmed':
//       case 'processing':
//       case 'shipped':
//         return 'bg-blue-100 text-blue-700 border-blue-200';
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-700 border-yellow-200';
//       case 'cancelled':
//       case 'rejected':
//         return 'bg-red-100 text-red-700 border-red-200';
//       default:
//         return 'bg-gray-100 text-gray-700 border-gray-200';
//     }
//   };

//   const calculatePointsValue = (points: number) => {
//     return points / 100;
//   };

//   const formatDate = (timestamp: any) => {
//     if (!timestamp) return 'N/A';
//     try {
//       const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
//       return format(date, 'MMM dd, yyyy');
//     } catch {
//       return 'Invalid date';
//     }
//   };

//   const formatDateTime = (timestamp: any) => {
//     if (!timestamp) return 'N/A';
//     try {
//       const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
//       return format(date, 'MMM dd, yyyy hh:mm a');
//     } catch {
//       return 'Invalid date';
//     }
//   };

//   const getTimeAgo = (timestamp: any) => {
//     if (!timestamp) return 'N/A';
//     try {
//       const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
//       return formatDistanceToNow(date, { addSuffix: true });
//     } catch {
//       return 'Some time ago';
//     }
//   };

//   // Calculate cart total
//   const cartTotal = cartItems.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0);
//   const cartItemsCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="w-12 h-12 animate-spin text-secondary mx-auto mb-4" />
//           <p className="text-lg font-serif text-primary">Loading your portal...</p>
//           <p className="text-sm text-muted-foreground mt-2">Please wait while we fetch your data</p>
//         </div>
//       </div>
//     );
//   }

//   if (!customer) {
//     return null;
//   }

//   // Calculate statistics
//   const totalSpent = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0) + 
//                      orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
//   const completedBookings = bookings.filter(b => b.status === 'completed').length;
//   const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
//   const pendingFeedbacks = feedbacks.filter(f => f.status === 'pending').length;
//   const approvedFeedbacks = feedbacks.filter(f => f.status === 'approved').length;
//   const walletPointsValue = wallet ? calculatePointsValue(wallet.loyaltyPoints) : 0;

//   // Get recent items
//   const recentBookings = bookings.slice(0, 3);
//   const recentOrders = orders.slice(0, 3);
//   const recentFeedbacks = feedbacks.slice(0, 3);
//   const recentTransactions = transactions.slice(0, 5);

//   return (
//     <div className="min-h-screen bg-[#fcfcfc]">
//       <Header />

//       <div className="pt-24 pb-16 px-4">
//         <div className="max-w-7xl mx-auto">
//           {/* Welcome Banner */}
//           <div className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
//             <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
//             <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            
//             <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
//               <div className="flex items-center gap-4">
//                 <Avatar className="w-20 h-20 border-4 border-secondary/30">
//                   <AvatarImage src={customer.avatar} />
//                   <AvatarFallback className="bg-secondary text-primary text-2xl font-bold">
//                     {customer.name.charAt(0).toUpperCase()}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <div className="flex items-center gap-2 mb-1">
//                     <Sparkles className="w-4 h-4 text-yellow-300" />
//                     <span className="text-xs font-bold uppercase tracking-widest text-white/70">Premium Member</span>
//                   </div>
//                   <h1 className="text-3xl font-serif font-bold">{customer.name}</h1>
//                   <p className="text-white/70">{customer.email}</p>
//                   <div className="flex items-center gap-4 mt-2">
//                     <span className="text-sm text-white/70">
//                       📞 {customer.phone || 'Not provided'}
//                     </span>
//                     <span className="text-sm text-white/70">
//                       📅 Member since {customer.createdAt ? formatDate(customer.createdAt) : 'Recently'}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex flex-wrap gap-3">
//                 <Link href="/customer/portal/profile">
//                   <Button variant="outline" className="border-white/30 text-white bg-white/10 hover:bg-white/20 rounded-xl">
//                     <Settings className="w-4 h-4 mr-2" />
//                     Profile Settings
//                   </Button>
//                 </Link>
//                 <Button 
//                   onClick={handleLogout} 
//                   variant="outline" 
//                   className="border-white/30 text-white bg-white/10 hover:bg-white/20 rounded-xl"
//                 >
//                   <LogOut className="w-4 h-4 mr-2" />
//                   Logout
//                 </Button>
//               </div>
//             </div>
//           </div>

//           {/* Index Error Warning */}
//           {hasIndexError && (
//             <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
//               <div className="flex items-center gap-3">
//                 <Sparkles className="w-5 h-5 text-yellow-600" />
//                 <div className="flex-1">
//                   <p className="font-medium text-yellow-800">Performance Notice</p>
//                   <p className="text-sm text-yellow-700">
//                     Running in optimized mode. For better performance, create Firestore indexes.
//                   </p>
//                   <a 
//                     href="https://console.firebase.google.com/v1/r/project/manofcave-v1/firestore/indexes" 
//                     target="_blank" 
//                     rel="noopener noreferrer"
//                     className="text-sm text-yellow-800 font-medium hover:underline mt-1 inline-block"
//                   >
//                     Create Indexes →
//                   </a>
//                 </div>
//                 <button 
//                   onClick={() => setHasIndexError(false)}
//                   className="text-yellow-600 hover:text-yellow-800"
//                 >
//                   <XCircle className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Debugging Buttons */}
//           <div className="mb-6 flex gap-3">
          
//             <Button 
//               onClick={() => fetchCustomerData(customer?.id || '')}
//               variant="outline"
//               size="sm"
//             >
//               Refresh Data
//             </Button>
//           </div>

//           {/* Tabs Navigation */}
//           <div className="mb-8">
//             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//               <TabsList className="grid grid-cols-6 w-full bg-gray-100 p-1 rounded-2xl">
//                 <TabsTrigger value="dashboard" className="rounded-xl data-[state=active]:bg-white">
//                   <Sparkles className="w-4 h-4 mr-2" />
//                   Dashboard
//                 </TabsTrigger>
//                 <TabsTrigger value="cart" className="rounded-xl data-[state=active]:bg-white">
//                   <ShoppingCart className="w-4 h-4 mr-2" />
//                   Cart ({cartItemsCount})
//                 </TabsTrigger>
//                 <TabsTrigger value="bookings" className="rounded-xl data-[state=active]:bg-white">
//                   <Calendar className="w-4 h-4 mr-2" />
//                   Bookings ({bookings.length})
//                 </TabsTrigger>
//                 <TabsTrigger value="orders" className="rounded-xl data-[state=active]:bg-white">
//                   <Package className="w-4 h-4 mr-2" />
//                   Orders ({orders.length})
//                 </TabsTrigger>
//                 <TabsTrigger value="feedbacks" className="rounded-xl data-[state=active]:bg-white">
//                   <Star className="w-4 h-4 mr-2" />
//                   Reviews ({feedbacks.length})
//                 </TabsTrigger>
//                 <TabsTrigger value="wallet" className="rounded-xl data-[state=active]:bg-white">
//                   <Wallet className="w-4 h-4 mr-2" />
//                   Wallet
//                 </TabsTrigger>
//               </TabsList>

//               {/* Dashboard Tab */}
//               <TabsContent value="dashboard" className="mt-6 space-y-8">
//                 {/* Quick Stats */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                   <Card className="border-none shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300">
//                     <CardContent className="p-6">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
//                             Wallet Balance
//                           </p>
//                           <p className="text-3xl font-bold text-primary">
//                             ${wallet?.balance?.toFixed(2) || '0.00'}
//                           </p>
//                           <p className="text-xs text-muted-foreground mt-1">
//                             ${walletPointsValue.toFixed(2)} in points
//                           </p>
//                         </div>
//                         <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
//                           <Wallet className="w-7 h-7 text-green-600" />
//                         </div>
//                       </div>
//                       <Button variant="ghost" className="w-full mt-4 text-secondary hover:text-secondary/80">
//                         <Plus className="w-4 h-4 mr-2" />
//                         Add Funds
//                       </Button>
//                     </CardContent>
//                   </Card>

//                   <Card className="border-none shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300">
//                     <CardContent className="p-6">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
//                             Loyalty Points
//                           </p>
//                           <p className="text-3xl font-bold text-secondary">
//                             {wallet?.loyaltyPoints?.toLocaleString() || '0'}
//                           </p>
//                           <p className="text-xs text-muted-foreground mt-1">
//                             {wallet?.totalPointsEarned?.toLocaleString() || '0'} total earned
//                           </p>
//                         </div>
//                         <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center">
//                           <Award className="w-7 h-7 text-secondary" />
//                         </div>
//                       </div>
//                       <Link href="/customer/portal/loyalty">
//                         <Button variant="ghost" className="w-full mt-4 text-secondary hover:text-secondary/80">
//                           <Gift className="w-4 h-4 mr-2" />
//                           Redeem Points
//                         </Button>
//                       </Link>
//                     </CardContent>
//                   </Card>

//                   <Card className="border-none shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300">
//                     <CardContent className="p-6">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
//                             My Cart
//                           </p>
//                           <p className="text-3xl font-bold text-primary">{cartItemsCount} items</p>
//                           <p className="text-xs text-muted-foreground mt-1">
//                             ${cartTotal.toFixed(2)} total
//                           </p>
//                         </div>
//                         <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
//                           <ShoppingCart className="w-7 h-7 text-purple-600" />
//                         </div>
//                       </div>
//                       <Link href="/products">
//                         <Button variant="ghost" className="w-full mt-4 text-secondary hover:text-secondary/80">
//                           <Plus className="w-4 h-4 mr-2" />
//                           Add More Items
//                         </Button>
//                       </Link>
//                     </CardContent>
//                   </Card>

//                   <Card className="border-none shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300">
//                     <CardContent className="p-6">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
//                             Service Bookings
//                           </p>
//                           <p className="text-3xl font-bold text-primary">{bookings.length}</p>
//                           <p className="text-xs text-muted-foreground mt-1">
//                             {completedBookings} completed
//                           </p>
//                         </div>
//                         <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
//                           <Calendar className="w-7 h-7 text-blue-600" />
//                         </div>
//                       </div>
//                       <Link href="/services">
//                         <Button variant="ghost" className="w-full mt-4 text-secondary hover:text-secondary/80">
//                           <Calendar className="w-4 h-4 mr-2" />
//                           Book Service
//                         </Button>
//                       </Link>
//                     </CardContent>
//                   </Card>
//                 </div>

//                 {/* Recent Activity & Quick Actions */}
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                   {/* Left Column - Recent Bookings & Orders */}
//                   <div className="lg:col-span-2 space-y-6">
//                     {/* Recent Bookings */}
//                     <Card className="border-none shadow-lg rounded-2xl">
//                       <CardHeader className="flex flex-row items-center justify-between pb-4">
//                         <div>
//                           <CardTitle className="text-lg font-serif">Recent Bookings</CardTitle>
//                           <CardDescription>Your latest service appointments</CardDescription>
//                         </div>
//                         <Link href="/customer/portal?tab=bookings">
                         
//                         </Link>
//                       </CardHeader>
//                       <CardContent>
//                         {recentBookings.length === 0 ? (
//                           <div className="text-center py-8">
//                             <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
//                             <p className="text-muted-foreground">No bookings yet</p>
//                             <Link href="/services">
//                               <Button className="mt-4 bg-secondary hover:bg-secondary/90 text-primary rounded-xl">
//                                 <Calendar className="w-4 h-4 mr-2" />
//                                 Book Your First Service
//                               </Button>
//                             </Link>
//                           </div>
//                         ) : (
//                           <div className="space-y-4">
//                             {recentBookings.map((booking) => (
//                               <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
//                                 <div className="flex items-center gap-4">
//                                   <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
//                                     <Calendar className="w-6 h-6 text-primary" />
//                                   </div>
//                                   <div>
//                                     <p className="font-semibold text-sm">{booking.serviceName}</p>
                                    
//                                     <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                                       <Clock className="w-3 h-3" />
//                                       {booking.date} at {booking.time}
//                                     </div>

                                     
//                                     <p className="text-xs text-muted-foreground mt-1">
//                                       Booked {getTimeAgo(booking.createdAt)}
//                                     </p>
//                                   </div>
//                                 </div>
//                                 <div className="text-right">
//                                   <Badge className={`${getStatusColor(booking.status)} capitalize`}>
//                                     {booking.status}
//                                   </Badge>
//                                   <p className="text-sm font-bold text-primary mt-1">${booking.totalAmount}</p>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </CardContent>
//                     </Card>

//                     {/* Recent Orders */}
//                     <Card className="border-none shadow-lg rounded-2xl">
//                       <CardHeader className="flex flex-row items-center justify-between pb-4">
//                         <div>
//                           <CardTitle className="text-lg font-serif">Recent Orders</CardTitle>
//                           <CardDescription>Your latest product purchases</CardDescription>
//                         </div>
//                         <Link href="/customer/portal?tab=orders">
                          
//                         </Link>
//                       </CardHeader>
//                       <CardContent>
//                         {recentOrders.length === 0 ? (
//                           <div className="text-center py-8">
//                             <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
//                             <p className="text-muted-foreground">No orders yet</p>
//                             <Link href="/products">
//                               <Button className="mt-4 bg-secondary hover:bg-secondary/90 text-primary rounded-xl">
//                                 <ShoppingCart className="w-4 h-4 mr-2" />
//                                 Shop Products
//                               </Button>
//                             </Link>
//                           </div>
//                         ) : (
//                           <div className="space-y-4">
//                             {recentOrders.map((order) => (
//                               <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
//                                 <div className="flex items-center gap-4">
//                                   <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
//                                     <Package className="w-6 h-6 text-purple-600" />
//                                   </div>
//                                   <div>
//                                     <p className="font-semibold text-sm">
//                                       {order.products.length} {order.products.length === 1 ? 'item' : 'items'}
//                                     </p>
//                                     <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                                       <Clock className="w-3 h-3" />
//                                       Ordered {getTimeAgo(order.createdAt)}
//                                     </div>
//                                     <p className="text-xs text-muted-foreground mt-1">
//                                       {order.products.slice(0, 2).map(p => p.productName).join(', ')}
//                                       {order.products.length > 2 && '...'}
//                                     </p>
//                                   </div>
//                                 </div>
//                                 <div className="text-right">
//                                   <Badge className={`${getStatusColor(order.status)} capitalize`}>
//                                     {order.status}
//                                   </Badge>
//                                   <p className="text-sm font-bold text-primary mt-1">${order.totalAmount}</p>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </CardContent>
//                     </Card>
//                   </div>

//                   {/* Right Column - Quick Actions & Recent Transactions */}
//                   <div className="space-y-6">
//                     {/* Quick Book Services */}
//                     <Card className="border-none shadow-lg rounded-2xl">
//                       <CardHeader className="pb-4">
//                         <CardTitle className="text-lg font-serif flex items-center gap-2">
//                           <Sparkles className="w-5 h-5 text-secondary" />
//                           Quick Services
//                         </CardTitle>
//                       </CardHeader>
//                       <CardContent>
//                         <div className="space-y-3">
//                           {recentServices.slice(0, 3).map((service) => (
//                             <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
//                               <div className="flex items-center gap-3">
//                                 <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                                   <img 
//                                     src={service.imageUrl || 'https://images.unsplash.com/photo-1512690196222-7c7d3f993c1b?q=80&w=2070&auto=format&fit=crop'} 
//                                     alt={service.name}
//                                     className="w-full h-full object-cover rounded-lg"
//                                   />
//                                 </div>
//                                 <div>
//                                   <p className="font-semibold text-sm">{service.name}</p>
//                                   <p className="text-xs text-muted-foreground">${service.price}</p>
//                                   {/* Branch Display */}
//                                   {service.branchNames && service.branchNames.length > 0 && (
//                                     <div className="flex items-center gap-1 mt-1">
//                                       <MapPin className="w-3 h-3 text-gray-500" />
//                                       <span className="text-xs text-gray-600">
//                                         {service.branchNames.join(', ')}
//                                       </span>
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                               <div className="flex gap-2">
//                                 <Button 
//                                   size="sm" 
//                                   className="bg-secondary hover:bg-secondary/90 text-primary rounded-lg"
//                                   onClick={() => handleAddServiceToCart(service)}
//                                 >
//                                   <ShoppingCart className="w-3 h-3 mr-1" />
//                                   Add to Cart
//                                 </Button>
//                                 <Button 
//                                   size="sm" 
//                                   variant="outline"
//                                   className="rounded-lg"
//                                   onClick={() => handleQuickBook(service)}
//                                 >
//                                   Book Now
//                                 </Button>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                         <Link href="/services">
//                           <Button variant="ghost" className="w-full mt-4 text-secondary hover:text-secondary/80">
//                             View All Services <ChevronRight className="w-4 h-4 ml-1" />
//                           </Button>
//                         </Link>
//                       </CardContent>
//                     </Card>

//                     {/* Quick Products */}
//                     <Card className="border-none shadow-lg rounded-2xl">
//                       <CardHeader className="pb-4">
//                         <CardTitle className="text-lg font-serif flex items-center gap-2">
//                           <Package className="w-5 h-5 text-secondary" />
//                           Quick Products
//                         </CardTitle>
//                       </CardHeader>
//                       <CardContent>
//                         <div className="space-y-3">
//                           {recentProducts.slice(0, 3).map((product) => (
//                             <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
//                               <div className="flex items-center gap-3">
//                                 <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
//                                   <img 
//                                     src={product.imageUrl || 'https://images.unsplash.com/photo-1512690196222-7c7d3f993c1b?q=80&w=2070&auto=format&fit=crop'} 
//                                     alt={product.name}
//                                     className="w-full h-full object-cover rounded-lg"
//                                   />
//                                 </div>
//                                 <div>
//                                   <p className="font-semibold text-sm">{product.name}</p>
//                                   <p className="text-xs text-muted-foreground">${product.price}</p>
//                                   {/* Branch Display */}
//                                   {product.branchNames && product.branchNames.length > 0 && (
//                                     <div className="flex items-center gap-1 mt-1">
//                                       <MapPin className="w-3 h-3 text-gray-500" />
//                                       <span className="text-xs text-gray-600">
//                                         {product.branchNames.join(', ')}
//                                       </span>
//                                     </div>
//                                   )}
//                                   {/* SKU Display */}
//                                   {product.sku && (
//                                     <div className="flex items-center gap-1 mt-1">
//                                       <Tag className="w-3 h-3 text-gray-500" />
//                                       <span className="text-xs text-gray-600">SKU: {product.sku}</span>
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                               <div className="flex gap-2">
//                                 <Button 
//                                   size="sm" 
//                                   className="bg-secondary hover:bg-secondary/90 text-primary rounded-lg"
//                                   onClick={() => handleAddProductToCart(product)}
//                                 >
//                                   <ShoppingCart className="w-3 h-3 mr-1" />
//                                   Add to Cart
//                                 </Button>
//                                 <Button 
//                                   size="sm" 
//                                   variant="outline"
//                                   className="rounded-lg"
//                                   onClick={() => handleQuickPurchase(product)}
//                                 >
//                                   Buy Now
//                                 </Button>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                         <Link href="/products">
//                           <Button variant="ghost" className="w-full mt-4 text-secondary hover:text-secondary/80">
//                             View All Products <ChevronRight className="w-4 h-4 ml-1" />
//                           </Button>
//                         </Link>
//                       </CardContent>
//                     </Card>

//                     {/* Recent Transactions */}
//                     <Card className="border-none shadow-lg rounded-2xl">
//                       <CardHeader className="pb-4">
//                         <CardTitle className="text-lg font-serif flex items-center gap-2">
//                           <History className="w-5 h-5 text-secondary" />
//                           Recent Activity
//                         </CardTitle>
//                       </CardHeader>
//                       <CardContent>
//                         {recentTransactions.length === 0 ? (
//                           <div className="text-center py-4">
//                             <History className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
//                             <p className="text-sm text-muted-foreground">No transactions yet</p>
//                           </div>
//                         ) : (
//                           <div className="space-y-3">
//                             {recentTransactions.map((txn) => (
//                               <div key={txn.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
//                                 <div className="flex items-center gap-3">
//                                   <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                                     txn.amount > 0 || txn.pointsAmount > 0 
//                                       ? 'bg-green-100' 
//                                       : 'bg-red-100'
//                                   }`}>
//                                     {(txn.amount > 0 || txn.pointsAmount > 0) ? (
//                                       <ArrowUpRight className="w-4 h-4 text-green-600" />
//                                     ) : (
//                                       <ArrowUpRight className="w-4 h-4 text-red-600 rotate-180" />
//                                     )}
//                                   </div>
//                                   <div>
//                                     <p className="text-sm font-medium truncate max-w-[150px]">{txn.description}</p>
//                                     <p className="text-xs text-muted-foreground">
//                                       {getTimeAgo(txn.createdAt)}
//                                     </p>
//                                   </div>
//                                 </div>
//                                 <div className="text-right">
//                                   {txn.pointsAmount !== 0 && (
//                                     <p className={`text-sm font-bold ${txn.pointsAmount > 0 ? 'text-green-600' : 'text-red-600'}`}>
//                                       {txn.pointsAmount > 0 ? '+' : ''}{txn.pointsAmount} pts
//                                     </p>
//                                   )}
//                                   {txn.amount !== 0 && (
//                                     <p className={`text-sm font-bold ${txn.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
//                                       {txn.amount > 0 ? '+' : ''}${Math.abs(txn.amount).toFixed(2)}
//                                     </p>
//                                   )}
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                         <Button 
//                           variant="ghost" 
//                           className="w-full mt-4 text-secondary hover:text-secondary/80"
//                           onClick={() => setActiveTab('wallet')}
//                         >
//                           View All Transactions <ChevronRight className="w-4 h-4 ml-1" />
//                         </Button>
//                       </CardContent>
//                     </Card>
//                   </div>
//                 </div>
//               </TabsContent>

//               {/* Cart Tab - FIXED */}
//               <TabsContent value="cart" className="mt-6">
//                 <Card className="border-none shadow-lg rounded-2xl">
//                   <CardHeader>
//                     <div className="flex flex-col md:flex-row md:items-center justify-between">
//                       <div>
//                         <CardTitle className="text-2xl font-serif">My Shopping Cart</CardTitle>
//                         <CardDescription>Review and manage your selected items - Services & Products</CardDescription>
//                       </div>
//                       <div className="mt-4 md:mt-0 flex items-center gap-3">
//                         <p className="text-lg font-bold text-primary">
//                           Total: <span className="text-2xl">${cartTotal.toFixed(2)}</span>
//                         </p>
//                         <Button
//                           onClick={handleCheckout}
//                           disabled={cartItems.length === 0 || checkoutLoading}
//                           className="bg-secondary hover:bg-secondary/90 text-primary rounded-xl px-8"
//                         >
//                           {checkoutLoading ? (
//                             <>
//                               <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                               Processing...
//                             </>
//                           ) : (
//                             <>
//                               <ShoppingCart className="w-4 h-4 mr-2" />
//                               Checkout Now
//                             </>
//                           )}
//                         </Button>
//                       </div>
//                     </div>
//                   </CardHeader>
                  
//                   <CardContent>
//                     {isLoadingCart ? (
//                       <div className="text-center py-12">
//                         <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
//                         <p className="text-lg font-semibold text-primary">Loading your cart...</p>
//                       </div>
//                     ) : cartItems.length === 0 ? (
//                       <div className="text-center py-12">
//                         <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
//                         <h3 className="text-lg font-semibold text-gray-700 mb-2">Your cart is empty</h3>
//                         <p className="text-gray-500 mb-6">Add some services or products to get started</p>
//                         <div className="flex gap-4 justify-center">
//                           <Link href="/services">
//                             <Button className="bg-secondary hover:bg-secondary/90 text-primary rounded-xl px-6">
//                               <Calendar className="w-4 h-4 mr-2" />
//                               Browse Services
//                             </Button>
//                           </Link>
//                           <Link href="/products">
//                             <Button variant="outline" className="rounded-xl px-6">
//                               <Package className="w-4 h-4 mr-2" />
//                               Browse Products
//                             </Button>
//                           </Link>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="space-y-4">
//                         {cartItems.map((item) => {
//                           console.log('Displaying cart item:', item); // Debug log
//                           return (
//                             <div key={item.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">
//                               <div className="flex items-start gap-4 mb-4 md:mb-0">
//                                 <div className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
//                                   <img 
//                                     src={item.itemImage} 
//                                     alt={item.itemName}
//                                     className="w-full h-full object-cover"
//                                     onError={(e) => {
//                                       (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1512690196222-7c7d3f993c1b?q=80&w=2070&auto=format&fit=crop';
//                                     }}
//                                   />
//                                 </div>
//                                 <div>
//                                   <div className="flex items-center gap-2 mb-1">
//                                     <h3 className="text-lg font-semibold text-primary">{item.itemName || 'Unnamed Item'}</h3>
//                                     <Badge variant="outline" className={
//                                       item.type === 'service' 
//                                         ? 'bg-blue-100 text-blue-700 border-blue-200' 
//                                         : 'bg-purple-100 text-purple-700 border-purple-200'
//                                     }>
//                                       {item.type === 'service' ? 'Service' : 'Product'}
//                                     </Badge>
//                                   </div>
                                  
//                                   {/* Branch Display in Cart */}
//                                   {item.branchNames && item.branchNames.length > 0 && (
//                                     <div className="flex items-center gap-1 mb-2">
//                                       <MapPin className="w-4 h-4 text-gray-500" />
//                                       <span className="text-sm text-gray-600">
//                                         Available at: {item.branchNames.join(', ')}
//                                       </span>
//                                     </div>
//                                   )}
                                  
//                                   <p className="text-sm text-muted-foreground mt-1">
//                                     Added {getTimeAgo(item.addedAt)}
//                                   </p>
//                                   <div className="flex items-center gap-4 mt-2">
//                                     <div className="flex items-center gap-2">
//                                       <span className="text-sm font-medium">Quantity:</span>
//                                       <div className="flex items-center gap-1">
//                                         <Button
//                                           size="sm"
//                                           variant="outline"
//                                           className="h-6 w-6 p-0"
//                                           onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
//                                           disabled={updatingCartItem === item.id || item.quantity <= 1}
//                                         >
//                                           -
//                                         </Button>
//                                         <span className="w-8 text-center font-bold">{item.quantity}</span>
//                                         <Button
//                                           size="sm"
//                                           variant="outline"
//                                           className="h-6 w-6 p-0"
//                                           onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
//                                           disabled={updatingCartItem === item.id}
//                                         >
//                                           +
//                                         </Button>
//                                       </div>
//                                     </div>
//                                     <Button
//                                       variant="ghost"
//                                       size="sm"
//                                       onClick={() => handleRemoveFromCart(item.id)}
//                                       disabled={removingCartItem === item.id}
//                                       className="text-red-600 hover:text-red-700 hover:bg-red-50"
//                                     >
//                                       {removingCartItem === item.id ? (
//                                         <Loader2 className="w-4 h-4 mr-1 animate-spin" />
//                                       ) : (
//                                         <Trash2 className="w-4 h-4 mr-1" />
//                                       )}
//                                       Remove
//                                     </Button>
//                                   </div>
//                                 </div>
//                               </div>
                              
//                               <div className="text-right">
//                                 <p className="text-2xl font-bold text-primary">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
//                                 <p className="text-sm text-muted-foreground">${item.price} each</p>
//                                 {item.type === 'service' && (
//                                   <p className="text-xs text-blue-600 mt-1">
//                                     Will be booked on checkout
//                                   </p>
//                                 )}
//                               </div>
//                             </div>
//                           );
//                         })}
                        
//                         {/* Cart Summary */}
//                         <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
//                           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                             <div>
//                               <p className="text-lg font-semibold text-primary">Order Summary</p>
//                               <p className="text-sm text-muted-foreground">
//                                 {cartItemsCount} items in cart
//                               </p>
//                               <div className="flex gap-4 mt-2">
//                                 <Badge className="bg-blue-100 text-blue-700 border-blue-200">
//                                   Services: {cartItems.filter(item => item.type === 'service').length}
//                                 </Badge>
//                                 <Badge className="bg-purple-100 text-purple-700 border-purple-200">
//                                   Products: {cartItems.filter(item => item.type === 'product').length}
//                                 </Badge>
//                               </div>
//                             </div>
//                             <div className="space-y-2">
//                               <div className="flex justify-between">
//                                 <span className="text-gray-600">Subtotal:</span>
//                                 <span className="font-semibold">${cartTotal.toFixed(2)}</span>
//                               </div>
//                               <div className="flex justify-between">
//                                 <span className="text-gray-600">Shipping:</span>
//                                 <span className="font-semibold">$0.00</span>
//                               </div>
//                               <div className="flex justify-between text-lg font-bold border-t pt-2">
//                                 <span>Total:</span>
//                                 <span className="text-primary">${cartTotal.toFixed(2)}</span>
//                               </div>
//                             </div>
//                           </div>
                          
//                           <div className="mt-6 flex flex-col sm:flex-row gap-3">
//                             <Button
//                               onClick={handleCheckout}
//                               disabled={checkoutLoading}
//                               className="flex-1 bg-secondary hover:bg-secondary/90 text-primary rounded-xl py-6 text-lg font-bold"
//                             >
//                               {checkoutLoading ? (
//                                 <>
//                                   <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                                   Processing...
//                                 </>
//                               ) : (
//                                 <>
//                                   <ShoppingCart className="w-5 h-5 mr-2" />
//                                   Proceed to Checkout
//                                 </>
//                               )}
//                             </Button>
//                             <div className="flex-1 flex gap-3">
//                               <Link href="/services" className="flex-1">
//                                 <Button variant="outline" className="w-full rounded-xl py-6">
//                                   <Calendar className="w-5 h-5 mr-2" />
//                                   Add Services
//                                 </Button>
//                               </Link>
//                               <Link href="/products" className="flex-1">
//                                 <Button variant="outline" className="w-full rounded-xl py-6">
//                                   <Package className="w-5 h-5 mr-2" />
//                                   Add Products
//                                 </Button>
//                               </Link>
//                             </div>
//                           </div>
                          
//                           {/* Info Message */}
//                           <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
//                             <div className="flex items-center gap-2">
//                               <Sparkles className="w-4 h-4 text-blue-600" />
//                               <p className="text-sm text-blue-700">
//                                 <span className="font-semibold">Note:</span> Services in cart will be booked and products will be ordered when you checkout.
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               {/* Bookings Tab */}
//               <TabsContent value="bookings" className="mt-6">
//                 <Card className="border-none shadow-lg rounded-2xl">
//                   <CardHeader>
//                     <CardTitle className="text-2xl font-serif">My Service Bookings</CardTitle>
//                     <CardDescription>All your service appointments - Confirm, cancel or mark as completed</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     {bookings.length === 0 ? (
//                       <div className="text-center py-12">
//                         <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
//                         <h3 className="text-lg font-semibold text-gray-700 mb-2">No bookings yet</h3>
//                         <p className="text-gray-500 mb-6">Book your first service to get started</p>
//                         <Link href="/services">
//                           <Button className="bg-secondary hover:bg-secondary/90 text-primary rounded-xl px-8">
//                             <Calendar className="w-4 h-4 mr-2" />
//                             Browse Services
//                           </Button>
//                         </Link>
//                       </div>
//                     ) : (
//                       <div className="space-y-6">
//                         {bookings.map((booking) => (
//                           <Card key={booking.id} className="border shadow-sm">
//                             <CardContent className="p-6">
//                               <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
//                                 <div className="flex-1">
//                                   <div className="flex items-center gap-3 mb-4">
//                                     <Calendar className="w-5 h-5 text-primary" />
//                                     <h3 className="text-lg font-semibold">{booking.serviceName}</h3>
//                                   </div>
                                  
//                                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
//                                     <div>
//                                       <span className="font-medium">Date & Time:</span>
//                                       <p className="text-muted-foreground">{booking.date} at {booking.time}</p>
//                                     </div>
//                                     <div>
//                                       <span className="font-medium">Booked On:</span>
//                                       <p className="text-muted-foreground">{formatDateTime(booking.createdAt)}</p>
//                                     </div>
//                                     <div>
//                                       <span className="font-medium">Service Price:</span>
//                                       <p className="text-muted-foreground">${booking.servicePrice}</p>
//                                     </div>
//                                     <div>
//                                       <span className="font-medium">Total Amount:</span>
//                                       <p className="text-muted-foreground">${booking.totalAmount}</p>
//                                     </div>
//                                     <div>
//                                       <span className="font-medium">Booking ID:</span>
//                                       <p className="text-muted-foreground text-sm">{booking.id.slice(0, 8)}...</p>
//                                     </div>
//                                   </div>
                                  
//                                   {booking.notes && (
//                                     <div className="mb-4">
//                                       <span className="font-medium">Notes:</span>
//                                       <p className="text-muted-foreground">{booking.notes}</p>
//                                     </div>
//                                   )}
                                  
//                                   {/* Action Buttons */}
//                                   <div className="flex flex-wrap gap-3 mt-4">
//                                     {/* Confirm/Checkout Button - only for pending bookings */}
//                                     {booking.status === 'pending' && (
//                                       <Button
//                                         onClick={() => handleConfirmBooking(booking.id)}
//                                         disabled={confirmingBooking === booking.id}
//                                         className="bg-green-600 hover:bg-green-700 text-white"
//                                       >
//                                         {confirmingBooking === booking.id ? (
//                                           <>
//                                             <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                                             Confirming...
//                                           </>
//                                         ) : (
//                                           <>
//                                             <CreditCard className="w-4 h-4 mr-2" />
//                                             Confirm & Pay
//                                           </>
//                                         )}
//                                       </Button>
//                                     )}
                                    
//                                     {/* Complete Button - only for confirmed bookings */}
//                                     {booking.status === 'confirmed' && (
//                                       <Button
//                                         onClick={() => handleCompleteBooking(booking.id)}
//                                         disabled={completingBooking === booking.id}
//                                         className="bg-blue-600 hover:bg-blue-700 text-white"
//                                       >
//                                         {completingBooking === booking.id ? (
//                                           <>
//                                             <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                                             Completing...
//                                           </>
//                                         ) : (
//                                           <>
//                                             <Check className="w-4 h-4 mr-2" />
//                                             Mark as Completed
//                                           </>
//                                         )}
//                                       </Button>
//                                     )}
                                    
//                                     {/* Cancel Button - for pending and confirmed bookings */}
//                                     {(booking.status === 'pending' || booking.status === 'confirmed') && (
//                                       <Button
//                                         onClick={() => handleCancelBooking(booking.id)}
//                                         disabled={cancellingBooking === booking.id}
//                                         variant="outline"
//                                         className="text-red-600 border-red-300 hover:bg-red-50"
//                                       >
//                                         {cancellingBooking === booking.id ? (
//                                           <>
//                                             <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                                             Cancelling...
//                                           </>
//                                         ) : (
//                                           <>
//                                             <X className="w-4 h-4 mr-2" />
//                                             Cancel Booking
//                                           </>
//                                         )}
//                                       </Button>
//                                     )}
                                    
//                                     {/* View Details Button */}
//                                     <Button
//                                       variant="ghost"
//                                       onClick={() => console.log('Booking details:', booking)}
//                                     >
//                                       <Eye className="w-4 h-4 mr-2" />
//                                       View Details
//                                     </Button>
//                                   </div>
//                                 </div>
                                
//                                 <div className="lg:w-1/4 flex flex-col items-end gap-4">
//                                   <Badge className={`${getStatusColor(booking.status)} text-sm px-3 py-1`}>
//                                     {booking.status.toUpperCase()}
//                                   </Badge>
                                  
//                                   <div className="text-right">
//                                     <p className="text-2xl font-bold text-primary">${booking.totalAmount}</p>
//                                     <p className="text-sm text-muted-foreground">Total Amount</p>
//                                   </div>
                                  
//                                   {/* Status-specific messages */}
//                                   {booking.status === 'pending' && (
//                                     <div className="text-sm text-yellow-600 bg-yellow-50 px-3 py-2 rounded-lg">
//                                       <Clock className="w-4 h-4 inline mr-1" />
//                                       Awaiting confirmation
//                                     </div>
//                                   )}
//                                   {booking.status === 'confirmed' && (
//                                     <div className="text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
//                                       <CheckCircle className="w-4 h-4 inline mr-1" />
//                                       Confirmed & Paid
//                                     </div>
//                                   )}
//                                   {booking.status === 'completed' && (
//                                     <div className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
//                                       <Award className="w-4 h-4 inline mr-1" />
//                                       Completed
//                                     </div>
//                                   )}
//                                   {booking.status === 'cancelled' && (
//                                     <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
//                                       <XCircle className="w-4 h-4 inline mr-1" />
//                                       Cancelled
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             </CardContent>
//                           </Card>
//                         ))}
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               {/* Orders Tab */}
//               <TabsContent value="orders" className="mt-6">
//                 <Card className="border-none shadow-lg rounded-2xl">
//                   <CardHeader>
//                     <CardTitle className="text-2xl font-serif">My Product Orders</CardTitle>
//                     <CardDescription>Track all your product purchases</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     {orders.length === 0 ? (
//                       <div className="text-center py-12">
//                         <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
//                         <h3 className="text-lg font-semibold text-gray-700 mb-2">No orders yet</h3>
//                         <p className="text-gray-500 mb-6">Start shopping our premium products</p>
//                         <Link href="/products">
//                           <Button className="bg-secondary hover:bg-secondary/90 text-primary rounded-xl px-8">
//                             <ShoppingCart className="w-4 h-4 mr-2" />
//                             Shop Products
//                           </Button>
//                         </Link>
//                       </div>
//                     ) : (
//                       <div className="space-y-6">
//                         {orders.map((order) => (
//                           <Card key={order.id} className="border shadow-sm">
//                             <CardContent className="p-6">
//                               <div className="flex flex-col md:flex-row justify-between gap-6">
//                                 <div className="flex-1">
//                                   <div className="flex items-center gap-3 mb-4">
//                                     <Package className="w-5 h-5 text-purple-600" />
//                                     <div>
//                                       <h3 className="text-lg font-semibold">Order #{order.id.slice(0, 8)}</h3>
//                                       <p className="text-sm text-muted-foreground">
//                                         Placed on {formatDateTime(order.createdAt)}
//                                       </p>
//                                     </div>
//                                   </div>
                                  
//                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                                     <div>
//                                       <h4 className="font-medium mb-2">Products:</h4>
//                                       <ul className="space-y-2">
//                                         {order.products.map((product, idx) => (
//                                           <li key={idx} className="flex items-center justify-between text-sm">
//                                             <div className="flex items-center gap-2">
//                                               {product.image && (
//                                                 <img 
//                                                   src={product.image} 
//                                                   alt={product.productName}
//                                                   className="w-8 h-8 rounded-md object-cover"
//                                                 />
//                                               )}
//                                               <span>{product.productName}</span>
//                                             </div>
//                                             <span className="text-muted-foreground">
//                                               {product.quantity} × ${product.price}
//                                             </span>
//                                           </li>
//                                         ))}
//                                       </ul>
//                                     </div>
//                                     <div>
//                                       <h4 className="font-medium mb-2">Order Details:</h4>
//                                       <div className="space-y-1 text-sm">
//                                         <p>
//                                           <span className="font-medium">Items:</span> {order.products.length}
//                                         </p>
//                                         <p>
//                                           <span className="font-medium">Payment:</span> {order.paymentMethod || 'Not specified'}
//                                         </p>
//                                         {order.shippingAddress && (
//                                           <p>
//                                             <span className="font-medium">Shipping:</span> {order.shippingAddress}
//                                           </p>
//                                         )}
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
                                
//                                 <div className="flex flex-col items-end gap-4">
//                                   <Badge className={`${getStatusColor(order.status)} text-sm px-3 py-1`}>
//                                     {order.status.toUpperCase()}
//                                   </Badge>
//                                   <div className="text-right">
//                                     <p className="text-2xl font-bold text-primary">${order.totalAmount}</p>
//                                     <p className="text-sm text-muted-foreground">Total Amount</p>
//                                   </div>
//                                 </div>
//                               </div>
//                             </CardContent>
//                           </Card>
//                         ))}
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               {/* Feedbacks Tab */}
//               <TabsContent value="feedbacks" className="mt-6">
//                 <Card className="border-none shadow-lg rounded-2xl">
//                   <CardHeader>
//                     <div className="flex flex-col md:flex-row md:items-center justify-between">
//                       <div>
//                         <CardTitle className="text-2xl font-serif">My Reviews & Feedbacks</CardTitle>
//                         <CardDescription>Share your experience with our services and products</CardDescription>
//                       </div>
//                       <Button
//                         onClick={() => setShowFeedbackForm(!showFeedbackForm)}
//                         className="mt-4 md:mt-0 bg-secondary hover:bg-secondary/90 text-primary rounded-xl"
//                       >
//                         <Star className="w-4 h-4 mr-2" />
//                         {showFeedbackForm ? 'Close Form' : '+ Submit Feedback'}
//                       </Button>
//                     </div>
//                   </CardHeader>
                  
//                   <CardContent>
//                     {/* Feedback Form */}
//                     {showFeedbackForm && (
//                       <div className="mb-8 p-6 border-2 border-secondary/20 rounded-2xl bg-secondary/5">
//                         <h3 className="text-xl font-serif font-bold mb-6">Share Your Experience</h3>
//                         <div className="space-y-6">
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <div>
//                               <label className="block text-sm font-medium mb-2">Feedback Type *</label>
//                               <div className="flex gap-3">
//                                 <Button
//                                   type="button"
//                                   variant={feedbackType === 'service' ? 'default' : 'outline'}
//                                   onClick={() => setFeedbackType('service')}
//                                   className="flex-1"
//                                 >
//                                   <Calendar className="w-4 h-4 mr-2" />
//                                   Service
//                                 </Button>
//                                 <Button
//                                   type="button"
//                                   variant={feedbackType === 'product' ? 'default' : 'outline'}
//                                   onClick={() => setFeedbackType('product')}
//                                   className="flex-1"
//                                 >
//                                   <Package className="w-4 h-4 mr-2" />
//                                   Product
//                                 </Button>
//                               </div>
//                             </div>
                            
//                             <div>
//                               <label className="block text-sm font-medium mb-2">
//                                 Select {feedbackType === 'service' ? 'Service' : 'Product'} *
//                               </label>
//                               <select
//                                 value={feedbackService}
//                                 onChange={(e) => setFeedbackService(e.target.value)}
//                                 className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary"
//                                 required
//                               >
//                                 <option value="">Choose one...</option>
//                                 {feedbackType === 'service'
//                                   ? services.map(service => (
//                                       <option key={service.id} value={service.name}>
//                                         {service.name} (${service.price})
//                                       </option>
//                                     ))
//                                   : products.map(product => (
//                                       <option key={product.id} value={product.name}>
//                                         {product.name} (${product.price})
//                                       </option>
//                                     ))
//                                 }
//                                 <option value="other">Other</option>
//                               </select>
//                             </div>
//                           </div>

//                           <div>
//                             <label className="block text-sm font-medium mb-2">Rating *</label>
//                             <div className="flex gap-2">
//                               {[1, 2, 3, 4, 5].map((num) => (
//                                 <Button
//                                   key={num}
//                                   type="button"
//                                   size="lg"
//                                   variant={feedbackRating === num ? 'default' : 'outline'}
//                                   onClick={() => setFeedbackRating(num)}
//                                   className="w-12 h-12 p-0 rounded-xl flex flex-col items-center justify-center"
//                                 >
//                                   <Star className={`w-5 h-5 ${feedbackRating >= num ? 'fill-yellow-500 text-yellow-500' : ''}`} />
//                                   <span className="text-xs mt-1">{num}</span>
//                                 </Button>
//                               ))}
//                             </div>
//                             <div className="flex justify-between text-xs text-muted-foreground mt-2">
//                               <span>Poor</span>
//                               <span>Excellent</span>
//                             </div>
//                           </div>
                          
//                           <div>
//                             <label className="block text-sm font-medium mb-2">Your Review *</label>
//                             <Textarea
//                               placeholder="Share your detailed experience... What did you like? What could be improved?"
//                               value={feedbackComment}
//                               onChange={(e) => setFeedbackComment(e.target.value)}
//                               className="min-h-[120px] rounded-xl"
//                               required
//                             />
//                           </div>
                          
//                           <div className="flex gap-3">
//                             <Button
//                               onClick={handleAddFeedback}
//                               disabled={isSubmittingFeedback}
//                               className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-8"
//                               size="lg"
//                             >
//                               {isSubmittingFeedback ? (
//                                 <>
//                                   <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                                   Submitting...
//                                 </>
//                               ) : (
//                                 'Submit Review'
//                               )}
//                             </Button>
//                             <Button
//                               variant="outline"
//                               onClick={() => setShowFeedbackForm(false)}
//                               className="rounded-xl px-8"
//                               size="lg"
//                             >
//                               Cancel
//                             </Button>
//                           </div>
                          
//                           <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
//                             <div className="flex items-center gap-2 mb-2">
//                               <Sparkles className="w-4 h-4 text-blue-600" />
//                               <p className="text-sm font-medium text-blue-800">Pro Tip:</p>
//                             </div>
//                             <p className="text-sm text-blue-700">
//                               Earn loyalty points for your reviews! 5-star reviews earn 50 points, 
//                               4-star reviews earn 25 points. Your feedback helps us improve.
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {/* Feedback List */}
//                     <div className="space-y-6">
//                       {feedbacks.length === 0 ? (
//                         <div className="text-center py-12">
//                           <MessageSquare className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
//                           <h3 className="text-lg font-semibold text-gray-700 mb-2">No reviews yet</h3>
//                           <p className="text-gray-500 mb-6">Be the first to share your experience</p>
//                           <Button
//                             onClick={() => setShowFeedbackForm(true)}
//                             className="bg-secondary hover:bg-secondary/90 text-primary rounded-xl px-8"
//                           >
//                             <Star className="w-4 h-4 mr-2" />
//                             Write Your First Review
//                           </Button>
//                         </div>
//                       ) : (
//                         <>
//                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//                             <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
//                               <CardContent className="p-4">
//                                 <div className="text-center">
//                                   <p className="text-3xl font-bold text-green-700">{approvedFeedbacks}</p>
//                                   <p className="text-sm text-green-600">Approved Reviews</p>
//                                 </div>
//                               </CardContent>
//                             </Card>
//                             <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
//                               <CardContent className="p-4">
//                                 <div className="text-center">
//                                   <p className="text-3xl font-bold text-yellow-700">{pendingFeedbacks}</p>
//                                   <p className="text-sm text-yellow-600">Pending Reviews</p>
//                                 </div>
//                               </CardContent>
//                             </Card>
//                             <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
//                               <CardContent className="p-4">
//                                 <div className="text-center">
//                                   <p className="text-3xl font-bold text-blue-700">
//                                     {feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length || 0}/5
//                                   </p>
//                                   <p className="text-sm text-blue-600">Average Rating</p>
//                                 </div>
//                               </CardContent>
//                             </Card>
//                           </div>

//                           <div className="space-y-6">
//                             {feedbacks.map((feedback) => (
//                               <Card key={feedback.id} className="border shadow-sm hover:shadow-md transition-shadow">
//                                 <CardContent className="p-6">
//                                   <div className="flex flex-col md:flex-row gap-6">
//                                     <div className="flex-1">
//                                       <div className="flex items-start justify-between mb-4">
//                                         <div>
//                                           <div className="flex items-center gap-2 mb-2">
//                                             {feedback.type === 'service' ? (
//                                               <Calendar className="w-5 h-5 text-blue-600" />
//                                             ) : (
//                                               <Package className="w-5 h-5 text-purple-600" />
//                                             )}
//                                             <h3 className="text-lg font-semibold">{feedback.serviceOrProduct}</h3>
//                                           </div>
//                                           <div className="flex items-center gap-4">
//                                             <div className="flex gap-1">
//                                               {Array.from({ length: 5 }).map((_, i) => (
//                                                 <Star
//                                                   key={i}
//                                                   className={`w-4 h-4 ${
//                                                     i < feedback.rating
//                                                       ? 'fill-yellow-500 text-yellow-500'
//                                                       : 'text-gray-300'
//                                                   }`}
//                                                 />
//                                               ))}
//                                             </div>
//                                             <Badge
//                                               variant="outline"
//                                               className={`rounded-full ${
//                                                 feedback.status === 'approved'
//                                                   ? 'bg-green-100 text-green-800 border-green-200'
//                                                   : feedback.status === 'pending'
//                                                   ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
//                                                   : 'bg-red-100 text-red-800 border-red-200'
//                                               }`}
//                                             >
//                                               {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
//                                             </Badge>
//                                             <span className="text-sm text-muted-foreground">
//                                               {getTimeAgo(feedback.createdAt)}
//                                             </span>
//                                           </div>
//                                         </div>
//                                       </div>
                                      
//                                       <div className="bg-gray-50 rounded-xl p-4 mb-4">
//                                         <p className="text-gray-700 italic">"{feedback.comment}"</p>
//                                       </div>
                                      
//                                       <div className="text-sm text-muted-foreground">
//                                         <p>
//                                           <span className="font-medium">By:</span> {feedback.customerName} ({feedback.customerEmail})
//                                         </p>
//                                       </div>
//                                     </div>
                                    
//                                     {feedback.adminReply && (
//                                       <div className="md:w-1/3">
//                                         <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
//                                           <div className="flex items-center gap-2 mb-2">
//                                             <Sparkles className="w-4 h-4 text-blue-600" />
//                                             <p className="text-sm font-bold text-blue-900">Admin Response:</p>
//                                           </div>
//                                           <p className="text-sm text-blue-800">{feedback.adminReply}</p>
//                                         </div>
//                                       </div>
//                                     )}
//                                   </div>
//                                 </CardContent>
//                               </Card>
//                             ))}
//                           </div>
//                         </>
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               {/* Wallet Tab */}
//               <TabsContent value="wallet" className="mt-6">
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                   {/* Wallet Summary */}
//                   <div className="lg:col-span-2">
//                     <Card className="border-none shadow-lg rounded-2xl">
//                       <CardHeader>
//                         <CardTitle className="text-2xl font-serif">My Wallet</CardTitle>
//                         <CardDescription>Manage your balance and loyalty points</CardDescription>
//                       </CardHeader>
//                       <CardContent>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                           <Card className="bg-gradient-to-br from-primary to-primary/80 text-white">
//                             <CardContent className="p-6">
//                               <div className="flex items-center justify-between mb-4">
//                                 <div>
//                                   <p className="text-sm opacity-80">Available Balance</p>
//                                   <p className="text-4xl font-bold">${wallet?.balance?.toFixed(2) || '0.00'}</p>
//                                 </div>
//                                 <Wallet className="w-12 h-12 opacity-50" />
//                               </div>
//                               <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/20">
//                                 <Plus className="w-4 h-4 mr-2" />
//                                 Add Funds
//                               </Button>
//                             </CardContent>
//                           </Card>
                          
//                           <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-primary">
//                             <CardContent className="p-6">
//                               <div className="flex items-center justify-between mb-4">
//                                 <div>
//                                   <p className="text-sm opacity-80">Loyalty Points</p>
//                                   <p className="text-4xl font-bold">{wallet?.loyaltyPoints?.toLocaleString() || '0'}</p>
//                                   <p className="text-sm opacity-80 mt-1">
//                                     Worth ${walletPointsValue.toFixed(2)}
//                                   </p>
//                                 </div>
//                                 <Award className="w-12 h-12 opacity-50" />
//                               </div>
//                               <Link href="/customer/portal/loyalty">
//                                 <Button className="w-full bg-primary hover:bg-primary/90 text-white">
//                                   <Gift className="w-4 h-4 mr-2" />
//                                   Redeem Points
//                                 </Button>
//                               </Link>
//                             </CardContent>
//                           </Card>
//                         </div>
                        
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                           <Card>
//                             <CardContent className="p-6">
//                               <div className="text-center">
//                                 <p className="text-3xl font-bold text-green-600">
//                                   {wallet?.totalPointsEarned?.toLocaleString() || '0'}
//                                 </p>
//                                 <p className="text-sm text-muted-foreground">Total Points Earned</p>
//                               </div>
//                             </CardContent>
//                           </Card>
                          
//                           <Card>
//                             <CardContent className="p-6">
//                               <div className="text-center">
//                                 <p className="text-3xl font-bold text-blue-600">
//                                   {wallet?.totalPointsRedeemed?.toLocaleString() || '0'}
//                                 </p>
//                                 <p className="text-sm text-muted-foreground">Total Points Redeemed</p>
//                               </div>
//                             </CardContent>
//                           </Card>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </div>
                  
//                   {/* Recent Transactions */}
//                   <div>
//                     <Card className="border-none shadow-lg rounded-2xl h-full">
//                       <CardHeader>
//                         <CardTitle className="text-lg font-serif flex items-center gap-2">
//                           <History className="w-5 h-5 text-secondary" />
//                           Recent Transactions
//                         </CardTitle>
//                       </CardHeader>
//                       <CardContent>
//                         {transactions.length === 0 ? (
//                           <div className="text-center py-8">
//                             <History className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
//                             <p className="text-muted-foreground">No transactions yet</p>
//                           </div>
//                         ) : (
//                           <div className="space-y-3 max-h-[400px] overflow-y-auto">
//                             {transactions.slice(0, 10).map((txn) => (
//                               <div key={txn.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
//                                 <div className="flex items-center gap-3">
//                                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
//                                     txn.amount > 0 || txn.pointsAmount > 0 
//                                       ? 'bg-green-100' 
//                                       : 'bg-red-100'
//                                   }`}>
//                                     {(txn.amount > 0 || txn.pointsAmount > 0) ? (
//                                       <ArrowUpRight className="w-5 h-5 text-green-600" />
//                                     ) : (
//                                       <ArrowUpRight className="w-5 h-5 text-red-600 rotate-180" />
//                                     )}
//                                   </div>
//                                   <div>
//                                     <p className="text-sm font-medium">{txn.description}</p>
//                                     <p className="text-xs text-muted-foreground">
//                                       {getTimeAgo(txn.createdAt)}
//                                     </p>
//                                   </div>
//                                 </div>
//                                 <div className="text-right">
//                                   {txn.pointsAmount !== 0 && (
//                                     <p className={`text-sm font-bold ${txn.pointsAmount > 0 ? 'text-green-600' : 'text-red-600'}`}>
//                                       {txn.pointsAmount > 0 ? '+' : ''}{txn.pointsAmount} pts
//                                     </p>
//                                   )}
//                                   {txn.amount !== 0 && (
//                                     <p className={`text-sm font-bold ${txn.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
//                                       {txn.amount > 0 ? '+' : ''}${Math.abs(txn.amount).toFixed(2)}
//                                     </p>
//                                   )}
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </CardContent>
//                     </Card>
//                   </div>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </div>

//           {/* Quick Access Section */}
//           <Card className="border-none shadow-lg rounded-2xl mt-8">
//             <CardHeader>
//               <CardTitle className="text-lg font-serif">Quick Access</CardTitle>
//               <CardDescription>Get to your favorite actions quickly</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <Link href="/services">
//                   <Button className="w-full h-24 flex-col gap-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200 text-blue-700">
//                     <Calendar className="w-6 h-6" />
//                     <span className="text-sm font-bold">Book Service</span>
//                   </Button>
//                 </Link>
                
//                 <Link href="/products">
//                   <Button className="w-full h-24 flex-col gap-3 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-200 text-purple-700">
//                     <ShoppingCart className="w-6 h-6" />
//                     <span className="text-sm font-bold">Shop Products</span>
//                   </Button>
//                 </Link>
                
//                 <Button 
//                   onClick={() => setActiveTab('cart')}
//                   className="w-full h-24 flex-col gap-3 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:from-green-100 hover:to-green-200 text-green-700"
//                 >
//                   <ShoppingCart className="w-6 h-6" />
//                   <span className="text-sm font-bold">View Cart ({cartItemsCount})</span>
//                 </Button>
                
//                 <Link href="/customer/portal/profile">
//                   <Button className="w-full h-24 flex-col gap-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:from-gray-100 hover:to-gray-200 text-gray-700">
//                     <Settings className="w-6 h-6" />
//                     <span className="text-sm font-bold">Settings</span>
//                   </Button>
//                 </Link>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }
// new code

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/shared/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Calendar,
  Package,
  Wallet,
  Star,
  Settings,
  LogOut,
  Clock,
  ChevronRight,
  Gift,
  Award,
  History,
  User,
  Sparkles,
  ArrowUpRight,
  Loader2,
  MessageSquare,
  ShoppingCart,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Eye,
  Check,
  X,
  CreditCard,
  MapPin,
  Tag,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

// Firebase imports
import { db, auth } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// Types
interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt?: any;
}

interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  date: string;
  time: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: any;
  notes?: string;
  confirmedAt?: any;
  completedAt?: any;
  cancelledAt?: any;
}

interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  products: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: any;
  shippingAddress?: string;
  paymentMethod?: string;
}

interface Feedback {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  serviceOrProduct: string;
  serviceOrProductId?: string;
  type: 'service' | 'product';
  rating: number;
  comment: string;
  createdAt: any;
  status: 'pending' | 'approved' | 'rejected';
  adminReply?: string;
}

interface Transaction {
  id: string;
  customerId: string;
  type: 'wallet_topup' | 'points_earned' | 'points_redeemed' | 'purchase' | 'refund' | 'booking' | 'order';
  amount: number;
  pointsAmount?: number;
  description: string;
  createdAt: any;
  status: 'success' | 'failed' | 'pending';
  referenceId?: string;
}

interface CustomerWallet {
  id: string;
  customerId: string;
  balance: number;
  loyaltyPoints: number;
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  updatedAt: any;
}

interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration?: string;
  category?: string;
  imageUrl?: string;
  branchNames?: string[];
  branches?: string[];
  status: 'active' | 'inactive';
  createdAt?: any;
  popularity?: string;
  revenue?: number;
  totalBookings?: number;
  categoryId?: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
  branchNames?: string[];
  branches?: string[];
  stock: number;
  status: 'active' | 'inactive';
  createdAt?: any;
  cost?: number;
  rating?: number;
  reviews?: number;
  sku?: string;
  revenue?: number;
  totalSold?: number;
  totalStock?: number;
  categoryId?: string;
}

// Cart Item Interface
interface CartItem {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  itemId: string;
  itemName: string;
  itemImage: string;
  price: number;
  quantity: number;
  addedAt: any;
  updatedAt?: any;
  status: 'active' | 'purchased' | 'removed';
  type: 'product' | 'service';
  serviceId?: string;
  productId?: string;
  branchNames?: string[];
  serviceName?: string;
  productName?: string;
  image?: string;
  imageUrl?: string;
}

export default function CustomerPortal() {
  const router = useRouter();
  
  // States
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [wallet, setWallet] = useState<CustomerWallet | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [recentServices, setRecentServices] = useState<Service[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  
  // Cart Items State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackService, setFeedbackService] = useState('');
  const [feedbackType, setFeedbackType] = useState<'service' | 'product'>('service');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [updatingCartItem, setUpdatingCartItem] = useState<string | null>(null);
  const [removingCartItem, setRemovingCartItem] = useState<string | null>(null);
  const [hasIndexError, setHasIndexError] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  
  // New states for booking management
  const [confirmingBooking, setConfirmingBooking] = useState<string | null>(null);
  const [cancellingBooking, setCancellingBooking] = useState<string | null>(null);
  const [completingBooking, setCompletingBooking] = useState<string | null>(null);

  // Add to Cart for Service
  const handleAddServiceToCart = async (service: Service) => {
    if (!customer) {
      router.push('/customer/login');
      return;
    }

    try {
      console.log('Adding service to cart:', service);
      
      // Check if service already in cart
      const existingItem = cartItems.find(item => 
        item.type === 'service' && item.itemId === service.id
      );
      
      if (existingItem) {
        alert('Service already in cart!');
        return;
      }

      const cartItemData = {
        customerId: customer.id,
        customerName: customer.name || 'Customer',
        customerEmail: customer.email || '',
        itemId: service.id,
        itemName: service.name,
        itemImage: service.imageUrl || 'https://images.unsplash.com/photo-1512690196222-7c7d3f993c1b?q=80&w=2070&auto=format&fit=crop',
        serviceName: service.name,
        price: service.price || 0,
        quantity: 1,
        type: 'service' as const,
        serviceId: service.id,
        productId: '',
        branchNames: service.branchNames || [],
        addedAt: serverTimestamp(),
        status: 'active' as const
      };

      console.log('Adding to cart:', cartItemData);

      // Add to cart collection
      await addDoc(collection(db, 'cart'), cartItemData);
      
      alert(`${service.name} added to cart!`);
      
    } catch (error) {
      console.error('Error adding service to cart:', error);
      alert('Failed to add service to cart. Please try again.');
    }
  };

  // Add to Cart for Product
  const handleAddProductToCart = async (product: Product) => {
    if (!customer) {
      router.push('/customer/login');
      return;
    }

    try {
      console.log('Adding product to cart:', product);
      
      // Check if product already in cart
      const existingItem = cartItems.find(item => 
        item.type === 'product' && item.itemId === product.id
      );
      
      if (existingItem) {
        // Update quantity if already exists
        await updateDoc(doc(db, 'cart', existingItem.id), {
          quantity: (existingItem.quantity || 1) + 1,
          updatedAt: serverTimestamp()
        });
        alert('Product quantity updated in cart!');
        return;
      }

      const cartItemData = {
        customerId: customer.id,
        customerName: customer.name || 'Customer',
        customerEmail: customer.email || '',
        itemId: product.id,
        itemName: product.name,
        itemImage: product.imageUrl || 'https://images.unsplash.com/photo-1512690196222-7c7d3f993c1b?q=80&w=2070&auto=format&fit=crop',
        productName: product.name,
        price: product.price || 0,
        quantity: 1,
        type: 'product' as const,
        serviceId: '',
        productId: product.id,
        branchNames: product.branchNames || [],
        addedAt: serverTimestamp(),
        status: 'active' as const
      };

      console.log('Adding to cart:', cartItemData);

      // Add to cart collection
      await addDoc(collection(db, 'cart'), cartItemData);
      
      alert(`${product.name} added to cart!`);
      
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    }
  };

  // Fetch all initial data
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      
      // Check authentication
      const authData = localStorage.getItem('customerAuth');
      if (!authData) {
        router.push('/customer/login');
        return;
      }

      try {
        const { customer: customerData } = JSON.parse(authData);
        const customerObj: Customer = {
          id: customerData.uid || customerData.id || ('cust_' + Date.now()),
          name: customerData.name || 'Customer',
          email: customerData.email || '',
          phone: customerData.phone || '',
          avatar: customerData.avatar
        };
        
        console.log('Setting customer:', customerObj);
        setCustomer(customerObj);

        // Fetch all data
        await fetchCustomerData(customerObj.id);
        await fetchServices();
        await fetchProducts();
        
        // Fetch recent items after main data is loaded
        await fetchRecentServices();
        await fetchRecentProducts();
        
      } catch (error) {
        console.error('Initialization error:', error);
        // Check if it's an index error
        if (error instanceof Error && error.message.includes('index')) {
          setHasIndexError(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();

    // Set up real-time listeners after initial load
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && customer) {
        setupRealtimeListeners(firebaseUser.uid);
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // Fetch customer data from Firebase
  const fetchCustomerData = async (customerId: string) => {
    if (!customerId) {
      console.error('No customer ID provided');
      return;
    }
    
    setIsLoadingData(true);
    console.log(`Fetching data for customer: ${customerId}`);
    
    try {
      // Fetch wallet
      try {
        const walletDoc = await getDoc(doc(db, 'wallets', customerId));
        if (walletDoc.exists()) {
          console.log('Wallet found:', walletDoc.data());
          setWallet({ id: walletDoc.id, ...walletDoc.data() } as CustomerWallet);
        } else {
          console.log('No wallet found, creating default');
          const defaultWallet: CustomerWallet = {
            id: customerId,
            customerId,
            balance: 0,
            loyaltyPoints: 0,
            totalPointsEarned: 0,
            totalPointsRedeemed: 0,
            updatedAt: new Date()
          };
          setWallet(defaultWallet);
        }
      } catch (walletError) {
        console.error('Error fetching wallet:', walletError);
      }

      // Fetch bookings
      console.log('Fetching bookings...');
      try {
        const bookingsQuery = query(
          collection(db, 'bookings'),
          where('customerId', '==', customerId)
        );
        const bookingsSnapshot = await getDocs(bookingsQuery);
        const bookingsData: Booking[] = [];
        
        console.log(`Found ${bookingsSnapshot.size} bookings`);
        
        bookingsSnapshot.forEach(doc => {
          const data = doc.data();
          console.log(`Booking ${doc.id}:`, data);
          
          const booking: Booking = {
            id: doc.id,
            customerId: data.customerId || customerId,
            customerName: data.customerName || 'Customer',
            customerEmail: data.customerEmail || '',
            serviceId: data.serviceId || '',
            serviceName: data.serviceName || 'Unknown Service',
            servicePrice: typeof data.servicePrice === 'number' ? data.servicePrice : 0,
            date: data.date || new Date().toISOString().split('T')[0],
            time: data.time || '10:00 AM',
            totalAmount: typeof data.totalAmount === 'number' ? data.totalAmount : 0,
            status: (['pending', 'confirmed', 'completed', 'cancelled'].includes(data.status) 
              ? data.status 
              : 'pending') as 'pending' | 'confirmed' | 'completed' | 'cancelled',
            createdAt: data.createdAt || serverTimestamp(),
            notes: data.notes || ''
          };
          
          bookingsData.push(booking);
        });
        
        // Client-side sorting by date (newest first)
        bookingsData.sort((a, b) => {
          try {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
            return dateB.getTime() - dateA.getTime();
          } catch (error) {
            return 0;
          }
        });
        
        console.log('Processed bookings:', bookingsData);
        setBookings(bookingsData);
      } catch (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
        setBookings([]);
      }

      // Fetch orders
      console.log('Fetching orders...');
      try {
        const ordersQuery = query(
          collection(db, 'orders'),
          where('customerId', '==', customerId)
        );
        const ordersSnapshot = await getDocs(ordersQuery);
        const ordersData: Order[] = [];
        
        console.log(`Found ${ordersSnapshot.size} orders`);
        
        ordersSnapshot.forEach(doc => {
          const data = doc.data();
          console.log(`Order ${doc.id}:`, data);
          
          const order: Order = {
            id: doc.id,
            customerId: data.customerId || customerId,
            customerName: data.customerName || 'Customer',
            customerEmail: data.customerEmail || '',
            products: Array.isArray(data.products) ? data.products.map((p: any) => ({
              productId: p.productId || '',
              productName: p.productName || 'Product',
              quantity: typeof p.quantity === 'number' ? p.quantity : 1,
              price: typeof p.price === 'number' ? p.price : 0,
              image: p.image || p.productImage || ''
            })) : [],
            totalAmount: typeof data.totalAmount === 'number' ? data.totalAmount : 0,
            status: (['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(data.status)
              ? data.status
              : 'pending') as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
            createdAt: data.createdAt || serverTimestamp(),
            shippingAddress: data.shippingAddress || '',
            paymentMethod: data.paymentMethod || 'wallet'
          };
          
          ordersData.push(order);
        });
        
        // Client-side sorting by date (newest first)
        ordersData.sort((a, b) => {
          try {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
            return dateB.getTime() - dateA.getTime();
          } catch (error) {
            return 0;
          }
        });
        
        console.log('Processed orders:', ordersData);
        setOrders(ordersData);
      } catch (ordersError) {
        console.error('Error fetching orders:', ordersError);
        setOrders([]);
      }

      // Fetch feedbacks
      try {
        const feedbacksQuery = query(
          collection(db, 'feedbacks'),
          where('customerId', '==', customerId)
        );
        const feedbacksSnapshot = await getDocs(feedbacksQuery);
        const feedbacksData: Feedback[] = [];
        
        feedbacksSnapshot.forEach(doc => {
          const data = doc.data();
          feedbacksData.push({
            id: doc.id,
            customerId: data.customerId || customerId,
            customerName: data.customerName || 'Customer',
            customerEmail: data.customerEmail || '',
            serviceOrProduct: data.serviceOrProduct || '',
            serviceOrProductId: data.serviceOrProductId || '',
            type: (data.type || 'service') as 'service' | 'product',
            rating: typeof data.rating === 'number' ? data.rating : 5,
            comment: data.comment || '',
            createdAt: data.createdAt || serverTimestamp(),
            status: (data.status || 'pending') as 'pending' | 'approved' | 'rejected',
            adminReply: data.adminReply || ''
          });
        });
        
        // Client-side sorting
        feedbacksData.sort((a, b) => {
          try {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
            return dateB.getTime() - dateA.getTime();
          } catch (error) {
            return 0;
          }
        });
        
        setFeedbacks(feedbacksData);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
        setFeedbacks([]);
      }

      // Fetch transactions
      try {
        const transactionsQuery = query(
          collection(db, 'transactions'),
          where('customerId', '==', customerId)
        );
        const transactionsSnapshot = await getDocs(transactionsQuery);
        const transactionsData: Transaction[] = [];
        
        transactionsSnapshot.forEach(doc => {
          const data = doc.data();
          transactionsData.push({
            id: doc.id,
            customerId: data.customerId || customerId,
            type: (data.type || 'purchase') as Transaction['type'],
            amount: typeof data.amount === 'number' ? data.amount : 0,
            pointsAmount: typeof data.pointsAmount === 'number' ? data.pointsAmount : 0,
            description: data.description || '',
            createdAt: data.createdAt || serverTimestamp(),
            status: (data.status || 'success') as 'success' | 'failed' | 'pending',
            referenceId: data.referenceId || ''
          });
        });
        
        // Client-side sorting
        transactionsData.sort((a, b) => {
          try {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
            return dateB.getTime() - dateA.getTime();
          } catch (error) {
            return 0;
          }
        });
        
        setTransactions(transactionsData);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setTransactions([]);
      }

      // Fetch cart items
      await fetchCartItems(customerId);

    } catch (error) {
      console.error('Error fetching customer data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Fetch cart items
  const fetchCartItems = async (customerId: string) => {
    if (!customerId) return;
    
    setIsLoadingCart(true);
    try {
      console.log('Fetching cart items for customer:', customerId);
      
      const cartQuery = query(
        collection(db, 'cart'),
        where('customerId', '==', customerId)
      );
      const cartSnapshot = await getDocs(cartQuery);
      const cartData: CartItem[] = [];
      
      cartSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`Cart item ${doc.id}:`, data);
        
        // Filter active items client-side
        if (data.status === 'active' || !data.status) {
          const cartItem: CartItem = {
            id: doc.id,
            customerId: data.customerId || customerId,
            customerName: data.customerName || 'Customer',
            customerEmail: data.customerEmail || '',
            itemId: data.itemId || data.serviceId || data.productId || '',
            itemName: data.itemName || data.serviceName || data.productName || 'Item',
            itemImage: data.itemImage || data.imageUrl || data.image || data.productImage || 
                      'https://images.unsplash.com/photo-1512690196222-7c7d3f993c1b?q=80&w=2070&auto=format&fit=crop',
            price: typeof data.price === 'number' ? data.price : 0,
            quantity: typeof data.quantity === 'number' ? data.quantity : 1,
            addedAt: data.addedAt || serverTimestamp(),
            updatedAt: data.updatedAt,
            status: (data.status || 'active') as 'active' | 'purchased' | 'removed',
            type: (data.type || (data.serviceId ? 'service' : 'product')) as 'product' | 'service',
            serviceId: data.serviceId || '',
            productId: data.productId || '',
            branchNames: data.branchNames || [],
            serviceName: data.serviceName,
            productName: data.productName,
            image: data.image,
            imageUrl: data.imageUrl
          };
          cartData.push(cartItem);
        }
      });
      
      // Client-side sorting
      cartData.sort((a, b) => {
        try {
          const dateA = a.addedAt?.toDate ? a.addedAt.toDate() : new Date(0);
          const dateB = b.addedAt?.toDate ? b.addedAt.toDate() : new Date(0);
          return dateB.getTime() - dateA.getTime();
        } catch (error) {
          return 0;
        }
      });
      
      console.log('Cart items found (detailed):', cartData);
      setCartItems(cartData);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setCartItems([]);
    } finally {
      setIsLoadingCart(false);
    }
  };

  // Fetch all services
  const fetchServices = async () => {
    try {
      const servicesQuery = query(
        collection(db, 'services'),
        where('status', '==', 'active')
      );
      const servicesSnapshot = await getDocs(servicesQuery);
      const servicesData: Service[] = [];
      
      servicesSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`Service ${doc.id}:`, data);
        
        servicesData.push({
          id: doc.id,
          name: data.name || 'Service',
          description: data.description || '',
          price: typeof data.price === 'number' ? data.price : 0,
          duration: data.duration || '',
          category: data.category || '',
          imageUrl: data.imageUrl || '',
          branchNames: data.branchNames || [],
          branches: data.branches || [],
          status: (data.status || 'active') as 'active' | 'inactive',
          createdAt: data.createdAt || null,
          popularity: data.popularity || 'low',
          revenue: data.revenue || 0,
          totalBookings: data.totalBookings || 0,
          categoryId: data.categoryId || ''
        });
      });
      
      console.log('Services loaded:', servicesData);
      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    }
  };

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const productsQuery = query(
        collection(db, 'products'),
        where('status', '==', 'active')
      );
      const productsSnapshot = await getDocs(productsQuery);
      const productsData: Product[] = [];
      
      productsSnapshot.forEach(doc => {
        const data = doc.data();
        console.log(`Product ${doc.id}:`, data);
        
        // Filter stock client-side
        if ((data.totalStock || 0) > 0) {
          productsData.push({
            id: doc.id,
            name: data.name || 'Product',
            description: data.description || '',
            price: typeof data.price === 'number' ? data.price : 0,
            category: data.category || '',
            imageUrl: data.imageUrl || '',
            branchNames: data.branchNames || [],
            branches: data.branches || [],
            stock: typeof data.totalStock === 'number' ? data.totalStock : 0,
            status: (data.status || 'active') as 'active' | 'inactive',
            createdAt: data.createdAt || null,
            cost: data.cost || 0,
            rating: data.rating || 0,
            reviews: data.reviews || 0,
            sku: data.sku || '',
            revenue: data.revenue || 0,
            totalSold: data.totalSold || 0,
            totalStock: data.totalStock || 0,
            categoryId: data.categoryId || ''
          });
        }
      });
      
      console.log('Products loaded:', productsData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  // Fetch recent services
  const fetchRecentServices = async () => {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const recentServicesData = services
        .filter(service => {
          if (!service.createdAt) return true;
          try {
            const createdAt = service.createdAt?.toDate ? service.createdAt.toDate() : new Date(0);
            return createdAt >= thirtyDaysAgo;
          } catch {
            return true;
          }
        })
        .sort((a, b) => {
          try {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
            return dateB.getTime() - dateA.getTime();
          } catch {
            return 0;
          }
        })
        .slice(0, 6);
      
      setRecentServices(recentServicesData);
    } catch (error) {
      console.error('Error fetching recent services:', error);
      const fallback = services.slice(0, 6);
      setRecentServices(fallback);
    }
  };

  // Fetch recent products
  const fetchRecentProducts = async () => {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const recentProductsData = products
        .filter(product => {
          if (!product.createdAt) return true;
          try {
            const createdAt = product.createdAt?.toDate ? product.createdAt.toDate() : new Date(0);
            return createdAt >= thirtyDaysAgo;
          } catch {
            return true;
          }
        })
        .sort((a, b) => {
          try {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
            return dateB.getTime() - dateA.getTime();
          } catch {
            return 0;
          }
        })
        .slice(0, 6);
      
      setRecentProducts(recentProductsData);
    } catch (error) {
      console.error('Error fetching recent products:', error);
      const fallback = products.slice(0, 6);
      setRecentProducts(fallback);
    }
  };

  // Set up real-time listeners
  const setupRealtimeListeners = (customerId: string) => {
    if (!customerId) return;
    
    console.log('Setting up real-time listeners for:', customerId);
    
    try {
      // Real-time bookings listener
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('customerId', '==', customerId)
      );
      
      const unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
        console.log('Bookings real-time update:', snapshot.size, 'documents');
        const bookingsData: Booking[] = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          bookingsData.push({
            id: doc.id,
            customerId: data.customerId || customerId,
            customerName: data.customerName || 'Customer',
            customerEmail: data.customerEmail || '',
            serviceId: data.serviceId || '',
            serviceName: data.serviceName || 'Unknown Service',
            servicePrice: typeof data.servicePrice === 'number' ? data.servicePrice : 0,
            date: data.date || new Date().toISOString().split('T')[0],
            time: data.time || '10:00 AM',
            totalAmount: typeof data.totalAmount === 'number' ? data.totalAmount : 0,
            status: (['pending', 'confirmed', 'completed', 'cancelled'].includes(data.status) 
              ? data.status 
              : 'pending') as 'pending' | 'confirmed' | 'completed' | 'cancelled',
            createdAt: data.createdAt || serverTimestamp(),
            notes: data.notes || ''
          });
        });
        
        // Client-side sorting
        bookingsData.sort((a, b) => {
          try {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
            return dateB.getTime() - dateA.getTime();
          } catch {
            return 0;
          }
        });
        
        console.log('Updated bookings:', bookingsData);
        setBookings(bookingsData);
      }, (error) => {
        console.error('Bookings listener error:', error);
      });

      // Real-time orders listener
      const ordersQuery = query(
        collection(db, 'orders'),
        where('customerId', '==', customerId)
      );
      
      const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
        console.log('Orders real-time update:', snapshot.size, 'documents');
        const ordersData: Order[] = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          ordersData.push({
            id: doc.id,
            customerId: data.customerId || customerId,
            customerName: data.customerName || 'Customer',
            customerEmail: data.customerEmail || '',
            products: Array.isArray(data.products) ? data.products.map((p: any) => ({
              productId: p.productId || '',
              productName: p.productName || 'Product',
              quantity: typeof p.quantity === 'number' ? p.quantity : 1,
              price: typeof p.price === 'number' ? p.price : 0,
              image: p.image || p.productImage || ''
            })) : [],
            totalAmount: typeof data.totalAmount === 'number' ? data.totalAmount : 0,
            status: (['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(data.status)
              ? data.status
              : 'pending') as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
            createdAt: data.createdAt || serverTimestamp(),
            shippingAddress: data.shippingAddress || '',
            paymentMethod: data.paymentMethod || 'wallet'
          });
        });
        
        // Client-side sorting
        ordersData.sort((a, b) => {
          try {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
            return dateB.getTime() - dateA.getTime();
          } catch {
            return 0;
          }
        });
        
        console.log('Updated orders:', ordersData);
        setOrders(ordersData);
      }, (error) => {
        console.error('Orders listener error:', error);
      });

      // Real-time feedbacks listener
      const feedbacksQuery = query(
        collection(db, 'feedbacks'),
        where('customerId', '==', customerId)
      );
      
      const unsubscribeFeedbacks = onSnapshot(feedbacksQuery, (snapshot) => {
        const feedbacksData: Feedback[] = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          feedbacksData.push({
            id: doc.id,
            customerId: data.customerId || customerId,
            customerName: data.customerName || 'Customer',
            customerEmail: data.customerEmail || '',
            serviceOrProduct: data.serviceOrProduct || '',
            serviceOrProductId: data.serviceOrProductId || '',
            type: (data.type || 'service') as 'service' | 'product',
            rating: typeof data.rating === 'number' ? data.rating : 5,
            comment: data.comment || '',
            createdAt: data.createdAt || serverTimestamp(),
            status: (data.status || 'pending') as 'pending' | 'approved' | 'rejected',
            adminReply: data.adminReply || ''
          });
        });
        
        // Client-side sorting
        feedbacksData.sort((a, b) => {
          try {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
            return dateB.getTime() - dateA.getTime();
          } catch {
            return 0;
          }
        });
        
        setFeedbacks(feedbacksData);
      }, (error) => {
        console.error('Feedbacks listener error:', error);
      });

      // Real-time wallet listener
      const unsubscribeWallet = onSnapshot(doc(db, 'wallets', customerId), (doc) => {
        if (doc.exists()) {
          console.log('Wallet updated:', doc.data());
          setWallet({ id: doc.id, ...doc.data() } as CustomerWallet);
        }
      }, (error) => {
        console.error('Wallet listener error:', error);
      });

      // Real-time transactions listener
      const transactionsQuery = query(
        collection(db, 'transactions'),
        where('customerId', '==', customerId)
      );
      
      const unsubscribeTransactions = onSnapshot(transactionsQuery, (snapshot) => {
        const transactionsData: Transaction[] = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          transactionsData.push({
            id: doc.id,
            customerId: data.customerId || customerId,
            type: (data.type || 'purchase') as Transaction['type'],
            amount: typeof data.amount === 'number' ? data.amount : 0,
            pointsAmount: typeof data.pointsAmount === 'number' ? data.pointsAmount : 0,
            description: data.description || '',
            createdAt: data.createdAt || serverTimestamp(),
            status: (data.status || 'success') as 'success' | 'failed' | 'pending',
            referenceId: data.referenceId || ''
          });
        });
        
        // Client-side sorting
        transactionsData.sort((a, b) => {
          try {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
            return dateB.getTime() - dateA.getTime();
          } catch {
            return 0;
          }
        });
        
        setTransactions(transactionsData);
      }, (error) => {
        console.error('Transactions listener error:', error);
      });

      // Real-time cart listener
      const cartQuery = query(
        collection(db, 'cart'),
        where('customerId', '==', customerId)
      );
      
      const unsubscribeCart = onSnapshot(cartQuery, (snapshot) => {
        console.log('Cart real-time update:', snapshot.size, 'documents');
        const cartData: CartItem[] = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          // Filter active items client-side
          if (data.status === 'active' || !data.status) {
            cartData.push({
              id: doc.id,
              customerId: data.customerId || customerId,
              customerName: data.customerName || 'Customer',
              customerEmail: data.customerEmail || '',
              itemId: data.itemId || data.productId || '',
              itemName: data.itemName || data.productName || 'Item',
              itemImage: data.itemImage || data.productImage || data.image || 'https://images.unsplash.com/photo-1512690196222-7c7d3f993c1b?q=80&w=2070&auto=format&fit=crop',
              price: typeof data.price === 'number' ? data.price : 0,
              quantity: typeof data.quantity === 'number' ? data.quantity : 1,
              addedAt: data.addedAt || serverTimestamp(),
              updatedAt: data.updatedAt,
              status: (data.status || 'active') as 'active' | 'purchased' | 'removed',
              type: (data.type || 'product') as 'product' | 'service',
              serviceId: data.serviceId || '',
              productId: data.productId || '',
              branchNames: data.branchNames || []
            });
          }
        });
        
        // Sort client side
        cartData.sort((a, b) => {
          try {
            const dateA = a.addedAt?.toDate ? a.addedAt.toDate() : new Date(0);
            const dateB = b.addedAt?.toDate ? b.addedAt.toDate() : new Date(0);
            return dateB.getTime() - dateA.getTime();
          } catch {
            return 0;
          }
        });
        
        setCartItems(cartData);
      }, (error) => {
        console.error('Cart listener error:', error);
      });

      // Return cleanup function
      return () => {
        unsubscribeBookings();
        unsubscribeOrders();
        unsubscribeFeedbacks();
        unsubscribeWallet();
        unsubscribeTransactions();
        unsubscribeCart();
      };
    } catch (error) {
      console.warn('Could not set up real-time listeners:', error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('customerAuth');
    localStorage.removeItem('user');
    router.push('/customer/login');
  };

  // Handle remove from cart
  const handleRemoveFromCart = async (cartItemId: string) => {
    if (!customer) return;
    
    setRemovingCartItem(cartItemId);
    try {
      await deleteDoc(doc(db, 'cart', cartItemId));
      console.log('Cart item removed:', cartItemId);
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Failed to remove item from cart');
    } finally {
      setRemovingCartItem(null);
    }
  };

  // Handle update quantity
  const handleUpdateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (!customer || newQuantity < 1) return;
    
    setUpdatingCartItem(cartItemId);
    try {
      await updateDoc(doc(db, 'cart', cartItemId), {
        quantity: newQuantity,
        updatedAt: serverTimestamp()
      });
      console.log('Cart item quantity updated:', cartItemId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity');
    } finally {
      setUpdatingCartItem(null);
    }
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (!customer || cartItems.length === 0) {
      alert('Cart is empty');
      return;
    }
    
    setCheckoutLoading(true);
    console.log('Starting checkout process...');
    console.log('Cart items:', cartItems);
    
    try {
      // Separate services and products
      const serviceItems = cartItems.filter(item => item.type === 'service');
      const productItems = cartItems.filter(item => item.type === 'product');
      
      console.log('Service items:', serviceItems);
      console.log('Product items:', productItems);
      
      let successMessages: string[] = [];
      
      // Handle services - create bookings WITH SERVICE NAME
      if (serviceItems.length > 0) {
        console.log('Processing services...');
        
        for (const serviceItem of serviceItems) {
          try {
            console.log('Creating booking for:', serviceItem.itemName);
            
            const bookingData = {
              customerId: customer.id,
              customerName: customer.name || 'Customer',
              customerEmail: customer.email || '',
              serviceId: serviceItem.itemId,
              serviceName: serviceItem.itemName || serviceItem.serviceName || 'Service',
              servicePrice: serviceItem.price || 0,
              date: new Date().toISOString().split('T')[0],
              time: '10:00 AM',
              totalAmount: serviceItem.price || 0,
              status: 'pending' as const,
              createdAt: serverTimestamp(),
              notes: 'Booked from cart checkout'
            };

            console.log('Booking data:', bookingData);

            // Create booking
            const bookingRef = await addDoc(collection(db, 'bookings'), bookingData);
            console.log('Booking created with ID:', bookingRef.id);
            
            // Remove from cart
            await deleteDoc(doc(db, 'cart', serviceItem.id));
            
            // Add transaction
            await addDoc(collection(db, 'transactions'), {
              customerId: customer.id,
              type: 'booking' as const,
              amount: -(serviceItem.price || 0),
              description: `Booking for ${serviceItem.itemName}`,
              status: 'success' as const,
              referenceId: bookingRef.id,
              createdAt: serverTimestamp()
            });

            successMessages.push(`✓ ${serviceItem.itemName} booked successfully`);
            
          } catch (error) {
            console.error(`Error booking ${serviceItem.itemName}:`, error);
            alert(`Failed to book ${serviceItem.itemName}. Please try again.`);
          }
        }
      }
      
      // Handle products - create orders WITH PRODUCT NAME
      if (productItems.length > 0) {
        console.log('Processing products...');
        
        const orderProducts = productItems.map(item => ({
          productId: item.itemId || '',
          productName: item.itemName || item.productName || 'Product',
          quantity: Math.max(1, item.quantity || 1),
          price: Math.max(0, item.price || 0),
          image: item.itemImage || ''
        }));
        
        const totalAmount = productItems.reduce((sum, item) => 
          sum + (Math.max(0, item.price || 0) * Math.max(1, item.quantity || 1)), 
        0);

        try {
          const orderData = {
            customerId: customer.id || '',
            customerName: customer.name || 'Customer',
            customerEmail: customer.email || '',
            products: orderProducts,
            totalAmount: totalAmount,
            status: 'pending' as const,
            createdAt: serverTimestamp(),
            shippingAddress: '',
            paymentMethod: 'wallet'
          };

          console.log('Order data:', orderData);

          const orderRef = await addDoc(collection(db, 'orders'), orderData);
          console.log('Order created with ID:', orderRef.id);
          
          // Remove products from cart
          const deletePromises = productItems.map(item =>
            deleteDoc(doc(db, 'cart', item.id))
          );
          
          await Promise.all(deletePromises);
          
          await addDoc(collection(db, 'transactions'), {
            customerId: customer.id || '',
            type: 'order' as const,
            amount: -totalAmount,
            description: `Purchase of ${productItems.length} products`,
            status: 'success' as const,
            referenceId: orderRef.id,
            createdAt: serverTimestamp()
          });

          successMessages.push(`✓ Order placed for ${productItems.length} product(s)`);
          
        } catch (error) {
          console.error('Error creating order:', error);
          alert('Failed to place order. Please try again.');
        }
      }
      
      // Show success message
      if (successMessages.length > 0) {
        let finalMessage = '';
        
        if (serviceItems.length > 0) {
          finalMessage += `${serviceItems.length} service(s) booked successfully!\n`;
          setActiveTab('bookings');
        }
        
        if (productItems.length > 0) {
          finalMessage += `${productItems.length} product(s) ordered successfully!\n`;
          if (serviceItems.length === 0) {
            setActiveTab('orders');
          }
        }
        
        finalMessage += '\nCheck the respective sections for details.';
        alert(finalMessage);
      }
      
      // Refresh cart
      await fetchCartItems(customer.id);
      
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Failed to process checkout. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Handle feedback submission
  const handleAddFeedback = async () => {
    if (!feedbackComment.trim() || !feedbackService.trim() || !customer) {
      alert('Please fill all required fields');
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      const feedbackData = {
        customerId: customer.id,
        customerName: customer.name || 'Customer',
        customerEmail: customer.email || '',
        serviceOrProduct: feedbackService,
        type: feedbackType,
        rating: feedbackRating,
        comment: feedbackComment,
        status: 'pending' as const,
        createdAt: serverTimestamp()
      };

      console.log('Submitting feedback:', feedbackData);

      // Add to Firebase feedbacks collection
      await addDoc(collection(db, 'feedbacks'), feedbackData);
      
      // Also add a transaction record for points
      if (feedbackRating >= 4) {
        const pointsEarned = feedbackRating === 5 ? 50 : 25;
        await addDoc(collection(db, 'transactions'), {
          customerId: customer.id,
          type: 'points_earned' as const,
          pointsAmount: pointsEarned,
          amount: 0,
          description: `Feedback points for ${feedbackService}`,
          status: 'success' as const,
          createdAt: serverTimestamp()
        });

        // Update wallet points
        if (wallet) {
          await addDoc(collection(db, 'wallets'), {
            customerId: customer.id,
            balance: wallet.balance,
            loyaltyPoints: wallet.loyaltyPoints + pointsEarned,
            totalPointsEarned: wallet.totalPointsEarned + pointsEarned,
            totalPointsRedeemed: wallet.totalPointsRedeemed,
            updatedAt: serverTimestamp()
          });
        }
      }

      // Clear form
      setFeedbackComment('');
      setFeedbackService('');
      setFeedbackRating(5);
      setShowFeedbackForm(false);
      
      alert('Thank you for your feedback! You have earned loyalty points.');
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Handle quick service booking
  const handleQuickBook = async (service: Service) => {
    if (!customer) {
      router.push('/customer/login');
      return;
    }

    try {
      console.log('Creating booking for service:', service);
      
      const bookingData = {
        customerId: customer.id,
        customerName: customer.name || 'Customer',
        customerEmail: customer.email || '',
        serviceId: service.id,
        serviceName: service.name,
        servicePrice: service.price || 0,
        date: new Date().toISOString().split('T')[0],
        time: '10:00 AM',
        totalAmount: service.price || 0,
        status: 'pending' as const,
        createdAt: serverTimestamp(),
        notes: 'Quick booking from portal'
      };

      console.log('Booking data to save:', bookingData);

      // Add booking
      const bookingRef = await addDoc(collection(db, 'bookings'), bookingData);
      console.log('Booking created with ID:', bookingRef.id);
      
      // Add transaction
      await addDoc(collection(db, 'transactions'), {
        customerId: customer.id,
        type: 'booking' as const,
        amount: -(service.price || 0),
        description: `Booking for ${service.name}`,
        status: 'success' as const,
        referenceId: bookingRef.id,
        createdAt: serverTimestamp()
      });

      alert(`Booking created for ${service.name}! Check your bookings.`);
      
      // Automatically switch to bookings tab
      setActiveTab('bookings');
      
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

  // Handle confirm booking
  const handleConfirmBooking = async (bookingId: string) => {
    if (!customer) return;
    
    setConfirmingBooking(bookingId);
    try {
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) {
        alert('Booking not found');
        return;
      }

      // Update booking status to confirmed
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: 'confirmed',
        confirmedAt: serverTimestamp()
      });

      // Add transaction for payment
      await addDoc(collection(db, 'transactions'), {
        customerId: customer.id,
        type: 'booking' as const,
        amount: -(booking.totalAmount || 0),
        description: `Payment for ${booking.serviceName} booking`,
        status: 'success' as const,
        referenceId: bookingId,
        createdAt: serverTimestamp()
      });

      // Update wallet balance
      if (wallet) {
        const newBalance = (wallet.balance || 0) - (booking.totalAmount || 0);
        await updateDoc(doc(db, 'wallets', customer.id), {
          balance: newBalance,
          updatedAt: serverTimestamp()
        });
      }

      alert('Booking confirmed successfully!');
      
    } catch (error) {
      console.error('Error confirming booking:', error);
      alert('Failed to confirm booking. Please try again.');
    } finally {
      setConfirmingBooking(null);
    }
  };

  // Handle cancel booking
  const handleCancelBooking = async (bookingId: string) => {
    if (!customer) return;
    
    setCancellingBooking(bookingId);
    try {
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) {
        alert('Booking not found');
        return;
      }

      // Confirm cancellation
      if (!confirm('Are you sure you want to cancel this booking?')) {
        setCancellingBooking(null);
        return;
      }

      // Update booking status to cancelled
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: 'cancelled',
        cancelledAt: serverTimestamp()
      });

      // Add transaction for refund if booking was paid
      if (booking.status === 'confirmed') {
        await addDoc(collection(db, 'transactions'), {
          customerId: customer.id,
          type: 'refund' as const,
          amount: booking.totalAmount || 0,
          description: `Refund for cancelled booking: ${booking.serviceName}`,
          status: 'success' as const,
          referenceId: bookingId,
          createdAt: serverTimestamp()
        });

        // Update wallet balance for refund
        if (wallet) {
          const newBalance = (wallet.balance || 0) + (booking.totalAmount || 0);
          await updateDoc(doc(db, 'wallets', customer.id), {
            balance: newBalance,
            updatedAt: serverTimestamp()
          });
        }
      }

      alert('Booking cancelled successfully!');
      
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setCancellingBooking(null);
    }
  };

  // Handle complete booking
  const handleCompleteBooking = async (bookingId: string) => {
    if (!customer) return;
    
    setCompletingBooking(bookingId);
    try {
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) {
        alert('Booking not found');
        return;
      }

      // Update booking status to completed
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: 'completed',
        completedAt: serverTimestamp()
      });

      // Add loyalty points for completed service
      const pointsEarned = 100;
      await addDoc(collection(db, 'transactions'), {
        customerId: customer.id,
        type: 'points_earned' as const,
        pointsAmount: pointsEarned,
        amount: 0,
        description: `Points for completed service: ${booking.serviceName}`,
        status: 'success' as const,
        referenceId: bookingId,
        createdAt: serverTimestamp()
      });

      // Update wallet points
      if (wallet) {
        await updateDoc(doc(db, 'wallets', customer.id), {
          loyaltyPoints: (wallet.loyaltyPoints || 0) + pointsEarned,
          totalPointsEarned: (wallet.totalPointsEarned || 0) + pointsEarned,
          updatedAt: serverTimestamp()
        });
      }

      alert('Booking marked as completed! You earned 100 loyalty points.');
      
    } catch (error) {
      console.error('Error completing booking:', error);
      alert('Failed to mark booking as completed. Please try again.');
    } finally {
      setCompletingBooking(null);
    }
  };

  // Handle quick product purchase
  const handleQuickPurchase = async (product: Product) => {
    if (!customer) {
      router.push('/customer/login');
      return;
    }

    try {
      console.log('Creating order for product:', product);
      
      const orderData = {
        customerId: customer.id,
        customerName: customer.name || 'Customer',
        customerEmail: customer.email || '',
        products: [{
          productId: product.id,
          productName: product.name,
          quantity: 1,
          price: product.price || 0,
          image: product.imageUrl || ''
        }],
        totalAmount: product.price || 0,
        status: 'pending' as const,
        createdAt: serverTimestamp(),
        shippingAddress: '',
        paymentMethod: 'wallet'
      };

      console.log('Order data to save:', orderData);

      // Add order
      const orderRef = await addDoc(collection(db, 'orders'), orderData);
      console.log('Order created with ID:', orderRef.id);
      
      // Add transaction
      await addDoc(collection(db, 'transactions'), {
        customerId: customer.id,
        type: 'order' as const,
        amount: -(product.price || 0),
        description: `Purchase of ${product.name}`,
        status: 'success' as const,
        referenceId: orderRef.id,
        createdAt: serverTimestamp()
      });

      alert(`Order placed for ${product.name}! Check your orders.`);
      
      // Automatically switch to orders tab
      setActiveTab('orders');
      
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'confirmed':
      case 'processing':
      case 'shipped':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const calculatePointsValue = (points: number) => {
    return points / 100;
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const formatDateTime = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, 'MMM dd, yyyy hh:mm a');
    } catch {
      return 'Invalid date';
    }
  };

  const getTimeAgo = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Some time ago';
    }
  };

  // Calculate cart total
  const cartTotal = cartItems.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0);
  const cartItemsCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-secondary mx-auto mb-4" />
          <p className="text-lg font-serif text-primary">Loading your portal...</p>
          <p className="text-sm text-muted-foreground mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  // Calculate statistics
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const pendingFeedbacks = feedbacks.filter(f => f.status === 'pending').length;
  const approvedFeedbacks = feedbacks.filter(f => f.status === 'approved').length;
  const walletPointsValue = wallet ? calculatePointsValue(wallet.loyaltyPoints) : 0;

  // Get recent items
  const recentBookings = bookings.slice(0, 3);
  const recentOrders = orders.slice(0, 3);
  const recentFeedbacks = feedbacks.slice(0, 3);
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <Header />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20 border-4 border-secondary/30">
                  <AvatarImage src={customer.avatar} />
                  <AvatarFallback className="bg-secondary text-primary text-2xl font-bold">
                    {customer.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span className="text-xs font-bold uppercase tracking-widest text-white/70">Premium Member</span>
                  </div>
                  <h1 className="text-3xl font-serif font-bold">{customer.name}</h1>
                  <p className="text-white/70">{customer.email}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-white/70">
                      📞 {customer.phone || 'Not provided'}
                    </span>
                    <span className="text-sm text-white/70">
                      📅 Member since {customer.createdAt ? formatDate(customer.createdAt) : 'Recently'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/customer/portal/profile">
                  <Button variant="outline" className="border-white/30 text-white bg-white/10 hover:bg-white/20 rounded-xl">
                    <Settings className="w-4 h-4 mr-2" />
                    Profile Settings
                  </Button>
                </Link>
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  className="border-white/30 text-white bg-white/10 hover:bg-white/20 rounded-xl"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Index Error Warning */}
          {hasIndexError && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-yellow-600" />
                <div className="flex-1">
                  <p className="font-medium text-yellow-800">Performance Notice</p>
                  <p className="text-sm text-yellow-700">
                    Running in optimized mode. For better performance, create Firestore indexes.
                  </p>
                  <a 
                    href="https://console.firebase.google.com/v1/r/project/manofcave-v1/firestore/indexes" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-yellow-800 font-medium hover:underline mt-1 inline-block"
                  >
                    Create Indexes →
                  </a>
                </div>
                <button 
                  onClick={() => setHasIndexError(false)}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Debugging Buttons */}
          <div className="mb-6 flex gap-3">
            <Button 
              onClick={() => fetchCustomerData(customer?.id || '')}
              variant="outline"
              size="sm"
            >
              Refresh Data
            </Button>
          </div>

          {/* Tabs Navigation */}
          <div className="mb-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-6 w-full bg-gray-100 p-1 rounded-2xl">
                <TabsTrigger value="dashboard" className="rounded-xl data-[state=active]:bg-white">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="cart" className="rounded-xl data-[state=active]:bg-white">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart ({cartItemsCount})
                </TabsTrigger>
                <TabsTrigger value="bookings" className="rounded-xl data-[state=active]:bg-white">
                  <Calendar className="w-4 h-4 mr-2" />
                  Bookings ({bookings.length})
                </TabsTrigger>
                <TabsTrigger value="orders" className="rounded-xl data-[state=active]:bg-white">
                  <Package className="w-4 h-4 mr-2" />
                  Orders ({orders.length})
                </TabsTrigger>
                <TabsTrigger value="feedbacks" className="rounded-xl data-[state=active]:bg-white">
                  <Star className="w-4 h-4 mr-2" />
                  Reviews ({feedbacks.length})
                </TabsTrigger>
                <TabsTrigger value="wallet" className="rounded-xl data-[state=active]:bg-white">
                  <Wallet className="w-4 h-4 mr-2" />
                  Wallet
                </TabsTrigger>
              </TabsList>

              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="mt-6 space-y-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="border-none shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                            Wallet Balance
                          </p>
                          <p className="text-3xl font-bold text-primary">
                            ${wallet?.balance?.toFixed(2) || '0.00'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            ${walletPointsValue.toFixed(2)} in points
                          </p>
                        </div>
                        <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                          <Wallet className="w-7 h-7 text-green-600" />
                        </div>
                      </div>
                      <Button variant="ghost" className="w-full mt-4 text-secondary hover:text-secondary/80">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Funds
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                            Loyalty Points
                          </p>
                          <p className="text-3xl font-bold text-secondary">
                            {wallet?.loyaltyPoints?.toLocaleString() || '0'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {wallet?.totalPointsEarned?.toLocaleString() || '0'} total earned
                          </p>
                        </div>
                        <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center">
                          <Award className="w-7 h-7 text-secondary" />
                        </div>
                      </div>
                      <Link href="/customer/portal/loyalty">
                        <Button variant="ghost" className="w-full mt-4 text-secondary hover:text-secondary/80">
                          <Gift className="w-4 h-4 mr-2" />
                          Redeem Points
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                            My Cart
                          </p>
                          <p className="text-3xl font-bold text-primary">{cartItemsCount} items</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            ${cartTotal.toFixed(2)} total
                          </p>
                        </div>
                        <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
                          <ShoppingCart className="w-7 h-7 text-purple-600" />
                        </div>
                      </div>
                      <Link href="/products">
                        <Button variant="ghost" className="w-full mt-4 text-secondary hover:text-secondary/80">
                          <Plus className="w-4 h-4 mr-2" />
                          Add More Items
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                            Service Bookings
                          </p>
                          <p className="text-3xl font-bold text-primary">{bookings.length}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {completedBookings} completed
                          </p>
                        </div>
                        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                          <Calendar className="w-7 h-7 text-blue-600" />
                        </div>
                      </div>
                      <Link href="/services">
                        <Button variant="ghost" className="w-full mt-4 text-secondary hover:text-secondary/80">
                          <Calendar className="w-4 h-4 mr-2" />
                          Book Service
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column - Recent Bookings & Orders */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Recent Bookings */}
                    <Card className="border-none shadow-lg rounded-2xl">
                      <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <div>
                          <CardTitle className="text-lg font-serif">Recent Bookings</CardTitle>
                          <CardDescription>Your latest service appointments</CardDescription>
                        </div>
                        <Link href="/customer/portal?tab=bookings">
                          {/* Empty link */}
                        </Link>
                      </CardHeader>
                      <CardContent>
                        {recentBookings.length === 0 ? (
                          <div className="text-center py-8">
                            <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                            <p className="text-muted-foreground">No bookings yet</p>
                            <Link href="/services">
                              <Button className="mt-4 bg-secondary hover:bg-secondary/90 text-primary rounded-xl">
                                <Calendar className="w-4 h-4 mr-2" />
                                Book Your First Service
                              </Button>
                            </Link>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {recentBookings.map((booking) => (
                              <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-sm">{booking.serviceName}</p>
                                    
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <Clock className="w-3 h-3" />
                                      {booking.date} at {booking.time}
                                    </div>

                                    <p className="text-xs text-muted-foreground mt-1">
                                      Booked {getTimeAgo(booking.createdAt)}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <Badge className={`${getStatusColor(booking.status)} capitalize`}>
                                    {booking.status}
                                  </Badge>
                                  <p className="text-sm font-bold text-primary mt-1">${booking.totalAmount}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Recent Orders */}
                    <Card className="border-none shadow-lg rounded-2xl">
                      <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <div>
                          <CardTitle className="text-lg font-serif">Recent Orders</CardTitle>
                          <CardDescription>Your latest product purchases</CardDescription>
                        </div>
                        <Link href="/customer/portal?tab=orders">
                          {/* Empty link */}
                        </Link>
                      </CardHeader>
                      <CardContent>
                        {recentOrders.length === 0 ? (
                          <div className="text-center py-8">
                            <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                            <p className="text-muted-foreground">No orders yet</p>
                            <Link href="/products">
                              <Button className="mt-4 bg-secondary hover:bg-secondary/90 text-primary rounded-xl">
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Shop Products
                              </Button>
                            </Link>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {recentOrders.map((order) => (
                              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <Package className="w-6 h-6 text-purple-600" />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-sm">
                                      {order.products.length} {order.products.length === 1 ? 'item' : 'items'}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <Clock className="w-3 h-3" />
                                      Ordered {getTimeAgo(order.createdAt)}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {order.products.slice(0, 2).map(p => p.productName).join(', ')}
                                      {order.products.length > 2 && '...'}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <Badge className={`${getStatusColor(order.status)} capitalize`}>
                                    {order.status}
                                  </Badge>
                                  <p className="text-sm font-bold text-primary mt-1">${order.totalAmount}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column - Quick Actions & Recent Transactions */}
                  <div className="space-y-6">
                    {/* Quick Book Services */}
                    <Card className="border-none shadow-lg rounded-2xl">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-serif flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-secondary" />
                          Quick Services
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {recentServices.slice(0, 3).map((service) => (
                            <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <img 
                                    src={service.imageUrl || 'https://images.unsplash.com/photo-1512690196222-7c7d3f993c1b?q=80&w=2070&auto=format&fit=crop'} 
                                    alt={service.name}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                </div>
                                <div>
                                  <p className="font-semibold text-sm">{service.name}</p>
                                  <p className="text-xs text-muted-foreground">${service.price}</p>
                                  {/* Branch Display */}
                                  {service.branchNames && service.branchNames.length > 0 && (
                                    <div className="flex items-center gap-1 mt-1">
                                      <MapPin className="w-3 h-3 text-gray-500" />
                                      <span className="text-xs text-gray-600">
                                        {service.branchNames.join(', ')}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  className="bg-secondary hover:bg-secondary/90 text-primary rounded-lg"
                                  onClick={() => handleAddServiceToCart(service)}
                                >
                                  <ShoppingCart className="w-3 h-3 mr-1" />
                                  Add to Cart
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="rounded-lg"
                                  onClick={() => handleQuickBook(service)}
                                >
                                  Book Now
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Link href="/services">
                          <Button variant="ghost" className="w-full mt-4 text-secondary hover:text-secondary/80">
                            View All Services <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>

                    {/* Quick Products */}
                    <Card className="border-none shadow-lg rounded-2xl">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-serif flex items-center gap-2">
                          <Package className="w-5 h-5 text-secondary" />
                          Quick Products
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {recentProducts.slice(0, 3).map((product) => (
                            <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                  <img 
                                    src={product.imageUrl || 'https://images.unsplash.com/photo-1512690196222-7c7d3f993c1b?q=80&w=2070&auto=format&fit=crop'} 
                                    alt={product.name}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                </div>
                                <div>
                                  <p className="font-semibold text-sm">{product.name}</p>
                                  <p className="text-xs text-muted-foreground">${product.price}</p>
                                  {/* Branch Display */}
                                  {product.branchNames && product.branchNames.length > 0 && (
                                    <div className="flex items-center gap-1 mt-1">
                                      <MapPin className="w-3 h-3 text-gray-500" />
                                      <span className="text-xs text-gray-600">
                                        {product.branchNames.join(', ')}
                                      </span>
                                    </div>
                                  )}
                                  {/* SKU Display */}
                                  {product.sku && (
                                    <div className="flex items-center gap-1 mt-1">
                                      <Tag className="w-3 h-3 text-gray-500" />
                                      <span className="text-xs text-gray-600">SKU: {product.sku}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  className="bg-secondary hover:bg-secondary/90 text-primary rounded-lg"
                                  onClick={() => handleAddProductToCart(product)}
                                >
                                  <ShoppingCart className="w-3 h-3 mr-1" />
                                  Add to Cart
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  className="rounded-lg"
                                  onClick={() => handleQuickPurchase(product)}
                                >
                                  Buy Now
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Link href="/products">
                          <Button variant="ghost" className="w-full mt-4 text-secondary hover:text-secondary/80">
                            View All Products <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>

                    {/* Recent Transactions */}
                    <Card className="border-none shadow-lg rounded-2xl">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-serif flex items-center gap-2">
                          <History className="w-5 h-5 text-secondary" />
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {recentTransactions.length === 0 ? (
                          <div className="text-center py-4">
                            <History className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">No transactions yet</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {recentTransactions.map((txn) => (
                              <div key={txn.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    txn.amount > 0 || (txn.pointsAmount || 0) > 0 
                                      ? 'bg-green-100' 
                                      : 'bg-red-100'
                                  }`}>
                                    {(txn.amount > 0 || (txn.pointsAmount || 0) > 0) ? (
                                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <ArrowUpRight className="w-4 h-4 text-red-600 rotate-180" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium truncate max-w-[150px]">{txn.description}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {getTimeAgo(txn.createdAt)}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  {txn.pointsAmount !== 0 && (
                                    <p className={`text-sm font-bold ${(txn.pointsAmount || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                      {(txn.pointsAmount || 0) > 0 ? '+' : ''}{txn.pointsAmount} pts
                                    </p>
                                  )}
                                  {txn.amount !== 0 && (
                                    <p className={`text-sm font-bold ${txn.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                      {txn.amount > 0 ? '+' : ''}${Math.abs(txn.amount).toFixed(2)}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <Button 
                          variant="ghost" 
                          className="w-full mt-4 text-secondary hover:text-secondary/80"
                          onClick={() => setActiveTab('wallet')}
                        >
                          View All Transactions <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Cart Tab */}
              <TabsContent value="cart" className="mt-6">
                <Card className="border-none shadow-lg rounded-2xl">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl font-serif">My Shopping Cart</CardTitle>
                        <CardDescription>Review and manage your selected items - Services & Products</CardDescription>
                      </div>
                      <div className="mt-4 md:mt-0 flex items-center gap-3">
                        <p className="text-lg font-bold text-primary">
                          Total: <span className="text-2xl">${cartTotal.toFixed(2)}</span>
                        </p>
                        <Button
                          onClick={handleCheckout}
                          disabled={cartItems.length === 0 || checkoutLoading}
                          className="bg-secondary hover:bg-secondary/90 text-primary rounded-xl px-8"
                        >
                          {checkoutLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Checkout Now
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {isLoadingCart ? (
                      <div className="text-center py-12">
                        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-lg font-semibold text-primary">Loading your cart...</p>
                      </div>
                    ) : cartItems.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Your cart is empty</h3>
                        <p className="text-gray-500 mb-6">Add some services or products to get started</p>
                        <div className="flex gap-4 justify-center">
                          <Link href="/services">
                            <Button className="bg-secondary hover:bg-secondary/90 text-primary rounded-xl px-6">
                              <Calendar className="w-4 h-4 mr-2" />
                              Browse Services
                            </Button>
                          </Link>
                          <Link href="/products">
                            <Button variant="outline" className="rounded-xl px-6">
                              <Package className="w-4 h-4 mr-2" />
                              Browse Products
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cartItems.map((item) => {
                          console.log('Displaying cart item:', item);
                          return (
                            <div key={item.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">
                              <div className="flex items-start gap-4 mb-4 md:mb-0">
                                <div className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                                  <img 
                                    src={item.itemImage} 
                                    alt={item.itemName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1512690196222-7c7d3f993c1b?q=80&w=2070&auto=format&fit=crop';
                                    }}
                                  />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg font-semibold text-primary">{item.itemName || 'Unnamed Item'}</h3>
                                    <Badge variant="outline" className={
                                      item.type === 'service' 
                                        ? 'bg-blue-100 text-blue-700 border-blue-200' 
                                        : 'bg-purple-100 text-purple-700 border-purple-200'
                                    }>
                                      {item.type === 'service' ? 'Service' : 'Product'}
                                    </Badge>
                                  </div>
                                  
                                  {/* Branch Display in Cart */}
                                  {item.branchNames && item.branchNames.length > 0 && (
                                    <div className="flex items-center gap-1 mb-2">
                                      <MapPin className="w-4 h-4 text-gray-500" />
                                      <span className="text-sm text-gray-600">
                                        Available at: {item.branchNames.join(', ')}
                                      </span>
                                    </div>
                                  )}
                                  
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Added {getTimeAgo(item.addedAt)}
                                  </p>
                                  <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium">Quantity:</span>
                                      <div className="flex items-center gap-1">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-6 w-6 p-0"
                                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                          disabled={updatingCartItem === item.id || item.quantity <= 1}
                                        >
                                          -
                                        </Button>
                                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-6 w-6 p-0"
                                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                          disabled={updatingCartItem === item.id}
                                        >
                                          +
                                        </Button>
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveFromCart(item.id)}
                                      disabled={removingCartItem === item.id}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      {removingCartItem === item.id ? (
                                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                      ) : (
                                        <Trash2 className="w-4 h-4 mr-1" />
                                      )}
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <p className="text-2xl font-bold text-primary">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                                <p className="text-sm text-muted-foreground">${item.price} each</p>
                                {item.type === 'service' && (
                                  <p className="text-xs text-blue-600 mt-1">
                                    Will be booked on checkout
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        
                        {/* Cart Summary */}
                        <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <p className="text-lg font-semibold text-primary">Order Summary</p>
                              <p className="text-sm text-muted-foreground">
                                {cartItemsCount} items in cart
                              </p>
                              <div className="flex gap-4 mt-2">
                                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                                  Services: {cartItems.filter(item => item.type === 'service').length}
                                </Badge>
                                <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                                  Products: {cartItems.filter(item => item.type === 'product').length}
                                </Badge>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Shipping:</span>
                                <span className="font-semibold">$0.00</span>
                              </div>
                              <div className="flex justify-between text-lg font-bold border-t pt-2">
                                <span>Total:</span>
                                <span className="text-primary">${cartTotal.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <Button
                              onClick={handleCheckout}
                              disabled={checkoutLoading}
                              className="flex-1 bg-secondary hover:bg-secondary/90 text-primary rounded-xl py-6 text-lg font-bold"
                            >
                              {checkoutLoading ? (
                                <>
                                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <ShoppingCart className="w-5 h-5 mr-2" />
                                  Proceed to Checkout
                                </>
                              )}
                            </Button>
                            <div className="flex-1 flex gap-3">
                              <Link href="/services" className="flex-1">
                                <Button variant="outline" className="w-full rounded-xl py-6">
                                  <Calendar className="w-5 h-5 mr-2" />
                                  Add Services
                                </Button>
                              </Link>
                              <Link href="/products" className="flex-1">
                                <Button variant="outline" className="w-full rounded-xl py-6">
                                  <Package className="w-5 h-5 mr-2" />
                                  Add Products
                                </Button>
                              </Link>
                            </div>
                          </div>
                          
                          {/* Info Message */}
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-blue-600" />
                              <p className="text-sm text-blue-700">
                                <span className="font-semibold">Note:</span> Services in cart will be booked and products will be ordered when you checkout.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Bookings Tab */}
              <TabsContent value="bookings" className="mt-6">
                <Card className="border-none shadow-lg rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-serif">My Service Bookings</CardTitle>
                    <CardDescription>All your service appointments - Confirm, cancel or mark as completed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {bookings.length === 0 ? (
                      <div className="text-center py-12">
                        <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No bookings yet</h3>
                        <p className="text-gray-500 mb-6">Book your first service to get started</p>
                        <Link href="/services">
                          <Button className="bg-secondary hover:bg-secondary/90 text-primary rounded-xl px-8">
                            <Calendar className="w-4 h-4 mr-2" />
                            Browse Services
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {bookings.map((booking) => (
                          <Card key={booking.id} className="border shadow-sm">
                            <CardContent className="p-6">
                              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-4">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    <h3 className="text-lg font-semibold">{booking.serviceName}</h3>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                    <div>
                                      <span className="font-medium">Date & Time:</span>
                                      <p className="text-muted-foreground">{booking.date} at {booking.time}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Booked On:</span>
                                      <p className="text-muted-foreground">{formatDateTime(booking.createdAt)}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Service Price:</span>
                                      <p className="text-muted-foreground">${booking.servicePrice}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Total Amount:</span>
                                      <p className="text-muted-foreground">${booking.totalAmount}</p>
                                    </div>
                                    <div>
                                      <span className="font-medium">Booking ID:</span>
                                      <p className="text-muted-foreground text-sm">{booking.id.slice(0, 8)}...</p>
                                    </div>
                                  </div>
                                  
                                  {booking.notes && (
                                    <div className="mb-4">
                                      <span className="font-medium">Notes:</span>
                                      <p className="text-muted-foreground">{booking.notes}</p>
                                    </div>
                                  )}
                                  
                                  {/* Action Buttons */}
                                  <div className="flex flex-wrap gap-3 mt-4">
                                    {/* Confirm/Checkout Button - only for pending bookings */}
                                    {booking.status === 'pending' && (
                                      <Button
                                        onClick={() => handleConfirmBooking(booking.id)}
                                        disabled={confirmingBooking === booking.id}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                      >
                                        {confirmingBooking === booking.id ? (
                                          <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Confirming...
                                          </>
                                        ) : (
                                          <>
                                            <CreditCard className="w-4 h-4 mr-2" />
                                            Confirm & Pay
                                          </>
                                        )}
                                      </Button>
                                    )}
                                    
                                    {/* Complete Button - only for confirmed bookings */}
                                    {booking.status === 'confirmed' && (
                                      <Button
                                        onClick={() => handleCompleteBooking(booking.id)}
                                        disabled={completingBooking === booking.id}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                      >
                                        {completingBooking === booking.id ? (
                                          <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Completing...
                                          </>
                                        ) : (
                                          <>
                                            <Check className="w-4 h-4 mr-2" />
                                            Mark as Completed
                                          </>
                                        )}
                                      </Button>
                                    )}
                                    
                                    {/* Cancel Button - for pending and confirmed bookings */}
                                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                      <Button
                                        onClick={() => handleCancelBooking(booking.id)}
                                        disabled={cancellingBooking === booking.id}
                                        variant="outline"
                                        className="text-red-600 border-red-300 hover:bg-red-50"
                                      >
                                        {cancellingBooking === booking.id ? (
                                          <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Cancelling...
                                          </>
                                        ) : (
                                          <>
                                            <X className="w-4 h-4 mr-2" />
                                            Cancel Booking
                                          </>
                                        )}
                                      </Button>
                                    )}
                                    
                                    {/* View Details Button */}
                                    <Button
                                      variant="ghost"
                                      onClick={() => console.log('Booking details:', booking)}
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Details
                                    </Button>
                                  </div>
                                </div>
                                
                                <div className="lg:w-1/4 flex flex-col items-end gap-4">
                                  <Badge className={`${getStatusColor(booking.status)} text-sm px-3 py-1`}>
                                    {booking.status.toUpperCase()}
                                  </Badge>
                                  
                                  <div className="text-right">
                                    <p className="text-2xl font-bold text-primary">${booking.totalAmount}</p>
                                    <p className="text-sm text-muted-foreground">Total Amount</p>
                                  </div>
                                  
                                  {/* Status-specific messages */}
                                  {booking.status === 'pending' && (
                                    <div className="text-sm text-yellow-600 bg-yellow-50 px-3 py-2 rounded-lg">
                                      <Clock className="w-4 h-4 inline mr-1" />
                                      Awaiting confirmation
                                    </div>
                                  )}
                                  {booking.status === 'confirmed' && (
                                    <div className="text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                                      <CheckCircle className="w-4 h-4 inline mr-1" />
                                      Confirmed & Paid
                                    </div>
                                  )}
                                  {booking.status === 'completed' && (
                                    <div className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                                      <Award className="w-4 h-4 inline mr-1" />
                                      Completed
                                    </div>
                                  )}
                                  {booking.status === 'cancelled' && (
                                    <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                                      <XCircle className="w-4 h-4 inline mr-1" />
                                      Cancelled
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders" className="mt-6">
                <Card className="border-none shadow-lg rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-serif">My Product Orders</CardTitle>
                    <CardDescription>Track all your product purchases</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <div className="text-center py-12">
                        <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No orders yet</h3>
                        <p className="text-gray-500 mb-6">Start shopping our premium products</p>
                        <Link href="/products">
                          <Button className="bg-secondary hover:bg-secondary/90 text-primary rounded-xl px-8">
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Shop Products
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {orders.map((order) => (
                          <Card key={order.id} className="border shadow-sm">
                            <CardContent className="p-6">
                              <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-4">
                                    <Package className="w-5 h-5 text-purple-600" />
                                    <div>
                                      <h3 className="text-lg font-semibold">Order #{order.id.slice(0, 8)}</h3>
                                      <p className="text-sm text-muted-foreground">
                                        Placed on {formatDateTime(order.createdAt)}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                      <h4 className="font-medium mb-2">Products:</h4>
                                      <ul className="space-y-2">
                                        {order.products.map((product, idx) => (
                                          <li key={idx} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                              {product.image && (
                                                <img 
                                                  src={product.image} 
                                                  alt={product.productName}
                                                  className="w-8 h-8 rounded-md object-cover"
                                                />
                                              )}
                                              <span>{product.productName}</span>
                                            </div>
                                            <span className="text-muted-foreground">
                                              {product.quantity} × ${product.price}
                                            </span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div>
                                      <h4 className="font-medium mb-2">Order Details:</h4>
                                      <div className="space-y-1 text-sm">
                                        <p>
                                          <span className="font-medium">Items:</span> {order.products.length}
                                        </p>
                                        <p>
                                          <span className="font-medium">Payment:</span> {order.paymentMethod || 'Not specified'}
                                        </p>
                                        {order.shippingAddress && (
                                          <p>
                                            <span className="font-medium">Shipping:</span> {order.shippingAddress}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex flex-col items-end gap-4">
                                  <Badge className={`${getStatusColor(order.status)} text-sm px-3 py-1`}>
                                    {order.status.toUpperCase()}
                                  </Badge>
                                  <div className="text-right">
                                    <p className="text-2xl font-bold text-primary">${order.totalAmount}</p>
                                    <p className="text-sm text-muted-foreground">Total Amount</p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Feedbacks Tab */}
              <TabsContent value="feedbacks" className="mt-6">
                <Card className="border-none shadow-lg rounded-2xl">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl font-serif">My Reviews & Feedbacks</CardTitle>
                        <CardDescription>Share your experience with our services and products</CardDescription>
                      </div>
                      <Button
                        onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                        className="mt-4 md:mt-0 bg-secondary hover:bg-secondary/90 text-primary rounded-xl"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        {showFeedbackForm ? 'Close Form' : '+ Submit Feedback'}
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Feedback Form */}
                    {showFeedbackForm && (
                      <div className="mb-8 p-6 border-2 border-secondary/20 rounded-2xl bg-secondary/5">
                        <h3 className="text-xl font-serif font-bold mb-6">Share Your Experience</h3>
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium mb-2">Feedback Type *</label>
                              <div className="flex gap-3">
                                <Button
                                  type="button"
                                  variant={feedbackType === 'service' ? 'default' : 'outline'}
                                  onClick={() => setFeedbackType('service')}
                                  className="flex-1"
                                >
                                  <Calendar className="w-4 h-4 mr-2" />
                                  Service
                                </Button>
                                <Button
                                  type="button"
                                  variant={feedbackType === 'product' ? 'default' : 'outline'}
                                  onClick={() => setFeedbackType('product')}
                                  className="flex-1"
                                >
                                  <Package className="w-4 h-4 mr-2" />
                                  Product
                                </Button>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Select {feedbackType === 'service' ? 'Service' : 'Product'} *
                              </label>
                              <select
                                value={feedbackService}
                                onChange={(e) => setFeedbackService(e.target.value)}
                                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-secondary focus:border-secondary"
                                required
                              >
                                <option value="">Choose one...</option>
                                {feedbackType === 'service'
                                  ? services.map(service => (
                                      <option key={service.id} value={service.name}>
                                        {service.name} (${service.price})
                                      </option>
                                    ))
                                  : products.map(product => (
                                      <option key={product.id} value={product.name}>
                                        {product.name} (${product.price})
                                      </option>
                                    ))
                                }
                                <option value="other">Other</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Rating *</label>
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <Button
                                  key={num}
                                  type="button"
                                  size="lg"
                                  variant={feedbackRating === num ? 'default' : 'outline'}
                                  onClick={() => setFeedbackRating(num)}
                                  className="w-12 h-12 p-0 rounded-xl flex flex-col items-center justify-center"
                                >
                                  <Star className={`w-5 h-5 ${feedbackRating >= num ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                                  <span className="text-xs mt-1">{num}</span>
                                </Button>
                              ))}
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                              <span>Poor</span>
                              <span>Excellent</span>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">Your Review *</label>
                            <Textarea
                              placeholder="Share your detailed experience... What did you like? What could be improved?"
                              value={feedbackComment}
                              onChange={(e) => setFeedbackComment(e.target.value)}
                              className="min-h-[120px] rounded-xl"
                              required
                            />
                          </div>
                          
                          <div className="flex gap-3">
                            <Button
                              onClick={handleAddFeedback}
                              disabled={isSubmittingFeedback}
                              className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-8"
                              size="lg"
                            >
                              {isSubmittingFeedback ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Submitting...
                                </>
                              ) : (
                                'Submit Review'
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setShowFeedbackForm(false)}
                              className="rounded-xl px-8"
                              size="lg"
                            >
                              Cancel
                            </Button>
                          </div>
                          
                          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="w-4 h-4 text-blue-600" />
                              <p className="text-sm font-medium text-blue-800">Pro Tip:</p>
                            </div>
                            <p className="text-sm text-blue-700">
                              Earn loyalty points for your reviews! 5-star reviews earn 50 points, 
                              4-star reviews earn 25 points. Your feedback helps us improve.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Feedback List */}
                    <div className="space-y-6">
                      {feedbacks.length === 0 ? (
                        <div className="text-center py-12">
                          <MessageSquare className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-700 mb-2">No reviews yet</h3>
                          <p className="text-gray-500 mb-6">Be the first to share your experience</p>
                          <Button
                            onClick={() => setShowFeedbackForm(true)}
                            className="bg-secondary hover:bg-secondary/90 text-primary rounded-xl px-8"
                          >
                            <Star className="w-4 h-4 mr-2" />
                            Write Your First Review
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                              <CardContent className="p-4">
                                <div className="text-center">
                                  <p className="text-3xl font-bold text-green-700">{approvedFeedbacks}</p>
                                  <p className="text-sm text-green-600">Approved Reviews</p>
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                              <CardContent className="p-4">
                                <div className="text-center">
                                  <p className="text-3xl font-bold text-yellow-700">{pendingFeedbacks}</p>
                                  <p className="text-sm text-yellow-600">Pending Reviews</p>
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                              <CardContent className="p-4">
                                <div className="text-center">
                                  <p className="text-3xl font-bold text-blue-700">
                                    {(feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length || 0).toFixed(1)}/5
                                  </p>
                                  <p className="text-sm text-blue-600">Average Rating</p>
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          <div className="space-y-6">
                            {feedbacks.map((feedback) => (
                              <Card key={feedback.id} className="border shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                  <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1">
                                      <div className="flex items-start justify-between mb-4">
                                        <div>
                                          <div className="flex items-center gap-2 mb-2">
                                            {feedback.type === 'service' ? (
                                              <Calendar className="w-5 h-5 text-blue-600" />
                                            ) : (
                                              <Package className="w-5 h-5 text-purple-600" />
                                            )}
                                            <h3 className="text-lg font-semibold">{feedback.serviceOrProduct}</h3>
                                          </div>
                                          <div className="flex items-center gap-4">
                                            <div className="flex gap-1">
                                              {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                  key={i}
                                                  className={`w-4 h-4 ${
                                                    i < feedback.rating
                                                      ? 'fill-yellow-500 text-yellow-500'
                                                      : 'text-gray-300'
                                                  }`}
                                                />
                                              ))}
                                            </div>
                                            <Badge
                                              variant="outline"
                                              className={`rounded-full ${
                                                feedback.status === 'approved'
                                                  ? 'bg-green-100 text-green-800 border-green-200'
                                                  : feedback.status === 'pending'
                                                  ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                                  : 'bg-red-100 text-red-800 border-red-200'
                                              }`}
                                            >
                                              {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                                            </Badge>
                                            <span className="text-sm text-muted-foreground">
                                              {getTimeAgo(feedback.createdAt)}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                        <p className="text-gray-700 italic">"{feedback.comment}"</p>
                                      </div>
                                      
                                      <div className="text-sm text-muted-foreground">
                                        <p>
                                          <span className="font-medium">By:</span> {feedback.customerName} ({feedback.customerEmail})
                                        </p>
                                      </div>
                                    </div>
                                    
                                    {feedback.adminReply && (
                                      <div className="md:w-1/3">
                                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                          <div className="flex items-center gap-2 mb-2">
                                            <Sparkles className="w-4 h-4 text-blue-600" />
                                            <p className="text-sm font-bold text-blue-900">Admin Response:</p>
                                          </div>
                                          <p className="text-sm text-blue-800">{feedback.adminReply}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Wallet Tab */}
              <TabsContent value="wallet" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Wallet Summary */}
                  <div className="lg:col-span-2">
                    <Card className="border-none shadow-lg rounded-2xl">
                      <CardHeader>
                        <CardTitle className="text-2xl font-serif">My Wallet</CardTitle>
                        <CardDescription>Manage your balance and loyalty points</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                          <Card className="bg-gradient-to-br from-primary to-primary/80 text-white">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <p className="text-sm opacity-80">Available Balance</p>
                                  <p className="text-4xl font-bold">${wallet?.balance?.toFixed(2) || '0.00'}</p>
                                </div>
                                <Wallet className="w-12 h-12 opacity-50" />
                              </div>
                              <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/20">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Funds
                              </Button>
                            </CardContent>
                          </Card>
                          
                          <Card className="bg-gradient-to-br from-secondary to-secondary/80 text-primary">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <p className="text-sm opacity-80">Loyalty Points</p>
                                  <p className="text-4xl font-bold">{wallet?.loyaltyPoints?.toLocaleString() || '0'}</p>
                                  <p className="text-sm opacity-80 mt-1">
                                    Worth ${walletPointsValue.toFixed(2)}
                                  </p>
                                </div>
                                <Award className="w-12 h-12 opacity-50" />
                              </div>
                              <Link href="/customer/portal/loyalty">
                                <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                                  <Gift className="w-4 h-4 mr-2" />
                                  Redeem Points
                                </Button>
                              </Link>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card>
                            <CardContent className="p-6">
                              <div className="text-center">
                                <p className="text-3xl font-bold text-green-600">
                                  {wallet?.totalPointsEarned?.toLocaleString() || '0'}
                                </p>
                                <p className="text-sm text-muted-foreground">Total Points Earned</p>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardContent className="p-6">
                              <div className="text-center">
                                <p className="text-3xl font-bold text-blue-600">
                                  {wallet?.totalPointsRedeemed?.toLocaleString() || '0'}
                                </p>
                                <p className="text-sm text-muted-foreground">Total Points Redeemed</p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Recent Transactions */}
                  <div>
                    <Card className="border-none shadow-lg rounded-2xl h-full">
                      <CardHeader>
                        <CardTitle className="text-lg font-serif flex items-center gap-2">
                          <History className="w-5 h-5 text-secondary" />
                          Recent Transactions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {transactions.length === 0 ? (
                          <div className="text-center py-8">
                            <History className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                            <p className="text-muted-foreground">No transactions yet</p>
                          </div>
                        ) : (
                          <div className="space-y-3 max-h-[400px] overflow-y-auto">
                            {transactions.slice(0, 10).map((txn) => (
                              <div key={txn.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                    txn.amount > 0 || (txn.pointsAmount || 0) > 0 
                                      ? 'bg-green-100' 
                                      : 'bg-red-100'
                                  }`}>
                                    {(txn.amount > 0 || (txn.pointsAmount || 0) > 0) ? (
                                      <ArrowUpRight className="w-5 h-5 text-green-600" />
                                    ) : (
                                      <ArrowUpRight className="w-5 h-5 text-red-600 rotate-180" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">{txn.description}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {getTimeAgo(txn.createdAt)}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  {txn.pointsAmount !== 0 && (
                                    <p className={`text-sm font-bold ${(txn.pointsAmount || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                      {(txn.pointsAmount || 0) > 0 ? '+' : ''}{txn.pointsAmount} pts
                                    </p>
                                  )}
                                  {txn.amount !== 0 && (
                                    <p className={`text-sm font-bold ${txn.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                      {txn.amount > 0 ? '+' : ''}${Math.abs(txn.amount).toFixed(2)}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Quick Access Section */}
          <Card className="border-none shadow-lg rounded-2xl mt-8">
            <CardHeader>
              <CardTitle className="text-lg font-serif">Quick Access</CardTitle>
              <CardDescription>Get to your favorite actions quickly</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/services">
                  <Button className="w-full h-24 flex-col gap-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200 text-blue-700">
                    <Calendar className="w-6 h-6" />
                    <span className="text-sm font-bold">Book Service</span>
                  </Button>
                </Link>
                
                <Link href="/products">
                  <Button className="w-full h-24 flex-col gap-3 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-200 text-purple-700">
                    <ShoppingCart className="w-6 h-6" />
                    <span className="text-sm font-bold">Shop Products</span>
                  </Button>
                </Link>
                
                <Button 
                  onClick={() => setActiveTab('cart')}
                  className="w-full h-24 flex-col gap-3 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:from-green-100 hover:to-green-200 text-green-700"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span className="text-sm font-bold">View Cart ({cartItemsCount})</span>
                </Button>
                
                <Link href="/customer/portal/profile">
                  <Button className="w-full h-24 flex-col gap-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:from-gray-100 hover:to-gray-200 text-gray-700">
                    <Settings className="w-6 h-6" />
                    <span className="text-sm font-bold">Settings</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}