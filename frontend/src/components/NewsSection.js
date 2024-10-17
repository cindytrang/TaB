import React from 'react';
import { Card, CardBody, Divider } from "@nextui-org/react";
import { NewspaperIcon } from '@heroicons/react/24/outline';

const NewsSection = ({ fakeNews }) => {
  return (
    <div className="p-4 rounded-lg h-full overflow-y-auto">
      {fakeNews.length > 0 ? (
        fakeNews.map((news, index) => (
          <Card key={news.id} className="mb-4 shadow-sm">
            <CardBody>
              <div className="flex items-start">
                <NewspaperIcon className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-md text-gray-800">{news.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{news.content}</p>
                </div>
              </div>
            </CardBody>
            {index < fakeNews.length - 1 && <Divider className="my-2" />}
          </Card>
        ))
      ) : (
        <Card>
          <CardBody>
            <p className="text-center text-gray-500">No relevant news for the selected date.</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default NewsSection;