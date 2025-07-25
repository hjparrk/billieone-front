import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    type ColumnDef,
} from "@tanstack/react-table";

export interface DataTableProps<T> {
    data: T[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: ColumnDef<T, any>[];
    emptyMessage?: string;
    emptyDescription?: string;
    containerClassName?: string;
    tableClassName?: string;
    headerClassName?: string;
    cellClassName?: string;
    emptyClassName?: string;
}

export function DataTable<T>({
    data,
    columns,
    emptyMessage = "No data found",
    emptyDescription = "There are no items available at the moment.",
    containerClassName = "",
    tableClassName = "",
    headerClassName = "",
    cellClassName = "",
    emptyClassName = "",
}: DataTableProps<T>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (!Array.isArray(data) || data.length === 0) {
        return (
            <div className={emptyClassName}>
                <h3>{emptyMessage}</h3>
                <p>{emptyDescription}</p>
            </div>
        );
    }

    return (
        <div className={containerClassName}>
            <table className={tableClassName}>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className={headerClassName}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className={cellClassName}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
