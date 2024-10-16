import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Card, CardBody, CardHeader, Button } from "@nextui-org/react";

const Home = () => {
    const [profile, setProfile] = useState(null);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfileAndEvents = async () => {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                window.location.href = '/login';
                return;
            }

            try {
                const profileResponse = await axios.get('api/profile/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setProfile(profileResponse.data);

                // Fetch events for the user's groups
                const eventsResponse = await axios.get('api/groups/events/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setEvents(eventsResponse.data);
            } catch (err) {
                setError('Failed to fetch data');
                console.error('Error:', err);
            }
        };

        fetchProfileAndEvents();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
    };

    if (error) return <div>Error: {error}</div>;
    if (!profile) return <div>Loading...</div>;

    return (
        <div className="p-4">
            <Card className="mb-4">
                <CardHeader>
                    <h1 className="text-2xl">Welcome, {profile.user.username}!</h1>
                </CardHeader>
                <CardBody>
                    <h2 className="text-xl mb-2">Your Profile</h2>
                    <p>Email: {profile.user.email}</p>
                    {profile.age && <p>Age: {profile.age}</p>}
                    <Button onClick={handleLogout} color="danger" className="mt-4">Logout</Button>
                </CardBody>
            </Card>

            <Card>
                <CardHeader>
                    <h2 className="text-xl">Your Calendar</h2>
                </CardHeader>
                <CardBody>
                    <Calendar 
                        events={events.map(event => ({
                            id: event.id,
                            title: event.event_title,
                            start: new Date(event.event_start_date),
                            end: new Date(event.event_end_date),
                        }))}
                        onChange={(date) => console.log(date)}
                    />
                </CardBody>
            </Card>
        </div>
    );
};

export default Home;