import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "../../lib/axios";
import { authStore } from "../../store/auth.store";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const res = await api.post("/auth/user-login", data);
    authStore.login(res.data.token, res.data.user);
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm rounded-lg bg-card p-6 shadow"
      >
        <h1 className="text-xl font-semibold mb-4">Login</h1>

        <div className="space-y-4">
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full rounded-md border px-3 py-2"
          />

          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="w-full rounded-md border px-3 py-2"
          />

          {formState.errors.email && (
            <p className="text-sm text-destructive">
              {formState.errors.email.message}
            </p>
          )}

          <button className="w-full bg-primary text-primary-foreground py-2 rounded-md">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
