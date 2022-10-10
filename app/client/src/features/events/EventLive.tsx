/* eslint-disable react/prop-types */
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { Grid, useMediaQuery } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { motion } from 'framer-motion';
import { graphql, useQueryLoader, PreloadedQuery, usePreloadedQuery, useMutation } from 'react-relay';
import { Loader } from '@local/components/Loader';
import { useRouter } from 'next/router';

import type { EventLiveQuery } from '@local/__generated__/EventLiveQuery.graphql';
import { Fab } from '@local/components/Fab';
import { EventSidebar, EventVideo, EventContext, EventSidebarLoader } from '@local/features/events';
import { ValidateInviteQuery } from '@local/__generated__/ValidateInviteQuery.graphql';
import { VALIDATE_INVITE_QUERY } from './Invites/ValidateInvite';
import { EventDetailsCard } from './EventDetailsCard';
import { SpeakerList } from './Speakers';
import { liveQuery } from '@local/__generated__/liveQuery.graphql';
import { LIVE_QUERY } from '@local/pages/events/[id]/live';
// import { EventLiveEndEventMutation } from '@local/__generated__/EventLiveEndEventMutation.graphql';
import { EventLiveStartEventMutation } from '@local/__generated__/EventLiveStartEventMutation.graphql';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        [theme.breakpoints.up('md')]: {
            flexDirection: 'row',
            flexWrap: 'nowrap',
        },
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
            overflowY: 'scroll',
            flexWrap: 'nowrap',
        },
    },
    panes: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        [theme.breakpoints.up('md')]: {
            overflowY: 'scroll',
        },
    },
    video: {
        [theme.breakpoints.down('md')]: {
            position: 'sticky',
            top: 0,
            zIndex: theme.zIndex.appBar,
        },
    },
    target: {
        scrollMarginTop: '1rem',
    },
}));

export const EVENT_LIVE_QUERY = graphql`
    query EventLiveQuery($eventId: ID!) {
        node(id: $eventId) {
            id
            ... on Event {
                isViewerModerator
                ...EventSidebarFragment
                ...EventVideoFragment
                ...EventDetailsCardFragment
                ...SpeakerListFragment
            }
        }
    }
`;

export function EventLiveLoader() {
    return <Loader />;
}

export interface PreloadedEventLiveProps {
    queryReference: PreloadedQuery<liveQuery>;
    eventId: string;
    token?: string;
}

export interface EventLiveProps {
    eventLiveQueryRef: PreloadedQuery<EventLiveQuery>;
    validateInviteQueryRef: PreloadedQuery<ValidateInviteQuery>;
    isActive: boolean | null | undefined;
}

export function EventLive({ eventLiveQueryRef, validateInviteQueryRef, isActive }: EventLiveProps) {
    const router = useRouter();
    const id = router.query.id

    const { node } = usePreloadedQuery(EVENT_LIVE_QUERY, eventLiveQueryRef);
    usePreloadedQuery(VALIDATE_INVITE_QUERY, validateInviteQueryRef);
    // styles
    const classes = useStyles();
    const theme = useTheme();

    // references for scrolling
    const topRef = React.useRef<HTMLDivElement | null>(null);
    const [isFabVisible, setIsFabVisible] = React.useState(false);

    const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

    // increase the distance required to show the scroll to top fab
    // because of on screen keyboards on mobile
    const distance = React.useMemo(() => (isMdUp ? 500 : 800), [isMdUp]);

    const handleScroll = () => {
        const top = topRef.current?.getBoundingClientRect()?.top;
        if (top && top < -distance) {
            setIsFabVisible(true);
        } else {
            setIsFabVisible(false);
        }
    };

    const handleClick = () => {
        topRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest',
        });
    };

    
    const END_EVENT_MUTATION = graphql`
        mutation EventLiveEndEventMutation($eventId: String!) {
            endEvent(eventId: $eventId) {
                message
            }
        }
    `
    // mutation to stop the event (set isActive to false)
    const [commitEventEndMutation] = useMutation<EventLiveEndEventMutation>(
        END_EVENT_MUTATION
    )

    const START_EVENT_MUTATION = graphql`
        mutation EventLiveStartEventMutation($eventId: String!) {
            startEvent(eventId: $eventId) {
                message
            }
        }
    `
    // mutation to start the event (set isActive to true)
    const [commitEventStartMutation] = useMutation<EventLiveStartEventMutation>(
        START_EVENT_MUTATION
    )

    if (!node) return <EventSidebarLoader />;
    
    // TO:DO
    // use isActive prop to display start/stop button and call the according mutation
    return (
        <EventContext.Provider value={{ eventId: node.id, isModerator: Boolean(node.isViewerModerator) }}>
            {/* {isActive ?
                <button onClick={() => commitEventEndMutation({
                    variables: {
                        eventId: id,
                    },
                    onCompleted() {
                        alert('Event has ended!')
                    }
                })}>End</button>
                :
                <button onClick={() => commitEventStartMutation({
                    variables: {
                        eventId: id,
                    },
                    onCompleted() {
                        alert('Event has started!')
                    }
                })}>Start</button>
            } */}
            <button onClick={() => commitEventStartMutation({
                variables: {
                    eventId: id,
                },
                onCompleted() {
                    alert('Event has started!')
                }
            })}>Start</button>
            <button onClick={() => commitEventEndMutation({
                    variables: {
                        eventId: id,
                    },
                    onCompleted() {
                        alert('Event has ended!')
                    }
                })}>End</button>

            <Grid component={motion.div} key='townhall-live' container className={classes.root} onScroll={handleScroll}>
                {!isMdUp && <div ref={topRef} />}
                <Grid container item md={8} direction='column' wrap='nowrap'>
                    <Grid item className={classes.video}>
                        <EventVideo fragmentRef={node} />
                    </Grid>
                    <EventDetailsCard fragmentRef={node} />
                    <SpeakerList fragmentRef={node} />
                </Grid>
                <Grid container item xs={12} md={4} direction='column'>
                    <div className={classes.panes} id='event-sidebar-scroller' onScroll={handleScroll}>
                        {isMdUp && <div ref={topRef} className={classes.target} />}
                        <EventSidebar fragmentRef={node} />
                    </div>
                </Grid>
                <Fab onClick={handleClick} ZoomProps={{ in: isFabVisible }}>
                    <KeyboardArrowUpIcon />
                </Fab>
            </Grid>
        </EventContext.Provider>
    );
}

export function PreloadedEventLive({ queryReference, eventId, token }: PreloadedEventLiveProps) {
    const router = useRouter()
    const data = usePreloadedQuery<liveQuery>(LIVE_QUERY, queryReference);
    var isActive = data.findSingleEvent?.isActive    

    console.log(isActive)

    var url_arry = window.location.href.split('/')
    url_arry.pop()
    var url = url_arry.join('/')
    
    // if (!isActive) {
    //     // go to pre-event or post-event TO:DO add a field isEnded
    //     router.push(url + '/pre')
    // }

    const [eventLiveQueryRef, loadEventQuery] = useQueryLoader<EventLiveQuery>(EVENT_LIVE_QUERY);
    const [validateInviteQueryRef, loadInviteQuery] = useQueryLoader<ValidateInviteQuery>(VALIDATE_INVITE_QUERY);

    React.useEffect(() => {
        if (!eventLiveQueryRef) loadEventQuery({ eventId });
    }, [eventLiveQueryRef, loadEventQuery, eventId]);

    React.useEffect(() => {
        if (!token && !validateInviteQueryRef) loadInviteQuery({ token: '', eventId });
        if (token && !validateInviteQueryRef) loadInviteQuery({ token, eventId });
    }, [validateInviteQueryRef, loadInviteQuery, eventId, token]);

    if (!eventLiveQueryRef || !validateInviteQueryRef) return <EventSidebarLoader />;

    return <EventLive eventLiveQueryRef={eventLiveQueryRef} validateInviteQueryRef={validateInviteQueryRef} isActive={isActive}/>;
}
