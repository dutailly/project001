import React from 'react';
import { Users, AlertCircle, Calendar, Clock, MapPin, Link2, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import ViewerTopic from './MeetingComponents/ViewerTopic';
import Topic from './MeetingComponents/Topic';
import Participants from './MeetingComponents/Participants';
import OutstandingIssues from './MeetingComponents/OutstandingIssues';
import NextMeeting from './MeetingComponents/NextMeeting';
import UrlList from './MeetingComponents/UrlList';

interface MeetingNoteProps {
  content: string;
  onContentChange: (content: string) => void;
  metadata: {
    participants?: string;
    topics?: Array<{
      id: string;
      name: string;
      description: string;
      decisions: Array<{ id: string; text: string; completed: boolean }>;
      tasks: Array<{ id: string; what: string; who: string; when: string }>;
    }>;
    issues?: Array<{ id: string; text: string }>;
    nextMeeting?: {
      date: string;
      time: string;
      location: string;
    };
    urls?: Array<{ id: string; url: string; description: string }>;
  };
  onMetadataChange: (metadata: any) => void;
  editable?: boolean;
}

export default function MeetingNote({
  metadata,
  onMetadataChange,
  editable = true
}: MeetingNoteProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bgBase = isDark ? 'bg-[#1e1e2f]' : 'bg-white';
  const bgHighlight = isDark ? 'bg-[#25262b]' : 'bg-gray-50';
  const borderColor = isDark ? 'border-gray-700/50' : 'border-gray-200';
  const textMutedColor = isDark ? 'text-gray-400' : 'text-gray-500';

  // Mode lecture seule
  if (!editable) {
    return (
      <div className="space-y-4">
        {/* Participants */}
        {metadata.participants && (
          <div className={`${bgHighlight} rounded-lg p-3 border ${borderColor}`}>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4" />
              <h3 className="text-sm font-medium">Participants</h3>
            </div>
            <div className="whitespace-pre-line text-sm">
              {metadata.participants}
            </div>
          </div>
        )}

        {/* Topics */}
        {metadata.topics && metadata.topics.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium px-1">Topics</h3>
            {metadata.topics.map((topic) => (
              <ViewerTopic key={topic.id} {...topic} />
            ))}
          </div>
        )}

        {/* Outstanding Issues */}
        {metadata.issues && metadata.issues.length > 0 && (
          <div className={`${bgHighlight} rounded-lg p-3 border ${borderColor}`}>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4" />
              <h3 className="text-sm font-medium">Outstanding Issues</h3>
            </div>
            <ul className="space-y-1">
              {metadata.issues.map((issue) => (
                <li key={issue.id} className="text-sm">{issue.text}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Next Meeting */}
        {metadata.nextMeeting && (
          <div className={`${bgHighlight} rounded-lg p-3 border ${borderColor}`}>
            <h3 className="text-sm font-medium mb-3">Next Meeting</h3>
            <div className="grid grid-cols-3 gap-4">
              {metadata.nextMeeting.date && (
                <div>
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className={textMutedColor}>Date</span>
                  </div>
                  <div className="text-sm">{metadata.nextMeeting.date}</div>
                </div>
              )}
              {metadata.nextMeeting.time && (
                <div>
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <Clock className="w-4 h-4" />
                    <span className={textMutedColor}>Time</span>
                  </div>
                  <div className="text-sm">{metadata.nextMeeting.time}</div>
                </div>
              )}
              {metadata.nextMeeting.location && (
                <div>
                  <div className="flex items-center gap-2 text-sm mb-1">
                    <MapPin className="w-4 h-4" />
                    <span className={textMutedColor}>Location</span>
                  </div>
                  <div className="text-sm">{metadata.nextMeeting.location}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* URLs */}
        {metadata.urls && metadata.urls.length > 0 && (
          <div className={`${bgHighlight} rounded-lg p-3 border ${borderColor}`}>
            <div className="flex items-center gap-2 mb-2">
              <Link2 className="w-4 h-4" />
              <h3 className="text-sm font-medium">URLs of Interest</h3>
            </div>
            <div className="space-y-2">
              {metadata.urls.map((url) => (
                <div key={url.id} className="flex items-center gap-4 text-sm">
                  <a
                    href={url.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#4783ff] hover:text-[#3064cc]"
                  >
                    {url.url}
                  </a>
                  {url.description && (
                    <span className={textMutedColor}>{url.description}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Mode édition
  const addTopic = () => {
    onMetadataChange({
      ...metadata,
      topics: [
        ...(metadata.topics || []),
        {
          id: crypto.randomUUID(),
          name: '',
          description: '',
          decisions: [],
          tasks: []
        }
      ]
    });
  };

  return (
    <div className="space-y-6">
      {/* Participants */}
      <Participants
        value={metadata.participants || ''}
        onChange={(value) => onMetadataChange({ ...metadata, participants: value })}
      />

      {/* Topics */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Topics</h3>
          <button
            type="button"
            onClick={addTopic}
            className="flex items-center gap-1 text-[#4783ff] hover:text-[#3064cc] text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Topic
          </button>
        </div>
        <div className="space-y-4">
          {(metadata.topics || []).map((topic, index) => (
            <Topic
              key={topic.id}
              {...topic}
              onNameChange={(name) => {
                const newTopics = [...(metadata.topics || [])];
                newTopics[index] = { ...newTopics[index], name };
                onMetadataChange({ ...metadata, topics: newTopics });
              }}
              onDescriptionChange={(description) => {
                const newTopics = [...(metadata.topics || [])];
                newTopics[index] = { ...newTopics[index], description };
                onMetadataChange({ ...metadata, topics: newTopics });
              }}
              onDecisionsChange={(decisions) => {
                const newTopics = [...(metadata.topics || [])];
                newTopics[index] = { ...newTopics[index], decisions };
                onMetadataChange({ ...metadata, topics: newTopics });
              }}
              onTasksChange={(tasks) => {
                const newTopics = [...(metadata.topics || [])];
                newTopics[index] = { ...newTopics[index], tasks };
                onMetadataChange({ ...metadata, topics: newTopics });
              }}
              onDelete={() => {
                const newTopics = [...(metadata.topics || [])];
                newTopics.splice(index, 1);
                onMetadataChange({ ...metadata, topics: newTopics });
              }}
            />
          ))}
        </div>
      </div>

      {/* Outstanding Issues */}
      <OutstandingIssues
        issues={metadata.issues || []}
        onChange={(issues) => onMetadataChange({ ...metadata, issues })}
      />

      {/* Next Meeting */}
      <NextMeeting
        date={metadata.nextMeeting?.date || ''}
        time={metadata.nextMeeting?.time || ''}
        location={metadata.nextMeeting?.location || ''}
        onDateChange={(date) => 
          onMetadataChange({ 
            ...metadata, 
            nextMeeting: { ...metadata.nextMeeting, date } 
          })
        }
        onTimeChange={(time) => 
          onMetadataChange({ 
            ...metadata, 
            nextMeeting: { ...metadata.nextMeeting, time } 
          })
        }
        onLocationChange={(location) => 
          onMetadataChange({ 
            ...metadata, 
            nextMeeting: { ...metadata.nextMeeting, location } 
          })
        }
      />

      {/* URLs */}
      <UrlList
        urls={metadata.urls || []}
        onChange={(urls) => onMetadataChange({ ...metadata, urls })}
      />
    </div>
  );
}