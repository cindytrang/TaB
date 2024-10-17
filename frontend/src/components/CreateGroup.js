import React, { useState } from 'react';
import axios from 'axios';

const CreateGroup = () => {
    const [groupName, setGroupName] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        
        if (groupName.trim().length < 3) {
            setError('Group name must be at least 3 characters long');
            return;
        }

        try {
            await axios.post('/api/groups/', { name: groupName });
            setSuccess(true);
            setGroupName(''); 
        } catch (err) {
            setError('Failed to create group: ' + (err.response?.data?.detail || err.message));
        }
    };

    const handleInputChange = (e) => {
        setGroupName(e.target.value);
        setError(null);
        setSuccess(false);
    };

    return (
        <div>
            <h2>Create Group</h2>
            {error && <div style={{color: 'red'}}>{error}</div>}
            {success && <div style={{color: 'green'}}>Group created successfully!</div>}
            <form onSubmit={handleCreateGroup}>
                <input 
                    type="text" 
                    placeholder="Group Name" 
                    value={groupName} 
                    onChange={handleInputChange} 
                    required 
                    minLength={3}
                />
                <button type="submit">Create Group</button>
            </form>
        </div>
    );
};

export default CreateGroup;