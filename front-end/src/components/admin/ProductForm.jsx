import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProductForm = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(productId);

    const [product, setProduct] = useState({
        name: '', price: '', stock: '', category_id: '', is_active: true,
    });
    const [imageFile, setImageFile] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const catRes = await fetch('http://localhost:8000/api/categories/random');
                const catData = await catRes.json();
                setCategories(catData);

                if (isEditing) {
                    const prodRes = await fetch(`http://localhost:8000/api/admin/products`, { credentials: 'include' });
                    const allProducts = await prodRes.json();
                    const currentProduct = allProducts.find(p => p.id === parseInt(productId));
                    if(currentProduct) {
                        currentProduct.is_active = Boolean(currentProduct.is_active);
                        setProduct(currentProduct);
                    }
                }
            } catch (error) {
                toast.error('Gagal memuat data awal.');
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [productId, isEditing]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'category_id' && value === '__CREATE_NEW__') {
            setShowNewCategoryInput(true);
        } else {
            if (name === 'category_id') {
                setShowNewCategoryInput(false);
            }
            setProduct(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        }
    };

    const handleImageChange = (e) => setImageFile(e.target.files[0]);
    
    const handleSaveNewCategory = async () => {
        if (!newCategoryName || newCategoryName.trim() === '') {
            toast.error('Nama kategori tidak boleh kosong.');
            return;
        }
        try {
            const res = await fetch('http://localhost:8000/api/admin/categories', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ name: newCategoryName }),
            });
            const newCategory = await res.json();
            if (!res.ok) throw new Error(newCategory.message || 'Gagal membuat kategori.');

            toast.success(`Kategori "${newCategory.name}" berhasil dibuat!`);
            
            setCategories(prev => [...prev, newCategory]);
            setProduct(prev => ({ ...prev, category_id: newCategory.id })); 
            setNewCategoryName(''); 
            setShowNewCategoryInput(false); 

        } catch (error) {
            toast.error(error.message);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('price', product.price);
        formData.append('stock', product.stock);
        formData.append('category_id', product.category_id);
        formData.append('is_active', product.is_active ? 1 : 0);
        if (imageFile) formData.append('image', imageFile);
        if (isEditing) formData.append('_method', 'POST');

        const url = isEditing
            ? `http://localhost:8000/api/admin/products/${productId}`
            : 'http://localhost:8000/api/admin/products';

        try {
            const res = await fetch(url, { method: 'POST', credentials: 'include', body: formData });
            if (!res.ok) {
                 const errorData = await res.json();
                 throw new Error(errorData.message || 'Gagal menyimpan produk.');
            }
            toast.success(`Produk berhasil ${isEditing ? 'diperbarui' : 'ditambahkan'}!`);
            navigate('/admin/products');
        } catch (error) {
            toast.error(error.message);
        }
    };
    
    if(loading) return <div>Loading form...</div>;

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Produk</label>
                    <input type="text" name="name" value={product.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Harga</label>
                    <input type="number" name="price" value={product.price} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Stok</label>
                    <input type="number" name="stock" value={product.stock} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Kategori</label>
                    <select name="category_id" value={product.category_id} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
                        <option value="">Pilih Kategori</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        <option value="__CREATE_NEW__" className="font-bold text-blue-600">-- Tambah Kategori Baru --</option>
                    </select>
                </div>
                
                {showNewCategoryInput && (
                    <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                        <label className="block text-sm font-medium text-gray-700">Nama Kategori Baru</label>
                        <div className="flex items-center space-x-2 mt-1">
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Contoh: Makanan Ringan"
                                className="block w-full rounded-md border-gray-300 shadow-sm"
                            />
                            <button type="button" onClick={handleSaveNewCategory} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap">
                                Simpan Kategori
                            </button>
                        </div>
                    </div>
                )}
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Gambar Produk</label>
                    <input type="file" name="image" onChange={handleImageChange} className="mt-1 block w-full" />
                </div>
                <div className="flex items-center">
                    <input type="checkbox" name="is_active" checked={product.is_active} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600" />
                    <label className="ml-2 block text-sm text-gray-900">Aktifkan produk</label>
                </div>
                <div className="flex justify-end space-x-4">
                    <button 
                        type="button" 
                        onClick={() => navigate('/admin/products')}
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                        Batal
                    </button>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Simpan
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;