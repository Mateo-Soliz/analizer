import { Button } from "@/components/primitives/button";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/primitives/form";
import { Input } from "@/components/primitives/input";
import { Label } from "@/components/primitives/label";
import { useFormContext } from "react-hook-form";

export const RegisterForm = () => {
  const form = useFormContext<any>();
  const { isSubmitting, isValid, errors } = form.formState;
  return (
    <div className="space-y-4">

      <div className="space-y-2">
        <Label htmlFor="name">Nombre completo</Label>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Tu nombre"
                  value={field.value}
                  onChange={field.onChange}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={field.value}
                  onChange={field.onChange}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={field.value}
                  onChange={field.onChange}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={field.value}
                  onChange={field.onChange}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {/* Mostrar el error general si existe */}
      {errors.root?.message && (
        <div className="text-red-600 text-sm text-center mb-2">
          {errors.root.message}
        </div>
      )}
      <Button type="submit" className="w-full" disabled={isSubmitting || !isValid}>
        {isSubmitting ? "Creando cuenta..." : "Crear Cuenta"}
      </Button>
    </div>
  );
};
