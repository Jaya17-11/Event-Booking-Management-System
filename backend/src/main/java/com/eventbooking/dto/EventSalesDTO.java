package com.eventbooking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventSalesDTO {

    private Long eventId;
    private String eventName;
    private Long ticketsSold;
    private BigDecimal revenue;
}
