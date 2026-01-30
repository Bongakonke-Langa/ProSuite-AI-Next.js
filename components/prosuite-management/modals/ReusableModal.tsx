import React from 'react';
import { Button } from '@/components/ui/button';

interface ReusableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  description: string;
  submitButtonText: string;
  cancelButtonText: string;
  type: 'confirm' | 'alert';
  size?: 'small' | 'medium' | 'large';
}

export default function ReusableModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  submitButtonText,
  cancelButtonText,
}: ReusableModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{description}</p>
        <div className="flex justify-end space-x-3">
          <Button variant="ghost" onClick={onClose}>
            {cancelButtonText}
          </Button>
          <Button onClick={onSubmit}>
            {submitButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
