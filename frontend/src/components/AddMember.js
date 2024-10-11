import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddMember = ({ groupId }) => {
    const [userEmail, setUserEmail] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/users/');
                setUsers(response.data);
            } catch (err) {
                setError('Failed to fetch users');
                console.error('Error:', err);
            }
        };

        fetchUsers();
    }, []);

    const handleAddMember = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post(`api/groups/${groupId}/add_member/`, { email: userEmail });
            setSuccess(true);
            setUserEmail('');
        } catch (err) {
            setError('Failed to add member');
            console.error('Error:', err);
        }
    };

    return (
        <div>
            <h2>Add Member to Group</h2>
            {error && <div>Error: {error}</div>}
            {success && <div>Member added successfully!</div>}
            <form onSubmit={handleAddMember}>
                <select value={userEmail} onChange={(e) => setUserEmail(e.target.value)} required>
                    <option value="">Select User</option>
                    {users.map(user => (
                        <option key={user.id} value={user.email}>{user.username} - {user.email}</option>
                    ))}
                </select>
                <button type="submit">Add Member</button>
            </form>
        </div>
    );
};

export default AddMember;
