import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { motion } from 'motion/react';
import { Plus, Edit, Trash2, Save, X, Image as ImageIcon, Tag, DollarSign } from 'lucide-react';
import { formatPrice } from '../lib/utils';

export default function Admin() {
  const { products, addProduct, updateProduct, deleteProduct, orders } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'prism2025') setIsAuthenticated(true);
    else alert('Incorrect password');
  };

  const startEdit = (product: any) => {
    setEditingId(product.id);
    setEditForm({ ...product });
  };

  const handleSave = () => {
    updateProduct(editForm);
    setEditingId(null);
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
      isSpectrum: false,
      spectrumImage: '',
      stockCount: 10,
      isOutOfStock: false,
    };
    addProduct(newProd);
    startEdit(newProd);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'images' | 'spectrumImage') => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (field === 'images') {
          setEditForm((prev: any) => ({
            ...prev,
            images: [...prev.images, base64String]
          }));
        } else {
          setEditForm((prev: any) => ({
            ...prev,
            spectrumImage: base64String
          }));
        }
      };
      reader.readAsDataURL(file);
    });
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
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-prism-mid"
            />
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
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-5xl font-display font-black uppercase">Admin Panel</h1>
            <p className="text-white/40 font-mono text-sm tracking-widest mt-2">Manage your spectrum</p>
          </div>
          <button onClick={handleAdd} className="flex items-center gap-2 px-6 py-3 bg-prism-mid text-white rounded-xl font-bold uppercase tracking-widest hover:bg-prism-start transition-all">
            <Plus size={20} /> Add Piece
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
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
                        <label className="group cursor-pointer relative">
                          <div className="w-full py-8 glass border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 group-hover:border-prism-mid/50 group-hover:bg-prism-mid/5 transition-all">
                            <div className="p-3 rounded-full bg-white/5 group-hover:bg-prism-mid/20 transition-colors">
                              <ImageIcon size={24} className="text-white/40 group-hover:text-prism-mid transition-colors" />
                            </div>
                            <div className="text-center">
                              <p className="text-xs font-bold uppercase tracking-widest mb-1">Upload from Gallery</p>
                              <p className="text-[10px] text-white/20 uppercase tracking-widest">Supports multiple photos & files</p>
                            </div>
                          </div>
                          <input 
                            type="file" 
                            multiple 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handleImageUpload(e, 'images')} 
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

                        <div className="grid grid-cols-4 gap-3">
                          {editForm.images.map((img: string, idx: number) => (
                            <motion.div 
                              key={idx} 
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="relative aspect-[3/4] group"
                            >
                              <img src={img} className="w-full h-full object-cover rounded-xl border border-white/10 shadow-lg" referrerPolicy="no-referrer" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                                <button 
                                  onClick={() => {
                                    const newImages = [...editForm.images];
                                    newImages.splice(idx, 1);
                                    setEditForm({...editForm, images: newImages});
                                  }}
                                  className="bg-red-500 text-white p-2 rounded-full hover:scale-110 transition-transform"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                              {idx === 0 && (
                                <div className="absolute top-2 left-2 px-2 py-0.5 bg-prism-mid text-[8px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                                  Main
                                </div>
                              )}
                            </motion.div>
                          ))}
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
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-display font-black mb-8 uppercase">Recent Orders</h2>
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="glass p-6 rounded-3xl flex justify-between items-center">
                <div>
                  <p className="font-mono font-bold text-prism-mid">{order.id}</p>
                  <p className="text-sm font-bold">{order.customer.name}</p>
                  <p className="text-xs text-white/40">{order.customer.address}</p>
                  <p className="text-[10px] text-prism-start font-bold uppercase tracking-widest mt-1">{order.deliveryArea} (+{formatPrice(order.deliveryFee)})</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-xl">{formatPrice(order.total)}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">{new Date(order.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {orders.length === 0 && <p className="text-white/30 text-center py-12">No orders yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
