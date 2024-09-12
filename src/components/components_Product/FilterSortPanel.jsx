import { Button, Dropdown, Modal, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { FaSortAlphaDown, FaSortAlphaUpAlt } from 'react-icons/fa';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa6';
import { Chip_Filter_Component } from '../exportComponent';

// option values for advanced filter
const options = [
    {
        title: 'Đối tượng',
        choices: [
            { key: 'Nữ', label: 'Đồng hồ nữ' },
            { key: 'Nam', label: 'Đồng hồ nam' },
        ],
    },
    {
        title: 'Chất liệu dây',
        choices: [
            { key: 'Dây Da', label: 'Dây Da' },
            { key: 'Dây Nhựa', label: 'Dây Nhựa' },
            { key: 'Dây Kim Loại', label: 'Dây Kim Loại' },
            { key: 'Dây Thép Không Gỉ Mạ Vàng PVD', label: 'Dây Thép Không Gỉ Mạ Vàng PVD' },
        ],
    },
    {
        title: 'Hình dáng mặt đồng hồ',
        choices: [
            { key: 'Mặt tròn', label: 'Mặt tròn' },
            { key: 'Mặt vuông', label: 'Mặt vuông' },
        ],
    },
    {
        title: 'Kháng nước',
        choices: [
            { key: '3', label: '3atm' },
            { key: '5', label: '5atm' },
            { key: '10', label: '10atm' },
            { key: '20', label: '20atm' },
        ],
    },
];

export default function FilterSortPanel() {
    // state for sort
    const [sort, setSort] = useState(null);

    // state for filter
    const [showModalFilter, setShowModalFilter] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedFilters, setSelectedFilters] = useState([]);

    // ========================================= Sort =========================================
    // handle sort change
    const handleSortChange = (value) => {
        setSort(value);
    };

    // ========================================= Filter =========================================
    // handle select filter
    const handleSelect = (title, choice) => {
        const isChoiceExist = selectedFilters.some(
            (item) => item.title === title && item.choice === choice
        );
        if (!isChoiceExist) {
            setSelectedFilters([...selectedFilters, { title, choice }]);
        }
    };

    // handle remove filter
    const handleRemoveFilter = (filter) => {
        setSelectedFilters(selectedFilters.filter((item) => item !== filter));
    };

    // handle filter options
    const filteredOptions = options.map((option) => ({
        ...option,
        choices: option.choices.filter((choice) =>
            choice.label.toLowerCase().includes(search.toLowerCase())
        ),
    }));

    return (
        <>
            <div className='flex justify-center items-center gap-x-5'>
                <Button outline onClick={() => setShowModalFilter(true)} className=''>
                    Bộ lọc
                </Button>
                <Dropdown outline label='Sắp xếp'>
                    <Dropdown.Item
                        onClick={() => handleSortChange('Giá tăng dần')}
                        icon={FaArrowUp}
                    >
                        Giá tăng dần
                    </Dropdown.Item>
                    <Dropdown.Item
                        onClick={() => handleSortChange('Giá giảm dần')}
                        icon={FaArrowDown}
                    >
                        Giá giảm dần
                    </Dropdown.Item>
                    <Dropdown.Item
                        onClick={() => handleSortChange('Từ A - Z')}
                        icon={FaSortAlphaDown}
                    >
                        Từ A - Z
                    </Dropdown.Item>
                    <Dropdown.Item
                        onClick={() => handleSortChange('Giá Z - A')}
                        icon={FaSortAlphaUpAlt}
                    >
                        Từ Z - A
                    </Dropdown.Item>
                </Dropdown>
            </div>

            <Modal show={showModalFilter} onClose={() => setShowModalFilter(false)} size='md' popup>
                <Modal.Header className='pl-6'>Bộ Lọc Nâng Cao</Modal.Header>
                <Modal.Body>
                    <div className='mb-4'>
                        <TextInput
                            placeholder='Tìm kiếm lựa chọn...'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className='mb-4'>
                        {selectedFilters.length > 0 && (
                            <div className='mb-4'>
                                {selectedFilters.map((filter, index) => (
                                    <Chip_Filter_Component
                                        key={index}
                                        label={`${filter.choice}`}
                                        onRemove={() => handleRemoveFilter(filter)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {filteredOptions.map((option, index) => (
                        <div key={index} className='mb-4'>
                            <div className='font-semibold mb-2 border-b border-gray-300'>
                                {option.title}
                            </div>
                            <div className='flex flex-wrap gap-x-2 gap-y-3'>
                                {option.choices.map((choice, i) => (
                                    <div
                                        key={i}
                                        className='cursor-pointer px-5 py-2 border border-gray-200 rounded-lg
                                        hover:bg-gray-200'
                                        onClick={() => handleSelect(option.title, choice.label)}
                                    >
                                        {choice.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </Modal.Body>
                <Modal.Footer className='flex justify-between items-center'>
                    <Button color='gray' onClick={() => setShowModalFilter(false)}>
                        Đóng
                    </Button>
                    <Button color='blue' onClick={() => setShowModalFilter(false)}>
                        Lọc
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
