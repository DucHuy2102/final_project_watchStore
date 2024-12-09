import { Tooltip } from 'antd';
import { Modal, Button } from 'flowbite-react';
import { useMemo } from 'react';
import { HiX, HiFilter } from 'react-icons/hi';

export default function FilterModal({ show, onClose, selectedFilters, onRemoveFilter, options, onSelect, onSubmit }) {
    const header = useMemo(
        () => (
            <div className='flex items-center justify-between border-b border-gray-200 pb-4'>
                <div className='flex items-center space-x-3'>
                    <div className='p-1.5 bg-blue-50 rounded-lg'>
                        <HiFilter className='w-5 h-5 text-blue-600' />
                    </div>
                    <h3 className='text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent'>
                        Bộ Lọc Nâng Cao
                        {selectedFilters.length != 0 && ` (${selectedFilters.length})`}
                    </h3>
                </div>
                <button onClick={onClose} className='p-1.5 hover:bg-gray-100 rounded-full transition-all duration-200'>
                    <HiX className='w-4 h-4 text-gray-500' />
                </button>
            </div>
        ),
        [onClose],
    );

    const body = useMemo(() => {
        return options.map((option, index) => (
            <div key={index} className='bg-white rounded-lg p-3'>
                <h4 className='font-medium text-gray-800 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2'>
                    {option.title}
                    <span className='text-xs text-gray-400'>({option.choices.length})</span>
                </h4>
                <div className='grid grid-cols-3 gap-2'>
                    {option.choices.map((choice, i) => (
                        <Tooltip title={choice.label} key={`${choice.key}-${choice.value}`}>
                            <button
                                key={i}
                                onClick={() => onSelect(choice)}
                                className={`
                                            px-3 py-2 text-sm rounded-md transition-all duration-200
                                            hover:shadow-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis
                                            ${
                                                selectedFilters.some(
                                                    (f) => f.key === choice.key && f.value === choice.value,
                                                )
                                                    ? 'bg-blue-100 text-blue-700 border-blue-200'
                                                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                                            }
                                            border
                                        `}
                            >
                                {choice.label}
                            </button>
                        </Tooltip>
                    ))}
                </div>
            </div>
        ));
    }, [options, onSelect, selectedFilters]);

    const footer = useMemo(
        () => (
            <div className='flex justify-between items-center gap-2 px-6 py-3 bg-gray-50 rounded-b-lg border-t border-gray-100'>
                <Button
                    color='gray'
                    onClick={onClose}
                    className='px-4 !ring-0 text-sm hover:bg-gray-100 transition-colors'
                >
                    Đóng
                </Button>
                <div className='flex items-center justify-center gap-2'>
                    <Button
                        color='failure'
                        onClick={() => onRemoveFilter([])}
                        className='px-4 !ring-0 text-sm border-none shadow-sm 
                    hover:shadow-md transition-all duration-300'
                    >
                        Xóa tất cả
                    </Button>
                    <Button
                        color='blue'
                        onClick={onSubmit}
                        className='px-4 !ring-0 text-sm border-none shadow-sm 
                    hover:shadow-md transition-all duration-300'
                    >
                        Áp dụng {selectedFilters.length} bộ lọc
                    </Button>
                </div>
            </div>
        ),
        [onClose, onRemoveFilter, onSubmit, selectedFilters.length],
    );

    return (
        <Modal show={show} onClose={onClose} size='6xl' popup>
            <div className='px-6 py-5 space-y-1'>
                {header}

                {/* body */}
                <div className='grid grid-cols-2 gap-4'>{body}</div>
            </div>

            {/* footer */}
            {footer}
        </Modal>
    );
}
