"use client";

import React, { useEffect, useState } from "react";
import WindowControls from "@/components/WindowControls";
import WindowWrapper from "@/components/WindowWrapper";
import { ChevronLeft, ChevronRight, Plus, Trash } from "lucide-react";

type CalendarEvent = {
  id: string;
  title: string;
  date: string; // yyyy-mm-dd
  color: string;
};

const colors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-red-500",
  "bg-purple-500",
  "bg-orange-500",
];

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const formatDate = (date: Date) => date.toISOString().split("T")[0];

const Calendar = ({ isDark }: { isDark: boolean }) => {
  const today = new Date();
  const [current, setCurrent] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  // const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [color, setColor] = useState(colors[0]);

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("calendar-events");
    return stored ? JSON.parse(stored) : [];
  });

  /* ---------------- STORAGE ---------------- */
  useEffect(() => {
    const stored = localStorage.getItem("calendar-events");
    if (stored) setTimeout(() => setEvents(JSON.parse(stored)), 0);
  }, []);

  useEffect(() => {
    localStorage.setItem("calendar-events", JSON.stringify(events));
  }, [events]);

  /* ---------------- DATE HELPERS ---------------- */
  const year = current.getFullYear();
  const month = current.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const prevMonth = () => setCurrent(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrent(new Date(year, month + 1, 1));

  const dayEvents = events.filter((e) => e.date === selectedDate);

  /* ---------------- ACTIONS ---------------- */
  const addEvent = () => {
    if (!newTitle || !selectedDate) return;

    setEvents([
      ...events,
      {
        id: crypto.randomUUID(),
        title: newTitle,
        date: selectedDate,
        color,
      },
    ]);
    setNewTitle("");
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  return (
    <>
      {/* HEADER */}
      <div id="window-header">
        <WindowControls target="calendar" />

        <div className="flex items-center gap-2 text-sm font-medium">
          <button onClick={prevMonth}>
            <ChevronLeft size={16} />
          </button>

          <span>
            {current.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </span>

          <button onClick={nextMonth}>
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="w-12" />
      </div>

      {/* BODY */}
      <div
        className={`flex h-full ${
          isDark ? "bg-neutral-900 text-white" : " text-black"
        }`}
      >
        {/* MONTH GRID */}
        <div className="flex-1 p-4">
          <div className="grid grid-cols-7 text-xs mb-2 opacity-70">
            {weekDays.map((d) => (
              <div key={d} className="text-center">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-sm">
            {days.map((day, i) => {
              if (!day) return <div key={i} />;

              const dateStr = formatDate(new Date(year, month, day));

              const isToday = dateStr === formatDate(today);

              const hasEvents = events.some((e) => e.date === dateStr);

              return (
                <div
                  key={i}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-12 rounded-md flex flex-col items-center justify-center cursor-pointer
                  ${
                    isToday
                      ? "bg-blue-500 text-white"
                      : "hover:bg-black/5 dark:hover:bg-white/10"
                  }`}
                >
                  {day}
                  {hasEvents && (
                    <div className="flex gap-1 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* DAY PANEL */}
        {selectedDate && (
          <div className="w-72 border-l border-black/10 dark:border-white/10 p-3">
            <h3 className="font-semibold mb-2">
              {new Date(selectedDate).toDateString()}
            </h3>

            <div className="space-y-2 mb-3">
              {dayEvents.map((e) => (
                <div
                  key={e.id}
                  className={`flex items-center justify-between px-2 py-1 rounded text-white ${e.color}`}
                >
                  <span className="text-sm truncate">{e.title}</span>
                  <button onClick={() => deleteEvent(e.id)}>
                    <Trash size={14} />
                  </button>
                </div>
              ))}
            </div>

            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="New event"
              className="w-full mb-2 px-2 py-1 rounded bg-black/5 dark:bg-white/10 outline-none"
            />

            <div className="flex gap-2 mb-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-5 h-5 rounded-full ${c} ${
                    color === c ? "ring-2 ring-white" : ""
                  }`}
                />
              ))}
            </div>

            <button
              onClick={addEvent}
              className="flex items-center gap-1 text-sm px-2 py-1 rounded bg-blue-500 text-white"
            >
              <Plus size={14} /> Add Event
            </button>
          </div>
        )}
      </div>
    </>
  );
};

const CalendarWindow = WindowWrapper(Calendar, "calendar");

export default CalendarWindow;
