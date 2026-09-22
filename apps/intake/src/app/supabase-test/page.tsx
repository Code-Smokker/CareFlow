import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function SupabaseTestPage() {
  // A connectivity check for developers only: in a production build it must not exist (it prints the
  // project URL and would list rows of whatever table it queries).
  if (process.env.NODE_ENV === "production") notFound();

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.from("todos").select().limit(10);

  return (
    <div className="p-8 max-w-xl mx-auto space-y-4 font-sans">
      <h1 className="text-2xl font-bold">Supabase Connection Test</h1>
      <p className="text-sm text-gray-600">
        Project URL: <code className="bg-gray-100 px-1 py-0.5 rounded">{process.env.NEXT_PUBLIC_SUPABASE_URL}</code>
      </p>

      {error ? (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800 space-y-1">
          <p className="font-semibold">Query Result:</p>
          <p>{error.message}</p>
          <p className="text-xs text-gray-500">
            (If table "todos" does not exist yet in Supabase, this confirms the client contacted Supabase successfully!)
          </p>
        </div>
      ) : data && data.length > 0 ? (
        <ul className="list-disc pl-5 space-y-1">
          {data.map((todo: any) => (
            <li key={todo.id}>{todo.name ?? JSON.stringify(todo)}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-emerald-700 bg-emerald-50 p-3 rounded-md border border-emerald-200">
          Connected to Supabase successfully! Table "todos" is ready.
        </p>
      )}
    </div>
  );
}
