package com.eventbooking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.eventbooking.entity.EventStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventResponseDTO {

    private Long id;
    private String eventName;
    private String category;
    private String location;
    private LocalDateTime eventDate;
    private EventStatus status;
    private Integer totalSeats;
    private Integer availableSeats;
    private BigDecimal ticketPrice;
}
