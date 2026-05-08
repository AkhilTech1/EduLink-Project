package com.edulink.learning.service;

import com.edulink.learning.dto.AssignmentDto;
import com.edulink.learning.dto.LearningMaterialDto;
import com.edulink.learning.entity.Assignment;
import com.edulink.learning.entity.LearningMaterial;
import com.edulink.learning.exception.ResourceNotFoundException;
import com.edulink.learning.repository.AssignmentRepository;
import com.edulink.learning.repository.LearningMaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LearningService {

    private final LearningMaterialRepository materialRepository;
    private final AssignmentRepository assignmentRepository;

    public List<LearningMaterialDto.Response> getAllMaterials() {
        return materialRepository.findAll().stream().map(LearningMaterialDto.Response::from).toList();
    }

    public LearningMaterialDto.Response getMaterial(Long id) {
        return LearningMaterialDto.Response.from(materialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Learning material not found with id: " + id)));
    }

    public LearningMaterialDto.Response saveMaterial(LearningMaterialDto.Request request) {
        LearningMaterial m = LearningMaterial.builder()
                .courseId(request.getCourseId())
                .title(request.getTitle())
                .fileUri(request.getFileUri())
                .uploadedDate(request.getUploadedDate())
                .status(LearningMaterial.Status.valueOf(request.getStatus()))
                .build();
        return LearningMaterialDto.Response.from(materialRepository.save(m));
    }

    public LearningMaterialDto.Response updateMaterial(Long id, LearningMaterialDto.Request request) {
        LearningMaterial m = materialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Learning material not found with id: " + id));
        m.setCourseId(request.getCourseId());
        m.setTitle(request.getTitle());
        m.setFileUri(request.getFileUri());
        m.setUploadedDate(request.getUploadedDate());
        m.setStatus(LearningMaterial.Status.valueOf(request.getStatus()));
        return LearningMaterialDto.Response.from(materialRepository.save(m));
    }

    public void deleteMaterial(Long id) {
        if (!materialRepository.existsById(id))
            throw new ResourceNotFoundException("Learning material not found with id: " + id);
        materialRepository.deleteById(id);
    }

    public List<AssignmentDto.Response> getAllAssignments() {
        return assignmentRepository.findAll().stream().map(AssignmentDto.Response::from).toList();
    }

    public AssignmentDto.Response getAssignment(Long id) {
        return AssignmentDto.Response.from(assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id)));
    }

    public AssignmentDto.Response saveAssignment(AssignmentDto.Request request) {
        Assignment a = Assignment.builder()
                .courseId(request.getCourseId())
                .studentId(request.getStudentId())
                .title(request.getTitle())
                .submissionDate(request.getSubmissionDate())
                .status(Assignment.Status.valueOf(request.getStatus()))
                .build();
        return AssignmentDto.Response.from(assignmentRepository.save(a));
    }

    public AssignmentDto.Response updateAssignment(Long id, AssignmentDto.Request request) {
        Assignment a = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));
        a.setCourseId(request.getCourseId());
        a.setStudentId(request.getStudentId());
        a.setTitle(request.getTitle());
        a.setSubmissionDate(request.getSubmissionDate());
        a.setStatus(Assignment.Status.valueOf(request.getStatus()));
        return AssignmentDto.Response.from(assignmentRepository.save(a));
    }

    public void deleteAssignment(Long id) {
        if (!assignmentRepository.existsById(id))
            throw new ResourceNotFoundException("Assignment not found with id: " + id);
        assignmentRepository.deleteById(id);
    }
}
