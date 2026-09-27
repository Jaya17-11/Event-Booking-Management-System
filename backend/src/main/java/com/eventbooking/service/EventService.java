package com.eventbooking.service;

import com.eventbooking.config.DtoMapper;
import com.eventbooking.dto.EventDTO;
import com.eventbooking.dto.EventResponseDTO;
import com.eventbooking.dto.EventSalesDTO;
import com.eventbooking.dto.IncreaseSeatsDTO;
import com.eventbooking.entity.BookingStatus;
import com.eventbooking.entity.EventStatus;
import com.eventbooking.entity.Event;
import com.eventbooking.exception.BadRequestException;
import com.eventbooking.exception.EventNotFoundException;
import com.eventbooking.repository.BookingRepository;
import com.eventbooking.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;
    private final DtoMapper dtoMapper;

    @Transactional
    public List<EventResponseDTO> getAllEvents() {
        List<Event> events = eventRepository.findAll();

        events.forEach(event -> {
            EventStatus newStatus = calculateStatus(event);

            if (event.getStatus() != newStatus) {
                event.setStatus(newStatus);
            }
        });

        return events.stream()
                .map(dtoMapper::toEventResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public EventResponseDTO getEventById(Long id) {
        Event event = findEventById(id);
        refreshStatus(event);
        return dtoMapper.toEventResponse(event);
    }

    @Transactional
    public EventResponseDTO createEvent(EventDTO eventDTO) {
        validateEventTiming(eventDTO.getEventDate());
        Event event = Event.builder()
                .eventName(eventDTO.getEventName())
                .category(eventDTO.getCategory())
                .location(eventDTO.getLocation())
                .eventDate(eventDTO.getEventDate())
                .endDate(eventDTO.getEventDate())
                .totalSeats(eventDTO.getTotalSeats())
                .availableSeats(eventDTO.getTotalSeats())
                .ticketPrice(eventDTO.getTicketPrice())
                .build();

        Event saved = eventRepository.save(event);
        return dtoMapper.toEventResponse(saved);
    }

    @Transactional
    public EventResponseDTO updateEvent(Long id, EventDTO eventDTO) {
        validateEventTiming(eventDTO.getEventDate());
        Event event = findEventById(id);

        int seatsBooked = event.getTotalSeats() - event.getAvailableSeats();

        event.setEventName(eventDTO.getEventName());
        event.setCategory(eventDTO.getCategory());
        event.setLocation(eventDTO.getLocation());
        event.setEventDate(eventDTO.getEventDate());
        event.setEndDate(eventDTO.getEventDate());
        event.setTicketPrice(eventDTO.getTicketPrice());

        if (eventDTO.getTotalSeats() < seatsBooked) {
            throw new BadRequestException("Total seats cannot be less than already booked seats (" + seatsBooked + ")");
        }

        event.setTotalSeats(eventDTO.getTotalSeats());
        event.setAvailableSeats(eventDTO.getTotalSeats() - seatsBooked);

        Event updated = eventRepository.save(event);
        return dtoMapper.toEventResponse(updated);
    }

    @Transactional
    public void deleteEvent(Long id) {
        Event event = findEventById(id);
        long activeBookings = bookingRepository.countByEventIdAndStatus(id, BookingStatus.BOOKED);
        if (activeBookings > 0) {
            throw new BadRequestException("This event has active bookings and cannot be deleted");
        }
        eventRepository.delete(event);
    }

    @Transactional
    public EventResponseDTO increaseSeats(Long id, IncreaseSeatsDTO dto) {
        Event event = findEventById(id);
        event.setTotalSeats(event.getTotalSeats() + dto.getAdditionalSeats());
        event.setAvailableSeats(event.getAvailableSeats() + dto.getAdditionalSeats());
        Event updated = eventRepository.save(event);
        return dtoMapper.toEventResponse(updated);
    }

    public List<EventSalesDTO> getEventSales() {

        List<Event> events = eventRepository.findAll();

        List<Object[]> results = bookingRepository.getTicketsSoldByEvent(
                BookingStatus.BOOKED);

        Map<Long, Long> ticketsSoldMap = new HashMap<>();

        for (Object[] row : results) {
            Long eventId = (Long) row[0];
            Long ticketsSold = ((Number) row[1]).longValue();

            ticketsSoldMap.put(eventId, ticketsSold);
        }

        return events.stream()
                .map(event -> {

                    Long ticketsSold = ticketsSoldMap.getOrDefault(
                            event.getId(), 0L);

                    BigDecimal revenue = event.getTicketPrice()
                            .multiply(
                                    BigDecimal.valueOf(ticketsSold));

                    return EventSalesDTO.builder()
                            .eventId(event.getId())
                            .eventName(event.getEventName())
                            .ticketsSold(ticketsSold)
                            .revenue(revenue)
                            .build();
                })
                .collect(Collectors.toList());
    }

    public Event findEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new EventNotFoundException("Event not found with id: " + id));
    }

    @Transactional
    public Event findEventForBooking(Long id) {
        Event event = eventRepository.findByIdForUpdate(id)
                .orElseThrow(() -> new EventNotFoundException("Event not found with id: " + id));
        refreshStatus(event);
        return event;
    }

    @Transactional
    public void refreshAllEventStatuses() {
        eventRepository.findAll().forEach(this::refreshStatus);
    }

    private void validateEventTiming(LocalDateTime eventDate) {
        if (eventDate == null || !eventDate.isAfter(LocalDateTime.now().plusHours(1))) {
            throw new BadRequestException("Events must start more than 1 hour from now");
        }
    }

    private void refreshStatus(Event event) {
        event.setStatus(calculateStatus(event));
    }

    private EventStatus calculateStatus(Event event) {
        LocalDateTime now = LocalDateTime.now();

        if (event.getEventDate() != null
                && !now.isBefore(event.getEventDate())) {
            return EventStatus.EXPIRED;
        }

        if (event.getAvailableSeats() != null
                && event.getAvailableSeats() == 0) {
            return EventStatus.SOLD_OUT;
        }

        return EventStatus.UPCOMING;
    }
}
