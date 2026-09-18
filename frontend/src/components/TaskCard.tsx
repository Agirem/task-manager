import { useRef, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TrashIcon, PencilIcon } from "@/components/icons";
import type { Task, TaskStatus } from "@/types";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const isDone = task.status === "DONE";

  useLayoutEffect(() => {
    if (!rowRef.current) return;
    gsap.fromTo(
      rowRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.2, ease: "power1.out" }
    );
  }, [task.status]);

  function handleCheckedChange(checked: boolean) {
    if (!rowRef.current) {
      onStatusChange(task, checked ? "DONE" : "TODO");
      return;
    }
    gsap.to(rowRef.current, {
      opacity: 0,
      duration: 0.15,
      ease: "power1.in",
      onComplete: () => onStatusChange(task, checked ? "DONE" : "TODO"),
    });
  }

  return (
    <div ref={rowRef} className="flex items-start gap-3 border-b py-3">
      <Checkbox checked={isDone} onCheckedChange={handleCheckedChange} className="mt-1" />

      <div className="flex-1 min-w-0">
        <p className={isDone ? "line-through text-muted-foreground" : ""}>{task.title}</p>
        {task.description && (
          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
        )}
      </div>

      <div className="flex gap-1 shrink-0">
        {!isDone && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(task)}
            aria-label="Modifier"
            className="hover:text-accent"
          >
            <PencilIcon className="size-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setConfirmOpen(true)}
          aria-label="Supprimer"
        >
          <TrashIcon className="size-4" />
        </Button>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette tache ?</AlertDialogTitle>
            <AlertDialogDescription>
              "{task.title}" sera definitivement supprimee. Cette action est irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(task)}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
