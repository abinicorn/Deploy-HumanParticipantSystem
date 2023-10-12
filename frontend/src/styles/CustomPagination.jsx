import React, { useState } from 'react';
import { useGridApiContext, useGridSelector, gridPageCountSelector, GridPagination } from '@mui/x-data-grid';
import MuiPagination from '@mui/material/Pagination';
import {Button} from '@mui/material';

function Pagination(props) {
    const apiRef = useGridApiContext();
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  
    const [pageInput, setPageInput] = useState('');  // Used to store page numbers entered by the user
  
    const handlePageInputChange = (e) => {
      setPageInput(e.target.value);
    };
  
    const handleGoButtonClick = () => {
      const pageNum = parseInt(pageInput, 10);
      if (pageNum >= 1 && pageNum <= pageCount) {
        props.onPageChange(null, pageNum - 1);
      } else {
        alert('Invalid page number');
      }
    };
  
    return (
      <div style={{ display: 'flex', alignItems: 'center', width: '400px'}}>
        <MuiPagination
          color="primary"
          className={props.className}
          count={pageCount}
          siblingCount={2}
          // boundaryCount={3}
          page={props.page + 1}
          onChange={(event, newPage) => {
            props.onPageChange(event, newPage - 1);
          }}
        />
        <input
          type="number"
          value={pageInput}
          onChange={handlePageInputChange}
          style={{ marginLeft: '10px', width: '50px' }}
          placeholder="Go"
        />
        <Button 
          onClick={handleGoButtonClick} 
          variant="contained"
          style={{ 
            marginLeft: '5px',
            maxHeight: '20px',
            minWidth: '30px',
            fontSize: '10px',
          }}>Go</Button>
      </div>
    );
  }
  
export function CustomPagination(props) {
    return <GridPagination ActionsComponent={Pagination} {...props} />;
}