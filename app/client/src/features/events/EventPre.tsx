import { useRouter } from 'next/router';
import { fetchQuery, PreloadedQuery, usePreloadedQuery, useQueryLoader } from 'react-relay';
import { CountdownWrapper } from '@local/components/Countdown';
import { EventLiveQuery } from '@local/__generated__/EventLiveQuery.graphql';
import { EVENT_LIVE_QUERY } from './EventLive';
import { BroadcastMessageList } from '../events/BroadcastMessageList';
import { useEnvironment } from '@local/core';
import React from 'react';
import { EventContext } from './EventContext';

const styles = {
  justifyCenter: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%'
  },
  list: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    paddingTop: '40px'
  }
}

export interface PreloadedEventLiveProps {
    eventLiveQueryRef: PreloadedQuery<EventLiveQuery>;
}

export function EventPre({eventLiveQueryRef}: PreloadedEventLiveProps) {
    const router = useRouter()
    const { node } = usePreloadedQuery(EVENT_LIVE_QUERY, eventLiveQueryRef);    
    // used to create the countdown component
    const date = node?.startDateTime as Date
    // used to check whether the event is on-going
    const isActive = node?.isActive
    // used to route
    const eventId = router.query.id
    
    // route user to live event if event is on-going
    if (isActive) {
        // navigate back to /live once the event starts
        router.push('/events/' + eventId + '/live')
    }
    
    if (!node) return <h1>Loading Pre-Event Page...</h1>;

    return (
        <div style={styles.justifyCenter}>
            <div style={styles.justifyCenter}>
                <CountdownWrapper date={date} />
            </div>
            <div style={styles.list}>
                <EventContext.Provider value={{ eventId: node.id, isModerator: Boolean(node.isViewerModerator) }}>
                    <BroadcastMessageList fragmentRef={node} />
                </EventContext.Provider>
            </div>
        </div>
    )
}

export interface PreloadedEventPreProps {
    eventId: string;
}

export function PreloadedEventPre({ eventId }: PreloadedEventPreProps) {
    const [eventLiveQueryRef, loadEventQuery] = useQueryLoader<EventLiveQuery>(EVENT_LIVE_QUERY);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const { env } = useEnvironment();
    const refresh = React.useCallback(() => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        fetchQuery(env, EVENT_LIVE_QUERY, { eventId }).subscribe({
            complete: () => {
                setIsRefreshing(false);
                loadEventQuery({ eventId }, { fetchPolicy: 'store-or-network' });
            },
            error: () => {
                setIsRefreshing(false);
            },
        });
    }, [env, eventId, isRefreshing, loadEventQuery]);

    
    React.useEffect(() => {
        const interval = setInterval(() => {
            refresh();
        }, 2000);
        return () => clearInterval(interval);
    });
    if (!eventLiveQueryRef) return <h1>Loading Pre-Event Page...</h1>;
    return <EventPre eventLiveQueryRef={eventLiveQueryRef} />;
}