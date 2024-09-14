import { useEffect } from 'react';
import {
    Carousel_Component,
    Policy_Component,
    Review_Component,
    SayThanks_Component,
    ShopNow_Component,
} from '../../components/exportComponent';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { get_All_Product } from '../../redux/slices/productSlice';

export default function Home() {
    // state
    const dispatch = useDispatch();

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

        getAllProduct();
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
