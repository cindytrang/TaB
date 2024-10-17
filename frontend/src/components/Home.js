import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Card, CardBody, CardHeader, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Select, SelectItem } from "@nextui-org/react";
import { parseISO, format, isValid, isSameDay } from 'date-fns';
import { today, getLocalTimeZone, isWeekend} from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";
import EventList from './EventList';
import NewsSection from './NewsSection';
import { CalendarIcon, MapPinIcon, FlagIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const safeParseISO = (dateString) => {
    if (!dateString) return null;
    const parsedDate = parseISO(dateString);
    return isValid(parsedDate) ? parsedDate : null;
};

const Home = () => {
    const [profile, setProfile] = useState(null);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groupMembers, setGroupMembers] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [error, setError] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [focusedDate, setFocusedDate] = useState(today(getLocalTimeZone()));
    const [selectedDate, setSelectedDate] = useState(today(getLocalTimeZone()));
    const [newGroupName, setNewGroupName] = useState('');
    const [newEvent, setNewEvent] = useState({
        event_title: '',
        event_start_date: '',
        event_end_date: '',
        event_description: '',
        event_location: '',
        event_priority: null, 
        event_status: ''
    });
    const { locale } = useLocale();
    const { isOpen: isCreateGroupOpen, onOpen: onCreateGroupOpen, onClose: onCreateGroupClose } = useDisclosure();
    const { isOpen: isAddMemberOpen, onOpen: onAddMemberOpen, onClose: onAddMemberClose } = useDisclosure();
    const { isOpen: isCreateEventOpen, onOpen: onCreateEventOpen, onClose: onCreateEventClose } = useDisclosure();
    const fakeNews = [
        { id: 1, title: "Traffic Alert: Major Delays on Highway 101", content: "A multi-vehicle accident has caused significant delays on Highway 101. Commuters are advised to seek alternate routes." },
        { id: 2, title: "Weather Warning: Heavy Rain Expected", content: "Meteorologists predict heavy rainfall over the next 48 hours. Residents are urged to prepare for potential flooding." },
        { id: 3, title: "New Business District Opening Ceremony", content: "The mayor will attend the ribbon-cutting ceremony for the newly developed business district downtown." }
    ];
    const [isUpdateEventOpen, setIsUpdateEventOpen] = useState(false);
    const [eventToUpdate, setEventToUpdate] = useState(null);

    useEffect(() => {
        fetchProfileAndData();
    }, []);

    useEffect(() => {
        if (selectedGroup) {
            fetchGroupData();
        }
    }, [selectedGroup]);

    useEffect(() => {
        filterEvents(selectedDate);
    }, [allEvents, selectedDate]);

    const fetchProfileAndData = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            window.location.href = '/login';
            return;
        }

        try {
            const [profileResponse, groupsResponse, usersResponse] = await Promise.all([
                axios.get('api/profile/', { headers: { 'Authorization': `Token ${token}` } }),
                axios.get('api/groups/', { headers: { 'Authorization': `Token ${token}` } }),
                axios.get('api/users/', { headers: { 'Authorization': `Token ${token}` } })
            ]);

            setProfile(profileResponse.data);
            setGroups(groupsResponse.data);
            setAllUsers(usersResponse.data);
        } catch (err) {
            setError('Failed to fetch data');
            console.error('Error:', err);
        }
    };

    const fetchGroupData = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const [eventsResponse, membersResponse] = await Promise.all([
                axios.get(`api/groups/${selectedGroup}/events/`, { headers: { 'Authorization': `Token ${token}` } }),
                axios.get(`api/groups/${selectedGroup}/members/`, { headers: { 'Authorization': `Token ${token}` } })
            ]);

            const events = eventsResponse.data.map(event => ({
                ...event,
                start: safeParseISO(event.event_start_date),
                end: safeParseISO(event.event_end_date),
                title: event.event_title,
            }));

            setAllEvents(events);
            setGroupMembers(membersResponse.data);
        } catch (err) {
            setError('Failed to fetch group data');
            console.error('Error:', err);
        }
    };

    const isDateUnavailable = (date) => {
        const formattedDate = format(date.toDate(getLocalTimeZone()), 'yyyy-MM-dd');
        const hasEvent = allEvents.some(event => 
            event.start && format(event.start, 'yyyy-MM-dd') === formattedDate
        );
        return !hasEvent;
    };

    const filterEvents = (date) => {
        const filtered = allEvents.filter(event => 
            event.start && isSameDay(event.start, date.toDate(getLocalTimeZone()))
        );
        setFilteredEvents(filtered);
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setFocusedDate(date);
    };

    const handleCreateGroup = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.post('api/groups/', { name: newGroupName }, {
                headers: { 'Authorization': `Token ${token}` }
            });
            setGroups([...groups, response.data]);
            setNewGroupName('');
            onCreateGroupClose();
        } catch (err) {
            setError('Failed to create group');
            console.error('Error:', err);
        }
    };
    
    const handleAddMember = async () => {
        const token = localStorage.getItem('authToken');
        try {
            await axios.post(`api/groups/${selectedGroup}/add_member/`, { user_id: selectedUser }, {
                headers: { 'Authorization': `Token ${token}` }
            });
            setSelectedUser(null);
            onAddMemberClose();
            fetchGroupData();
        } catch (err) {
            setError('Failed to add member');
            console.error('Error:', err);
        }
    };

    const handleGroupSelect = (groupId) => {
        setSelectedGroup(groupId);
    };

    const handleCreateEvent = async () => {
        const token = localStorage.getItem('authToken');
        try {
            const response = await axios.post(`api/groups/${selectedGroup}/events/`, newEvent, {
                headers: { 'Authorization': `Token ${token}` }
            });
            setAllEvents(prevEvents => [...prevEvents, {
                ...response.data,
                start: safeParseISO(response.data.event_start_date),
                end: safeParseISO(response.data.event_end_date),
                title: response.data.event_title,
            }]);
            setNewEvent({
                event_title: '',
                event_start_date: '',
                event_end_date: '',
                event_description: '',
                event_location: '',
                event_priority: null,
                event_status: ''
            });
            onCreateEventClose();
        } catch (err) {
            setError('Failed to create event');
            console.error('Error:', err);
        }
    };

    const handleUpdateEvent = (event) => {
        setEventToUpdate(event);
        setIsUpdateEventOpen(true);
      };
    
    const handleDeleteEvent = async (eventId) => {
    const token = localStorage.getItem('authToken');
    try {
        await axios.delete(`api/groups/${selectedGroup}/events/${eventId}/`, {
        headers: { 'Authorization': `Token ${token}` }
        });
        setAllEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    } catch (err) {
        setError('Failed to delete event');
        console.error('Error:', err);
    }
    };

    const handleUpdateEventSubmit = async () => {
    const token = localStorage.getItem('authToken');
    try {
        const response = await axios.put(`api/groups/${selectedGroup}/events/${eventToUpdate.id}/`, eventToUpdate, {
        headers: { 'Authorization': `Token ${token}` }
        });
        setIsUpdateEventOpen(false);
        setEventToUpdate(null);
        fetchGroupData();
    } catch (err) {
        setError('Failed to update event');
        console.error('Error:', err);
    }
    };

    const handleEventInputChange = (name, value) => {
        const finalValue = name === 'event_priority' ? parseInt(value, 10) : value;
        setNewEvent(prev => ({ ...prev, [name]: finalValue }));
    };

    if (error) return <div>Error: {error}</div>;
    if (!profile) return <div>Loading...</div>;

    return (
        <div className="p-4">
            <Card className="mb-4">
                <CardHeader>
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                    <h1 className="text-2xl">Enjoy Your Amazing Day!</h1>
                </CardHeader>
                <CardBody>
                    <p>User details: </p>
                    <p>Email: {profile.user.email}</p>
                    {profile.age && <p>Age: {profile.age}</p>}
                </CardBody>
            </Card>

            <Card className="mb-4">
                <CardHeader>
                <CalendarIcon className="h-5 w-5 mr-2" />
                    <h2 className="text-xl font-bold">Switch Calendar</h2>
                </CardHeader> 
                <CardBody>
                    <Select 
                        placeholder="Select a group" 
                        onChange={(e) => handleGroupSelect(e.target.value)}
                        className="mt-2"
                    >
                        {groups.map((group) => (
                            <SelectItem key={group.id} value={group.id}>
                                {group.name}
                            </SelectItem>
                        ))}
                    </Select>
                    <Button onClick={onCreateGroupOpen} color="primary" className="mr-2">Create Group</Button>
                    <Button 
                        onClick={onAddMemberOpen} 
                        color="secondary" 
                        className="mt-2 mr-2" 
                        disabled={!selectedGroup}
                    >
                        Add Member to Selected Group
                    </Button>
                    <Button 
                        onClick={onCreateEventOpen} 
                        color="success" 
                        className="mt-2" 
                        disabled={!selectedGroup}
                    >
                        Create Event
                    </Button>
                </CardBody>
            </Card>

            {selectedGroup && (
                <Card className="mb-4">
                    <CardHeader>
                        <img src="profile.jpg"  width={40} ></img>
                        <h2 className="text-xl">Group Members</h2>
                    </CardHeader>
                    <CardBody>
                        <ul>
                            {groupMembers.map((member) => (
                                <li key={member.id}>{member.username} ({member.email})</li>
                            ))}
                        </ul>
                    </CardBody>
                </Card>
            )}

            <Card className="mb-6">
                <CardHeader>
                <MapPinIcon className="h-5 w-5 mr-2" />
                    <h2 className="text-xl font-bold">Events and News</h2>
                </CardHeader>
                <CardBody>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-1/2">
                            <h3 className="text-lg font-semibold mb-10">Calendar</h3>
                            <Calendar
                                aria-label="Event Calendar"
                                showMonthAndYearPickers={true}
                                focusedValue={focusedDate}
                                value={selectedDate}
                                onChange={handleDateSelect}
                                isDateUnavailable={isDateUnavailable}
                                className="w-full"
                                visibleMonths={3} 
                            />
                        </div>
                        <div className="w-full md:w-1/2">
                            <h3 className="text-lg font-semibold mb-2">News</h3>
                            {/* TODO news component here */}
                            <NewsSection fakeNews={fakeNews} />
                        </div>
                    </div>
                </CardBody>
            </Card>


            <Card>
                <CardHeader>
                <FlagIcon className="h-5 w-5 mr-2" />
                    <h2 className="text-xl font-bold text-xl">Events for {format(selectedDate.toDate(getLocalTimeZone()), 'MMMM d, yyyy')}</h2>
                </CardHeader>
                <CardBody>
                    {filteredEvents.length > 0 ? (
                        <EventList events={filteredEvents} onUpdateEvent={handleUpdateEvent} onDeleteEvent={handleDeleteEvent} />
                    ) : (
                        <p>No events for this date.</p>
                    )}
                </CardBody>
            </Card>

            <Modal isOpen={isCreateGroupOpen} onClose={onCreateGroupClose}>
                <ModalContent>
                    <ModalHeader>Create New Group</ModalHeader>
                    <ModalBody>
                        <Input 
                            placeholder="Group Name" 
                            value={newGroupName} 
                            onChange={(e) => setNewGroupName(e.target.value)} 
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={handleCreateGroup}>Create</Button>
                        <Button color="danger" onClick={onCreateGroupClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isAddMemberOpen} onClose={onAddMemberClose}>
                <ModalContent>
                    <ModalHeader>Add Member to Group</ModalHeader>
                    <ModalBody>
                        <Select 
                            placeholder="Select a user" 
                            onChange={(e) => setSelectedUser(e.target.value)}
                        >
                            {allUsers.map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                    {user.username} ({user.email})
                                </SelectItem>
                            ))}
                        </Select>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={handleAddMember} disabled={!selectedUser}>Add</Button>
                        <Button color="danger" onClick={onAddMemberClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isCreateEventOpen} onClose={onCreateEventClose}>
                <ModalContent>
                    <ModalHeader>Create New Event</ModalHeader>
                    <ModalBody>
                        <Input 
                            placeholder="Event Title" 
                            name="event_title"
                            value={newEvent.event_title} 
                            onChange={(e) => handleEventInputChange('event_title', e.target.value)} 
                            className="mb-2"
                        />
                        <Input 
                            placeholder="Start Date" 
                            name="event_start_date"
                            type="datetime-local"
                            value={newEvent.event_start_date} 
                            onChange={(e) => handleEventInputChange('event_start_date', e.target.value)} 
                            className="mb-2"
                        />
                        <Input 
                            placeholder="End Date" 
                            name="event_end_date"
                            type="datetime-local"
                            value={newEvent.event_end_date} 
                            onChange={(e) => handleEventInputChange('event_end_date', e.target.value)} 
                            className="mb-2"
                        />
                        <Input 
                            placeholder="Event Description" 
                            name="event_description"
                            value={newEvent.event_description} 
                            onChange={(e) => handleEventInputChange('event_description', e.target.value)} 
                            className="mb-2"
                        />
                        <Input 
                            placeholder="Event Location" 
                            name="event_location"
                            value={newEvent.event_location} 
                            onChange={(e) => handleEventInputChange('event_location', e.target.value)} 
                            className="mb-2"
                        />
                        <Select 
                            placeholder="Event Priority" 
                            selectedKeys={newEvent.event_priority !== null ? [newEvent.event_priority.toString()] : []}
                            onChange={(e) => handleEventInputChange('event_priority', e.target.value)}
                            className="mb-2"
                        >
                            <SelectItem key="1" value="1">Low</SelectItem>
                            <SelectItem key="2" value="2">Medium</SelectItem>
                            <SelectItem key="3" value="3">High</SelectItem>
                        </Select>
                        <Select 
                            placeholder="Event Status" 
                            selectedKeys={newEvent.event_status ? [newEvent.event_status] : []}
                            onChange={(e) => handleEventInputChange('event_status', e.target.value)}
                            className="mb-2"
                        >
                            <SelectItem key="scheduled" value="scheduled">Scheduled</SelectItem>
                            <SelectItem key="in_progress" value="in_progress">In Progress</SelectItem>
                            <SelectItem key="completed" value="completed">Completed</SelectItem>
                            <SelectItem key="cancelled" value="cancelled">Cancelled</SelectItem>
                        </Select>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={handleCreateEvent}>Create</Button>
                        <Button color="danger" onClick={onCreateEventClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isUpdateEventOpen} onClose={() => setIsUpdateEventOpen(false)}>
            <ModalContent>
            <ModalHeader>Update Event</ModalHeader>
            <ModalBody>
                {eventToUpdate && (
                <>
                    <Input 
                    placeholder="Event Title" 
                    value={eventToUpdate.event_title} 
                    onChange={(e) => setEventToUpdate({...eventToUpdate, event_title: e.target.value})} 
                    className="mb-2"
                    />
                    <Input 
                    placeholder="Start Date" 
                    type="datetime-local"
                    value={eventToUpdate.event_start_date} 
                    onChange={(e) => setEventToUpdate({...eventToUpdate, event_start_date: e.target.value})} 
                    className="mb-2"
                    />
                    <Input 
                    placeholder="End Date" 
                    type="datetime-local"
                    value={eventToUpdate.event_end_date} 
                    onChange={(e) => setEventToUpdate({...eventToUpdate, event_end_date: e.target.value})} 
                    className="mb-2"
                    />
                </>
                )}
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={handleUpdateEventSubmit}>Update</Button>
                <Button color="danger" onClick={() => setIsUpdateEventOpen(false)}>Cancel</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
        </div>
    );
};

export default Home;