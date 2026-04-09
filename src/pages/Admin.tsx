import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { motion, Reorder, AnimatePresence } from 'motion/react';
import { Plus, Edit, Trash2, Save, X, Image as ImageIcon, Tag, DollarSign, GripVertical } from 'lucide-react';
import { formatPrice, compressImage } from '../lib/utils';

export default function Admin() {
  const { products, addProduct, updateProduct, deleteProduct, orders, updateOrderStatus } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [imageToDelete, setImageToDelete] = useState<{idx: number} | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [storageWarning, setStorageWarning] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'sadman2025') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const startEdit = (product: any) => {
    setEditingId(product.id);
    setEditForm({ ...product });
  };

  const handleSave = () => {
    try {
      updateProduct(editForm);
      setEditingId(null);
      setStorageWarning(null);
    } catch (e) {
      if (e instanceof Error && e.name === 'QuotaExceededError') {
        setStorageWarning("Storage limit reached! Try using smaller images or external URLs.");
      }
    }
  };

  const handleAdd = () => {
    const newProd = {
      id: Date.now().toString(),
      title: 'New Piece',
      price: 0,
      description: 'Description here',
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'],
      category: 'T-Shirts',
      sizes: ['S', 'M', 'L'],
      colors: [],
      isSpectrum: false,
      spectrumImage: '',
      stockCount: 10,
      isOutOfStock: false,
    };
    addProduct(newProd);
    startEdit(newProd);
  };

  const handleBulkAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsProcessing(true);
    const filesArray: File[] = Array.from(files);

    for (let i = 0; i < filesArray.length; i++) {
      const file: File = filesArray[i];
      const reader = new FileReader();
      
      const base64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const compressed = await compressImage(base64);
      
      const newProd = {
        id: (Date.now() + i).toString() + '-' + Math.random().toString(36).substr(2, 5),
        title: file.name.split('.')[0] || 'New Piece',
        price: 0,
        description: 'Description here',
        images: [compressed],
        category: 'T-Shirts',
        sizes: ['S', 'M', 'L'],
        colors: [],
        isSpectrum: false,
        spectrumImage: '',
        stockCount: 10,
        isOutOfStock: false,
      };
      addProduct(newProd);
    }
    setIsProcessing(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'images' | 'spectrumImage') => {
    const files = e.target.files;
    if (!files) return;

    setIsProcessing(true);
    const filesArray: File[] = Array.from(files);

    for (const file of filesArray) {
      if (field === 'images' && editForm.images.length >= 6) {
        setStorageWarning("Maximum 6 images allowed per product.");
        break;
      }

      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const compressed = await compressImage(base64);

      if (field === 'images') {
        setEditForm((prev: any) => ({
          ...prev,
          images: [...prev.images, compressed].slice(0, 6)
        }));
      } else {
        setEditForm((prev: any) => ({
          ...prev,
          spectrumImage: compressed
        }));
      }
    }
    setIsProcessing(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full glass p-10 rounded-3xl text-center">
          <h1 className="text-3xl font-display font-black mb-8">ADMIN ACCESS</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Enter Password" 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              className={`w-full px-6 py-4 bg-white/5 border rounded-2xl focus:outline-none transition-colors ${error ? 'border-red-500' : 'border-white/10 focus:border-prism-mid'}`}
            />
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-red-500 text-xs font-bold uppercase tracking-widest"
              >
                {error}
              </motion.p>
            )}
            <button type="submit" className="w-full py-4 bg-white text-black font-display font-bold rounded-2xl hover:bg-prism-mid hover:text-white transition-all">
              Unlock Panel
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
          <div>
            <h1 className="text-5xl font-display font-black uppercase">Admin Panel</h1>
            <p className="text-white/40 font-mono text-sm tracking-widest mt-2">Manage your spectrum</p>
          </div>
          
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${activeTab === 'orders' ? 'bg-white text-black shadow-xl' : 'text-white/40 hover:text-white'}`}
            >
              Orders ({orders.length})
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${activeTab === 'products' ? 'bg-white text-black shadow-xl' : 'text-white/40 hover:text-white'}`}
            >
              Inventory ({products.length})
            </button>
          </div>

          {activeTab === 'products' && (
            <div className="flex flex-col items-end gap-4">
              <div className="flex items-center gap-4">
                <label className={`flex items-center gap-2 px-6 py-3 glass border-white/10 text-white rounded-xl font-bold uppercase tracking-widest transition-all cursor-pointer ${isProcessing ? 'opacity-50 cursor-wait' : 'hover:bg-white/10'}`}>
                  {isProcessing ? 'Processing...' : <><ImageIcon size={20} /> Add from Photos</>}
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleBulkAdd} 
                    disabled={isProcessing}
                  />
                </label>
                <button onClick={handleAdd} className="flex items-center gap-2 px-6 py-3 bg-prism-mid text-white rounded-xl font-bold uppercase tracking-widest hover:bg-prism-start transition-all">
                  <Plus size={20} /> Add Piece
                </button>
              </div>
              {storageWarning && (
                <motion.p 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-red-500 text-[10px] font-bold uppercase tracking-widest bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20"
                >
                  {storageWarning}
                </motion.p>
              )}
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'products' ? (
            <motion.div 
              key="products"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 gap-6"
            >
              {products.map(product => (
                <div key={product.id} className="glass p-6 rounded-3xl">
                  {editingId === product.id ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-bold uppercase text-white/40 mb-1 block">Title</label>
                          <input 
                            value={editForm.title} 
                            onChange={e => setEditForm({...editForm, title: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-white/40 mb-1 block">Price ($)</label>
                          <input 
                            type="number"
                            value={editForm.price} 
                            onChange={e => setEditForm({...editForm, price: parseFloat(e.target.value)})}
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-white/40 mb-1 block">Offer (%)</label>
                          <input 
                            type="number"
                            value={editForm.offer || 0} 
                            onChange={e => setEditForm({...editForm, offer: parseInt(e.target.value)})}
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-white/40 mb-1 block">Stock Count</label>
                          <input 
                            type="number"
                            value={editForm.stockCount || 0} 
                            onChange={e => setEditForm({...editForm, stockCount: parseInt(e.target.value)})}
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-white/40 mb-1 block">Colors (comma separated)</label>
                          <input 
                            value={(editForm.colors || []).join(', ')} 
                            onChange={e => setEditForm({...editForm, colors: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})}
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-xl"
                            placeholder="Black, White, Grey"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-white/40 mb-1 block">Sizes (comma separated)</label>
                          <input 
                            value={(editForm.sizes || []).join(', ')} 
                            onChange={e => setEditForm({...editForm, sizes: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})}
                            className="w-full bg-white/5 border border-white/10 p-3 rounded-xl"
                            placeholder="S, M, L, XL, XXL"
                          />
                        </div>
                        <div className="flex flex-col gap-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={editForm.isSpectrum}
                              onChange={e => setEditForm({...editForm, isSpectrum: e.target.checked})}
                              className="w-5 h-5 rounded border-white/10 bg-white/5 text-prism-mid"
                            />
                            <span className="text-sm font-bold uppercase tracking-widest">Spectrum Series</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={editForm.isOutOfStock}
                              onChange={e => setEditForm({...editForm, isOutOfStock: e.target.checked})}
                              className="w-5 h-5 rounded border-white/10 bg-white/5 text-red-500"
                            />
                            <span className="text-sm font-bold uppercase tracking-widest text-red-500">Mark as Stock Out</span>
                          </label>
                        </div>
                        {editForm.isSpectrum && (
                          <div>
                            <label className="text-[10px] font-bold uppercase text-white/40 mb-1 block">Spectrum Effect Image</label>
                            <div className="flex flex-col gap-4">
                              <label className="group cursor-pointer relative">
                                <div className="w-full py-6 glass border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 group-hover:border-prism-mid/50 group-hover:bg-prism-mid/5 transition-all">
                                  <ImageIcon size={20} className="text-white/40 group-hover:text-prism-mid transition-colors" />
                                  <p className="text-[10px] font-bold uppercase tracking-widest">Upload Effect Layer</p>
                                </div>
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden" 
                                  onChange={(e) => handleImageUpload(e, 'spectrumImage')} 
                                />
                              </label>
                              
                              <div className="flex gap-4 items-start">
                                <input 
                                  value={editForm.spectrumImage || ''} 
                                  onChange={e => setEditForm({...editForm, spectrumImage: e.target.value})}
                                  className="flex-1 bg-white/5 border border-white/10 p-3 rounded-xl text-[10px] font-mono"
                                  placeholder="Or paste effect URL"
                                />
                              </div>
                            </div>
                            {editForm.spectrumImage && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 relative w-24 h-24 group"
                              >
                                <img src={editForm.spectrumImage} className="w-full h-full object-cover rounded-xl border border-white/10 shadow-xl" referrerPolicy="no-referrer" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                                  <button 
                                    onClick={() => setEditForm({...editForm, spectrumImage: ''})}
                                    className="bg-red-500 text-white p-1.5 rounded-full hover:scale-110 transition-transform"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-end mb-2">
                            <label className="text-[10px] font-bold uppercase text-white/40 block">Product Images</label>
                            <span className="text-[10px] text-white/20 uppercase tracking-widest">{editForm.images.length} Images</span>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-4">
                            <label className={`group cursor-pointer relative ${isProcessing || editForm.images.length >= 6 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                              <div className="w-full py-8 glass border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 group-hover:border-prism-mid/50 group-hover:bg-prism-mid/5 transition-all">
                                <div className="p-3 rounded-full bg-white/5 group-hover:bg-prism-mid/20 transition-colors">
                                  <ImageIcon size={24} className="text-white/40 group-hover:text-prism-mid transition-colors" />
                                </div>
                                <div className="text-center">
                                  <p className="text-xs font-bold uppercase tracking-widest mb-1">
                                    {isProcessing ? 'Compressing...' : editForm.images.length >= 6 ? 'Limit Reached (6)' : 'Upload from Gallery'}
                                  </p>
                                  <p className="text-[10px] text-white/20 uppercase tracking-widest">Max 6 photos per product</p>
                                </div>
                              </div>
                              <input 
                                type="file" 
                                multiple 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => handleImageUpload(e, 'images')} 
                                disabled={isProcessing || editForm.images.length >= 6}
                              />
                            </label>
    
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold uppercase text-white/40 block">Manual URLs</label>
                              <textarea 
                                value={editForm.images.join('\n')} 
                                onChange={e => setEditForm({...editForm, images: e.target.value.split('\n').filter(url => url.trim() !== '')})}
                                className="w-full bg-white/5 border border-white/10 p-3 rounded-xl h-20 resize-none font-mono text-[10px] leading-relaxed"
                                placeholder="https://image1.jpg&#10;https://image2.jpg"
                              />
                            </div>
    
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <label className="text-[10px] font-bold uppercase text-white/40 block">Reorder Images (Drag to Sort)</label>
                                <span className="text-[10px] text-white/20 uppercase tracking-widest">First image is Main</span>
                              </div>
                              
                              <Reorder.Group 
                                axis="x" 
                                values={editForm.images} 
                                onReorder={(newImages) => setEditForm({ ...editForm, images: newImages })}
                                className="grid grid-cols-4 gap-3"
                              >
                                {editForm.images.map((img: string, idx: number) => (
                                  <Reorder.Item 
                                    key={img} 
                                    value={img}
                                    className="relative aspect-[3/4] group cursor-grab active:cursor-grabbing"
                                  >
                                    <img src={img} className="w-full h-full object-cover rounded-xl border border-white/10 shadow-lg" referrerPolicy="no-referrer" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                                      <div className="flex flex-col gap-2 items-center">
                                        <GripVertical className="text-white/40 mb-2" size={20} />
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setImageToDelete({ idx });
                                          }}
                                          className="bg-red-500 text-white p-2 rounded-full hover:scale-110 transition-transform"
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      </div>
                                    </div>
                                    {idx === 0 && (
                                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-prism-mid text-[8px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                                        Main
                                      </div>
                                    )}
                                  </Reorder.Item>
                                ))}
                              </Reorder.Group>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-4 pt-4">
                          <button onClick={handleSave} className="flex-1 py-4 bg-white text-black rounded-xl font-bold uppercase flex items-center justify-center gap-2">
                            <Save size={18} /> Save
                          </button>
                          <button onClick={() => setEditingId(null)} className="px-6 py-4 glass rounded-xl font-bold uppercase">
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-6">
                      <img src={product.images[0]} className="w-16 h-20 rounded-xl object-cover" referrerPolicy="no-referrer" />
                      <div className="flex-1">
                        <h3 className="font-display font-bold text-xl flex items-center gap-3">
                          {product.title}
                          {product.isOutOfStock && (
                            <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">Stock Out</span>
                          )}
                        </h3>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-white/40 text-xs font-mono">{formatPrice(product.price)} {product.offer ? `(-${product.offer}%)` : ''}</p>
                          <p className={`text-[10px] font-bold uppercase tracking-widest ${product.stockCount && product.stockCount < 5 ? 'text-orange-400' : 'text-white/20'}`}>
                            Stock: {product.stockCount || 0}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(product)} className="p-3 glass rounded-xl text-white/50 hover:text-white"><Edit size={18} /></button>
                        <button onClick={() => deleteProduct(product.id)} className="p-3 glass rounded-xl text-white/50 hover:text-red-500"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {products.length === 0 && <p className="text-white/30 text-center py-12">No products in inventory.</p>}
            </motion.div>
          ) : (
            <motion.div 
              key="orders"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {orders.map(order => (
                <div key={order.id} className="glass p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-prism-mid/5 blur-[80px] -mr-32 -mt-32 group-hover:bg-prism-mid/10 transition-colors" />
                  
                  <div className="relative flex flex-col lg:flex-row gap-12">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-6">
                        <span className="px-4 py-1.5 glass border-prism-mid/30 text-prism-mid font-mono text-xs font-bold rounded-full">{order.id}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">{new Date(order.date).toLocaleString()}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Customer Information</h4>
                          <p className="font-display font-bold text-xl mb-1">{order.customer.name}</p>
                          <p className="text-sm text-prism-start font-bold mb-2">{order.customer.phone}</p>
                          <p className="text-xs text-white/50 leading-relaxed">{order.customer.address}</p>
                        </div>
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Shipping Details</h4>
                          <p className="text-sm font-bold uppercase tracking-widest mb-1">{order.deliveryArea}</p>
                          <p className="text-xs text-white/40">Fee: {formatPrice(order.deliveryFee)}</p>
                          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 glass border-white/10 rounded-lg">
                            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                              order.status === 'delivered' ? 'bg-green-500' : 
                              order.status === 'refunded' ? 'bg-red-500' :
                              order.status === 'shipped' ? 'bg-blue-500' : 
                              order.status === 'processing' ? 'bg-orange-500' : 'bg-prism-mid'
                            }`} />
                            <span className="text-[9px] font-bold uppercase tracking-widest">{order.status}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30">Order Items</h4>
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-4 p-3 glass border-white/5 rounded-2xl">
                            <img src={item.images[0]} className="w-12 h-12 rounded-lg object-cover" />
                            <div className="flex-1">
                              <p className="text-xs font-bold uppercase">{item.title}</p>
                              <p className="text-[10px] text-white/40 uppercase tracking-widest">Size: {item.selectedSize} × {item.quantity}</p>
                            </div>
                            <span className="text-xs font-mono font-bold">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="lg:w-64 flex flex-col justify-between items-end gap-8">
                      <div className="text-right">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">Total Amount</h4>
                        <p className="text-4xl font-display font-black prism-text">{formatPrice(order.total)}</p>
                      </div>
                      
                      <div className="w-full space-y-4">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 block text-right">Update Status</label>
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest outline-none focus:border-prism-mid transition-colors appearance-none text-center"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {orders.length === 0 && <p className="text-white/30 text-center py-12">No orders yet.</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confirmation Modal */}
      {imageToDelete !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-sm w-full glass p-8 rounded-3xl text-center border border-white/10"
          >
            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-display font-bold mb-2 uppercase">Delete Image?</h3>
            <p className="text-white/40 text-sm mb-8">This action cannot be undone. Are you sure you want to remove this image from the product?</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setImageToDelete(null)}
                className="flex-1 py-3 glass rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  const newImages = [...editForm.images];
                  newImages.splice(imageToDelete.idx, 1);
                  setEditForm({...editForm, images: newImages});
                  setImageToDelete(null);
                }}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
