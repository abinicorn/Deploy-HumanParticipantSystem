import { createContext, useState, useContext } from 'react';

export const DataGridContext = createContext();

export function DataGridProvider({ children }) {
    const [selectRowsByEmails, setSelectRowsByEmails] = useState(false);
    const [inputEmails, setInputEmails] = useState('');
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
