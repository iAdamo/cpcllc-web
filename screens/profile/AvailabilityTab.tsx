"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];
const UNAVAILABLE = ["Sun", "Wed"];
const BOOKED_SLOTS = ["9:00 AM", "2:00 PM"];

export default function AvailabilityTab({ isOnline }: { isOnline: boolean }) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Live status */}
      <div className={`rounded-2xl p-4 flex items-center justify-between ${isOnline ? "bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200" : "bg-gray-50 border border-gray-200"}`}>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`} />
          <div>
            <p className={`text-sm font-bold ${isOnline ? "text-emerald-700" : "text-gray-600"}`}>
              {isOnline ? "Available Now" : "Currently Offline"}
            </p>
            <p className="text-xs text-gray-500">Response time ~15 mins</p>
          </div>
        </div>
        <button
          type="button"
          disabled={!isOnline}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${isOnline ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
        >
          {isOnline ? "Book Instantly" : "Unavailable"}
        </button>
      </div>

      {/* Weekly calendar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-base font-black text-gray-900 mb-4">Weekly Schedule</h2>
        <div className="grid grid-cols-7 gap-1.5">
          {DAYS.map((day) => {
            const off = UNAVAILABLE.includes(day);
            const sel = selectedDay === day;
            return (
              <button key={day} type="button"
                disabled={off}
                onClick={() => setSelectedDay(sel ? null : day)}
                className={`py-3 rounded-xl text-xs font-bold text-center transition-all ${
                  off ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                    : sel ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}>
                {day}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {selectedDay && !UNAVAILABLE.includes(selectedDay) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-500 mb-3">Available slots for {selectedDay}</p>
                <div className="grid grid-cols-4 gap-2">
                  {SLOTS.map((slot) => {
                    const booked = BOOKED_SLOTS.includes(slot);
                    const sel = selectedSlot === slot;
                    return (
                      <button key={slot} type="button"
                        disabled={booked}
                        onClick={() => setSelectedSlot(sel ? null : slot)}
                        className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                          booked ? "bg-red-50 text-red-300 border border-red-100 cursor-not-allowed"
                            : sel ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                            : "bg-gray-50 text-gray-700 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
                        }`}>
                        {booked ? "Booked" : slot}
                      </button>
                    );
                  })}
                </div>
                {selectedSlot && (
                  <button type="button"
                    className="mt-4 w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black text-sm rounded-xl shadow-md shadow-blue-200 hover:from-blue-700 hover:to-indigo-700 transition-all active:scale-95">
                    Book {selectedDay} at {selectedSlot}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-1">
        {[
          { color: "bg-blue-100", label: "Available" },
          { color: "bg-red-50 border border-red-100", label: "Booked" },
          { color: "bg-gray-100", label: "Day off" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm ${color}`} />
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
