import React from "react";
import { useParams } from "react-router-dom";

interface TaskDetailPageProps {
  id?: string;
}

const TaskDetailPage: React.FC<TaskDetailPageProps> = ({ id: propId }) => {
  const params = useParams();
  const id = propId || params.id;
  return (
    <div className="w-full min-h-screen bg-white dark:bg-dark-bg p-6">
      <div className="mb-6 flex items-center gap-2">
        <span className="inline-block bg-blue-100 text-blue-600 rounded-full p-2">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="#2563eb" opacity="0.2" />
            <path
              d="M12 7v5l3 3"
              stroke="#2563eb"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="text-xl font-semibold">Holiday Updates Fields</span>
      </div>
      <div className="rounded-lg overflow-hidden mb-8">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80"
          alt="Holiday"
          className="w-full h-64 object-cover"
        />
      </div>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="business-centre"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Business Centre
          </label>
          <input
            id="business-centre"
            type="text"
            placeholder="Enter Value"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="event-date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Event Date
          </label>
          <div className="relative">
            <input
              id="event-date"
              type="date"
              placeholder="Enter Value"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path
                  d="M7 11h10M7 15h6M5 7h14v12a2 2 0 01-2 2H7a2 2 0 01-2-2V7z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
        <div>
          <label
            htmlFor="calendar-type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Calendar Type
          </label>
          <select
            id="calendar-type"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Enter Value</option>
            <option value="Type1">Type 1</option>
            <option value="Type2">Type 2</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="related-financial-centre"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Related Financial Centre
          </label>
          <select
            id="related-financial-centre"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Enter Value</option>
            <option value="Centre1">Centre 1</option>
            <option value="Centre2">Centre 2</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label
            htmlFor="comments"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Comments
          </label>
          <textarea
            id="comments"
            rows={3}
            placeholder="Enter Value"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </form>
    </div>
  );
};

export default TaskDetailPage;
