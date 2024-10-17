import React from 'react';
import { Card, CardBody, Chip, Divider, Button } from "@nextui-org/react";
import { CalendarIcon, MapPinIcon, FlagIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const priorityColors = {
  1: "success",
  2: "warning",
  3: "danger"
};

const statusColors = {
  scheduled: "default",
  in_progress: "primary",
  completed: "success",
  cancelled: "danger"
};

const EventList = ({ events, onUpdateEvent, onDeleteEvent }) => {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id} className={`${event.color === '#3182ce' ? 'border-grey-200' : 'border-grey-200'} border-2`}>
          <CardBody>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold">{event.title}</h3>
              <Chip color={event.color === '#3182ce' ? "primary" : "danger"} variant="flat" size="sm">
                {event.color === '#3182ce' ? 'Personal' : 'Group'}
              </Chip>
            </div>
            <Divider className="my-2" />
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
                <span>Start: {new Date(event.start).toLocaleString()}</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
                <span>End: {new Date(event.end).toLocaleString()}</span>
              </div>
              <div className="flex items-center">
                <MapPinIcon className="w-4 h-4 mr-2 text-gray-500" />
                <span>Location: {event.event_location || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <FlagIcon className="w-4 h-4 mr-2 text-gray-500" />
                <Chip color={priorityColors[event.event_priority]} size="sm">
                  Priority: {event.event_priority}
                </Chip>
              </div>
              <div className="flex items-center col-span-2">
                <CheckCircleIcon className="w-4 h-4 mr-2 text-gray-500" />
                <Chip color={statusColors[event.event_status]} size="sm">
                  Status: {event.event_status}
                </Chip>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button size="sm" color="primary" onClick={() => onUpdateEvent(event)}>Update</Button>
              <Button size="sm" color="danger" onClick={() => onDeleteEvent(event.id)}>Delete</Button>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default EventList;