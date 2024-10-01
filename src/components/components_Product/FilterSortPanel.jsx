import { Button, Dropdown, Modal, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { FaSortAlphaDown, FaSortAlphaUpAlt, FaTimes } from 'react-icons/fa';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa6';
import { Chip_Filter_Component } from '../exportComponent';
import { Badge } from 'antd';
import { useSearchParams } from 'react-router-dom';

// option values for advanced filter
const options = [
    {
        title: 'Đối tượng',
        choices: [
            { key: 'gender', value: 'Nữ', label: 'Đồng hồ nữ' },
            { key: 'gender', value: 'Nam', label: 'Đồng hồ nam' },
        ],
    },
    {
        title: 'Chất liệu dây',
        choices: [
            { key: 'wireMaterial', value: 'Dây Da', label: 'Dây Da' },
            { key: 'wireMaterial', value: 'Dây Nhựa', label: 'Dây Nhựa' },
            { key: 'wireMaterial', value: 'Dây Kim Loại', label: 'Dây Kim Loại' },
            {
                key: 'wireMaterial',
                value: 'Dây Thép Không Gỉ Mạ Vàng PVD',
                label: 'Dây Thép Không Gỉ Mạ Vàng PVD',
            },
        ],
    },
    {
        title: 'Hình dáng mặt đồng hồ',
        choices: [
            { key: 'shape', value: 'Mặt tròn', label: 'Mặt tròn' },
            { key: 'shape', value: 'Mặt vuông', label: 'Mặt vuông' },
        ],
    },
    {
        title: 'Kháng nước',
        choices: [
            { key: 'waterProof', value: '3', label: '3atm' },
            { key: 'waterProof', value: '5', label: '5atm' },
            { key: 'waterProof', value: '10', label: '10atm' },
            { key: 'waterProof', value: '20', label: '20atm' },
        ],
    },
];

export default function FilterSortPanel() {
    // states
    const [searchParams, setSearchParams] = useSearchParams();
    const [sortValue, setSortValue] = useState({
        value: '',
        label: '',
    });
    const [showModalFilter, setShowModalFilter] = useState(false);
    const [searchFilterOption, setSearchFilterOption] = useState('');
    const [selectedFilters, setSelectedFilters] = useState([]);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        const initialFilters = [];
        options.forEach((option) => {
            const paramValue = searchParams.get(option.choices[0].key);
            if (paramValue) {
                const values = paramValue.split(',');
                option.choices.forEach((choice) => {
                    if (values.includes(choice.value)) {
                        initialFilters.push(choice);
                    }
                });
            }
        });
        setSelectedFilters(initialFilters);

        const sortByParam = searchParams.get('sortBy');
        if (sortByParam) {
            const sortOption = {
                value: sortByParam,
                label: getSortLabel(sortByParam),
            };
            setSortValue(sortOption);
        }
    }, [searchParams]);

    // ========================================= Sort =========================================
    const handleSortChange = (newValue, newLabel) => {
        const sortOption = { value: newValue, label: newLabel };
        setSortValue(sortOption);
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('sortBy', newValue);
        setSearchParams(newSearchParams);
    };

    const handleRemoveSort = () => {
        setSortValue({
            value: '',
            label: '',
        });
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('sortBy');
        setSearchParams(newSearchParams);
    };

    const getSortLabel = (value) => {
        switch (value) {
            case 'gia-tang-dan':
                return 'Giá tăng dần';
            case 'gia-giam-dan':
                return 'Giá giảm dần';
            case 'a-z':
                return 'Từ A - Z';
            case 'z-a':
                return 'Từ Z - A';
            default:
                return '';
        }
    };

    // ========================================= Filter =========================================
    const filteredOptions = options.map((option) => ({
        ...option,
        choices: option.choices.filter((choice) =>
            choice.label.toLowerCase().includes(searchFilterOption.toLowerCase())
        ),
    }));

    const handleSelect = (choice) => {
        const isChoiceExist = selectedFilters.some(
            (item) => item.key === choice.key && item.value === choice.value
        );
        if (!isChoiceExist) {
            setSelectedFilters([...selectedFilters, choice]);
        }
    };

    const handleRemoveOptionFilter = (filterToRemove) => {
        const updatedFilters = selectedFilters.filter(
            (filter) =>
                !(filter.key === filterToRemove.key && filter.value === filterToRemove.value)
        );
        setSelectedFilters(updatedFilters);
    };

    const updateSearchParams = (filters) => {
        const newSearchParams = new URLSearchParams();

        const filterGroups = {};
        filters.forEach((filter) => {
            if (!filterGroups[filter.key]) {
                filterGroups[filter.key] = [];
            }
            filterGroups[filter.key].push(filter.value);
        });

        Object.entries(filterGroups).forEach(([key, values]) => {
            if (values.length > 0) {
                newSearchParams.set(key, values.join(','));
            }
        });

        searchParams.forEach((value, key) => {
            if (key !== 'pageNum' && !options.some((option) => option.choices[0].key === key)) {
                newSearchParams.set(key, value);
            }
        });

        setSearchParams(newSearchParams);
    };

    const handleSubmitFilter = (e) => {
        e.preventDefault();
        updateSearchParams(selectedFilters);
        setShowModalFilter(false);
    };

    return (
        <>
            <div className='flex justify-center items-center gap-x-2 sm:gap-x-5'>
                {/* filter */}
                <Badge count={selectedFilters.length}>
                    <Button outline onClick={() => setShowModalFilter(true)} className=''>
                        Bộ lọc
                    </Button>
                </Badge>

                {/* sort */}
                <Dropdown outline label={sortValue.label ? sortValue.label : 'Sắp xếp'}>
                    <Dropdown.Item
                        onClick={() => handleSortChange('gia-tang-dan', 'Giá tăng dần')}
                        icon={FaArrowUp}
                    >
                        Giá tăng dần
                    </Dropdown.Item>
                    <Dropdown.Item
                        onClick={() => handleSortChange('gia-giam-dan', 'Giá giảm dần')}
                        icon={FaArrowDown}
                    >
                        Giá giảm dần
                    </Dropdown.Item>
                    <Dropdown.Item
                        onClick={() => handleSortChange('a-z', 'Từ A - Z')}
                        icon={FaSortAlphaDown}
                    >
                        Từ A - Z
                    </Dropdown.Item>
                    <Dropdown.Item
                        onClick={() => handleSortChange('z-a', 'Từ Z - A')}
                        icon={FaSortAlphaUpAlt}
                    >
                        Từ Z - A
                    </Dropdown.Item>
                    {sortValue.value && (
                        <Dropdown.Item onClick={() => handleRemoveSort()} icon={FaTimes}>
                            Bỏ chọn
                        </Dropdown.Item>
                    )}
                </Dropdown>
            </div>

            {/* modal filter option */}
            <Modal show={showModalFilter} onClose={() => setShowModalFilter(false)} size='md' popup>
                <Modal.Header className='pl-6'>Bộ Lọc Nâng Cao</Modal.Header>
                <Modal.Body>
                    <div className='mb-4'>
                        <TextInput
                            placeholder='Tìm kiếm lựa chọn...'
                            value={searchFilterOption}
                            onChange={(e) => setSearchFilterOption(e.target.value)}
                        />
                    </div>

                    {/* show SELECTED filter options */}
                    <div className='mb-4'>
                        {selectedFilters.length > 0 && (
                            <div className='mb-4'>
                                {selectedFilters.map((optionFilter, index) => (
                                    <Chip_Filter_Component
                                        key={index}
                                        label={`${optionFilter.label}`}
                                        onRemove={() => handleRemoveOptionFilter(optionFilter)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* show filter options */}
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
                                        onClick={() => handleSelect(choice)}
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
                    <Button color='blue' onClick={handleSubmitFilter}>
                        Lọc
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
