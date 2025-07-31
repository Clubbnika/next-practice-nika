import Image from 'next/image';

interface UserAvatarProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export const UserAvatar = ({
  src,
  alt,
  width,
  height,
  className = "rounded-full"
}: UserAvatarProps) => {
  return (
    <Image 
      src={src} 
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
};