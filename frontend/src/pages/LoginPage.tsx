import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/AuthLayout";
import { useAuth } from "@/context/AuthContext";
import { login as loginRequest } from "@/api/auth";
import { ApiError } from "@/lib/api";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await loginRequest(email, password);
      login(response.token, response.email);
      toast.success("Connexion reussie");
      navigate("/tasks");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      } else {
        toast.error("Une erreur est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold text-primary mb-1">Connexion</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Contente de vous revoir. Connectez-vous pour retrouver vos taches.
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
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Connexion..." : "Se connecter"}
        </Button>
      </form>
      <p className="text-sm text-center mt-4 text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link to="/register" className="text-accent underline font-medium">
          S'inscrire
        </Link>
      </p>
    </AuthLayout>
  );
}
