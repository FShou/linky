import { Check, LoaderCircleIcon } from "lucide-react";

const loadingTitle: string & React.ReactNode = (
  <div className="flex items-center gap-2">
    <LoaderCircleIcon className="size-4 animate-spin" />
    <p>Loading...</p>
  </div>
) as string & React.ReactNode;

const succsessTitle: string & React.ReactNode = (
  <div className="flex items-center gap-2">
    <Check strokeWidth={3} className="size-4" />
    <p className="text-green-600">Success</p>
  </div>
) as string & React.ReactNode;

export const LOADING_TOAST = {
  title: loadingTitle,
  description: "Your request is being processed",
};

export const SUCCESS_TOAST = {
  title: succsessTitle,
  description: "We've processed your request successfully",
  duration: 1200,
};
