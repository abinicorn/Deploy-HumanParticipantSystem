import { createContext, useState } from 'react';

export const DataGridContext = createContext();

export function DataGridProvider({ children }) {
    const [selectRowsByEmails, setSelectRowsByEmails] = useState(false); // is user using the select rows by email function
    const [inputEmails, setInputEmails] = useState(''); // inputed string

    //datagrid models
    const [sortModel, setSortModel] = useState([]);
    const [filterModel, setFilterModel] = useState({ items: [] });
    const [pageModel, setPageModel] = useState({
        page: 0,
        pageSize: 100
    }); 
    const [columnVisibility, setColumnVisibility] = useState({
        note: false,
        delete: false
    });

    const contextValue = {
        selectRowsByEmails, setSelectRowsByEmails,
        inputEmails, setInputEmails,
        sortModel, setSortModel,
        filterModel, setFilterModel,
        pageModel, setPageModel,
        columnVisibility, setColumnVisibility
    };

    return (
        <DataGridContext.Provider value={contextValue}>
            {children}
        </DataGridContext.Provider>
    );
}
