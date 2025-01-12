import { motion } from "framer-motion";

interface EmptyListProps {
  message: string;
}

export default function EmptyList({ message }: EmptyListProps) {
  return (
    <motion.div
      layout
      initial={{
        y: 30,
        opacity: 0,
      }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        type: "tween",
        duration: 0.3,
      }}
      className="h-56 col-span-3 border-2 rounded-md border-dashed bg-white"
    >
      <motion.p layout className="mt-24  text-center">
        {message}
      </motion.p>
    </motion.div>
  );
}
