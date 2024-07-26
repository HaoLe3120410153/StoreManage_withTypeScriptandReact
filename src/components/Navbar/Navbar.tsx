import React, { useState, useMemo, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { MdPerson, MdSearch, MdLogout, MdMenu } from 'react-icons/md';
import { ref, get } from 'firebase/database';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { database } from '../../firebaseConfig';
import { images } from '../../constants';
import './Navbar.css';

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

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [results, setResults] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showCategoryList, setShowCategoryList] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const productsRef = ref(database, 'products');
      const categoriesSnapshot = await get(productsRef);

      if (categoriesSnapshot.exists()) {
        const categoriesData = categoriesSnapshot.val();
        setCategories(Object.keys(categoriesData));
      } else {
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = useMemo(() => async () => {
    const productsRef = ref(database, 'products');
    const categoriesSnapshot = await get(productsRef);

    if (categoriesSnapshot.exists()) {
      const categories = categoriesSnapshot.val();
      const searchResults: Product[] = [];

      for (const category in categories) {
        const products = categories[category];
        for (const productId in products) {
          const product = products[productId];
          searchResults.push({
            ...product,
            category: category,
            productId: productId
          });
        }
      }

      setResults(searchResults.filter(product =>
        product.pro_name.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else {
      setResults([]);
    }
  }, [searchTerm]);

  const debounceSearch = useMemo(() => debounce(handleSearch, 300), [handleSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debounceSearch();
  };

  const handleProductClick = (category: string, productId: string) => {
    navigate(`/productdetail/${category}/${productId}`);
    setResults([]);
  };

  const handleClickOutside = useMemo(() => (event: MouseEvent) => {
    if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
      setResults([]);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLogin(true);
        const userRef = ref(database, `users/${user.uid}`);
        const userSnapshot = await get(userRef);
        if (userSnapshot.exists() && userSnapshot.val().admin === true) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsLogin(false);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      setIsLogin(false);
      setIsAdmin(false);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogo = () => {
    navigate(`/`)
  }

  useEffect(() => {
    setShowDropdown(false);
  }, [location]);

  return (
    <div className='app__navbar'>
      <div className='app_logo' onClick={() => handleLogo()}>
        <img src={images.logo} alt='Logo' />
      </div>
      <div className="search-container" ref={searchContainerRef}>
        <input
          type="text"
          className="inputField"
          placeholder="Nhập để tìm kiếm..."
          value={searchTerm}
          onChange={handleInputChange}
        />
        {searchTerm && (
          <div className="results-container">
            {results.length > 0 ? (
              <ul className="results-list">
                {results.map((result, index) => (
                  <li
                    key={index}
                    className="result-item"
                    onClick={() => handleProductClick(result.category, result.productId)}
                  >
                    <img src={result.imageUrl} alt={result.pro_name} className="result-image" />
                    <h3>{result.pro_name}</h3>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-results">Không tìm thấy kết quả</p>
            )}
          </div>
        )}
      </div>
      <div className="app__navbar_links desktop">
        <ul className="app__navbar_link">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          {isAdmin && (
            <li
              onMouseEnter={() => setShowCategoryList(true)}
              onMouseLeave={() => setShowCategoryList(false)}
              className="dropdown"
            >
              <NavLink to="/product-management">Products</NavLink>
              {/* {showCategoryList && (
                <ul className="dropdown-menu">
                  {categories.map((category) => (
                    <li key={category} className='category'>
                      <NavLink to={`/category/${category}`}>{category.replace(/-/g, ' ')}</NavLink>
                    </li>
                  ))}
                </ul>
              )} */}
            </li>
          )}
          {isAdmin && (
            <li>
              <NavLink to="/users">Users</NavLink>
            </li>
          )}
          {isLogin ? (
            <li onClick={handleLogout}>
              <MdLogout />
            </li>
          ) : (
            <li>
              <NavLink to="/login">
                <MdPerson />
              </NavLink>
            </li>
          )}
        </ul>
      </div>
      <div className="app__navbar_links mobile">
        <button className="app__navbar_dropdown-button" onClick={handleToggleDropdown}>
          <MdMenu />
        </button>
        {showDropdown && (
          <ul className="app__navbar_dropdown-menu">
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            {isAdmin && (
              <>
                <li className="dropdown">
                  <NavLink to="/product-management">Products</NavLink>
                </li>
                <li>
                  <NavLink to="/users">Users</NavLink>
                </li>
              </>
            )}
            {isLogin ? (
              <li onClick={handleLogout}>
                <MdLogout />
              </li>
            ) : (
              <li>
                <NavLink to="/login">
                  <MdPerson />
                </NavLink>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export default Navbar;
