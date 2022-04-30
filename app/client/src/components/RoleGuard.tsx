import router from 'next/router';

export interface RoleGuardProps {
    organizer?: boolean;
    moderator?: boolean;
    children: JSX.Element | JSX.Element[];
}

export function RoleGuard({ organizer = false, moderator = false, children }: RoleGuardProps){
    if (organizer) return <>{children}</>
    else router.push('/dashboard');
    if (moderator) return <>{children}</>
    return <></>
}