import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import './ProductSlider.css';
import { images } from '../../constants';

const ProductSlider: React.FC = () => {
    return (
        <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            onSwiper={(swiper) => console.log(swiper)}
            onSlideChange={() => console.log('slide change')}
        >
            <SwiperSlide>
                <img src={images.swiper1} alt="Slide 1" style={{ width: "100%" }} />
            </SwiperSlide>
            <SwiperSlide>
                <img src={images.swiper2} alt="Slide 2" style={{ width: "100%" }} />
            </SwiperSlide>
            <SwiperSlide>
                <img src={images.swiper3} alt="Slide 3" style={{ width: "100%" }} />
            </SwiperSlide>
            <SwiperSlide>
                <img src={images.swiper4} alt="Slide 4" style={{ width: "100%" }} />
            </SwiperSlide>
        </Swiper>
    );
};

export default ProductSlider;
