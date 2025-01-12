import { Link, redirect, useNavigate } from "@remix-run/react";
import { ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function NotFound({
  message = "Error Happened" ,
  description  = "Something Went wrong !!!"
}) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Oops! {message}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {description}
          </p>
        </div>
        <div className="mt-8">
          <svg
            className="mx-auto h-48 w-48 text-red-900"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="mt-5">
          <Button
            className="w-full"
            onClick={() => {
              navigate(-1);
            }}
          >
            <ArrowLeft />
            Go back
          </Button>
        </div>
      </div>
    </div>
  );
}
