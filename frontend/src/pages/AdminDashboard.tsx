import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    return (
        <div>
            <h1>Admin Dashboard</h1>
            <nav>
                <ul>
                    <li><Link to="/admin/users">Manage Users</Link></li>
                    <li><Link to="/admin/roles">Manage Roles</Link></li>
                    <li><Link to="/admin/permissions">Manage Permissions</Link></li>
                </ul>
            </nav>
        </div>
    );
};

export default AdminDashboard;