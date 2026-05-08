package com.edulink.identity.seeder;

import com.edulink.identity.entity.User;
import com.edulink.identity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        userRepository.save(User.builder().name("Admin User").email("admin@edulink.com")
                .phone("1000000001").password(passwordEncoder.encode("admin123"))
                .role(User.Role.ADMIN).status(User.Status.ACTIVE).build());

        userRepository.save(User.builder().name("John Teacher").email("teacher@edulink.com")
                .phone("1000000002").password(passwordEncoder.encode("teacher123"))
                .role(User.Role.TEACHER).status(User.Status.ACTIVE).build());

        userRepository.save(User.builder().name("Jane Student").email("student@edulink.com")
                .phone("1000000003").password(passwordEncoder.encode("student123"))
                .role(User.Role.STUDENT).status(User.Status.ACTIVE).build());

        userRepository.save(User.builder().name("Board Officer").email("board@edulink.com")
                .phone("1000000004").password(passwordEncoder.encode("board123"))
                .role(User.Role.BOARD).status(User.Status.ACTIVE).build());

        userRepository.save(User.builder().name("Compliance Officer").email("compliance@edulink.com")
                .phone("1000000005").password(passwordEncoder.encode("compliance123"))
                .role(User.Role.COMPLIANCE).status(User.Status.ACTIVE).build());

        userRepository.save(User.builder().name("Regulator").email("regulator@edulink.com")
                .phone("1000000006").password(passwordEncoder.encode("regulator123"))
                .role(User.Role.REGULATOR).status(User.Status.ACTIVE).build());

        System.out.println("Identity seeder: 6 users created.");
    }
}
