"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export type ItineraryEvent = {
  id: string;
  day: number;
  title: string;
  location: string;
  description: string;
  duration: string;
  type: "travel" | "activity" | "accommodation" | "meal";
};

const TYPE_META: Record<
  ItineraryEvent["type"],
  { icon: string; color: string; label: string }
> = {
  travel:        { icon: "🚌", color: "bg-blue-500/20 border-blue-400/30 text-blue-300",      label: "Travel"        },
  activity:      { icon: "🏔️", color: "bg-emerald-500/20 border-emerald-400/30 text-emerald-300", label: "Activity"  },
  accommodation: { icon: "🏨", color: "bg-purple-500/20 border-purple-400/30 text-purple-300", label: "Stay"         },
  meal:          { icon: "🍽️", color: "bg-amber-500/20 border-amber-400/30 text-amber-300",    label: "Meal"         },
};

function EventCard({ event }: { event: ItineraryEvent }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: event.id });

  const meta = TYPE_META[event.type];

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`
        group relative flex gap-3 p-3 rounded-xl
        bg-white/[0.06] border border-white/10
        hover:bg-white/[0.09] hover:border-white/20
        transition-all duration-200 select-none
        ${isDragging ? "opacity-50 shadow-2xl scale-[1.02] z-50" : "opacity-100"}
      `}
    >
      {/* Drag handle */}
      <button
        {...listeners}
        {...attributes}
        aria-label="Drag to reorder"
        className="
          flex-shrink-0 flex items-center justify-center
          w-6 self-stretch rounded-lg
          text-white/20 hover:text-white/50 cursor-grab active:cursor-grabbing
          transition-colors
        "
      >
        ⠿
      </button>

      {/* Day badge */}
      <div className="flex-shrink-0 flex flex-col items-center justify-center w-9 h-9 rounded-lg bg-white/[0.08] border border-white/10">
        <span className="text-[9px] text-white/35 font-medium leading-none uppercase tracking-wide">Day</span>
        <span className="text-sm font-bold text-white/80 leading-none">{event.day}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <span className="text-sm font-semibold text-white/90 leading-snug">{event.title}</span>
          <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${meta.color}`}>
            <span aria-hidden>{meta.icon}</span>
            {meta.label}
          </span>
        </div>
        <p className="text-xs text-white/45 mt-0.5 truncate">
          📍 {event.location} · ⏱ {event.duration}
        </p>
        <p className="text-xs text-white/55 mt-1 leading-relaxed line-clamp-2">
          {event.description}
        </p>
      </div>
    </div>
  );
}

export default function Timeline({
  tripTitle,
  totalDays,
  initialEvents,
}: {
  tripTitle: string;
  totalDays: number;
  initialEvents: ItineraryEvent[];
}) {
  const [events, setEvents] = useState(initialEvents);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      setEvents((prev) => {
        const oldIndex = prev.findIndex((ev) => ev.id === active.id);
        const newIndex = prev.findIndex((ev) => ev.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className="mt-2 rounded-xl overflow-hidden border border-white/10 bg-white/[0.03]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.04]">
        <div>
          <p className="text-white/90 font-bold text-sm leading-none">{tripTitle}</p>
          <p className="text-white/35 text-xs mt-1">{totalDays}-day itinerary · {events.length} events · drag to reorder</p>
        </div>
        <span className="text-lg" aria-hidden>🗺️</span>
      </div>

      {/* Sortable list */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={events.map((e) => e.id)} strategy={verticalListSortingStrategy}>
          <div className="p-3 space-y-2 max-h-[420px] overflow-y-auto">
            {events.map((ev) => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
