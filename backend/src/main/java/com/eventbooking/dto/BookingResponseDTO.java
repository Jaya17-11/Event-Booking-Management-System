package com.eventbooking.dto;

import com.eventbooking.entity.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponseDTO {

    private Long id;
    private String bookingReference;
    private String userName;
    private String userEmail;
    private String eventName;
    private Long eventId;
    private Integer ticketsBooked;
    private LocalDateTime bookingDate;
    private BigDecimal totalAmount;
    private BookingStatus status;
}
