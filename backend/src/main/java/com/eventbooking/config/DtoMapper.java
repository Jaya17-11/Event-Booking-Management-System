package com.eventbooking.config;

import com.eventbooking.dto.*;
import com.eventbooking.entity.Booking;
import com.eventbooking.entity.Event;
import com.eventbooking.entity.User;
import org.springframework.stereotype.Component;

@Component
public class DtoMapper {

    public UserResponseDTO toUserResponse(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .build();
    }

    public EventResponseDTO toEventResponse(Event event) {
        return EventResponseDTO.builder()
                .id(event.getId())
                .eventName(event.getEventName())
                .category(event.getCategory())
                .location(event.getLocation())
                .eventDate(event.getEventDate())
                .status(event.getStatus())
                .totalSeats(event.getTotalSeats())
                .availableSeats(event.getAvailableSeats())
                .ticketPrice(event.getTicketPrice())
                .build();
    }

    public BookingResponseDTO toBookingResponse(Booking booking) {
        return BookingResponseDTO.builder()
                .id(booking.getId())
                .bookingReference(booking.getBookingReference())
                .userName(booking.getUser().getName())
                .userEmail(booking.getUser().getEmail())
                .eventName(booking.getEvent().getEventName())
                .eventId(booking.getEvent().getId())
                .ticketsBooked(booking.getTicketsBooked())
                .bookingDate(booking.getBookingDate())
                .totalAmount(booking.getTotalAmount())
                .status(booking.getStatus())
                .build();
    }
}
