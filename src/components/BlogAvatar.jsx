import { default as Avatar } from "boring-avatars";

export default function BlogAvatar({ title }) {  
  if (!Avatar) {
    console.error('Avatar component is not available:', Avatar);
    return <div>Loading...</div>;
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      <Avatar 
        className="w-full h-full rounded-2xl"
        name={title}
        variant="marble"
        colors={["#220353", "#3a0883", "#ce620c"]} 
        square={true}
      />
    </div>
  );
} 