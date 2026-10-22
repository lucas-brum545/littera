package com.littera.api.repository;

import com.littera.api.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    // Métodos CRUD básicos (findAll, findById, save, delete) já vêm prontos por herança!
}
