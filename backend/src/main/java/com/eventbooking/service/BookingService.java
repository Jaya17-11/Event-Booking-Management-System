package com.eventbooking.service;

import com.eventbooking.config.DtoMapper;
import com.eventbooking.dto.BookingDTO;
import com.eventbooking.dto.BookingResponseDTO;
import com.eventbooking.entity.Booking;
import com.eventbooking.entity.BookingStatus;
import com.eventbooking.entity.Event;
import com.eventbooking.entity.EventStatus;
import com.eventbooking.entity.User;
import com.eventbooking.exception.BadRequestException;
import com.eventbooking.exception.BookingNotFoundException;
import com.eventbooking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final EventService eventService;
    private final UserService userService;
    private final DtoMapper dtoMapper;

    @Transactional
    public BookingResponseDTO createBooking(BookingDTO bookingDTO, String userEmail) {
        User user = userService.findByEmail(userEmail);
        Event event = eventService.findEventForBooking(bookingDTO.getEventId());
        LocalDateTime cutoff = event.getEventDate().minusHours(1);

        if (!LocalDateTime.now().isBefore(cutoff)) {
            throw new BadRequestException("Bookings are closed 1 hour before the event starts");
        }

        if (event.getStatus() == EventStatus.EXPIRED) {
            throw new BadRequestException("This event has already ended");
        }

        if (event.getAvailableSeats() <= 0) {
            throw new BadRequestException("Event is sold out");
        }

        if (bookingDTO.getTicketsBooked() > event.getAvailableSeats()) {
            throw new BadRequestException("Only " + event.getAvailableSeats() + " seats available");
        }

        BigDecimal totalAmount = event.getTicketPrice()
                .multiply(BigDecimal.valueOf(bookingDTO.getTicketsBooked()));

        Booking booking = Booking.builder()
                .bookingReference(generateBookingReference())
                .user(user)
                .event(event)
                .ticketsBooked(bookingDTO.getTicketsBooked())
                .bookingDate(LocalDateTime.now())
                .totalAmount(totalAmount)
                .status(BookingStatus.BOOKED)
                .build();

        event.setAvailableSeats(event.getAvailableSeats() - bookingDTO.getTicketsBooked());

        Booking saved = bookingRepository.save(booking);
        return dtoMapper.toBookingResponse(saved);
    }

    public List<BookingResponseDTO> getMyBookings(String userEmail) {
        return bookingRepository.findByUserEmail(userEmail).stream()
                .map(dtoMapper::toBookingResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(dtoMapper::toBookingResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponseDTO cancelBooking(Long bookingId, String userEmail) {
        Booking booking = bookingRepository.findByIdForUpdate(bookingId)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + bookingId));

        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new BadRequestException("You can only cancel your own bookings");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        Event event = eventService.findEventForBooking(booking.getEvent().getId());
        LocalDateTime cutoff = event.getEventDate().minusHours(1);
        if (!LocalDateTime.now().isBefore(cutoff)) {
            throw new BadRequestException("Bookings can only be cancelled until 1 hour before the event starts");
        }

        booking.setStatus(BookingStatus.CANCELLED);

        
        event.setAvailableSeats(event.getAvailableSeats() + booking.getTicketsBooked());

        Booking updated = bookingRepository.save(booking);
        return dtoMapper.toBookingResponse(updated);
    }

    private String generateBookingReference() {
        return "EVT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
