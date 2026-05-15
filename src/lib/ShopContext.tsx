import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  getDoc,
  where
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { onAuthStateChanged, getRedirectResult } from 'firebase/auth';

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: string;
  rating: number;
  img: string;
  description?: string;
  isTrending?: boolean;
  stock?: number;
}

export interface CartItem extends Product {
  qty: number;
}

export interface Banner {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  accent: string;
  link: string;
  order: number;
}

export interface Order {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  items: CartItem[];
  total: number;
  deliveryCharge: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  address: string;
  phone: string;
  createdAt: any;
  couponUsed?: string;
  paymentMethod: 'COD' | 'SSLCommerz' | 'Stripe';
  paymentStatus: 'pending' | 'paid' | 'failed';
}

export interface ShopSettings {
  deliveryCharge: number;
  freeDeliveryThreshold: number;
  telegram?: string;
  whatsapp?: string;
  messenger?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minAmount: number;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface FlashSale {
  id: string;
  title: string;
  description?: string;
  image: string;
  link?: string;
  isActive: boolean;
  buttonText?: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  address: string;
}

interface ShopContextType {
  products: Product[];
  banners: Banner[];
  orders: Order[];
  coupons: Coupon[];
  categories: Category[];
  flashSales: FlashSale[];
  cart: CartItem[];
  settings: ShopSettings;
  isAdmin: boolean;
  isLoading: boolean;
  userProfile: UserProfile | null;
  
  // Cart Actions
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, delta: number) => void;
  clearCart: () => void;
  
  // Profile Actions
  updateProfile: (profile: UserProfile) => Promise<void>;
  
  // Admin Actions
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  addBanner: (banner: Omit<Banner, 'id'>) => Promise<void>;
  updateBanner: (id: string, banner: Partial<Banner>) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  
  addCoupon: (coupon: Omit<Coupon, 'id'>) => Promise<void>;
  updateCoupon: (id: string, coupon: Partial<Coupon>) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
  
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  addFlashSale: (sale: Omit<FlashSale, 'id'>) => Promise<void>;
  updateFlashSale: (id: string, sale: Partial<FlashSale>) => Promise<void>;
  deleteFlashSale: (id: string) => Promise<void>;
  
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  updateSettings: (settings: Partial<ShopSettings>) => Promise<void>;
  
  // UI Actions
  selectedProduct: Product | null;
  openProduct: (product: Product) => void;
  closeProduct: () => void;
  
  // Checkout
  checkout: (orderDetails: { address: string; phone: string; name?: string; email?: string; couponCode?: string; itemsOverride?: CartItem[] }) => Promise<void>;
  validateCoupon: (code: string, subtotal: number) => { valid: boolean; discountAmount: number; message: string };
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

// Error handling as per Firebase integration guide
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Permission Error: ', JSON.stringify(errInfo));
  // We throw so the app can handle it if needed, or just log for now
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [settings, setSettings] = useState<ShopSettings>({ 
    deliveryCharge: 100, 
    freeDeliveryThreshold: 5000,
    telegram: 'https://t.me/yourusername',
    whatsapp: 'https://wa.me/yournumber',
    messenger: 'https://m.me/yourpage'
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Persistence: Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('gadgets_hub_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to load cart", e);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('gadgets_hub_cart', JSON.stringify(cart));
  }, [cart]);

  // Auth & Permissions
  useEffect(() => {
    // Handle redirect result if user was redirected back
    getRedirectResult(auth).catch((error) => {
      console.error("Auth redirect error:", error);
    });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch User Profile
        const userDocRef = doc(db, 'users', user.uid);
        onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserProfile(docSnap.data() as UserProfile);
          } else {
            setUserProfile(null);
          }
        }, (err) => handleFirestoreError(err, OperationType.GET, `users/${user.uid}`));

        // Special Case: User provided admin email
        if (user.email === 'mdkawsarforazi.biz@gmail.com') {
          setIsAdmin(true);
          try {
            const adminDoc = await getDoc(doc(db, 'admins', user.uid));
            if (!adminDoc.exists()) {
              const { setDoc } = await import('firebase/firestore');
              await setDoc(doc(db, 'admins', user.uid), { email: user.email, role: 'superuser' });
            }
          } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, `admins/${user.uid}`);
          }
          return;
        }

        // Check if user is admin
        try {
          const adminDoc = await getDoc(doc(db, 'admins', user.uid));
          setIsAdmin(adminDoc.exists());
        } catch (e) {
          setIsAdmin(false);
          handleFirestoreError(e, OperationType.GET, `admins/${user.uid}`);
        }
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Real-time Data Fetching
  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      setIsLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'products'));

    const unsubBanners = onSnapshot(collection(db, 'banners'), (snapshot) => {
      const sortedBanners = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Banner))
        .sort((a, b) => a.order - b.order);
      setBanners(sortedBanners);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'banners'));

    const unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'categories'));

    const unsubCoupons = onSnapshot(collection(db, 'coupons'), (snapshot) => {
      setCoupons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Coupon)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'coupons'));

    const unsubSettings = onSnapshot(doc(db, 'settings', 'global'), (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data() as ShopSettings);
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'settings/global'));

    const unsubFlashSales = onSnapshot(collection(db, 'flashSales'), (snapshot) => {
      setFlashSales(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FlashSale)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'flashSales'));

    return () => {
      unsubProducts();
      unsubBanners();
      unsubCategories();
      unsubCoupons();
      unsubSettings();
      unsubFlashSales();
    };
  }, []);

  // Real-time Orders (Admin or User specific)
  useEffect(() => {
    if (!auth.currentUser) {
      setOrders([]);
      return;
    }

    let q = query(collection(db, 'orders'), where('userId', '==', auth.currentUser.uid));
    if (isAdmin) {
      q = query(collection(db, 'orders'));
    }

    const unsubOrders = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'orders'));

    return () => unsubOrders();
  }, [isAdmin, auth.currentUser?.uid]);

  // Cart Logic
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const updateProfile = async (profile: UserProfile) => {
    if (!auth.currentUser) return;
    try {
      const { setDoc } = await import('firebase/firestore');
      await setDoc(doc(db, 'users', auth.currentUser.uid), profile, { merge: true });
    } catch (e: any) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
    }
  };

  // Admin Actions
  const addProduct = async (p: Omit<Product, 'id'>) => {
    try {
      await addDoc(collection(db, 'products'), { ...p, createdAt: serverTimestamp() });
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'products');
    }
  };

  const updateProduct = async (id: string, p: Partial<Product>) => {
    try {
      await updateDoc(doc(db, 'products', id), p);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `products/${id}`);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `products/${id}`);
    }
  };

  const addBanner = async (b: Omit<Banner, 'id'>) => {
    try {
      await addDoc(collection(db, 'banners'), b);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'banners');
    }
  };

  const updateBanner = async (id: string, b: Partial<Banner>) => {
    try {
      await updateDoc(doc(db, 'banners', id), b);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `banners/${id}`);
    }
  };

  const deleteBanner = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'banners', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `banners/${id}`);
    }
  };

  const addCoupon = async (c: Omit<Coupon, 'id'>) => {
    try {
      await addDoc(collection(db, 'coupons'), c);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'coupons');
    }
  };

  const updateCoupon = async (id: string, c: Partial<Coupon>) => {
    try {
      await updateDoc(doc(db, 'coupons', id), c);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `coupons/${id}`);
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'coupons', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `coupons/${id}`);
    }
  };

  const addCategory = async (cat: Omit<Category, 'id'>) => {
    try {
      await addDoc(collection(db, 'categories'), cat);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'categories');
    }
  };

  const updateCategory = async (id: string, cat: Partial<Category>) => {
    try {
      await updateDoc(doc(db, 'categories', id), cat);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `categories/${id}`);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `categories/${id}`);
    }
  };

  const addFlashSale = async (s: Omit<FlashSale, 'id'>) => {
    try {
      await addDoc(collection(db, 'flashSales'), s);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'flashSales');
    }
  };

  const updateFlashSale = async (id: string, s: Partial<FlashSale>) => {
    try {
      await updateDoc(doc(db, 'flashSales', id), s);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `flashSales/${id}`);
    }
  };

  const deleteFlashSale = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'flashSales', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `flashSales/${id}`);
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      await updateDoc(doc(db, 'orders', id), { status });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `orders/${id}`);
    }
  };

  const updateSettings = async (s: Partial<ShopSettings>) => {
    try {
      await updateDoc(doc(db, 'settings', 'global'), s);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'settings/global');
    }
  };

  // UI Actions
  const openProduct = (p: Product) => setSelectedProduct(p);
  const closeProduct = () => setSelectedProduct(null);

  const validateCoupon = (code: string, subtotal: number) => {
    if (!code) return { valid: false, discountAmount: 0, message: '' };
    
    // Check dynamic coupons
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.isActive);
    if (coupon) {
      if (subtotal >= coupon.minAmount) {
        let discount = 0;
        if (coupon.discountType === 'percentage') {
          discount = subtotal * (coupon.discountValue / 100);
        } else {
          discount = coupon.discountValue;
        }
        return { valid: true, discountAmount: discount, message: 'Coupon applied successfully!' };
      } else {
        return { valid: false, discountAmount: 0, message: `Minimum amount ৳${coupon.minAmount} required` };
      }
    }

    // Hardcoded fallback
    if (code.toUpperCase() === 'SMART10') {
      return { valid: true, discountAmount: subtotal * 0.1, message: '10% Discount Applied' };
    }

    return { valid: false, discountAmount: 0, message: 'Invalid or expired coupon code' };
  };

  // Checkout
  const checkout = async (details: { address: string; phone: string; name?: string; email?: string; couponCode?: string; itemsOverride?: CartItem[] }) => {
    const checkoutItems = details.itemsOverride || cart;

    if (checkoutItems.length === 0) throw new Error("Cart is empty");

    const subtotal = checkoutItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    
    const { valid, discountAmount } = validateCoupon(details.couponCode || '', subtotal);
    const finalDiscount = valid ? discountAmount : 0;

    const orderData: Omit<Order, 'id'> = {
      userId: auth.currentUser?.uid || 'guest',
      userEmail: details.email || auth.currentUser?.email || 'guest@example.com',
      userName: details.name || auth.currentUser?.displayName || 'Guest User',
      items: checkoutItems,
      total: Math.max(0, subtotal + settings.deliveryCharge - finalDiscount),
      deliveryCharge: settings.deliveryCharge,
      status: 'pending',
      address: details.address,
      phone: details.phone,
      createdAt: serverTimestamp(),
      paymentMethod: 'COD',
      paymentStatus: 'pending',
      ...(valid && details.couponCode ? { couponUsed: details.couponCode } : {})
    };

    try {
      await addDoc(collection(db, 'orders'), orderData);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'orders');
    }
    
    // Only clear cart if we checked out the actual cart
    if (!details.itemsOverride) {
      clearCart();
    }
  };

  return (
    <ShopContext.Provider value={{
      products, banners, orders, coupons, categories, flashSales, cart, settings, isAdmin, isLoading, userProfile,
      addToCart, removeFromCart, updateCartQty, clearCart, updateProfile,
      addProduct, updateProduct, deleteProduct,
      addBanner, updateBanner, deleteBanner,
      addCoupon, updateCoupon, deleteCoupon,
      addCategory, updateCategory, deleteCategory,
      addFlashSale, updateFlashSale, deleteFlashSale,
      updateOrderStatus, updateSettings,
      selectedProduct, openProduct, closeProduct,
      checkout, validateCoupon
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
