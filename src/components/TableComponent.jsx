import React, { useState, useEffect } from 'react';
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const TableComponent = ({ columns, data,total }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'ascending' });
  const [sortedData, setSortedData] = useState([...data]);

  useEffect(() => {
    let sortableData = [...data];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    setSortedData(sortableData);
  }, [data, sortConfig]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 overflow-x-auto">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {columns.map((column) => (
              <th key={column.accessor}  className="flex-row items-center justify-center py-2 px-4 border-b">
                 
               { column.accessor !=="actions" ?(
                  <div className="flex items-center justify-center">
                    {column.Header}
                    <svg onClick={() => handleSort(column.accessor)} xmlns="http://www.w3.org/2000/svg" className={`flex-end h-5 w-5 cursor-pointer ${sortConfig.direction === 'ascending' ? "rotate-0" : "rotate-180"}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 0 1 .707.293l4 4a1 1 0 0 1-1.414 1.414L11 6.414V16a1 1 0 1 1-2 0V6.414l-2.293 2.293a1 1 0 1 1-1.414-1.414l4-4A1 1 0 0 1 10 3z" clipRule="evenodd" /></svg>
                  </div>
               ) :(
                  column.Header
               )}
              </th>
            ))}
            {/* <th className="py-2 px-4 border-b">Actions</th> */}
          </tr>
        </thead>
        <tbody >
          {currentRows.map((row, index) => (
            <tr key={index}
            className={
              index % 2 === 0
                ? "bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                : "bg-white dark:bg-gray-800"
            }>
              {columns.map((column) => (
                <td key={column.accessor} className="py-2 px-4 border-b">
                 {column.accessor === "actions" ? (
                        <column.Cell row={{ ...row }} />
                      ) : (
                        row[column.accessor]
                      )
                    }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="relative flex items-center justify-between border-t border-gray-200 bg-white dark:bg-gray-900 px-4 py-3 sm:px-6">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  Total:
                  <span className="font-medium text-gray-500 dark:text-gray-400">
                    {total}
                  </span>
                </p>
              </div>
              <label>
                Rows per page:
                <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))} className="ml-1">
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
          </label>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <a href="#" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                    <span className="sr-only">Previous</span>
                    <AiOutlineLeft className="h-5 w-5" aria-hidden="true" />
                  </a>
                  <a
                    href="#"
                    aria-current="page"
                    className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    {currentPage}
                  </a>
                  <a
                    href="#"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(data.length / rowsPerPage)))}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    <span className="sr-only">Next</span>
                    <AiOutlineRight className="h-5 w-5" aria-hidden="true" />
                  </a>
                </nav>
              </div>
            </div>
      </div>
    </div>
  );
};

export default TableComponent;
