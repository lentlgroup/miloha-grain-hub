import React from 'react';

interface CardProps {
    title: string;
    description: string;
    actions?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, description, actions }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
            <h2 className="text-lg font-bold mb-2">{title}</h2>
            <p className="text-gray-600 mb-4">{description}</p>
            <div className="flex justify-end space-x-2">{actions}</div>
        </div>
    );
};

export default Card;