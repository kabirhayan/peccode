import  { useState, useRef } from 'react';
import { User, Camera, X } from 'lucide-react';

interface ProfilePictureProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  editable?: boolean;
  onImageChange?: (file: File) => void;
}

const ProfilePicture = ({
  src,
  alt = 'User profile',
  size = 'md',
  className = '',
  editable = false,
  onImageChange
}: ProfilePictureProps) => {
  const [image, setImage] = useState<string | undefined>(src);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-xl'
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Display preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Call parent handler
    if (onImageChange) {
      onImageChange(file);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImage(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      className={`relative rounded-full overflow-hidden bg-primary-100 flex items-center justify-center ${sizeClasses[size]} ${className}`}
      onMouseEnter={() => editable && setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {image ? (
        <img src={image} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <User className="text-primary-600" size={size === 'xl' ? 36 : size === 'lg' ? 24 : 16} />
      )}

      {editable && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          
          {isHovering && (
            <div 
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-white flex flex-col items-center">
                <Camera size={size === 'xl' ? 24 : 16} />
                <span className="text-xs mt-1">Change</span>
              </div>
            </div>
          )}
          
          {image && (
            <button 
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/3 -translate-y-1/3"
              onClick={clearImage}
            >
              <X size={size === 'xl' || size === 'lg' ? 14 : 10} />
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ProfilePicture;
 