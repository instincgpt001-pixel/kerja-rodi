import { useState, useEffect } from 'react';

const ProductImage = ({ product, className }) => {
    const [imageSrc, setImageSrc] = useState('');
    const [showPlaceholder, setShowPlaceholder] = useState(false);

    useEffect(() => {
        if (product?.image) {
            setImageSrc(`http://localhost:8000/images/products/${product.image}`);
            setShowPlaceholder(false); 
        } else {
            setShowPlaceholder(true);
        }
    }, [product]);

    const handleError = () => {
        setShowPlaceholder(true);
    };

    if (showPlaceholder || !product) {
        return (
            <div className={`bg-gray-800 flex items-center justify-center text-center ${className}`}>
                <span className="text-sm font-bold text-white p-2">
                    {product?.name || "Produk"}
                </span>
            </div>
        );
    }

    return (
        <img
            src={imageSrc}
            alt={product.name}
            onError={handleError}
            className={`object-cover ${className}`}
        />
    );
};

export default ProductImage;