'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './page.css';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '@/context/auth-context';

export default function NutritionLog() {
    const [isFetch, setIsFetch] = useState(false);
    const [events, setEvents] = useState<{ title: string; date: string; color: string }[]>([]);
    const user = useContext(AuthContext);

    useEffect(() => {
        if (!user) return;
        if (isFetch) return;
        
        const fetchData = async () => {
            const response = await fetch(`api/get-health-logs/${user.uid}`);
            const data = await response.json();
            const newEvents = [];
            for (let i = 0; i < data.length; i++) {
                const drink = {
                    title: `${data[i].drink}ml 💧`,
                    date: data[i].time,
                    color: '#b3e5fc',
                }
                const food = {
                    title: `${data[i].food}g 🍖`,
                    date: data[i].time,
                    color: '#ffcdd2',
                }
                newEvents.push(drink);
                newEvents.push(food);
            }
            setEvents(newEvents);
        }
        fetchData();
        setIsFetch(true);
    }, [user]);

    return (
        <div className="h-full bg-white">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale="vi"
                firstDay={1}
                weekends={true}
                headerToolbar={{
                    left: 'today',
                    center: 'title',
                    right: 'prev,next',
                }}
                buttonText={{
                    today: 'Hôm nay',
                }}
                events={events}
                height="100%"
                dayMaxEventRows={3}
                eventDisplay="block"
                fixedWeekCount={false}
                dayHeaderFormat={{
                    weekday: 'long',
                }}
                eventContent={(eventInfo) => (
                    <div
                        style={{
                            color: 'black',
                            fontSize: 16,
                            textAlign: 'left',
                            whiteSpace: 'pre-wrap',
                            padding: '6px 12px',
                        }}
                    >
                        {eventInfo.event.title}
                    </div>
                )}
            />
        </div>
    );
}
