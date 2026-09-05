package com.eventbooking.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class EventStatusScheduler {
    private final EventService eventService;

    @Scheduled(fixedDelay = 60000)
    public void updateExpiredEvents() {
        eventService.refreshAllEventStatuses();
    }
}
