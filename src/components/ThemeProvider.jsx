// import { useSelector } from 'react-redux';

// export default function ThemeProvider({ children }) {
//     const theme = useSelector((state) => state.theme.theme);

//     return (
//         <div className={theme}>
//             <div className='min-h-screen bg-gray-100 text-black dark:text-white dark:bg-black'>
//                 {children}
//             </div>
//         </div>
//     );
// }

// import { useSelector } from 'react-redux';

// export default function ThemeProvider({ children }) {
//     const theme = useSelector((state) => state.theme.theme);

//     return (
//         <div
//             className={`min-h-screen ${
//                 theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'
//             }`}
//         >
//             {children}
//         </div>
//     );
// }

import { useSelector } from 'react-redux';

export default function ThemeProvider({ children }) {
    const theme = useSelector((state) => state.theme.theme);

    return (
        <div className={theme}>
            <div className='min-h-screen bg-white text-gray-800 dark:text-gray-200 dark:bg-[rgb(16,32,42)]'>
                {children}
            </div>
        </div>
    );
}
