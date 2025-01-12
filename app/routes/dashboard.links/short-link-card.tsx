import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Edit, Share2, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { motion } from "framer-motion";

interface ShortlinkCardProps {
  handleShare: (link: Link) => void;
  handleEdit: (link: Link) => void;
  handleDelete: (linkId: number) => void;
  link: Link;
}

export default function ShortlinkCard({
  link,
  handleEdit,
  handleShare,
  handleDelete,
}: ShortlinkCardProps) {
  const [isCopied, setIsCopied] = useState(false);

  const url = "https://" + import.meta.env.VITE_DOMAIN_ORIGIN + `/${link.slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      layout
      transition={{
        type: "tween",
        duration: 0.3,
      }}
      className="flex-grow"
    >
      <Card className="w-full duration-300">
        <CardHeader className="bg-gradient-to-r from-primary/90 via-primary/90 to-red-900 text-white rounded-t-xl pb-4">
          <CardTitle className="flex justify-between items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="truncate text-lg font-bold">
                    {link.title}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{link.title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-white text-primary hover:bg-secondary"
                  >
                    {new Intl.DateTimeFormat("id").format(link.updatedAt)}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Created on{" "}
                    {new Intl.DateTimeFormat("id").format(link.updatedAt)}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent className="py-4">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-md p-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={url}
                    className="text-sm font-medium truncate flex-grow hover:cursor-pointer hover:text-red-900"
                  >
                    {url}
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{url}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    {isCopied ? "Copied!" : "Copy"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isCopied ? "Copied to clipboard!" : "Copy short URL"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
        <CardFooter className="grid grid-cols-3 justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(link);
            }}
            className="flex-1 hover:bg-yellow-600 hover:text-white transition-colors duration-300"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleShare(link);
            }}
            className="flex-1 hover:bg-sky-700 hover:text-white transition-colors duration-300"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(link.id);
            }}
            className="flex-1 hover:bg-destructive hover:text-white transition-colors duration-300"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
