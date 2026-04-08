import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManagePermissions = () => {
    const [permissions, setPermissions] = useState([]);

    useEffect(() => {
        axios.get('/api/admin/permissions')
            .then(response => setPermissions(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h1>Manage Permissions</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {permissions.map(permission => (
                        <tr key={permission.id}>
                            <td>{permission.id}</td>
                            <td>{permission.name}</td>
                            <td>
                                <button>Edit</button>
                                <button>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManagePermissions;