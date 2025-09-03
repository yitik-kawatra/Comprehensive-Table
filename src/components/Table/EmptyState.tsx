import React from "react";

export const EmptyState: React.FC<{ message?: string }> = ({ message }) => (
  <tbody>
    <tr>
      <td colSpan={100} className="text-center py-6 text-gray-500">
        {message || "No data available"}
      </td>
    </tr>
  </tbody>
);
