import React, { useState, useEffect, useRef } from 'react';
import { database } from '../../firebaseConfig';
import { ref as dbRef, onValue } from 'firebase/database';
import ProductSlider from '../SwiperSlide/ProductSlider';
import { useNavigate } from 'react-router-dom';
import { MdArrowLeft, MdArrowRight } from 'react-icons/md';
import './Home.css';

interface Product {
    imageUrl: string;
    pro_name: string;
    pro_price_in: number;
    pro_price_out: number;
    pro_quantity: number;
    pro_company: string;
}

interface Products {
    [category: string]: {
        [productId: string]: Product;
    };
}

interface Category {
    images: string;
}

const Home: React.FC = () => {
    const [products, setProducts] = useState<Products>({});
    const [categories, setCategories] = useState<{ [key: string]: Category }>({});
    const navigate = useNavigate();
    const categoryGridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const productsRef = dbRef(database, "products");
        onValue(productsRef, (snapshot) => {
            if (snapshot.exists()) {
                setProducts(snapshot.val() as Products);
            } else {
                setProducts({});
            }
        });

        const categoriesRef = dbRef(database, "categories");
        onValue(categoriesRef, (snapshot) => {
            if (snapshot.exists()) {
                setCategories(snapshot.val() as { [key: string]: Category });
            } else {
                setCategories({});
            }
        });
    }, []);

    const handleProduct = (category: string, productId: string) => {
        navigate(`/productdetail/${category}/${productId}`);
    };

    const handleCategory = (category: string) => {
        navigate(`/category/${category}`)
    }

    const scrollLeft = () => {
        if (categoryGridRef.current) {
            categoryGridRef.current.scrollBy({ left: -240, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (categoryGridRef.current) {
            categoryGridRef.current.scrollBy({ left: 240, behavior: 'smooth' });
        }
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
                 <div className='category_list_grid'>
                    <button className='navigation-button left' onClick={scrollLeft}><MdArrowLeft/></button>
                    <div className='category-grid'ref={categoryGridRef}>
                        {Object.keys(categories).map((category) => (
                            <div key={category} className='category-item' onClick={() => handleCategory(category)}>
                                <img src={categories[category].images} alt={category} className='category-image' />
                                <p>{category}</p>
                            </div>
                        ))}
                    </div>
                    <button className='navigation-button right' onClick={scrollRight}><MdArrowRight/></button>
                </div>

                <ProductSlider />

                <div className='app__product__list'>
                    {Object.keys(products).map((category) => (
                        <div key={category} className='app__product__category'>
                            <div className='app__product__category-name'>
                                <h2>{category}</h2>
                            </div>
                            <div className='app__product__container'>
                                {Object.keys(products[category]).slice(0, 8).map((productId) => {
                                    const product = products[category][productId];
                                    return (
                                        <div key={productId} className='app__product' onClick={() => handleProduct(category, productId)}>
                                            <img src={product.imageUrl} alt={product.pro_name} />
                                            <div className='app__product__details'>
                                                <div><h5>{product.pro_name}</h5></div>
                                                <h6>Giá bán: {product.pro_price_out}</h6>
                                                <h6>Số lượng: {product.pro_quantity}</h6>
                                                <h6>Công ty: {product.pro_company}</h6>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;