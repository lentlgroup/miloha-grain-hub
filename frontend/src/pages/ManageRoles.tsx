import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageRoles = () => {
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        axios.get('/api/admin/roles')
            .then(response => setRoles(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h1>Manage Roles</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.map(role => (
                        <tr key={role.id}>
                            <td>{role.id}</td>
                            <td>{role.name}</td>
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

export default ManageRoles;