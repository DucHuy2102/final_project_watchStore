import { FaCheck } from 'react-icons/fa';
import { IoCloseOutline } from 'react-icons/io5';

const PasswordCriteria = ({ password }) => {
    const criteria = [
        { label: 'Có ít nhất 6 ký tự', isMet: password.length >= 6 },
        { label: 'Có chứa ký tự in hoa', isMet: /[A-Z]/.test(password) },
        { label: 'Có chứa ký tự thường', isMet: /[a-z]/.test(password) },
        { label: 'Có chứa số', isMet: /\d/.test(password) },
        { label: 'Có chứa ký tự đặc biệt', isMet: /[^A-Za-z0-9]/.test(password) },
    ];

    return (
        <div className='mt-2 space-y-1'>
            {criteria.map((item) => (
                <div key={item.label} className='flex items-center text-xs'>
                    {item.isMet ? (
                        <FaCheck className='size-4 text-green-500 mr-2' />
                    ) : (
                        <IoCloseOutline className='size-4 text-gray-500 mr-2' />
                    )}
                    <span className={item.isMet ? 'text-green-500' : 'text-gray-400'}>
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

const PasswordStrengthMeter = ({ password, strength }) => {
    // get color based on strength
    const getColor = (strength) => {
        switch (strength) {
            case 0:
                return 'bg-red-400';
            case 1:
                return 'bg-red-300';
            case 2:
                return 'bg-yellow-400';
            case 3:
                return 'bg-yellow-300';
            default:
                return 'bg-green-400';
        }
    };

    // get text based on strength
    const getStrengthText = (strength) => {
        switch (strength) {
            case 0:
                return 'Rất yếu';
            case 1:
                return 'Yếu';
            case 2:
                return 'Khá tốt';
            case 3:
                return 'Tốt';
            default:
                return 'Rất tốt';
        }
    };

    return (
        <div>
            <div className='flex justify-between items-center mb-2'>
                <span className='text-xs text-gray-400'>Độ mạnh mật khẩu</span>
                <span className='text-xs text-gray-400'>{getStrengthText(strength)}</span>
            </div>

            <div className='flex items-center space-x-2'>
                {[...Array(4)].map((_, index) => (
                    <div
                        key={index}
                        className={`h-1 w-1/4 rounded-full transition-colors duration-300 
                ${index < strength ? getColor(strength) : 'bg-gray-600'}`}
                    />
                ))}
            </div>
            <PasswordCriteria password={password} />
        </div>
    );
};
export default PasswordStrengthMeter;
