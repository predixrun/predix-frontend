import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CompleteModal: React.FC<CompleteModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) {
    return null;
  }

  const handleGoHome = () => {
    onClose(); 
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">

      <div className="bg-[#1E1E1E] rounded-xl shadow-lg p-6 w-80 border border-gray-700">

        <p className="text-white text-center text-lg font-semibold mb-5">
          Completed
        </p>

        <button
          onClick={handleGoHome}
          className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200 text-sm"
        >
          go home
        </button>
      </div>
    </div>
  );
};

export default CompleteModal; 