import { FaCheck } from 'react-icons/fa';
import { IoCloseOutline } from 'react-icons/io5';

const PasswordCriteria = ({ password }) => {
    const criteria = [
        { label: 'At least 6 characters', isMet: password.length >= 6 },
        { label: 'Contains uppercase letter', isMet: /[A-Z]/.test(password) },
        { label: 'Contains lowercase letter', isMet: /[a-z]/.test(password) },
        { label: 'Contains a number', isMet: /\d/.test(password) },
        { label: 'Contains special character', isMet: /[^A-Za-z0-9]/.test(password) },
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

const PasswordStrengthMeter = ({ password }) => {
    // get strength of password
    const getStrength = (pass) => {
        let strength = 0;
        if (pass.length >= 6) strength++;
        if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
        if (pass.match(/\d/)) strength++;
        if (pass.match(/[^a-zA-Z\d]/)) strength++;
        return strength;
    };
    const strength = getStrength(password);

    // get color based on strength
    const getColor = (strength) => {
        switch (strength) {
            case 0:
                return 'bg-red-500';
            case 1:
                return 'bg-red-400';
            case 2:
                return 'bg-yellow-500';
            case 3:
                return 'bg-yellow-400';
            default:
                return 'bg-green-500';
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
                <span className='text-xs text-gray-400'>Password strength</span>
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
