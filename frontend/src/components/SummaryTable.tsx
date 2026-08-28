import type { components } from "../types/api";

type ColumnSummary = components["schemas"]["ColumnSummary"];

function formatSummary(column: ColumnSummary): string {
  if (column.dtype === "numeric") {
    const mean = column.mean != null ? column.mean.toFixed(2) : "—";
    const std = column.std != null ? column.std.toFixed(2) : "—";
    return `μ ${mean} σ ${std}`;
  }
  return column.top_value != null ? `top: ${column.top_value} (${column.top_value_freq})` : "—";
}

interface SummaryTableProps {
  columns: ColumnSummary[];
}

/** Screen 2's left column (frontend.md). Numeric columns set in mono so the
 * figures line up -- ".claude/rules/frontend.md"'s load-bearing type choice. */
export function SummaryTable({ columns }: SummaryTableProps) {
  return (
    <div className="overflow-x-auto rounded-panel border border-rule bg-surface">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-rule text-xs uppercase tracking-wide text-muted">
            <th className="px-3 py-2 font-medium">Column</th>
            <th className="px-3 py-2 font-medium">Type</th>
            <th className="px-3 py-2 font-medium">Missing</th>
            <th className="px-3 py-2 font-medium">Unique</th>
            <th className="px-3 py-2 font-medium">Summary</th>
          </tr>
        </thead>
        <tbody>
          {columns.map((column) => (
            <tr key={column.name} className="border-b border-rule last:border-b-0">
              <td className="px-3 py-2 text-ink">
                {column.name}
                {column.is_target && (
                  <span className="ml-1 text-signal" aria-label="target column">
                    •
                  </span>
                )}
              </td>
              <td className="px-3 py-2 font-mono text-xs text-muted">{column.dtype}</td>
              <td className="px-3 py-2 font-mono text-ink">{(column.missing_pct * 100).toFixed(0)}%</td>
              <td className="px-3 py-2 font-mono text-ink">{column.unique_count}</td>
              <td className="px-3 py-2 font-mono text-ink">{formatSummary(column)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
