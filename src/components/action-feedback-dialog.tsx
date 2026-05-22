"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ActionFeedbackDialog({
  open,
  message,
  onOpenChange,
}: {
  open: boolean;
  message: string | null;
  onOpenChange: (open: boolean) => void;
}) {
  if (!message) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-center text-base font-medium">
            {message}
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="border-t-0 bg-transparent p-0 sm:justify-center">
          <Button type="button" onClick={() => onOpenChange(false)}>
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
