import { Calendar, ChevronDown, Search, X } from "lucide-react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

import { Calendar as CalendarComponent } from "~/components/ui/calendar";

// @ts-ignore
import _ from "lodash"

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  searchRef: React.RefObject<HTMLInputElement>;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  setDateRange: React.Dispatch<
    React.SetStateAction<{
      from: Date | undefined;
      to: Date | undefined;
    }>
  >;
  placeholder: string
}

export default function SearchBar({
  searchRef,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  dateRange,
  setDateRange,
  placeholder 
}: SearchBarProps) {
  return (
    <div className="flex w-full gap-2 flex-wrap my-2 bg-white">
      <div className="relative w-full">
        <Input
          ref={searchRef}
          className="peer pl-8"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm((_) => e.target.value)}
        />
        <Search className="peer-focus:text-primary text-muted-foreground size-5 absolute left-2 top-1/2 transform -translate-y-1/2" />
        {searchTerm && (
          <X
            className="text-muted-foreground hover:text-primary absolute right-2 top-2 size-5"
            onClick={() => {
              setSearchTerm("");
            }}
          />
        )}
      </div>

      <div className="flex items-center space-x-2 bg-white">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[140px] h-8">
            <SelectValue className="font-semibold" placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Tittle</SelectItem>
            <SelectItem value="date">Date</SelectItem>
          </SelectContent>
        </Select>
        {sortBy && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              setSortBy("");
            }}
            aria-label="Remove sort filter"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-8 justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  new Intl.DateTimeFormat("id").formatRange(
                    dateRange.from,
                    dateRange.to
                  )
                ) : (
                  new Intl.DateTimeFormat("id").format(dateRange.from)
                )
              ) : (
                <span>Pick a date range</span>
              )}
              <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={dateRange.from}
              selected={dateRange}
              onSelect={(range) => {
                if (range)
                  setDateRange(
                    range as { from: Date | undefined; to: Date | undefined }
                  );
              }}
            />
          </PopoverContent>
        </Popover>
        {(dateRange.from || dateRange.to) && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              setDateRange({ from: undefined, to: undefined });
            }}
            aria-label="Remove date filter"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
