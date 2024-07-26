import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, get, onValue } from 'firebase/database';
import { database } from '../../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import ProductSlider from '../../SwiperSlide/ProductSlider';
import './ProductCategory.css';

interface Product {
    pro_name: string;
    pro_price_in: string;
    pro_price_out: string;
    pro_quantity: string;
    pro_company: string;
    imageUrl: string;
    category: string;
    productId: string;
}

interface Category {
    images: string;
}

const ProductCategory: React.FC = () => {
    const { category } = useParams<{ category: string }>();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [categories, setCategories] = useState<{ [key: string]: Category }>({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            if (!category) return;

            const categoryRef = ref(database, `products/${category}`);
            const categorySnapshot = await get(categoryRef);

            if (categorySnapshot.exists()) {
                const productsData = categorySnapshot.val();
                const productsList: Product[] = Object.keys(productsData).map(productId => ({
                    ...productsData[productId],
                    productId,
                    category
                }));
                setProducts(productsList);
            }

            setLoading(false);
        };

        fetchProducts();

        const categoriesRef = ref(database, "categories");
        onValue(categoriesRef, (snapshot) => {
            if (snapshot.exists()) {
                setCategories(snapshot.val() as { [key: string]: Category });
            } else {
                setCategories({});
            }
        });
    }, [category]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleCategory = (category: string) => {
        navigate(`/category/${category}`);
    };

    const handleProduct = (category: string, productId: string) => {
        navigate(`/productdetail/${category}/${productId}`);
    };

    return (
        <div className='app__main_home'>
            <div className='app__home-cate'>
                <div className='category_list'>
                    {Object.keys(categories).map((category) => (
                        <div key={category} className='category-list-item' onClick={() => handleCategory(category)}>
                            <p>{category}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className='app__home-page'>
                <ProductSlider />

                <div className="product__category">
                    <div className='category__product__category-name'>
                        <h2>{category}</h2>
                    </div>
                    <div className="category__product__container">
                        {products.map(product => (
                            <div key={product.productId} className="app__product" onClick={() => handleProduct(product.category, product.productId)}>
                                <img src={product.imageUrl} alt={product.pro_name} />
                                <div className='app__product__details'>
                                    <div><h5>{product.pro_name}</h5></div>
                                    <h6>Giá bán: {product.pro_price_out}</h6>
                                    <h6>Số lượng: {product.pro_quantity}</h6>
                                    <h6>Công ty: {product.pro_company}</h6>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCategory;
