import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "./supabaseClient";

// Keeps a bookings query live.
//
// A technician marking a job complete has to show up on the dispatcher's screen
// without anyone refreshing. Supabase Realtime does that, but it only fires if
// the table has been added to the `supabase_realtime` publication, which is off
// by default. So this subscribes AND polls: realtime gives the instant update
// when it is enabled, the poll guarantees the screen is never more than 15
// seconds stale when it is not. Both funnel into one refetch.

const POLL_MS = 15000;

export default function useLiveBookings({ select, filter, enabled = true }) {
  const [rows, setRows] = useState(null);
  const [live, setLive] = useState(false);
  const busy = useRef(false);

  const load = useCallback(async () => {
    if (!enabled || busy.current) return;
    busy.current = true;
    let q = supabase.from("bookings").select(select).order("created_at", { ascending: false });
    if (filter) q = filter(q);
    const { data, error } = await q;
    busy.current = false;
    if (!error) setRows(data || []);
  }, [enabled, select, filter]);

  useEffect(() => {
    if (!enabled) return;
    load();

    const channel = supabase
      .channel("bookings-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, load)
      .subscribe((status) => setLive(status === "SUBSCRIBED"));

    const poll = setInterval(load, POLL_MS);
    // A tab that was in the background can be arbitrarily stale.
    const onWake = () => document.visibilityState === "visible" && load();
    document.addEventListener("visibilitychange", onWake);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(poll);
      document.removeEventListener("visibilitychange", onWake);
    };
  }, [enabled, load]);

  return { rows, reload: load, live };
}
