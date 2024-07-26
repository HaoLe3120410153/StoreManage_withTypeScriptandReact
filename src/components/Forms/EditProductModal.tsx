import React, { useState, useEffect, ChangeEvent } from 'react';
import { database } from '../../firebaseConfig';
import { ref as dbRef, update } from 'firebase/database';
import { Modal, Button, Form } from 'react-bootstrap';
import './EditProductModal.css'

interface Product {
  id: string;
  pro_name: string;
  pro_price_in: string;
  pro_price_out: string;
  pro_quantity: string;
  pro_company: string;
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  category: string;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ isOpen, onClose, product, category }) => {
  const [proName, setProName] = useState<string>('');
  const [proPriceIn, setProPriceIn] = useState<string>('');
  const [proPriceOut, setProPriceOut] = useState<string>('');
  const [proQuantity, setProQuantity] = useState<string>('');
  const [proCompany, setProCompany] = useState<string>('');

  useEffect(() => {
    if (product) {
      setProName(product.pro_name || '');
      setProPriceIn(product.pro_price_in || '');
      setProPriceOut(product.pro_price_out || '');
      setProQuantity(product.pro_quantity || '');
      setProCompany(product.pro_company || '');
    }
  }, [product]);

  const handleSave = () => {
    if (!product) return;

    const updatedProduct = {
      pro_name: proName,
      pro_price_in: proPriceIn,
      pro_price_out: proPriceOut,
      pro_quantity: proQuantity,
      pro_company: proCompany,
    };

    const productRef = dbRef(database, `products/${category}/${product.id}`);
    update(productRef, updatedProduct)
      .then(() => {
        onClose();
      })
      .catch((error) => {
        console.error('Error updating product:', error);
      });
  };

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header>
        <Modal.Title>Sửa Sản Phẩm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className='formEdit'>
          <Form.Group controlId="proName">
            <Form.Label>Tên Sản Phẩm</Form.Label>
            <Form.Control
              type="text"
              value={proName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setProName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="proPriceIn">
            <Form.Label>Giá Nhập</Form.Label>
            <Form.Control
              type="number"
              value={proPriceIn}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setProPriceIn(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="proPriceOut">
            <Form.Label>Giá Bán</Form.Label>
            <Form.Control
              type="number"
              value={proPriceOut}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setProPriceOut(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="proQuantity">
            <Form.Label>Số Lượng</Form.Label>
            <Form.Control
              type="number"
              value={proQuantity}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setProQuantity(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="proCompany">
            <Form.Label>Công Ty</Form.Label>
            <Form.Control
              type="text"
              value={proCompany}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setProCompany(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" className='custom__button' onClick={onClose}>
          Hủy
        </Button>
        <Button variant="primary" className='custom__button' onClick={handleSave}>
          Lưu
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProductModal;
