import React, { useState } from 'react';
import UserCount from './UserCount';
import Collection from './Collection';
import CalendarComponent from './CalendarComponent';
import Table from './Table';
import './Dashboard.css';

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [totalAmount, setTotalAmount] = useState(0); // State for total amount

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  return (
    <>
      <div className="title">Dashboard</div>
      <div id="Container">
        <div id="User">
          <UserCount />
          <Collection totalCollection={totalAmount} /> {/* Pass total amount to Collection */}
        </div>
        <div id="Content">
          <div id="Table">
            <Table selectedMonth={selectedMonth} setTotalAmount={setTotalAmount} /> {/* Pass setTotalAmount to Table */}
          </div>
          <div id="Calendar">
            <CalendarComponent selectedMonth={selectedMonth} onMonthChange={handleMonthChange} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
