import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

type Row = { track_id: string; lesson_id: string };

type Ctx = {
  done: Record<string, Set<string>>; // trackId -> Set<lessonId>
  doneIds: Set<string>; // global lesson ids
  isDone: (trackId: string, lessonId: string) => boolean;
  markComplete: (trackId: string, lessonId: string) => Promise<boolean>;
  refresh: () => Promise<void>;
  ready: boolean;
};

const ProgressCtx = createContext<Ctx>({
  done: {},
  doneIds: new Set(),
  isDone: () => false,
  markComplete: async () => false,
  refresh: async () => {},
  ready: false,
});

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [done, setDone] = useState<Record<string, Set<string>>>({});
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setDone({});
      setDoneIds(new Set());
      setReady(true);
      return;
    }
    const { data } = await supabase
      .from("user_progress")
      .select("track_id, lesson_id")
      .eq("user_id", user.id);
    const map: Record<string, Set<string>> = {};
    const ids = new Set<string>();
    for (const r of (data ?? []) as Row[]) {
      (map[r.track_id] ??= new Set()).add(r.lesson_id);
      ids.add(r.lesson_id);
    }
    setDone(map);
    setDoneIds(ids);
    setReady(true);
  }, [user]);

  useEffect(() => {
    setReady(false);
    refresh();
  }, [refresh]);

  const isDone = useCallback(
    (trackId: string, lessonId: string) => !!done[trackId]?.has(lessonId),
    [done],
  );

  const markComplete = useCallback(
    async (trackId: string, lessonId: string) => {
      if (!user) return false;
      if (done[trackId]?.has(lessonId)) return true;
      // Optimistic update
      setDone((prev) => {
        const next = { ...prev };
        next[trackId] = new Set(next[trackId] ?? []);
        next[trackId].add(lessonId);
        return next;
      });
      setDoneIds((prev) => {
        const next = new Set(prev);
        next.add(lessonId);
        return next;
      });
      const { error } = await supabase
        .from("user_progress")
        .insert({ user_id: user.id, track_id: trackId, lesson_id: lessonId });
      if (error && !error.message.toLowerCase().includes("duplicate")) {
        // revert on real error
        await refresh();
        return false;
      }
      return true;
    },
    [user, done, refresh],
  );

  return (
    <ProgressCtx.Provider value={{ done, doneIds, isDone, markComplete, refresh, ready }}>
      {children}
    </ProgressCtx.Provider>
  );
}

export const useProgress = () => useContext(ProgressCtx);
