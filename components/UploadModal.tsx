import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { useRef } from 'react';

export default function UploadModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const overlayRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = async () => {
    if (!fileInputRef.current || !fileInputRef.current.files[0]) {
      // No file selected
      return;
    }

    const formData = new FormData();
    formData.append('image', fileInputRef.current.files[0]);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Upload was successful
        console.log('Image uploaded successfully');
        onClose();
      } else {
        // Handle error
        console.error('Upload failed');
      }
    } catch (error) {
      // Handle network or fetch error
      console.error('Error:', error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      initialFocus={overlayRef}
      className="fixed inset-0 z-10 flex items-center justify-center"
    >
      <Dialog.Overlay
        ref={overlayRef}
        as={motion.div}
        key="backdrop"
        className="fixed inset-0 z-30 bg-black/70 backdrop-blur-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <div className="fixed z-40 w-full max-w-lg p-4 mx-auto bg-white rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold">Upload Images</h2>
        <input
          type="file"
          accept="image/*"
          className="mt-4"  // Removed "multiple"
          ref={fileInputRef}
        />
        <div className="mt-4 flex justify-end">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
            onClick={handleImageUpload}
          >
            Upload
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </Dialog>
  );
}
