import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AllDoneIllustration } from "@/components/AllDoneIllustration";
import { TaskCard } from "@/components/TaskCard";
import { TaskFormDialog } from "@/components/TaskFormDialog";
import { InlineTaskCreator } from "@/components/InlineTaskCreator";
import { useAuth } from "@/context/AuthContext";
import { getTasks, createTask, updateTask, deleteTask, type TaskInput } from "@/api/tasks";
import { ApiError } from "@/lib/api";
import type { Task, TaskStatus } from "@/types";

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "ALL">("ALL");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const { email, logout } = useAuth();

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getTasks({
        status: statusFilter === "ALL" ? undefined : statusFilter,
        search: search || undefined,
      });
      setTasks(data);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    const timeout = setTimeout(loadTasks, 300);
    return () => clearTimeout(timeout);
  }, [loadTasks]);

  const activeTasks = tasks.filter((task) => task.status !== "DONE");
  const completedTasks = tasks.filter((task) => task.status === "DONE");

  function openEditDialog(task: Task) {
    setEditingTask(task);
    setDialogOpen(true);
  }

  async function handleFormSubmit(input: TaskInput) {
    try {
      await updateTask(editingTask!.id, input);
      toast.success("Tache modifiee");
      loadTasks();
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
      throw error;
    }
  }

  async function handleCreate(input: TaskInput) {
    const tempId = -Date.now();
    const now = new Date().toISOString();
    const optimisticTask: Task = {
      id: tempId,
      title: input.title,
      description: input.description || null,
      status: input.status ?? "TODO",
      createdAt: now,
      updatedAt: now,
    };

    setTasks((current) => [...current, optimisticTask]);
    setIsCreating(false);

    try {
      const created = await createTask(input);
      setTasks((current) => current.map((t) => (t.id === tempId ? created : t)));
      toast.success("Tache creee");
    } catch (error) {
      setTasks((current) => current.filter((t) => t.id !== tempId));
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
      throw error;
    }
  }

  async function handleDelete(task: Task) {
    const previousTasks = tasks;
    setTasks((current) => current.filter((t) => t.id !== task.id));

    try {
      await deleteTask(task.id);
      toast.success("Tache supprimee");
    } catch (error) {
      setTasks(previousTasks);
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    }
  }

  async function handleStatusChange(task: Task, status: TaskStatus) {
    const previousTasks = tasks;

    setTasks((current) =>
      current.map((t) => (t.id === task.id ? { ...t, status } : t))
    );

    try {
      await updateTask(task.id, { title: task.title, description: task.description ?? "", status });
      if (status === "DONE") {
        toast.success("Tache marquee comme terminee");
      }
    } catch (error) {
      setTasks(previousTasks);
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    }
  }

  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Mes taches</h1>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
        <Button
          variant="outline"
          onClick={logout}
          className="hover:bg-destructive hover:text-white hover:border-destructive"
        >
          Deconnexion
        </Button>
      </div>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Rechercher une tache..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as TaskStatus | "ALL")}
          items={{
            ALL: "Tous statuts",
            TODO: "A faire",
            DONE: "Terminee",
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous statuts</SelectItem>
            <SelectItem value="TODO">A faire</SelectItem>
            <SelectItem value="DONE">Terminee</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent>
          {!isCreating ? (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full text-left text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              + Ajouter une tache
            </button>
          ) : (
            <InlineTaskCreator onCreate={handleCreate} onCancel={() => setIsCreating(false)} />
          )}

          {isLoading ? (
            <p className="text-sm text-muted-foreground mt-4">Chargement...</p>
          ) : tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground mt-4">Aucune tache pour le moment.</p>
          ) : statusFilter !== "ALL" ? (
            <div className="flex flex-col mt-2">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={openEditDialog}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          ) : (
            <>
              <div className="flex flex-col mt-2">
                {activeTasks.length === 0 ? (
                  <AllDoneIllustration />
                ) : (
                  activeTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={openEditDialog}
                      onDelete={handleDelete}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                )}
              </div>

              {completedTasks.length > 0 && (
                <Collapsible open={showCompleted} onOpenChange={setShowCompleted} className="mt-4">
                  <CollapsibleTrigger className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ChevronDownIcon
                      className={`size-4 transition-transform ${showCompleted ? "" : "-rotate-90"}`}
                    />
                    Taches terminees ({completedTasks.length})
                  </CollapsibleTrigger>
                  <CollapsibleContent className="flex flex-col mt-2">
                    {completedTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={openEditDialog}
                        onDelete={handleDelete}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <TaskFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
