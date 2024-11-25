import { Carousel_Component } from '../../components/exportComponent';
import { ShopNow, Policy, SayThanks, Review_Component } from './components/exportCom_DefaultPage';

export default function Home() {
    return (
        <div className='min-h-screene p-5'>
            <Carousel_Component />
            <ShopNow />
            <Policy />
            <Review_Component />
            <SayThanks />
        </div>
    );
}
