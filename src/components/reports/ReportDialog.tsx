"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";

// Keep the existing visual modal while adding focus management for report dialogs.
export default function ReportDialog({
  open,
  onClose,
  title,
  children,
  busy = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  busy?: boolean;
}) {
  const t = useTranslations("reports");
  const content = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    content.current?.focus();
    return () => previous?.focus();
  }, [open]);
  return (
    <Modal
      isOpen={open}
      onClose={() => {
        if (!busy) onClose();
      }}
      showCloseButton={false}
      className="m-4 max-h-dvh max-w-xl overflow-y-auto p-5 sm:p-6"
    >
      <div
        ref={content}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="space-y-5 text-gray-800 outline-none dark:text-white/90"
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const nodes = content.current?.querySelectorAll<HTMLElement>(
            'button:not(:disabled), input:not(:disabled), select:not(:disabled), a[href], [tabindex="0"]',
          );
          if (!nodes?.length) {
            event.preventDefault();
            return;
          }
          const first = nodes[0],
            last = nodes[nodes.length - 1];
          if (
            event.shiftKey &&
            (document.activeElement === first ||
              document.activeElement === content.current)
          ) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        {children}
        <Button size="sm" variant="outline" disabled={busy} onClick={onClose}>
          {t("close")}
        </Button>
      </div>
    </Modal>
  );
}
