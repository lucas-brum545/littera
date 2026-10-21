package com.littera.api.repository;

import com.littera.api.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
//    UserDetails loadUserByEmail(String email) throws UsernameNotFoundException;

    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    UserDetails findUserByEmail(String email);
}