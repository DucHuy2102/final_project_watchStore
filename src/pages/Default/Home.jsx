import {
    Carousel_Component,
    Policy_Component,
    Review_Component,
    SayThanks_Component,
    ShopNow_Component,
} from '../../components/exportComponent';

export default function Home() {
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
