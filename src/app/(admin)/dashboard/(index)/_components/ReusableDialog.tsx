'use client'

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import React, { useActionState } from "react"
import { actionResult } from "@/types"
import { postCategory } from "../categories/lib/actions"

type ReusableDialogProps = {
    triggerLabel?: string
    title: string
    description?: string
    children: React.ReactNode
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
    submitLabel?: string
    open?: boolean
    setOpen?: (open: boolean) => void
    cancelLabel?: string
    loading?: boolean
}
const initialState: actionResult = {

}

export function ReusableDialog({
    triggerLabel,
    title,
    description,
    children,
    onSubmit,
    open,
    setOpen,
    submitLabel = "Save changes",
    cancelLabel = "Cancel",
    loading = false,
}: ReusableDialogProps) {
    const [state, formAction] = useActionState(postCategory, initialState)
    

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {triggerLabel && (
                <DialogTrigger asChild>
                    <Button variant="outline">{triggerLabel}</Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={onSubmit} action={formAction}>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        {description && <DialogDescription>{description}</DialogDescription>}
                    </DialogHeader>
                    <div className="grid gap-4">{children}</div>
                    <DialogFooter className="mt-3">
                        <DialogClose asChild>
                            <Button variant="outline" type="button">{cancelLabel}</Button>
                        </DialogClose>
                        <Button type="submit" disabled={loading}>
                            {loading ? "loading..." : submitLabel}

                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}