import React, { useState } from 'react';
import axios from 'axios';

const CreateGroup = () => {
    const [groupName, setGroupName] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/groups/', { name: groupName });
            setSuccess(true);
            setGroupName(''); 
        } catch (err) {
            setError('Failed to create group');
            console.error('Error:', err);
        }
    };

    return (
        <div>
            <h2>Create Group</h2>
            {error && <div>Error: {error}</div>}
            {success && <div>Group created successfully!</div>}
            <form onSubmit={handleCreateGroup}>
                <input 
                    type="text" 
                    placeholder="Group Name" 
                    value={groupName} 
                    onChange={(e) => setGroupName(e.target.value)} 
                    required 
                />
                <button type="submit">Create Group</button>
            </form>
        </div>
    );
};

export default CreateGroup;
