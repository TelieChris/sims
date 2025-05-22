import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  // Static welcome message (no session check)
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Welcome to the Spare Parts Management System!</h1>
      </header>

      <nav className="mb-8">
        <ul className="flex space-x-6 text-blue-600 font-semibold">
          <li>
            <Link to="/">Spare Parts</Link>
          </li>
          <li>
            <Link to="/stockin">Stock In</Link>
          </li>
          <li>
            <Link to="/stockout">Stock Out</Link>
          </li>
          <li>
            <Link to="/report">Reports</Link>
          </li>
        </ul>
      </nav>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded shadow p-6 text-center">
          <h2 className="text-2xl font-semibold mb-2">120</h2>
          <p>Total Spare Parts</p>
        </div>
        <div className="bg-white rounded shadow p-6 text-center">
          <h2 className="text-2xl font-semibold mb-2">80</h2>
          <p>Stock In</p>
        </div>
        <div className="bg-white rounded shadow p-6 text-center">
          <h2 className="text-2xl font-semibold mb-2">40</h2>
          <p>Stock Out</p>
        </div>
      </section>
    </div>
  );
}
