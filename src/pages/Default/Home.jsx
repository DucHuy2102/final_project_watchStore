import { useEffect, useState } from 'react';
import {
    Carousel_Component,
    Policy_Component,
    Review_Component,
    SayThanks_Component,
    ShopNow_Component,
} from '../../components/exportComponent';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { get_All_Product } from '../../redux/slices/productSlice';

export default function Home() {
    // state
    const dispatch = useDispatch();
    const tokenUser = useSelector((state) => state.user.access_token);

    // get all product from api
    useEffect(() => {
        const getAllProduct = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/client/get-all-category`
                );
                if (res?.status === 200) {
                    const { data } = res;
                    dispatch(get_All_Product(data));
                }
            } catch (error) {
                console.log('Error when get all product', error);
            }
        };

        const getProductInCart = async () => {
            if (tokenUser) {
                try {
                    const res = await axios.get(
                        `${import.meta.env.VITE_API_URL}/api/cart/get-cart-user`,
                        {
                            headers: {
                                Authorization: `Bearer ${tokenUser}`,
                            },
                        }
                    );
                    if (res?.status === 200) {
                        console.log(res.data);
                        // dispatch(addProductToCart(res.data));
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        };

        getAllProduct();
        getProductInCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='min-h-screen p-5'>
            <Carousel_Component />
            <ShopNow_Component />
            <Policy_Component />
            <Review_Component />
            <SayThanks_Component />
        </div>
    );
}
