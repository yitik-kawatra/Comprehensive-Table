import React from "react";

interface LoadingStateProps {
  rows: number;
  columns: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ rows, columns }) => (
  <tbody>
    {Array.from({ length: rows }).map((_, idx) => (
      <tr key={idx} className="animate-pulse">
        {Array.from({ length: columns }).map((_, cIdx) => (
          <td key={cIdx} className="px-3 py-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </td>
        ))}
      </tr>
    ))}
  </tbody>
);
