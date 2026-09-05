package com.eventbooking.repository;

import com.eventbooking.entity.Booking;
import com.eventbooking.entity.BookingStatus;
import org.springframework.data.jpa.repository.Lock;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserEmail(String email);

    @Query("SELECT COALESCE(SUM(b.ticketsBooked), 0) FROM Booking b " +
           "WHERE b.event.id = :eventId AND b.status = :status")
    Long getTicketsSold(@Param("eventId") Long eventId, @Param("status") BookingStatus status);

    Optional<Booking> findByBookingReference(String bookingReference);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select b from Booking b where b.id = :id")
    Optional<Booking> findByIdForUpdate(@Param("id") Long id);

    long countByEventIdAndStatus(Long eventId, BookingStatus status);
}
