import { Badge } from "~/components/ui/badge"
import { DataTableColumnHeader } from "./data-column-header"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableRowActions } from "./data-row-action"

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "fullname",
    header: ({ column }) => (
      <div className="ml-4">

        <DataTableColumnHeader column={column} title="Full Name" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="ml-4 flex items-center gap-4">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("fullname")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Badge variant="outline">{row.getValue("username")}</Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          {new Intl.DateTimeFormat("id").format(row.getValue("createdAt"))}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          {new Intl.DateTimeFormat("id").format(row.getValue("updatedAt"))}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
]
