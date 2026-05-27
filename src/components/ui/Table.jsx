const Table = ({ columns, data, onRowClick, emptyMessage = 'No data to display' }) => {
  if (!data.length) {
    return (
      <div className="text-center py-12 text-on-surface-variant">
        <span className="material-symbols-outlined text-4xl text-outline mb-3 block">description</span>
        <p className="text-body-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low/50">
            {columns.map((col) => (
              <th key={col.key} className={`px-lg py-md text-label-sm uppercase tracking-wider text-outline ${col.className || ''}`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/30">
          {data.map((row, i) => (
            <tr
              key={row.id || i}
              onClick={() => onRowClick?.(row)}
              className={`${onRowClick ? 'cursor-pointer hover:bg-surface-container-low/40' : ''} transition-colors group`}
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-lg py-lg ${col.className || ''}`}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
