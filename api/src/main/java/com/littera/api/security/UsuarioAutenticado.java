package com.littera.api.security;

import com.littera.api.model.Usuario;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class UsuarioAutenticado implements UserDetails {
    private final Usuario usuario;

    public UsuarioAutenticado(Usuario usuario) {
        this.usuario = usuario;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    @Override
    public String getUsername() {
        return usuario.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public String getPassword() {
        return usuario.getSenhaHash();
    }

    @Override
    public Collection<?extends GrantedAuthority> getAuthorities() {
        if(this.usuario.getTipoUsuario().equals("ADMIN")) {
            String papel = "ROLE_" + usuario.getTipoUsuario().name();
            return List.of(new SimpleGrantedAuthority(papel));
        }
        else{
            return List.of(new SimpleGrantedAuthority(usuario.getTipoUsuario().name()));
        }
    }
}

