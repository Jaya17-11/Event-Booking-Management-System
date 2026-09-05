package com.eventbooking.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncreaseSeatsDTO {

    @NotNull(message = "Additional seats is required")
    @Min(value = 1, message = "Must add at least 1 seat")
    private Integer additionalSeats;
}
