"use client"

import * as React from "react"
import {
    DndContext,
    type UniqueIdentifier,
} from "@dnd-kit/core"
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
    IconDotsVertical,
} from "@tabler/icons-react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Tabs,
    TabsContent,

} from "@/components/ui/tabs"
import { ReusableDialog } from "../../_components/ReusableDialog"
import Image from "next/image"
import { getImageUrl } from "@/lib/supabase"
import { toast } from "sonner"
import { postBrand } from "../lib/actions"
import { getBrands } from "../lib/data"

export const schema = z.object({
    id: z.number(),
    name: z.string(),
    logo: z.string().url(),
})




function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
        id: row.original.id,
    })

    return (
        <TableRow
            data-state={row.getIsSelected() && "selected"}
            data-dragging={isDragging}
            ref={setNodeRef}
            className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
            style={{
                transform: CSS.Transform.toString(transform),
                transition: transition,
            }}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    )
}


export function DataTable({
    data: initialData,

}: {
    data: z.infer<typeof schema>[]
}) {
    // 
    const [loading, setLoading] = React.useState(false);
    const [data, setData] = React.useState(() => initialData)
    const [editDialogOpen, setEditDialogOpen] = React.useState(false);
    const [editData, setEditData] = React.useState<{ id: number; name: string } | null>(null);

    // Tambahkan handleSubmit brand name dan image di sini

    // handleEditSubmit Kategori disini 
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            const result = await postBrand(null, formData);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success('Brand berhasil ditambahkan!');
                const newData = await getBrands();
                setData(newData);
            }
        } catch (err: any) {
            console.error('Client call postBrand failed:', err);
            toast.error('Terjadi kesalahan tak terduga saat mengirim data.');
        } finally {
            setLoading(false);
        }
    }


    // // handleEditSubmit Kategori disini 
    // async function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
    //     e.preventDefault();
    //     setLoading(true);
    //     const formData = new FormData(e.currentTarget);

    //     const result = await updateCategory(null, formData, editData?.id);
    //     setLoading(false);

    //     if (result?.error) {
    //         toast.error(result.error);
    //     } else {
    //         toast.success("Kategori berhasil diubah!");
    //         // Fetch ulang data setelah berhasil ubah
    //         const newData = await getCategories();
    //         setData(newData);
    //     }
    // }

    // // handleDelete kategori 
    // async function handleDelete(id: number) {
    //     setLoading(true);
    //     const result = await deleteCategory(null, new FormData(), id);
    //     setLoading(false);

    //     if (result?.error) {
    //         toast.error(result.error);
    //     } else {
    //         toast.success("Kategori berhasil dihapus!");
    //         // Fetch ulang data setelah berhasil hapus
    //         const newData = await getCategories();
    //         setData(newData);
    //     }
    // }


    // Kolom actions harus di-DEFINISIKAN DI DALAM KOMPONEN agar bisa akses state!
    const columns: ColumnDef<z.infer<typeof schema>>[] = [
        {
            id: 'ID',
            header: 'ID',
            cell: ({ row }) => <span>{row.original.id}</span>,
        },
        {
            id: "name",
            header: "Nama Kategori",
            cell: ({ row }) => (
                <div className="inline-flex items-center gap-2">
                    <Image src={getImageUrl(row.original.logo)} alt={row.original.name} width={100} height={100} />
                    <span>{row.original.name}</span>
                </div>
            ),
        },
        {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <IconDotsVertical />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem
                            onClick={() => {
                                setEditData(row.original);
                                setEditDialogOpen(true);
                            }}
                        >
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {/* <DropdownMenuItem variant="destructive" onClick={() => handleDelete(row.original.id)}>Delete</DropdownMenuItem> */}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    ];


    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    })
    const sortableId = React.useId()

    const dataIds = React.useMemo<UniqueIdentifier[]>(
        () => data?.map(({ id }) => id) || [],
        [data]
    )

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
        },
        getRowId: (row) => row.id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })

    return (

        <Tabs
            defaultValue="outline"
            className="w-full flex-col justify-start gap-6"
        >
            <div className="flex items-center justify-end px-4 lg:px-6">
                {/* Tambah Brand */}
                <ReusableDialog
                    triggerLabel="Tambah Brand"
                    title="Tambah Brand"
                    description="Isi data brand baru di bawah ini."
                    submitLabel="Simpan"
                    cancelLabel="Batal"
                    onSubmit={handleSubmit}
                >
                    <div className="grid gap-3">
                        <div>
                            <Label htmlFor="name">Nama Brand</Label>
                            <Input id="name" name="name" required />
                        </div>
                        <div>
                            <Label htmlFor="image">Pilih Gambar</Label>
                            <Input id="image" name="image" type="file" accept="image/*" required />

                        </div>
                    </div>
                </ReusableDialog>

                {/* Edit Brand */}
                {/* <ReusableDialog
                    open={editDialogOpen}
                    setOpen={setEditDialogOpen}
                    title="Edit Brand"
                    triggerLabel=""
                    description="Edit data brand di bawah ini."
                    submitLabel="Simpan"
                    cancelLabel="Batal"
                    onSubmit={handleEditSubmit}
                >
                    <div className="grid gap-3">
                        <Label htmlFor="edit-brand-name">Nama Brand</Label>
                        <Input
                            id="edit-brand-name"
                            name="name"
                            defaultValue={editData?.name}
                        />
                    </div>
                </ReusableDialog> */}

            </div>
            <TabsContent
                value="outline"
                className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
            >
                <div className="overflow-hidden rounded-lg border">
                    <DndContext
                        id={sortableId}
                    >
                        <Table>
                            <TableHeader className="bg-muted sticky top-0 z-10">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id} colSpan={header.colSpan}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody className="**:data-[slot=table-cell]:first:w-8">
                                {table.getRowModel().rows?.length ? (
                                    <SortableContext
                                        items={dataIds}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {table.getRowModel().rows.map((row) => (
                                            <DraggableRow key={row.id} row={row} />
                                        ))}
                                    </SortableContext>
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </DndContext>
                </div>
                <div className="flex items-center justify-between px-4">
                    <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                        {table.getFilteredSelectedRowModel().rows.length} of{" "}
                        {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                    <div className="flex w-full items-center gap-8 lg:w-fit">
                        <div className="hidden items-center gap-2 lg:flex">
                            <Label htmlFor="rows-per-page" className="text-sm font-medium">
                                Rows per page
                            </Label>
                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value))
                                }}
                            >
                                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                                    <SelectValue
                                        placeholder={table.getState().pagination.pageSize}
                                    />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[10, 20, 30, 40, 50].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex w-fit items-center justify-center text-sm font-medium">
                            Page {table.getState().pagination.pageIndex + 1} of{" "}
                            {table.getPageCount()}
                        </div>
                        <div className="ml-auto flex items-center gap-2 lg:ml-0">
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to first page</span>
                                <IconChevronsLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to previous page</span>
                                <IconChevronLeft />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8"
                                size="icon"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to next page</span>
                                <IconChevronRight />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden size-8 lg:flex"
                                size="icon"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to last page</span>
                                <IconChevronsRight />
                            </Button>
                        </div>
                    </div>
                </div>
            </TabsContent>
            <TabsContent
                value="past-performance"
                className="flex flex-col px-4 lg:px-6"
            >
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>
            <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>
            <TabsContent
                value="focus-documents"
                className="flex flex-col px-4 lg:px-6"
            >
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
            </TabsContent>

        </Tabs>

    )
}

