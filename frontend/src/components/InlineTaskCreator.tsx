import { useRef, useState, useLayoutEffect, useEffect, type KeyboardEvent } from "react";
import gsap from "gsap";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { TaskInput } from "@/api/tasks";

interface InlineTaskCreatorProps {
  onCreate: (input: TaskInput) => Promise<void>;
  onCancel: () => void;
}

export function InlineTaskCreator({ onCreate, onCancel }: InlineTaskCreatorProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, scale: 0.95, y: -8 },
      { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: "power2.out" }
    );
    titleInputRef.current?.focus();
  }, []);

  async function submit() {
    if (!title.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onCreate({ title, description });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "Escape") {
      onCancel();
    }
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        if (title.trim()) {
          submit();
        } else {
          onCancel();
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  return (
    <div ref={cardRef}>
      <Card>
        <CardContent className="flex flex-col gap-2 pt-4">
          <Input
            ref={titleInputRef}
            placeholder="Titre de la tache"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting}
          />
          <Input
            placeholder="Description (optionnel)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
