import { useSelector } from 'react-redux';

export default function ThemeProvider({ children }) {
    const theme = useSelector((state) => state.theme.theme);

    return (
        <div className={theme}>
            <div
                className='min-h-screen bg-white text-gray-900 
            dark:bg-gray-900 dark:text-gray-200'
            >
                {children}
            </div>
        </div>
    );
}
