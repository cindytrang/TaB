import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddMember = ({ groupId }) => {
    const [userId, setUserId] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/users/');
                setUsers(response.data);
            } catch (err) {
                setError('Failed to fetch users: ' + (err.response?.data?.detail || err.message));
            }
        };

        fetchUsers();
    }, []);

    const handleAddMember = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        try {
            await axios.post(`/api/groups/${groupId}/add_member/`, { user_id: userId });
            setSuccess(true);
            setUserId('');
        } catch (err) {
            setError('Failed to add member: ' + (err.response?.data?.detail || err.message));
        }
    };

    return (
        <div>
            <h2>Add Member to Group</h2>
            {error && <div style={{color: 'red'}}>{error}</div>}
            {success && <div style={{color: 'green'}}>Member added successfully!</div>}
            <form onSubmit={handleAddMember}>
                <select 
                    value={userId} 
                    onChange={(e) => {
                        setUserId(e.target.value);
                        setError(null);
                        setSuccess(false);
                    }} 
                    required
                >
                    <option value="">Select User</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>{user.username} - {user.email}</option>
                    ))}
                </select>
                <button type="submit">Add Member</button>
            </form>
        </div>
    );
};

export default AddMember;