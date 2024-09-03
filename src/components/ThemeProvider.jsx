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
