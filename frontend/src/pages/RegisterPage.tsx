import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/AuthLayout";
import { useAuth } from "@/context/AuthContext";
import { register as registerRequest } from "@/api/auth";
import { ApiError } from "@/lib/api";

export function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setFieldErrors({});

    try {
      const response = await registerRequest(email, password);
      login(response.token, response.email);
      toast.success("Compte cree avec succes");
      navigate("/tasks");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
        if (error.errors) {
          setFieldErrors(error.errors);
        }
      } else {
        toast.error("Une erreur est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-primary mb-1">Creer un compte</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Commencez a organiser vos taches en quelques secondes.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {fieldErrors.email && (
            <p className="text-sm text-destructive">{fieldErrors.email}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {fieldErrors.password && (
            <p className="text-sm text-destructive">{fieldErrors.password}</p>
          )}
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Creation..." : "Creer mon compte"}
        </Button>
      </form>
      <p className="text-sm text-center mt-4 text-muted-foreground">
        Deja un compte ?{" "}
        <Link to="/login" className="text-accent underline font-medium">
          Se connecter
        </Link>
      </p>
    </AuthLayout>
  );
}
