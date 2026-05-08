package com.edulink.course.seeder;

import com.edulink.course.entity.ClassEntity;
import com.edulink.course.entity.Course;
import com.edulink.course.repository.ClassRepository;
import com.edulink.course.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CourseRepository courseRepository;
    private final ClassRepository classRepository;

    @Override
    public void run(String... args) {
        if (courseRepository.count() > 0) return;

        Course math = courseRepository.save(Course.builder().title("Mathematics Grade 10")
                .subject("Mathematics").gradeLevel("Grade 10").credits(4).status(Course.Status.ACTIVE).build());

        Course science = courseRepository.save(Course.builder().title("Science Grade 10")
                .subject("Science").gradeLevel("Grade 10").credits(4).status(Course.Status.ACTIVE).build());

        Course english = courseRepository.save(Course.builder().title("English Grade 10")
                .subject("English").gradeLevel("Grade 10").credits(3).status(Course.Status.ACTIVE).build());

        classRepository.save(ClassEntity.builder().courseId(math.getCourseId())
                .teacherId(2L).schedule("Mon/Wed 9:00-10:30").status(ClassEntity.Status.ACTIVE).build());

        classRepository.save(ClassEntity.builder().courseId(science.getCourseId())
                .teacherId(2L).schedule("Tue/Thu 11:00-12:30").status(ClassEntity.Status.ACTIVE).build());

        classRepository.save(ClassEntity.builder().courseId(english.getCourseId())
                .teacherId(2L).schedule("Fri 9:00-12:00").status(ClassEntity.Status.ACTIVE).build());

        System.out.println("Course seeder: 3 courses and 3 classes created.");
    }
}
