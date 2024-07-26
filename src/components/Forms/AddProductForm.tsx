import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { database, storage } from '../../firebaseConfig';
import { ref as dbRef, onValue, push, update } from 'firebase/database';
import { ref as strRef, uploadBytes, getDownloadURL } from 'firebase/storage';

import './AddProductForm.css';

const AddProductForm: React.FC = () => {
  const [categories, setCategories] = useState<{ [key: string]: { image: string } }>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('');
  const [proName, setProName] = useState<string>('');
  const [proPriceIn, setProPriceIn] = useState<string>('');
  const [proPriceOut, setProPriceOut] = useState<string>('');
  const [proQuantity, setProQuantity] = useState<string>('');
  const [proCompany, setProCompany] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    // Fetch categories
    const categoriesRef = dbRef(database, 'categories');
    onValue(categoriesRef, (snapshot) => {
      if (snapshot.exists()) {
        setCategories(snapshot.val() as { [key: string]: { image: string } });
      } else {
        setCategories({});
      }
    });
  }, []);

  const handleAddProduct = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const category = selectedCategory || newCategory.trim();
    if (!category || !proName || !proPriceIn || !proPriceOut || !proQuantity || !proCompany || !file) {
      alert('Vui lòng điền tất cả các trường và chọn tệp ảnh.');
      return;
    }

    const storageRef = strRef(storage, `images/${file.name}`);
    uploadBytes(storageRef, file)
      .then((snapshot) => getDownloadURL(snapshot.ref))
      .then((downloadURL) => {
        const productRef = dbRef(database, `products/${category}`);
        const newProduct = {
          pro_category: category,
          pro_name: proName,
          pro_price_in: proPriceIn,
          pro_price_out: proPriceOut,
          pro_quantity: proQuantity,
          pro_company: proCompany,
          imageUrl: downloadURL,
        };


        push(productRef, newProduct);

        // If adding a new category, update the categories database
        if (!selectedCategory) {
          const categoriesRef = dbRef(database, `categories/${newCategory}`);
          const categoryUpdate = {
            images: downloadURL, // You can set a default image or handle image updates separately
          };
          update(categoriesRef, categoryUpdate);
        }

        clearForm();
      })
      .catch((error) => {
        console.error('Error uploading image:', error);
      });
  };

  const clearForm = () => {
    setSelectedCategory('');
    setNewCategory('');
    setProName('');
    setProPriceIn('');
    setProPriceOut('');
    setProQuantity('');
    setProCompany('');
    setFile(null);
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleNewCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewCategory(e.target.value);
  };

  const handleProNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProName(e.target.value);
  };

  const handleProPriceInChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProPriceIn(e.target.value);
  };

  const handleProPriceOutChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProPriceOut(e.target.value);
  };

  const handleProQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProQuantity(e.target.value);
  };

  const handleProCompanyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProCompany(e.target.value);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleAddProduct} className="app__add-product__form">
      <h2>Thêm Sản Phẩm</h2>
      <div className="app__form_add">
        <label>Chọn Danh Mục:</label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          disabled={!!newCategory}
        >
          <option value="">Chọn danh mục</option>
          {Object.keys(categories).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="app__form_add">
        <label>Hoặc Thêm Danh Mục Mới:</label>
        <input
          type="text"
          value={newCategory}
          onChange={handleNewCategoryChange}
          disabled={!!selectedCategory}
        />
      </div>
      <div className="app__form_add">
        <label>Tên Sản Phẩm:</label>
        <input
          type="text"
          value={proName}
          onChange={handleProNameChange}
        />
      </div>
      <div className="app__form_add">
        <label>Giá Nhập:</label>
        <input
          type="number"
          value={proPriceIn}
          onChange={handleProPriceInChange}
        />
      </div>
      <div className="app__form_add">
        <label>Giá Bán:</label>
        <input
          type="number"
          value={proPriceOut}
          onChange={handleProPriceOutChange}
        />
      </div>
      <div className="app__form_add">
        <label>Số Lượng:</label>
        <input
          type="number"
          value={proQuantity}
          onChange={handleProQuantityChange}
        />
      </div>
      <div className="app__form_add">
        <label>Công Ty:</label>
        <input
          type="text"
          value={proCompany}
          onChange={handleProCompanyChange}
        />
      </div>
      <div className="app__form_add">
        <label>Ảnh Sản Phẩm:</label>
        <input
          type="file"
          onChange={handleFileChange}
        />
      </div>
      <div className="div__button">
        <button type="submit" className="custom__button">
          Thêm Sản Phẩm
        </button>
      </div>
    </form>
  );
};

export default AddProductForm;
