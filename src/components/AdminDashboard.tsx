import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingBag, Users, 
  BarChart3, Settings, Bell, MessageCircle, 
  Plus, Search, Filter, ArrowUpRight, ArrowDownRight,
  Monitor, Smartphone, Tablet, Trash2, Edit, Save, X, Ticket, Image as ImageIcon, Shield
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn, formatCurrency } from '../lib/utils';
import { useShop, Product, Banner, Order, Category, Coupon } from '../lib/ShopContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { 
    products, banners, orders, coupons, settings, categories, flashSales,
    addProduct, updateProduct, deleteProduct,
    addBanner, updateBanner, deleteBanner,
    addCoupon, updateCoupon, deleteCoupon,
    addCategory, updateCategory, deleteCategory,
    addFlashSale, updateFlashSale, deleteFlashSale,
    updateOrderStatus, updateSettings,
    isAdmin 
  } = useShop();

  const [activeTab, setActiveTab] = useState('Overview');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleQuickAddProduct = () => {
    setActiveTab('Products');
    setIsAddingProduct(true);
  };

  // Stats Calculations
  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((acc, o) => acc + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-6 text-center">
        <div className="glass p-12 rounded-[3rem] max-w-md">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-display font-black mb-4 uppercase">Restricted Sector</h1>
          <p className="text-white/40 mb-8 font-medium">Access to this neural link is restricted to authorized personnel only. Your credentials have been logged.</p>
          <button onClick={() => navigate('/')} className="px-8 py-4 rounded-full bg-accent text-primary font-black uppercase tracking-widest text-xs hover:scale-105 transition-all">Return to Surface</button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { label: 'Overview', icon: LayoutDashboard },
    { label: 'Products', icon: Package },
    { label: 'Categories', icon: Filter },
    { label: 'Flash Sale', icon: Bell },
    { label: 'Orders', icon: ShoppingBag },
    { label: 'Banners', icon: ImageIcon },
    { label: 'Coupons', icon: Ticket },
    { label: 'Customers', icon: Users },
    { label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col lg:flex-row">
      {/* Mobile Header Toggle */}
      <div className="lg:hidden h-16 px-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-accent flex items-center justify-center">
             <LayoutDashboard className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-bold uppercase italic text-xs">Admin <span className="text-accent">Core</span></span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 hover:bg-white/5 rounded-lg">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <LayoutDashboard className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-[#0a0a0a] z-40 p-6 space-y-2">
          {menuItems.map((item) => (
            <button 
              key={item.label}
              onClick={() => { setActiveTab(item.label); setIsMobileMenuOpen(false); }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-lg font-bold transition-all text-left",
                activeTab === item.label ? "bg-accent text-primary" : "text-white/40"
              )}
            >
              <item.icon className="w-6 h-6" />
              {item.label}
            </button>
          ))}
          <div className="pt-6 border-t border-white/5">
            <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-white/40 font-bold">
               <ArrowUpRight className="w-6 h-6" /> Exit to Store
            </button>
          </div>
        </div>
      )}

      {/* Sidebar (Desktop) */}
      <aside className="w-64 border-r border-white/5 flex flex-col p-6 hidden lg:flex sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center glow-cyan">
             <LayoutDashboard className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display font-bold uppercase italic tracking-tighter">Admin <span className="text-accent underline decoration-accent/30 underline-offset-4">Core</span></span>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => (
            <button 
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left",
                activeTab === item.label ? "bg-accent text-primary" : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-10 p-4 glass rounded-2xl border-white/5">
           <div className="text-[10px] uppercase font-black text-accent tracking-[0.2em] mb-2">System Status</div>
           <p className="text-[10px] text-white/40 leading-relaxed mb-4 italic">Neural link stable. Core uptime: 99.98%</p>
           <button onClick={() => navigate('/')} className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold uppercase transition-colors">
             Exit to Store
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 sticky top-0 lg:top-0 bg-[#0a0a0a]/80 backdrop-blur-md z-10 hidden lg:flex">
          <div>
            <h2 className="font-bold text-sm text-white/40 uppercase tracking-widest">{activeTab}</h2>
          </div>

          <div className="flex items-center gap-6">
             <button className="relative p-2 hover:bg-white/5 rounded-full transition-colors">
                <Bell className="w-5 h-5 text-white/40" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-[#0a0a0a]" />
             </button>
             <div className="flex items-center gap-3 pl-6 border-l border-white/5">
                <div className="text-right">
                   <div className="text-xs font-bold">Store Command</div>
                   <div className="text-[10px] text-accent font-black uppercase tracking-widest">Authorized</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 overflow-hidden shrink-0">
                   <img src="https://api.dicebear.com/7.x/bottts/svg?seed=admin" alt="Admin" className="w-full h-full" referrerPolicy="no-referrer" />
                </div>
             </div>
          </div>
        </header>

        <div className="p-4 lg:p-8">
           {activeTab === 'Overview' && (
             <Overview 
               products={products} 
               orders={orders} 
               revenue={totalRevenue} 
               pending={pendingOrders} 
               onSwitchTab={setActiveTab} 
               onQuickAdd={handleQuickAddProduct}
             />
           )}
           {activeTab === 'Products' && (
             <ProductManager 
               products={products} 
               categories={categories}
               isAdding={isAddingProduct}
               setIsAdding={setIsAddingProduct}
               onAdd={addProduct} 
               onUpdate={updateProduct} 
               onDelete={deleteProduct} 
             />
           )}
           {activeTab === 'Categories' && (
             <CategoryManager 
               categories={categories} 
               onAdd={addCategory} 
               onUpdate={updateCategory} 
               onDelete={deleteCategory} 
             />
           )}
           {activeTab === 'Flash Sale' && (
             <FlashSaleManager 
               flashSales={flashSales} 
               onAdd={addFlashSale} 
               onUpdate={updateFlashSale} 
               onDelete={deleteFlashSale} 
             />
           )}
           {activeTab === 'Orders' && (
             <OrderManager orders={orders} onUpdateStatus={updateOrderStatus} />
           )}
           {activeTab === 'Banners' && (
             <BannerManager banners={banners} onAdd={addBanner} onUpdate={updateBanner} onDelete={deleteBanner} />
           )}
           {activeTab === 'Settings' && (
             <SettingsManager settings={settings} onUpdate={updateSettings} />
           )}
           {activeTab === 'Coupons' && (
             <CouponManager coupons={coupons} onAdd={addCoupon} onUpdate={updateCoupon} onDelete={deleteCoupon} />
           )}
           {activeTab === 'Customers' && (
             <UserManager orders={orders} />
           )}
        </div>
      </main>
    </div>
  );
}

// --- Sub-components ---

function Overview({ products, orders, revenue, pending, onSwitchTab, onQuickAdd }: any) {
  return (
    <div className="space-y-8 text-left">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Revenue" value={formatCurrency(revenue)} trend="+14.2%" icon={BarChart3} color="text-accent" />
        <StatCard label="Total Orders" value={orders.length} trend="+5.1%" icon={ShoppingBag} color="text-purple-400" />
        <StatCard label="Active Items" value={products.length} icon={Package} color="text-blue-400" />
        <StatCard label="Pending Orders" value={pending} icon={Bell} color="text-orange-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass rounded-[2.5rem] border-white/5 overflow-hidden">
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-bold">Recent Acquisitions</h3>
            <button onClick={() => onSwitchTab('Orders')} className="text-[10px] font-black uppercase text-accent hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-widest text-white/30 border-b border-white/5">
                      <th className="px-8 py-4 tracking-tighter">Customer</th>
                      <th className="px-8 py-4 tracking-tighter">Items</th>
                      <th className="px-8 py-4 tracking-tighter">Status</th>
                      <th className="px-8 py-4 tracking-tighter text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {orders.slice(0, 5).map((order: any) => (
                      <tr key={order.id} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 grow">
                        <td className="px-8 py-5">
                            <div className="font-bold">{order.userName}</div>
                            <div className="text-[10px] text-white/30 truncate max-w-[150px]">{order.userEmail}</div>
                        </td>
                        <td className="px-8 py-5 text-white/60">{order.items.length} Units</td>
                        <td className="px-8 py-5">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                              order.status === 'delivered' ? "bg-green-400/20 text-green-400" : "bg-orange-400/20 text-orange-400"
                            )}>
                              {order.status}
                            </span>
                        </td>
                        <td className="px-8 py-5 text-right font-black italic text-accent">{formatCurrency(order.total)}</td>
                      </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-white/20 uppercase tracking-widest font-bold text-xs italic">No orders detected in the network</td>
                    </tr>
                  )}
                </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
           <div className="glass p-8 rounded-[2.5rem] border-white/5">
              <h3 className="font-bold mb-6 flex items-center gap-2">
                <Plus className="w-4 h-4 text-accent" /> Quick Actions
              </h3>
              <div className="space-y-3">
                 <button 
                  onClick={onQuickAdd}
                  className="w-full p-4 rounded-2xl bg-accent text-primary font-black uppercase tracking-widest text-xs flex items-center justify-between hover:scale-[1.02] active:scale-[0.98] transition-all"
                 >
                   Deploy New Gadget <ArrowUpRight className="w-4 h-4" />
                 </button>
                 <button 
                  onClick={() => onSwitchTab('Coupons')}
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs flex items-center justify-between hover:bg-white/10 transition-all"
                 >
                   Issue Discount <ArrowUpRight className="w-4 h-4" />
                 </button>
                 <button 
                  onClick={() => onSwitchTab('Banners')}
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs flex items-center justify-between hover:bg-white/10 transition-all"
                 >
                   Update Banners <ArrowUpRight className="w-4 h-4" />
                 </button>
              </div>
           </div>

           <div className="glass p-8 rounded-[2.5rem] border-white/5 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                 <Shield className="w-6 h-6 text-accent" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Encrypted Link</p>
              <h4 className="text-xs font-black italic">mdkawsarforazi.biz</h4>
           </div>
        </div>
      </div>
    </div>
  );
}

function ProductManager({ products, categories, isAdding, setIsAdding, onAdd, onUpdate, onDelete }: any) {
  const [editProduct, setEditProduct] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [useManualCategory, setUseManualCategory] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const category = useManualCategory 
      ? formData.get('manualCategory') as string 
      : formData.get('category') as string;

    const data = {
      name: formData.get('name') as string,
      slug: (formData.get('slug') as string || (formData.get('name') as string).toLowerCase().replace(/\s+/g, '-')),
      price: Number(formData.get('price')),
      originalPrice: formData.get('originalPrice') ? Number(formData.get('originalPrice')) : null,
      category: category,
      img: formData.get('img') as string,
      stock: Number(formData.get('stock')),
      description: formData.get('description') as string,
      rating: Number(formData.get('rating')) || 5,
      isTrending: formData.get('isTrending') === 'on'
    };

    if (editProduct) {
      await onUpdate(editProduct.id, data);
      setEditProduct(null);
    } else {
      await onAdd(data);
      setIsAdding(false);
    }
    setImagePreview('');
    setUseManualCategory(false);
  };

  const handleEdit = (p: any) => {
    setEditProduct(p);
    setImagePreview(p.img);
  };

  const closeForm = () => {
    setIsAdding(false);
    setEditProduct(null);
    setImagePreview('');
    setUseManualCategory(false);
  };

  return (
    <div className="space-y-8 text-left">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold uppercase tracking-tighter italic">Neural <span className="text-accent underline decoration-accent/30 underline-offset-4">Inventory</span></h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-6 py-3 rounded-xl bg-accent text-primary font-bold text-sm glow-cyan flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Deploy New Gadget
        </button>
      </div>

      {(isAdding || editProduct) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-8 rounded-[2.5rem] w-full max-w-2xl border-white/5 relative my-8"
          >
            <button onClick={closeForm} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full"><X className="w-6 h-6" /></button>
            <h2 className="text-2xl font-display font-black mb-6 uppercase italic text-center">{editProduct ? 'Refine Gadget' : 'Deploy Gadget'}</h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
               <div className="space-y-1 md:col-span-2">
                 <label className="text-[10px] font-black uppercase text-accent">Product Title</label>
                 <input name="name" defaultValue={editProduct?.name} required placeholder="Enter gadget name..." className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-lg font-bold focus:border-accent outline-none" />
               </div>

               <div className="space-y-1 md:col-span-2">
                 <label className="text-[10px] font-black uppercase text-accent">SEO Friendly URL (Slug)</label>
                 <input name="slug" defaultValue={editProduct?.slug} placeholder="e.g. iphone-15-pro-max" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-accent outline-none" />
               </div>

               <div className="space-y-1">
                 <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase text-accent">Category</label>
                    <button 
                      type="button"
                      onClick={() => setUseManualCategory(!useManualCategory)}
                      className="text-[8px] font-black uppercase text-white/40 hover:text-accent transition-colors"
                    >
                      {useManualCategory ? 'Use Preset' : 'Manual Entry'}
                    </button>
                 </div>
                 {useManualCategory ? (
                   <input name="manualCategory" placeholder="Enter new category..." required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-accent outline-none" />
                 ) : (
                   <select name="category" defaultValue={editProduct?.category || 'all'} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-accent outline-none">
                      {categories.map((cat: Category) => (
                        <option key={cat.id} value={cat.slug} className="bg-[#0a0a0a]">{cat.name}</option>
                      ))}
                      {categories.length === 0 && (
                        <>
                          <option value="audio" className="bg-[#0a0a0a]">Audio</option>
                          <option value="mobile" className="bg-[#0a0a0a]">Mobile</option>
                          <option value="wearables" className="bg-[#0a0a0a]">Wearables</option>
                          <option value="computing" className="bg-[#0a0a0a]">Computing</option>
                        </>
                      )}
                   </select>
                 )}
               </div>

               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-accent">Stock Units</label>
                 <input name="stock" type="number" defaultValue={editProduct?.stock || 0} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-accent outline-none" />
               </div>

               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-accent">Sale Price (৳)</label>
                 <input name="price" type="number" step="0.01" defaultValue={editProduct?.price} required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-accent outline-none" />
               </div>

               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-white/30">Original Price (optional ৳)</label>
                 <input name="originalPrice" type="number" step="0.01" defaultValue={editProduct?.originalPrice} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-accent outline-none text-white/60" />
               </div>

               <div className="space-y-4 md:col-span-2">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-accent">Image Neural Link (URL)</label>
                    <input 
                        name="img" 
                        defaultValue={editProduct?.img} 
                        onChange={(e) => setImagePreview(e.target.value)}
                        required 
                        placeholder="https://example.com/gadget.png"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-accent outline-none" 
                    />
                 </div>
                 {imagePreview && (
                    <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 p-2 overflow-hidden mx-auto transition-all">
                        <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/0a0a0a/00e5ff?text=Invalid+Link';
                            }}
                            referrerPolicy="no-referrer" 
                        />
                    </div>
                 )}
               </div>

               <div className="space-y-1 md:col-span-2">
                 <label className="text-[10px] font-black uppercase text-accent">Description</label>
                 <textarea name="description" defaultValue={editProduct?.description} rows={3} placeholder="Describe the gadget's future tech..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-accent outline-none resize-none" />
               </div>

               <div className="flex items-center gap-6 md:col-span-2">
                 <div className="flex items-center gap-3">
                   <input type="checkbox" name="isTrending" id="isTrending" defaultChecked={editProduct?.isTrending} className="w-4 h-4 rounded border-white/10 bg-white/5 text-accent focus:ring-accent" />
                   <label htmlFor="isTrending" className="text-[10px] font-black uppercase tracking-widest pt-0.5 cursor-pointer text-white/60">Mark as Trending</label>
                 </div>
                 <div className="flex items-center gap-2 grow max-w-[150px]">
                    <label className="text-[10px] font-black uppercase text-white/30 shrink-0">Rating</label>
                    <input name="rating" type="number" step="0.1" max="5" defaultValue={editProduct?.rating || 5} className="w-full bg-transparent border-b border-white/10 py-1 text-xs text-accent focus:border-accent outline-none text-center" />
                 </div>
               </div>

               <div className="md:col-span-2 pt-4">
                 <button type="submit" className="w-full py-5 bg-accent text-primary font-black uppercase tracking-[0.2em] rounded-2xl glow-cyan hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl">
                    {editProduct ? 'Sync Neural Changes' : 'Execute Deployment'}
                 </button>
               </div>
            </form>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {products.map((p: any) => (
           <div key={p.id} className="glass p-5 rounded-3xl border-white/5 group relative hover:border-accent/30 transition-all duration-300">
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button onClick={() => handleEdit(p)} className="p-2 bg-black/80 backdrop-blur-md rounded-lg text-white hover:bg-accent hover:text-primary transition-all border border-white/10"><Edit className="w-4 h-4" /></button>
                <button onClick={() => onDelete(p.id)} className="p-2 bg-black/80 backdrop-blur-md rounded-lg text-white hover:bg-red-500 hover:text-white transition-all border border-white/10"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="w-full aspect-square bg-white/5 rounded-2xl p-4 mb-4 flex items-center justify-center overflow-hidden">
                 <img src={p.img} alt={p.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
              </div>
              <div className="space-y-1">
                 <div className="text-[10px] font-black text-accent uppercase tracking-widest">{p.category}</div>
                 <h4 className="font-bold truncate">{p.name}</h4>
                 <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="font-black italic text-white/80">{formatCurrency(p.price)}</span>
                        {p.originalPrice && (
                            <span className="text-[10px] text-white/30 line-through">{formatCurrency(p.originalPrice)}</span>
                        )}
                    </div>
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{p.stock} Units</span>
                 </div>
              </div>
           </div>
         ))}
         {products.length === 0 && (
           <div className="col-span-full py-20 text-center glass rounded-[3rem] border-white/5">
              <Package className="w-16 h-16 text-white/5 mx-auto mb-4" />
              <p className="text-white/20 font-black uppercase tracking-[0.3em] text-sm">No items in the neural inventory</p>
           </div>
         )}
      </div>
    </div>
  );
}

function CategoryManager({ categories, onAdd, onUpdate, onDelete }: any) {
  const [isAdding, setIsAdding] = useState(false);
  const [editCat, setEditCat] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      slug: (formData.get('slug') as string || (formData.get('name') as string).toLowerCase().replace(/\s+/g, '-')),
      image: formData.get('image') as string,
    };

    if (editCat) {
      await onUpdate(editCat.id, data);
      setEditCat(null);
    } else {
      await onAdd(data);
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-8 text-left">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold uppercase tracking-tighter italic">Neural <span className="text-accent underline decoration-accent/30 underline-offset-4">Segments</span></h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-6 py-3 rounded-xl bg-accent text-primary font-bold text-sm glow-cyan flex items-center gap-2 hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Segment
        </button>
      </div>

      {(isAdding || editCat) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-8 rounded-[2.5rem] w-full max-w-md border-white/5 relative"
          >
            <button onClick={() => { setIsAdding(false); setEditCat(null); }} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full"><X className="w-6 h-6" /></button>
            <h2 className="text-2xl font-display font-black mb-6 uppercase italic">{editCat ? 'Update Category' : 'New Category'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-accent">Category Name</label>
                 <input name="name" defaultValue={editCat?.name} required placeholder="e.g. Mobile, Gaming" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-accent outline-none" />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-accent">SEO Friendly URL (Slug)</label>
                 <input name="slug" defaultValue={editCat?.slug} placeholder="e.g. mobile-gaming" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-accent outline-none" />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-accent">Image URL</label>
                 <input name="image" defaultValue={editCat?.image} required placeholder="https://images.unsplash.com/..." className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-accent outline-none" />
               </div>
               <button type="submit" className="w-full py-4 bg-accent text-primary font-black uppercase tracking-widest rounded-2xl glow-cyan transition-all">
                  Save Category
               </button>
            </form>
          </motion.div>
        </div>
      )}

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((c: any) => (
            <div key={c.id} className="glass p-6 rounded-[2rem] border-white/5 flex items-center justify-between border-b-4 border-b-accent/20 group">
               <div className="flex items-center gap-4">
                 {c.image && <img src={c.image} className="w-12 h-12 rounded-xl object-cover border border-white/10 shadow-lg" />}
                 <div>
                   <h4 className="font-bold text-lg leading-tight uppercase italic">{c.name}</h4>
                   <p className="text-[10px] text-white/30 font-black tracking-widest uppercase">{c.slug}</p>
                 </div>
               </div>
               <div className="flex gap-2">
                <button onClick={() => setEditCat(c)} className="p-2 bg-white/5 rounded-lg hover:bg-accent hover:text-primary transition-all"><Edit className="w-4 h-4" /></button>
                <button onClick={() => onDelete(c.id)} className="p-2 bg-white/5 rounded-lg hover:bg-red-500/20 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
           </div>
         ))}
         {categories.length === 0 && (
           <div className="col-span-full py-20 text-center glass rounded-[3rem] border-white/5">
              <Filter className="w-16 h-16 text-white/5 mx-auto mb-4" />
              <p className="text-white/20 font-black uppercase tracking-[0.3em] text-sm">No neural segments defined</p>
           </div>
         )}
      </div>
    </div>
  );
}

function OrderManager({ orders, onUpdateStatus }: any) {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  return (
    <div className="glass rounded-[2.5rem] border-white/5 overflow-hidden">
       <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-bold uppercase tracking-tighter italic">Neural <span className="text-accent underline decoration-accent/30 underline-offset-4">Shipments</span></h3>
          <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">{orders.length} Protocols Active</span>
       </div>
       <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-white/30 border-b border-white/5">
                   <th className="px-8 py-4">ID / Target</th>
                   <th className="px-8 py-4">Delivery Vector</th>
                   <th className="px-8 py-4">Products</th>
                   <th className="px-8 py-4">Total Value</th>
                   <th className="px-8 py-4">Current Status</th>
                   <th className="px-8 py-4 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="text-sm">
                {orders.map((o: any) => (
                   <tr key={o.id} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group cursor-pointer" onClick={() => setSelectedOrder(o)}>
                      <td className="px-8 py-6">
                         <div className="font-mono font-bold text-accent">#{o.id.slice(0, 8)}</div>
                         <div className="text-white font-medium">{o.userName || 'Anonymous'}</div>
                         <div className="text-[10px] text-white/30 truncate max-w-[120px]">{o.userEmail}</div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="text-xs font-bold text-white/60">{o.phone}</div>
                         <div className="text-[10px] text-white/30 truncate max-w-[150px]">{o.address}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-xs text-white/60">
                           {o.items.map((item: any) => `${item.qty}x ${item.name}`).join(', ')}
                        </div>
                      </td>
                      <td className="px-8 py-6 font-black italic">{formatCurrency(o.total)}</td>
                      <td className="px-8 py-6" onClick={(e) => e.stopPropagation()}>
                         <select 
                           value={o.status} 
                           onChange={(e) => onUpdateStatus(o.id, e.target.value)}
                           className={cn(
                             "bg-white/5 border border-white/10 rounded-lg py-1 px-3 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-accent",
                             o.status === 'delivered' ? 'text-green-400' : 
                             o.status === 'cancelled' ? 'text-red-400' : 'text-orange-400'
                           )}
                         >
                            <option value="pending" className="bg-[#0a0a0a]">Pending</option>
                            <option value="processing" className="bg-[#0a0a0a]">Processing</option>
                            <option value="shipped" className="bg-[#0a0a0a]">Shipped</option>
                            <option value="delivered" className="bg-[#0a0a0a]">Delivered</option>
                            <option value="cancelled" className="bg-[#0a0a0a]">Cancelled</option>
                         </select>
                      </td>
                      <td className="px-8 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                         <button 
                          onClick={() => setSelectedOrder(o)}
                          className="text-[10px] font-bold text-accent hover:text-white uppercase tracking-widest hover:underline transition-colors block ml-auto"
                         >
                           View Intel
                         </button>
                      </td>
                   </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center text-white/20 uppercase tracking-widest font-black italic">No orders detected in the nexus</td>
                  </tr>
                )}
             </tbody>
          </table>
       </div>

       {/* Detailed Order View Modal (Similar to InvoiceModal but more technical for Admin) */}
       {selectedOrder && (
         <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300 print:p-0 print:bg-white">
            <style dangerouslySetInnerHTML={{ __html: `
              @media print {
                body * { visibility: hidden; }
                .admin-printable, .admin-printable * { visibility: visible; }
                .admin-printable { 
                  position: absolute; 
                  left: 0; 
                  top: 0; 
                  width: 100%;
                  height: auto;
                  background: white !important;
                  color: black !important;
                }
                .glass { background: transparent !important; border: none !important; }
                .no-print { display: none !important; }
              }
            `}} />
            <div className="w-full max-w-2xl glass rounded-[3rem] border-white/5 overflow-hidden flex flex-col max-h-[85vh] admin-printable">
               <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5 no-print">
                  <div className="space-y-1">
                    <div className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">Neural Shipment Manifest</div>
                    <h2 className="text-2xl font-display font-black uppercase italic italic">Order <span className="text-accent">#{selectedOrder.id.slice(0, 12)}</span></h2>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-3 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6" /></button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-10 space-y-10">
                  {/* Delivery Detail Grid */}
                  <div className="grid grid-cols-2 gap-10">
                     <div className="space-y-4">
                        <div className="text-[10px] font-black text-white/30 uppercase tracking-widest border-b border-white/5 pb-2">Target Identity</div>
                        <div className="space-y-1">
                           <div className="font-bold text-lg">{selectedOrder.userName || 'Unknown Entity'}</div>
                           <div className="text-sm text-accent font-mono">{selectedOrder.userEmail}</div>
                           <div className="text-sm text-white/60">{selectedOrder.phone}</div>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <div className="text-[10px] font-black text-white/30 uppercase tracking-widest border-b border-white/5 pb-2">Drop Coordinates</div>
                        <div className="space-y-1">
                           <div className="text-sm text-white/80 italic leading-relaxed">{selectedOrder.address}</div>
                           <div className="pt-2">
                              <span className={cn(
                                "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 border border-white/10",
                                selectedOrder.status === 'delivered' ? 'text-green-400' : 'text-accent'
                              )}>
                                Priority: {selectedOrder.status === 'delivered' ? 'COMPLETED' : 'HIGH'}
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Payment Matrix */}
                  <div className="grid grid-cols-2 gap-10">
                     <div className="space-y-4">
                        <div className="text-[10px] font-black text-white/30 uppercase tracking-widest border-b border-white/5 pb-2">Financial Protocol</div>
                        <div className="space-y-1">
                           <div className="text-sm font-bold uppercase tracking-tighter">Method: <span className="text-accent">{selectedOrder.paymentMethod || 'COD'}</span></div>
                           <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Status: {selectedOrder.paymentStatus === 'paid' ? 'AUTHORIZED' : 'PENDING'}</div>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <div className="text-[10px] font-black text-white/30 uppercase tracking-widest border-b border-white/5 pb-2">Temporal Marker</div>
                        <div className="text-xs text-white/60 font-mono">
                           {selectedOrder.createdAt?.seconds ? new Date(selectedOrder.createdAt.seconds * 1000).toLocaleString() : 'Processing...'}
                        </div>
                     </div>
                  </div>

                  {/* Product Grid */}
                  <div className="space-y-4">
                     <div className="text-[10px] font-black text-white/30 uppercase tracking-widest border-b border-white/5 pb-2">Acquisition Payload</div>
                     <div className="space-y-4">
                        {selectedOrder.items.map((item: any, i: number) => (
                           <div key={i} className="flex items-center gap-4 group">
                              <div className="w-12 h-12 rounded-xl bg-white/5 p-2 shrink-0 border border-white/10">
                                 <img src={item.img} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                              </div>
                              <div className="flex-1">
                                 <div className="text-sm font-bold">{item.name}</div>
                                 <div className="text-[10px] text-white/40 uppercase font-black">{item.category} • {formatCurrency(item.price)}</div>
                              </div>
                              <div className="text-right">
                                 <div className="font-black text-accent">{item.qty}x</div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Financial Manifest */}
                  <div className="glass p-8 rounded-3xl border-white/5 space-y-4">
                     <div className="flex justify-between text-xs font-bold text-white/40">
                        <span>Base Cost</span>
                        <span>{formatCurrency(selectedOrder.total - selectedOrder.deliveryCharge)}</span>
                     </div>
                     <div className="flex justify-between text-xs font-bold text-white/40">
                        <span>Logistics</span>
                        <span>{selectedOrder.deliveryCharge === 0 ? 'FREE' : formatCurrency(selectedOrder.deliveryCharge)}</span>
                     </div>
                     <div className="h-px bg-white/5" />
                     <div className="flex justify-between items-end">
                        <div className="space-y-1">
                           <div className="text-[10px] font-black text-accent uppercase tracking-widest">Protocol Total</div>
                           <div className="text-xs text-white/30 italic">Encoded with Smart Circle Security</div>
                        </div>
                        <div className="text-3xl font-black italic italic text-white">{formatCurrency(selectedOrder.total)}</div>
                     </div>
                  </div>
               </div>

               <div className="p-8 border-t border-white/5 flex gap-4 no-print">
                  <button 
                    onClick={() => {
                        window.print();
                    }}
                    className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 font-black uppercase tracking-widest text-[10px] transition-all"
                  >
                    Print Manifest
                  </button>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="flex-1 py-4 rounded-2xl bg-accent text-primary font-black uppercase tracking-widest text-[10px] glow-cyan transition-all"
                  >
                    Close Log
                  </button>
               </div>
            </div>
         </div>
       )}
    </div>
  );
}

function SettingsManager({ settings, onUpdate }: any) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = async () => {
    await onUpdate(localSettings);
    alert("Settings synchronized successfully");
  };

  return (
    <div className="max-w-2xl mx-auto glass p-10 rounded-[2.5rem] border-white/5">
       <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500 glow-orange">
             <Settings className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-display font-black uppercase italic">Core <span className="text-accent underline decoration-accent/30 underline-offset-4">Config</span></h2>
       </div>

       <div className="space-y-8">
          <div className="grid grid-cols-2 gap-8">
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">Std Delivery Charge</label>
                <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-accent">৳</span>
                   <input 
                     type="number" 
                     value={localSettings.deliveryCharge} 
                     onChange={(e) => setLocalSettings({...localSettings, deliveryCharge: Number(e.target.value)})}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-6 focus:outline-none focus:border-accent/40 font-bold" 
                   />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">Free Shipping Ceiling</label>
                <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-accent">৳</span>
                   <input 
                     type="number" 
                     value={localSettings.freeDeliveryThreshold} 
                     onChange={(e) => setLocalSettings({...localSettings, freeDeliveryThreshold: Number(e.target.value)})}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-6 focus:outline-none focus:border-accent/40 font-bold" 
                   />
                </div>
             </div>
          </div>

          <div className="space-y-4">
             <label className="text-xs font-black uppercase tracking-widest text-accent">Support Neural Links</label>
             <div className="grid gap-4">
                <div className="space-y-1">
                   <label className="text-[10px] font-bold uppercase text-white/40 tracking-widest">WhatsApp URL</label>
                   <input 
                     type="text" 
                     value={localSettings.whatsapp || ''} 
                     onChange={(e) => setLocalSettings({...localSettings, whatsapp: e.target.value})}
                     placeholder="https://wa.me/..."
                     className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-accent outline-none" 
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-bold uppercase text-white/40 tracking-widest">Telegram URL</label>
                   <input 
                     type="text" 
                     value={localSettings.telegram || ''} 
                     onChange={(e) => setLocalSettings({...localSettings, telegram: e.target.value})}
                     placeholder="https://t.me/..."
                     className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-accent outline-none" 
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-bold uppercase text-white/40 tracking-widest">Messenger URL</label>
                   <input 
                     type="text" 
                     value={localSettings.messenger || ''} 
                     onChange={(e) => setLocalSettings({...localSettings, messenger: e.target.value})}
                     placeholder="https://m.me/..."
                     className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-accent outline-none" 
                   />
                </div>
             </div>
          </div>

          <div className="p-6 bg-white/5 rounded-3xl border border-white/5 italic text-white/40 text-xs">
             "The parameters defined here will affect all future transactions within the Hub."
          </div>

          <button 
           onClick={handleSave}
           className="w-full py-5 bg-white text-primary font-black uppercase tracking-widest rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
             <Save className="w-5 h-5" /> Synchronize Config
          </button>
       </div>
    </div>
  );
}

function BannerManager({ banners, onAdd, onUpdate, onDelete }: any) {
  const [isAdding, setIsAdding] = useState(false);
  const [editBanner, setEditBanner] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
      image: formData.get('image') as string,
      link: formData.get('link') as string,
      accent: formData.get('accent') as string,
      order: Number(formData.get('order')) || 0
    };

    if (editBanner) {
      await onUpdate(editBanner.id, data);
      setEditBanner(null);
    } else {
      await onAdd(data);
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold uppercase tracking-tighter italic">Slider <span className="text-accent underline decoration-accent/30 underline-offset-4">Neuralytics</span></h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-6 py-3 rounded-xl bg-accent text-primary font-bold text-sm glow-cyan flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Install New Sequence
        </button>
      </div>

      {(isAdding || editBanner) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-8 rounded-[2.5rem] w-full max-w-2xl border-white/5 relative"
          >
            <button onClick={() => { setIsAdding(false); setEditBanner(null); }} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full"><X className="w-6 h-6" /></button>
            <h2 className="text-2xl font-display font-black mb-6 uppercase italic">{editBanner ? 'Update Frame' : 'New Frame'}</h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
               <div className="space-y-1 md:col-span-2">
                 <label className="text-[10px] font-black uppercase text-accent">Banner Title (For Admin Identity)</label>
                 <input name="title" defaultValue={editBanner?.title} required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-accent outline-none" />
               </div>
               <div className="space-y-1 hidden">
                 <label className="text-[10px] font-black uppercase text-accent">Subtitle</label>
                 <input name="subtitle" defaultValue={editBanner?.subtitle || ''} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-accent outline-none" />
               </div>
               <div className="space-y-1 md:col-span-2">
                 <label className="text-[10px] font-black uppercase text-accent">Image URL (Clean - No Text)</label>
                 <input name="image" defaultValue={editBanner?.image} required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-accent outline-none" />
               </div>
               <div className="space-y-1 md:col-span-2">
                 <label className="text-[10px] font-black uppercase text-accent">Click Redirect URL</label>
                 <input name="link" defaultValue={editBanner?.link} placeholder="/shop" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-accent outline-none" />
               </div>
               <div className="space-y-1 hidden">
                 <label className="text-[10px] font-black uppercase text-accent">Accent Color (Hex)</label>
                 <input name="accent" defaultValue={editBanner?.accent || '#00e5ff'} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-accent outline-none" />
               </div>
               <div className="md:col-span-2">
                 <button type="submit" className="w-full py-4 bg-accent text-primary font-black uppercase tracking-widest rounded-2xl glow-cyan transition-all font-display italic">
                    Push to Mainframe
                 </button>
               </div>
            </form>
          </motion.div>
        </div>
      )}

      <div className="space-y-4">
         {banners.map((b: any) => (
           <div key={b.id} className="glass p-6 rounded-[2rem] border-white/5 flex items-center gap-6 group">
              <div className="w-40 h-24 rounded-2xl bg-white/5 overflow-hidden border border-white/10 shrink-0">
                 <img src={b.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg leading-tight">{b.title}</h4>
                <p className="text-xs text-white/40">{b.subtitle}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditBanner(b)} className="p-3 bg-white/5 rounded-xl hover:bg-accent hover:text-primary transition-all"><Edit className="w-4 h-4" /></button>
                <button onClick={() => onDelete(b.id)} className="p-3 bg-white/5 rounded-xl hover:bg-red-500/20 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}

function UserManager({ orders }: any) {
  // Derive customer list from orders for now, or just show a message
  const customers = Array.from(new Set(orders.map((o: any) => JSON.stringify({ email: o.userEmail, name: o.userName, uid: o.userId })))).map((s: any) => JSON.parse(s));

  return (
    <div className="glass rounded-[2.5rem] border-white/5 overflow-hidden">
       <div className="p-8 border-b border-white/5">
          <h3 className="font-bold uppercase tracking-tighter italic">Known <span className="text-accent underline decoration-accent/30 underline-offset-4">Entities</span></h3>
       </div>
       <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-white/30 border-b border-white/5">
                   <th className="px-8 py-4">Designation</th>
                   <th className="px-8 py-4">Comms Channel</th>
                   <th className="px-8 py-4">Neural ID</th>
                   <th className="px-8 py-4 text-right">Activity</th>
                </tr>
             </thead>
             <tbody className="text-sm">
                {customers.map((c: any, i: number) => (
                   <tr key={i} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-black text-xs">{c.name.charAt(0)}</div>
                           <span className="font-bold">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-white/60">{c.email}</td>
                      <td className="px-8 py-6 font-mono text-[10px] text-white/20 uppercase tracking-widest">{c.uid}</td>
                      <td className="px-8 py-6 text-right">
                         <span className="text-[10px] font-black text-accent uppercase tracking-widest">Active Operative</span>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );
}

function CouponManager({ coupons, onAdd, onUpdate, onDelete }: any) {
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      code: formData.get('code') as string,
      discountType: formData.get('discountType') as any,
      discountValue: Number(formData.get('discountValue')),
      minAmount: Number(formData.get('minAmount')),
      isActive: true
    };
    await onAdd(data);
    setIsAdding(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold uppercase tracking-tighter italic">Discount <span className="text-accent underline decoration-accent/30 underline-offset-4">Protocols</span></h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-6 py-3 rounded-xl bg-accent text-primary font-bold text-sm glow-cyan flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Generate Coupon
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-8 rounded-[2.5rem] w-full max-w-md border-white/5 relative"
          >
            <button onClick={() => setIsAdding(false)} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full"><X className="w-6 h-6" /></button>
            <h2 className="text-2xl font-display font-black mb-6 uppercase italic">New Coupon Code</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-accent">Coupon Code</label>
                 <input name="code" required placeholder="GADGET20" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-accent outline-none" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-accent">Type</label>
                    <select name="discountType" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-accent outline-none">
                       <option value="percentage" className="bg-[#0a0a0a]">Percentage (%)</option>
                       <option value="fixed" className="bg-[#0a0a0a]">Fixed Amount (৳)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-accent">Value</label>
                    <input name="discountValue" type="number" required placeholder="15" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-accent outline-none" />
                  </div>
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-accent">Minimum Order Amount (৳)</label>
                 <input name="minAmount" type="number" defaultValue="0" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-accent outline-none" />
               </div>
               <button type="submit" className="w-full py-4 bg-accent text-primary font-black uppercase tracking-widest rounded-2xl glow-cyan transition-all">
                  Sync Protocol
               </button>
            </form>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {coupons.map((c: any) => (
           <div key={c.id} className="glass p-6 rounded-3xl border-white/5 flex items-center justify-between border-l-4 border-l-accent">
              <div>
                <div className="text-xl font-display font-black tracking-widest text-white mb-1">{c.code}</div>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                  {c.discountValue}{c.discountType === 'percentage' ? '%' : '$'} OFF | MIN: ${c.minAmount}
                </div>
              </div>
              <button 
                onClick={() => onDelete(c.id)}
                className="p-3 bg-white/5 rounded-xl hover:bg-red-500/20 hover:text-red-500 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
           </div>
         ))}
         {coupons.length === 0 && (
           <div className="col-span-full py-20 text-center glass rounded-[3rem] border-white/5">
              <Ticket className="w-16 h-16 text-white/10 mx-auto mb-4" />
              <p className="text-white/20 font-black uppercase tracking-[0.2em] text-sm">No active discount protocols</p>
           </div>
         )}
      </div>
    </div>
  );
}

function FlashSaleManager({ flashSales, onAdd, onUpdate, onDelete }: any) {
  const [isAdding, setIsAdding] = useState(false);
  const [editSale, setEditSale] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      image: formData.get('image') as string,
      link: formData.get('link') as string,
      buttonText: formData.get('buttonText') as string,
      isActive: formData.get('isActive') === 'on'
    };

    if (editSale) {
      await onUpdate(editSale.id, data);
      setEditSale(null);
    } else {
      await onAdd(data);
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-8 text-left">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold uppercase tracking-tighter italic">Flash <span className="text-accent underline decoration-accent/30 underline-offset-4">Alerts</span></h3>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-6 py-3 rounded-xl bg-accent text-primary font-bold text-sm glow-cyan flex items-center gap-2 hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" /> Create Flash Sale
        </button>
      </div>

      {(isAdding || editSale) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 sm:p-2">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-8 rounded-[2.5rem] w-full max-w-lg border-white/5 relative"
          >
            <button onClick={() => { setIsAdding(false); setEditSale(null); }} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full"><X className="w-6 h-6" /></button>
            <h2 className="text-2xl font-display font-black mb-6 uppercase italic">{editSale ? 'Modify Flash' : 'New Flash Alert'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                 <label className="text-[10px] font-black uppercase text-accent">Alert Title</label>
                 <input name="title" defaultValue={editSale?.title} required placeholder="Limited Offer!" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-accent outline-none" />
               </div>
               <div>
                 <label className="text-[10px] font-black uppercase text-accent">Description (Optional)</label>
                 <textarea name="description" defaultValue={editSale?.description} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-accent outline-none resize-none" rows={2} />
               </div>
               <div>
                 <label className="text-[10px] font-black uppercase text-accent">Banner/Product Image URL</label>
                 <input name="image" defaultValue={editSale?.image} required className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-accent outline-none" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-accent">Button Text</label>
                    <input name="buttonText" defaultValue={editSale?.buttonText || 'Shop Now'} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-accent outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-accent">Redirect Link</label>
                    <input name="link" defaultValue={editSale?.link} placeholder="/shop" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-accent outline-none" />
                  </div>
               </div>
               <div className="flex items-center gap-3 py-2">
                 <input type="checkbox" name="isActive" id="saleActive" defaultChecked={editSale?.isActive ?? true} />
                 <label htmlFor="saleActive" className="text-xs font-bold uppercase tracking-widest text-white/60">Live Status (Active)</label>
               </div>
               <button type="submit" className="w-full py-4 bg-accent text-primary font-black uppercase tracking-widest rounded-2xl glow-cyan transition-all font-display italic">
                  Transmit Alert
               </button>
            </form>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {flashSales.map((s: any) => (
           <div key={s.id} className="glass p-6 rounded-[2rem] border-white/5 flex gap-4 items-center">
              <div className="w-24 h-24 rounded-2xl bg-white/5 overflow-hidden border border-white/10">
                 <img src={s.image} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-lg leading-tight truncate">{s.title}</h4>
                    {s.isActive && <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_#00e5ff]" />}
                </div>
                <p className="text-[10px] text-white/30 font-black tracking-widest uppercase truncate">{s.description || 'No data description'}</p>
                <div className="flex gap-2 mt-3">
                    <button onClick={() => setEditSale(s)} className="p-2.5 bg-white/5 rounded-xl hover:bg-accent hover:text-primary transition-all"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => onDelete(s.id)} className="p-2.5 bg-white/5 rounded-xl hover:bg-red-500/20 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, trend, icon: Icon, color, negative }: any) {
  return (
    <div className="glass p-6 rounded-3xl border-white/5 text-left transition-transform hover:scale-[1.02]">
       <div className="flex items-center justify-between mb-4">
          <div className={cn("p-2 rounded-lg bg-white/5", color)}>
             <Icon className="w-5 h-5" />
          </div>
          {trend && (
             <div className={cn("text-[10px] font-bold flex items-center gap-1", negative ? "text-red-400" : "text-green-400")}>
                {negative ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                {trend}
             </div>
          )}
       </div>
       <div className="text-2xl font-black mb-1">{value}</div>
       <div className="text-[10px] font-bold uppercase tracking-widest text-white/20">{label}</div>
    </div>
  );
}

