import DateFnsUtils from '@date-io/date-fns';
import { MenuItem, Select } from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import React from 'react';
import './FilterBar.css'

interface FilterBarProps {
    dateFilter: any,
    setDateFilter: React.Dispatch<React.SetStateAction<any>>
    stateFilter: number,
    setStateFiter: React.Dispatch<React.SetStateAction<any>>
}

export default function FilterBar(Props: FilterBarProps) {

    const handleStateChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        Props.setStateFiter(event.target.value)
      };

    return (
        <div className='filter-wrapper'>
            <div className='bar-header'/>
            <h4 className='bar-element'>Filter List</h4>

            <Select label='State' variant='outlined' value={Props.stateFilter} onChange={handleStateChange} className='bar-element'>
                <MenuItem value={0}>Filter by state</MenuItem>
                <MenuItem value={1}>Todo</MenuItem>
                <MenuItem value={2}>In-progress</MenuItem>
                <MenuItem value={3}>Done</MenuItem>
            </Select>

            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker label='Filter by date' inputVariant='outlined' clearable disablePast className='bar-element' value={Props.dateFilter} onChange={Props.setDateFilter} />
            </MuiPickersUtilsProvider> 
        </div>
    )
}
