import { X } from 'lucide-react';
import React from 'react'

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-blue-100 rounded-lg w-full max-w-md mx-auto shadow-xl">
                <div className="flex justify-between items-center border-b border-blue-200 p-4">
                    <h3 className="text-lg font-medium">{title}</h3>
                    <button onClick={onClose} className="text-gray-600 hover:text-black">
                        <X size={20} color='white' />
                    </button>
                </div>
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal