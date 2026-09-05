package com.eventbooking.controller;

import com.eventbooking.dto.*;
import com.eventbooking.service.BookingService;
import com.eventbooking.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final EventService eventService;
    private final BookingService bookingService;

    @PostMapping("/events")
    public ResponseEntity<EventResponseDTO> createEvent(@Valid @RequestBody EventDTO eventDTO) {
        return new ResponseEntity<>(eventService.createEvent(eventDTO), HttpStatus.CREATED);
    }

    @PutMapping("/events/{id}")
    public ResponseEntity<EventResponseDTO> updateEvent(
            @PathVariable Long id, @Valid @RequestBody EventDTO eventDTO) {
        return ResponseEntity.ok(eventService.updateEvent(id, eventDTO));
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/events/{id}/seats")
    public ResponseEntity<EventResponseDTO> increaseSeats(
            @PathVariable Long id, @Valid @RequestBody IncreaseSeatsDTO dto) {
        return ResponseEntity.ok(eventService.increaseSeats(id, dto));
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/events/sales")
    public ResponseEntity<List<EventSalesDTO>> getEventSales() {
        return ResponseEntity.ok(eventService.getEventSales());
    }
}
