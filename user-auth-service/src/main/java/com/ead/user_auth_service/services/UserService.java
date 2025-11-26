package com.ead.user_auth_service.services;

import com.ead.user_auth_service.entity.User;
import com.ead.user_auth_service.repository.UserRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User createUser(User user) {
        //check if username or email already exists
        if(userRepository.findByUsername(user.getUsername()).isPresent()){
            throw new RuntimeException("Username already exists");
        }
        if(userRepository.findByEmail(user.getEmail()).isPresent()){
            throw new RuntimeException("Email already exists");
        }
        user.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt()));
        return userRepository.save(user);
    }

    public User loginUser(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent() && BCrypt.checkpw(password, userOpt.get().getPassword())) {
            return userOpt.get();
        }
        return null;
    }

    public User updateUser(User user) {
        Optional<User> existingUser = userRepository.findById(user.getId());
        if (existingUser.isPresent()) {
            User updatedUser = existingUser.get();
            updatedUser.setUsername(user.getUsername());
            updatedUser.setEmail(user.getEmail());
            updatedUser.setFirstName(user.getFirstName());
            updatedUser.setLastName(user.getLastName());
            if (user.getPassword() != null && !user.getPassword().isEmpty()) {
                updatedUser.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt()));
            }
            return userRepository.save(updatedUser);
        }
        return null;
    }
}
