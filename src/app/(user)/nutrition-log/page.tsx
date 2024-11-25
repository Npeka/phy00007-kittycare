// NutritionLog.tsx
'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './page.css';

export default function NutritionLog() {
    const events = [
        {
            title: '200ml💧',
            start: '2024-11-01',
            color: '#b3e5fc',
        },
        {
            title: '2.3g 🍖',
            start: '2024-11-01',
            color: '#ffcdd2',
        },
        {
            title: '200ml 💧',
            start: '2024-10-31',
            color: '#b3e5fc',
        },
        {
            title: '2.3g 🍖',
            start: '2024-10-31',
            color: '#ffcdd2',
        },
    ];

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
