package com.smartcampus.backend.service;

import com.smartcampus.backend.model.Ticket;
import com.smartcampus.backend.model.TicketComment;
import com.smartcampus.backend.model.TicketStatus;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.TicketRepository;
import com.smartcampus.backend.repository.TicketCommentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TicketServiceTest {

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private TicketCommentRepository commentRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private TicketService ticketService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void addComment_ShouldSaveAndNotify() {
        String ticketId = "t1";
        String userId = "u1";
        String content = "Hello";

        Ticket ticket = new Ticket();
        ticket.setId(ticketId);

        when(ticketRepository.findById(ticketId)).thenReturn(Optional.of(ticket));
        when(commentRepository.save(any(TicketComment.class))).thenAnswer(i -> i.getArguments()[0]);

        TicketComment result = ticketService.addComment(ticketId, userId, content);

        assertNotNull(result);
        assertEquals(content, result.getContent());
        verify(commentRepository).save(any(TicketComment.class));
    }

    @Test
    void updateComment_WhenAuthorized_ShouldUpdate() {
        String commentId = "c1";
        String userId = "u1";
        String newContent = "Updated Content";

        TicketComment existing = new TicketComment();
        User author = new User();
        author.setId(userId);
        existing.setUser(author);
        existing.setContent("Old Content");

        when(commentRepository.findById(commentId)).thenReturn(Optional.of(existing));
        when(commentRepository.save(any(TicketComment.class))).thenReturn(existing);

        TicketComment result = ticketService.updateComment(commentId, userId, newContent);

        assertEquals(newContent, result.getContent());
        verify(commentRepository).save(existing);
    }

    @Test
    void updateComment_WhenUnauthorized_ShouldThrowException() {
        TicketComment existing = new TicketComment();
        User author = new User();
        author.setId("u1");
        existing.setUser(author);

        when(commentRepository.findById("c1")).thenReturn(Optional.of(existing));

        assertThrows(RuntimeException.class, () -> {
            ticketService.updateComment("c1", "u2", "Hacker was here");
        });
    }

    @Test
    void assignTechnician_ShouldUpdateStatus() {
        Ticket ticket = new Ticket();
        ticket.setId("t1");
        ticket.setStatus(TicketStatus.OPEN);

        when(ticketRepository.findById("t1")).thenReturn(Optional.of(ticket));
        when(ticketRepository.save(any())).thenReturn(ticket);

        Ticket result = ticketService.assignTechnician("t1", "tech1");

        assertEquals(TicketStatus.IN_PROGRESS, result.getStatus());
        assertNotNull(result.getTechnician());
    }
}
