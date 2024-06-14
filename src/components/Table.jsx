import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { saveAs } from "file-saver";

const Table = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch your data here
        fetchData();
    }, []);

    const fetchData = () => {
        // Simulated data fetching
        setTimeout(() => {
            const data = [
                { id: 1, name: "John", age: 30, email: "john@example.com" },
                { id: 2, name: "Jane", age: 25, email: "jane@example.com" },
                { id: 3, name: "Doe", age: 40, email: "doe@example.com" }
                // Add more data as needed
            ];
            setData(data);
            setLoading(false);
        }, 1000);
    };

    const columns = [
        {
            name: "ID",
            selector: data => data.id,
            sortable: true
        },
        {
            name: "Name",
            selector: data => data.name,
            sortable: true
        },
        {
            name: "Age",
            selector: data => data.age,
            sortable: true
        },
        {
            name: "Email",
            selector: data => data.email,
            sortable: true
        }
    ];

    const exportToExcel = () => {
        const csv = data.map(item => Object.values(item).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        saveAs(blob, "data.csv");
    };

    return (
        <div>
            <div className="flex flex-row justify-between">
                <div className="justify-start">
                    <button className="flex items-center bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mb-4">
                        New
                        <svg className="w-4 h-4 fill-current opacity-150 shrink-0 ml-2" viewBox="0 0 16 16">
                            <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                        </svg>
                    </button>
                </div>           
                <div className="justify-end">               
                    <button onClick={exportToExcel} className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
                        Export to Excel
                    </button>
                </div>
            </div>           
            <DataTable
                title="User Data"
                columns={columns}
                data={data}
                pagination
                // paginationPerPage={5}
                progressPending={loading}
                // paginationRowsPerPageOptions={[5,10,15,20,25,30]}
                striped
                highlightOnHover
                pointerOnHover
                sortIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 0 1 .707.293l4 4a1 1 0 0 1-1.414 1.414L11 6.414V16a1 1 0 1 1-2 0V6.414l-2.293 2.293a1 1 0 1 1-1.414-1.414l4-4A1 1 0 0 1 10 3z" clipRule="evenodd" /></svg>}
                // customStyles={{
                //     rowsPerPageOption: {
                //       display: 'none'
                //     }
                //   }
                // }
            />
        </div>
    );
};

export default Table;
