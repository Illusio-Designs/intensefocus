import React, { useState, useRef, useEffect } from 'react';
import { 
  CalendarToday, 
  KeyboardArrowLeft, 
  KeyboardArrowRight,
  Clear
} from '@mui/icons-material';
import '../../styles/components/common/DatePicker.css';

const DatePicker = ({ 
  value, 
  onChange, 
  placeholder = 'Select date', 
  format = 'DD/MM/YYYY',
  minDate,
  maxDate,
  disabled = false,
  className = '',
  showClear = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
  const [viewMode, setViewMode] = useState('days'); // 'days', 'months', 'years'
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
    }
  }, [value]);

  const formatDate = (date) => {
    if (!date) return '';
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return format
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', year);
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateDisabled = (date) => {
    if (minDate && date < new Date(minDate)) return true;
    if (maxDate && date > new Date(maxDate)) return true;
    return false;
  };

  const isSameDate = (date1, date2) => {
    if (!date1 || !date2) return false;
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const handleDateSelect = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (!isDateDisabled(newDate)) {
      setSelectedDate(newDate);
      onChange && onChange(newDate);
      setIsOpen(false);
    }
  };

  const handleMonthSelect = (month) => {
    setCurrentDate(new Date(currentDate.getFullYear(), month, 1));
    setViewMode('days');
  };

  const handleYearSelect = (year) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setViewMode('months');
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const navigateYear = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(newDate.getFullYear() + direction);
    setCurrentDate(newDate);
  };

  const clearDate = () => {
    setSelectedDate(null);
    onChange && onChange(null);
  };

  const renderDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isDisabled = isDateDisabled(date);
      const isSelected = selectedDate && isSameDate(date, selectedDate);
      const isToday = isSameDate(date, new Date());

      days.push(
        <div
          key={day}
          className={`calendar-day ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => !isDisabled && handleDateSelect(day)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const renderMonths = () => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    return months.map((month, index) => (
      <div
        key={month}
        className="calendar-month"
        onClick={() => handleMonthSelect(index)}
      >
        {month}
      </div>
    ));
  };

  const renderYears = () => {
    const currentYear = currentDate.getFullYear();
    const years = [];
    
    for (let year = currentYear - 10; year <= currentYear + 10; year++) {
      years.push(
        <div
          key={year}
          className={`calendar-year ${year === currentYear ? 'current' : ''}`}
          onClick={() => handleYearSelect(year)}
        >
          {year}
        </div>
      );
    }

    return years;
  };

  const renderHeader = () => {
    if (viewMode === 'days') {
      return (
        <div className="calendar-header">
          <button onClick={() => navigateMonth(-1)} className="nav-btn">
            <KeyboardArrowLeft />
          </button>
          <div className="current-date">
            <span 
              className="month-year" 
              onClick={() => setViewMode('months')}
            >
              {currentDate.toLocaleDateString('en-US', { month: 'long' })}
            </span>
            <span 
              className="year" 
              onClick={() => setViewMode('years')}
            >
              {currentDate.getFullYear()}
            </span>
          </div>
          <button onClick={() => navigateMonth(1)} className="nav-btn">
            <KeyboardArrowRight />
          </button>
        </div>
      );
    } else if (viewMode === 'months') {
      return (
        <div className="calendar-header">
          <button onClick={() => navigateYear(-1)} className="nav-btn">
            <KeyboardArrowLeft />
          </button>
          <div className="current-date">
            <span className="year">{currentDate.getFullYear()}</span>
          </div>
          <button onClick={() => navigateYear(1)} className="nav-btn">
            <KeyboardArrowRight />
          </button>
        </div>
      );
    } else {
      return (
        <div className="calendar-header">
          <button onClick={() => navigateYear(-20)} className="nav-btn">
            <KeyboardArrowLeft />
          </button>
          <div className="current-date">
            <span className="year-range">
              {currentDate.getFullYear() - 10} - {currentDate.getFullYear() + 10}
            </span>
          </div>
          <button onClick={() => navigateYear(20)} className="nav-btn">
            <KeyboardArrowRight />
          </button>
        </div>
      );
    }
  };

  return (
    <div className={`date-picker ${className}`} ref={pickerRef}>
      <div className="date-input-container">
        <input
          type="text"
          className="date-input"
          value={formatDate(selectedDate)}
          placeholder={placeholder}
          readOnly
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        />
        <div className="date-input-icons">
          {showClear && selectedDate && (
            <button 
              className="clear-btn" 
              onClick={clearDate}
              disabled={disabled}
            >
              <Clear />
            </button>
          )}
          <button 
            className="calendar-btn" 
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
          >
            <CalendarToday />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="calendar-dropdown">
          <div className="calendar">
            {renderHeader()}
            
            {viewMode === 'days' && (
              <>
                <div className="calendar-weekdays">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="weekday">{day}</div>
                  ))}
                </div>
                <div className="calendar-days">
                  {renderDays()}
                </div>
              </>
            )}
            
            {viewMode === 'months' && (
              <div className="calendar-months">
                {renderMonths()}
              </div>
            )}
            
            {viewMode === 'years' && (
              <div className="calendar-years">
                {renderYears()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker; 