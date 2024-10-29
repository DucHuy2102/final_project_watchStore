import React from 'react';
import { HiX } from 'react-icons/hi';

export default function Chip({ label, onRemove }) {
    return (
        <div
            className='inline-flex items-center px-3 py-1.5 text-sm 
        font-medium text-white bg-blue-500 rounded-full mr-2 mb-2'
        >
            {label}
            <button
                type='button'
                className='ml-2 text-white hover:bg-blue-600 focus:outline-none rounded-full'
                onClick={onRemove}
            >
                <HiX className='w-4 h-4' />
            </button>
        </div>
    );
}
