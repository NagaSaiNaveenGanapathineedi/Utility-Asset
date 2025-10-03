@CircuitBreaker(name="userSaveCircuit", fallbackMethod = "saveBreaker")
public User save(User obj) {
    // Check if email already exists
    if (userRepository.findByEmail(obj.getEmail()).isPresent()) {
        throw new RuntimeException("Email already exists: " + obj.getEmail());
    }
    
    obj.setPassword(passwordEncoder.encode(obj.getPassword()));
    return userRepository.save(obj);
}

public User saveBreaker(User obj, Throwable t) {
    return new User(-100L, "nill", "nill", "nill", -100L, "nill", "nill", "nill", "nill", "nill");
}

public Optional<User> getByEmail(String email) {
    return Optional.of(userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found for email: " + email)));
}