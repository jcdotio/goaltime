import { PlayCircle } from 'lucide-react';


interface VideoCardProps {
   id: string;
   title: string;
   thumbnail: string;
   onPlay: (id: string) => void;
 }
 
 export const VideoCard = ({ id, title, thumbnail, onPlay }: VideoCardProps) => (
   <button 
     onClick={() => onPlay(id)}
     className="group relative aspect-video rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all"
   >
     <img 
       src={thumbnail} 
       alt={title}
       className="w-full h-full object-cover group-hover:scale-105 transition-transform"
     />
     <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
       <PlayCircle className="w-12 h-12 text-white" />
     </div>
     <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
       <p className="text-white text-sm font-medium truncate">{title}</p>
     </div>
   </button>
 );