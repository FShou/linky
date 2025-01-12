import { Link } from "@remix-run/react";
import { motion } from "framer-motion";
import { CalendarDays, Edit, LinkIcon, Share2, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";

interface PageCardProps {
  page: Page;
  onDelete: (id: number) => void;
  onTogglePublish: (id: number, published: boolean) => void;
  onShare: (page: Page) => void;
}

export default function PageCard({
  page,
  onDelete,
  onTogglePublish,
  onShare,
}: PageCardProps) {
  const url =
    "https://" + import.meta.env.VITE_DOMAIN_ORIGIN + `/p/${page.slug}`;
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
      <Card className="duration-300">
        <CardHeader className="bg-gradient-to-r from-primary/90 md:via-primary/90 md:to-red-900 to-red-900  text-white rounded-t-xl">
          <CardTitle className="text-xl font-bold truncate">
            {page.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-between py-6">
          <div className="space-y-4">
            <a
              href={url}
              className="flex hover:text-red-900 items-center space-x-2 text-sm text-gray-500"
            >
              <LinkIcon className="w-4 h-4" />
              <span className="truncate">{url}</span>
            </a>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <CalendarDays className="w-4 h-4" />
              <span>
                {new Intl.DateTimeFormat("id").format(page.updatedAt)}
              </span>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm font-medium">Published</span>
            <Switch
              name="published"
              defaultChecked={page.published}
              onCheckedChange={(checked) => {
                onTogglePublish(page.id, checked);
              }}
            />
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 rounded-b-xl p-4 mt-auto">
          <div className="w-full grid grid-cols-3 gap-2">
            <Link
              to={`/dashboard/pages/${page.id}`}
              className="flex-grow flex-shrink"
              prefetch="intent"
            >
              <Button
                variant="outline"
                size="sm"
                className="flex-1 hover:bg-yellow-600 w-full hover:text-white transition-colors duration-300"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onShare(page);
              }}
              className="flex-1 flex-grow hover:bg-sky-700 hover:text-white transition-colors duration-300"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(page.id);
              }}
              className="flex-1 hover:bg-destructive hover:text-white transition-colors duration-300"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
