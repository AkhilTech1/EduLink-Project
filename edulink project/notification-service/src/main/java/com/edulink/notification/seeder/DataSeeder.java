package com.edulink.notification.seeder;

import com.edulink.notification.entity.Notification;
import com.edulink.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final NotificationRepository notificationRepository;

    @Override
    public void run(String... args) {
        if (notificationRepository.count() > 0) return;

        notificationRepository.save(Notification.builder().userId(3L).entityId(1L)
                .message("Welcome to EduLink! Your enrollment is confirmed.")
                .category(Notification.Category.ENROLLMENT).status(Notification.Status.SENT)
                .createdDate(LocalDateTime.now()).build());

        notificationRepository.save(Notification.builder().userId(3L).entityId(1L)
                .message("Midterm exam scheduled for Mathematics on " + java.time.LocalDate.now().plusDays(30))
                .category(Notification.Category.EXAM).status(Notification.Status.SENT)
                .createdDate(LocalDateTime.now()).build());

        notificationRepository.save(Notification.builder().userId(2L).entityId(1L)
                .message("New assignment posted for Mathematics course")
                .category(Notification.Category.COURSE).status(Notification.Status.SENT)
                .createdDate(LocalDateTime.now()).build());

        System.out.println("Notification seeder: 3 notifications created.");
    }
}
