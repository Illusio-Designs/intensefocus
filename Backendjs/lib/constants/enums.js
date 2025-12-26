const TrayStatus = {
    AVAILABLE: 'available',
    ASSIGNED: 'assigned',
    CLOSED: 'closed'
};

const TrayProductStatus = {
    ALLOTED: 'alloted',
    PRIORITY_BOOKED: 'priority_booked',
    PARTIALLY_BOOKED: 'partially_booked',
    RETURNED: 'returned'
};

const OrderStatus = {
    PENDING: 'pending',
    PROCESSED: 'processed',
    CANCELLED: 'cancelled',
    DISPATCHED: 'dispatched',
    PARTIALLY_DISPATCHED: 'partially_dispatched',
    HOLD_BY_TRAY: 'hold_by_tray',
    COMPLETED: 'completed',
};

const OrderType = {
    PARTY_ORDER: 'party_order',
    DISTRIBUTOR_ORDER: 'distributor_order',
    EVENT_ORDER: 'event_order',
    VISIT_ORDER: 'visit_order',
    WHATSAPP_ORDER: 'whatsapp_order',
};

const EventStatus = {
    UPCOMING: 'upcoming',
    ONGOING: 'ongoing',
    PAST: 'past',
};
module.exports = { TrayStatus, TrayProductStatus, OrderStatus, OrderType, EventStatus };