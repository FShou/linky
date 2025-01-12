import { ChangeEvent, useState } from "react";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Collapsible, CollapsibleTrigger } from "./ui/collapsible";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { GripVertical, Trash } from "lucide-react";
import { cn } from "~/lib/utils";
import { useSortable } from "@dnd-kit/react/sortable";

interface LinkContentFormInputProps {
  id:string,
  idx: number;
  title: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  errors: TitleContent;
  onDelete: () => void;
}

export default function LinkContentFormInput({
  id,
  idx,
  title,
  onChange,
  onDelete,
  errors,
}: LinkContentFormInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { ref, handleRef } = useSortable({ id, index: idx });
  return (
    <Collapsible ref={ref} open={isOpen} onOpenChange={setIsOpen}>
      <Card
        className={cn(
          "overflow-hidden relative",
          !!errors.title && "border-destructive"
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
            <CardTitle>{title ? title : "Title"}</CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>
            <div className="space-y-2 mb-2">
              <div>
                <Input
                  name="title"
                  value={title}
                  onChange={(e) => {
                    onChange(e);
                  }}
                  placeholder="Title for your"
                />
                {!!errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
