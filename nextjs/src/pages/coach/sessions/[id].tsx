import DashboardLayout from "@/components/layout/DashboardLayout";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export default function CoachSessionEdit() {
  const router = useRouter();
  const { toast } = useToast();
  const id = router.query.id as string;
  const isNew = id === "new";

  const { data: session, isLoading, refetch } = api.sessions.get.useQuery(
    { id },
    { enabled: !isNew && !!id }
  );
  const { data: allSessions } = api.sessions.list.useQuery();

  const updateSession = api.sessions.update.useMutation({
    onSuccess: () => { toast({ title: "Session saved" }); refetch(); },
  });
  const createSession = api.sessions.create.useMutation({
    onSuccess: (data) => {
      toast({ title: "Session created" });
      router.push(`/coach/sessions/${data?.id}`);
    },
  });
  const addStep = api.nextSteps.create.useMutation({ onSuccess: () => { refetch(); setNewStep(""); } });
  const deleteStep = api.nextSteps.delete.useMutation({ onSuccess: () => refetch() });
  const toggleStep = api.nextSteps.toggleComplete.useMutation({ onSuccess: () => refetch() });

  const [form, setForm] = useState({
    title: "", session_date: "", duration_minutes: 60,
    google_meet_url: "", summary: "", status: "scheduled" as const,
    client_id: "",
  });
  const [newStep, setNewStep] = useState("");

  useEffect(() => {
    if (session) {
      setForm({
        title: session.title ?? "",
        session_date: session.session_date ? session.session_date.slice(0, 16) : "",
        duration_minutes: session.duration_minutes ?? 60,
        google_meet_url: session.google_meet_url ?? "",
        summary: session.summary ?? "",
        status: (session.status as any) ?? "scheduled",
        client_id: session.client_id ?? "",
      });
    }
  }, [session]);

  // Unique clients from existing sessions
  const clientOptions = Array.from(
    new Map(allSessions?.map((s) => [s.client_id, s.client_id])).values()
  );

  const handleSave = () => {
    if (isNew) {
      createSession.mutate(form as any);
    } else {
      updateSession.mutate({ id, ...form } as any);
    }
  };

  return (
    <DashboardLayout title={isNew ? "New Session" : "Edit Session"}>
      <div className="space-y-8 max-w-2xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-stone-800">
            {isNew ? "New Session" : "Edit Session"}
          </h1>
          <Button variant="outline" onClick={() => router.push("/coach/sessions")}>
            ← Back
          </Button>
        </div>

        {!isNew && isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-100 p-6 space-y-5 shadow-sm">
            <div className="space-y-2">
              <Label>Session Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Discovery Session" />
            </div>

            <div className="space-y-2">
              <Label>Client ID</Label>
              <Input value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })} placeholder="Client user ID (UUID)" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date & Time</Label>
                <Input type="datetime-local" value={form.session_date} onChange={(e) => setForm({ ...form, session_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Input type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: +e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Google Meet URL</Label>
              <Input value={form.google_meet_url} onChange={(e) => setForm({ ...form, google_meet_url: e.target.value })} placeholder="https://meet.google.com/..." />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Session Summary</Label>
              <Textarea
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                placeholder="Key takeaways and notes from this session..."
                rows={5}
              />
            </div>

            <Button onClick={handleSave} className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-full">
              {isNew ? "Create Session" : "Save Changes"}
            </Button>
          </div>
        )}

        {!isNew && session && (
          <div className="bg-white rounded-2xl border border-stone-100 p-6 space-y-4 shadow-sm">
            <h2 className="font-semibold text-stone-800">Next Steps</h2>
            <div className="space-y-2">
              {(session as any).next_steps?.map((step: any) => (
                <div key={step.id} className="flex items-center gap-3 group">
                  <Checkbox
                    checked={step.is_completed}
                    onCheckedChange={(c) => toggleStep.mutate({ id: step.id, is_completed: !!c })}
                  />
                  <span className={`flex-1 text-sm ${step.is_completed ? "line-through text-stone-400" : "text-stone-700"}`}>
                    {step.description}
                  </span>
                  <button
                    onClick={() => deleteStep.mutate({ id: step.id })}
                    className="text-stone-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <Input
                value={newStep}
                onChange={(e) => setNewStep(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && newStep.trim()) addStep.mutate({ session_id: id, description: newStep.trim() }); }}
                placeholder="Add a next step... (press Enter)"
              />
              <Button
                variant="outline"
                onClick={() => newStep.trim() && addStep.mutate({ session_id: id, description: newStep.trim() })}
              >
                Add
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
