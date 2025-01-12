import { ChangeEvent, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { GripVertical, Link, Trash } from "lucide-react";
import { cn } from "~/lib/utils";
import { useSortable } from "@dnd-kit/react/sortable";

interface LinkContentFormInputProps {
  id: string
  idx: number;
  title: string;
  url: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
  errors: LinkContent;
}

export default function LinkContentFormInput({
  idx,
  id,
  title,
  url,
  onChange,
  onDelete,
  errors,
}: LinkContentFormInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { ref, handleRef } = useSortable({ id: id, index: idx });

  return (
    <Collapsible
      ref={ref}
      onDrag={(e) => {
        e.preventDefault();
      }}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <Card
        className={cn(
          "overflow-hidden relative ease-linear duration-300 transition-all",
          !!errors.title && "border-destructive",
          !!errors.url && "border-destructive"
        )}
      >
        <GripVertical
          className={cn(
            "w-6 hover:bg-muted h-full text-muted-foreground hidden hover:text-primary absolute top-0 left-0",
            isOpen === false && "block"
          )}
          ref={handleRef}
        />
        <Trash
          onClick={onDelete}
          className="absolute top-3 right-3 size-4 text-destructive/80 hover:text-destructive hover:cursor-pointer"
        />
        <CollapsibleTrigger className="w-full">
          <CardHeader>
            <CardTitle className="flex justify-center items-center">
                <span className="truncate max-w-[200px] md:max-w-[350px]">
                  {title ? title : "Link"}
                </span>
            </CardTitle>
            <CardDescription className="flex justify-center">
              <div className="flex gap-2 text-sm items-center text-muted-foreground">
                <Link className="size-4" />
                <span className="truncate max-w-[200px] md:max-w-[350px]">
                  {url ? url : "Url not set"}
                </span>
              </div>
            </CardDescription>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            <div className="space-y-2 mb-2">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  name="title"
                  value={title}
                  onChange={(e) => {
                    onChange(e);
                  }}
                  placeholder="Title for your link"
                />
                {!!errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>
              <div>
                <Label htmlFor="url">Url</Label>
                <Input
                  name="url"
                  value={url}
                  onChange={(e) => {
                    onChange(e);
                  }}
                  placeholder="Url Destination"
                />
                {!!errors.url && (
                  <p className="text-sm text-destructive">{errors.url}</p>
                )}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
