package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    @org.springframework.data.mongodb.repository.Query("{ $or: [ { 'user.$id': ?0 }, { 'user.$id': { $oid: ?0 } } ] }")
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);
    @org.springframework.data.mongodb.repository.Query("{ $or: [ { 'user.$id': ?0 }, { 'user.$id': { $oid: ?0 } } ], 'isRead': false }")
    List<Notification> findByUserIdAndIsReadFalse(String userId);

    long countByUserIdAndIsReadFalse(String userId);
}
